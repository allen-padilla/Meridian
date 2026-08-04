# 03 — Heroes: Design

## Data model

**`heroes`**

| Column | Notes |
|---|---|
| `hero_code` | Unique. The external, stable identifier. |
| `first_name_imported`, `last_name_imported`, `email_imported`, `phone_imported`, `ancestry_imported`, `class_imported`, `level_imported`, `home_realm_imported` | Snapshot of the values as originally submitted (player portal or first import), never touched again after creation. |
| `first_name`, `last_name`, `email`, `phone`, `ancestry`, `class`, `level`, `home_realm` | Live, guildkeeper-editable values. They start equal to the submitted values, then diverge as revisions are approved and manual edits land. |
| `faction` | Optional guild affiliation, validated against the `factions` whitelist at the application layer. |
| `standing_status` | Enum: `confirmed` \| `pending` \| `not_confirmed`. |
| `guild_crest_issued` | Boolean. |
| `verification_status` | Enum: `unverified` \| `pending_review` \| `verified`. |
| `verified_by`, `verified_at` | Set when status becomes `verified`. |

Why keep both `*_imported` and live columns instead of one set of fields
plus a separate audit log? Two reasons: (1) "what did the hero originally
submit" needs to render instantly on the profile page without joining
against a log table, and (2) it must be structurally impossible for a
later edit to lose the original submission — a parallel, append-only column
set guarantees that better than trusting every write path to also append
to a log.

**`hero_revisions`**

| Column | Notes |
|---|---|
| `hero_id` | FK. |
| `changed_fields` | JSON: `{ field: { submitted, active } }` for every field that differed at the time the revision was created. Fields are removed from this map as guildkeepers accept them. |
| `status` | `pending` \| `reviewed`. |
| `submitted_at` | When the triggering submission arrived. |
| `reviewed_by`, `reviewed_at` | Set when the revision moves to `reviewed`. |

Each revision belongs to exactly one hero and represents exactly one
incoming submission's diff. A second differing submission while one revision
is still pending creates another revision; it does not merge into the first.
This keeps each revision's `changed_fields` map an honest snapshot of one
submission, which matters if two different submissions propose two different
new values for the same field.

**`factions`**

Just a `name` column — a plain whitelist table. No need for anything
richer unless a later requirement needs per-faction metadata.

## Verification state machine

```
        accept last pending revision
        on a verified hero with
        no other pending revisions
    ┌───────────────────────────────┐
    │                                ▼
unverified ──verify()──▶ pending_review ──verify()──▶ verified
                ▲                                          │
                └──────── revision queued ──────────────┘
```

`verify()` is a single endpoint whose effect depends on current state: from
`unverified` it moves to `pending_review`; from `pending_review` it moves
to `verified` and stamps `verified_by`/`verified_at`. Modeling it as one
"advance" action rather than two separate "mark pending" / "mark verified"
actions matches how guildkeepers actually use it — a deliberate two-click
progression through a review, not jumping straight to verified.

## The diff-and-revision algorithm

Both the sync API and the CSV importer funnel through the same logic
(implement it once, call it from both):

```
diffAndQueue(hero, submittedFields):
    diff = {}
    for field, submittedValue in submittedFields:
        if field == hero_code: continue
        currentValue = hero[field]
        if submittedValue != currentValue:
            diff[field] = { submitted: submittedValue, active: currentValue }

    if diff is empty:
        return  # no-op, nothing to review

    create HeroRevision(hero, changed_fields: diff, status: pending)

    if hero.verification_status == 'verified':
        hero.verification_status = 'pending_review'
```

Comparisons are done as strings — a submitted `"pending"` vs. a stored
`"pending"` should compare equal, but a submitted empty string for a field
that had a value should register as a real (reviewable) change, not be
silently ignored. Blank submitted values are still diffed, not skipped —
if the public form now sends a blank phone number, guildkeepers should decide
whether that's a real change to accept, not have it silently dropped.

## Accepting/dismissing a revision

```
acceptField(revision, field):
    if field not in revision.changed_fields: error
    hero[field] = revision.changed_fields[field].submitted
    remove field from revision.changed_fields
    if revision.changed_fields is now empty:
        revision.status = reviewed
        revision.reviewed_by, reviewed_at = now
        if hero was pending_review because of this revision
           and hero has no other pending revisions:
            hero.verification_status = verified
```

The "return to verified" check must re-query for *other* pending revisions on
the hero, not just this one — a hero can accumulate more than one
pending revision (e.g. a resync arrives while an earlier CSV-import revision is
still unresolved), and resolving one shouldn't re-verify a hero who still
has a second, unrelated revision outstanding.

## CSV import

Two-phase: `preview` runs the full parse-and-classify pass and returns it
without writing anything; `store` runs the identical pass and then commits
it inside a transaction. Both call one shared `analyze()` routine so
preview and commit can never disagree about what will happen.

```
analyze(file):
    parse header row -> map known column headers to hero fields
    (reject the whole file if required columns like hero code,
     first name, last name aren't present — likely the wrong export)

    for each data row:
        clean/normalize fields (trim, strip spreadsheet-injected quote
          marks from phone numbers, merge a secondary address-line
          column into the main address field)
        if hero_code is blank: record as skipped, continue
        classify hero_code format against the org's numbering
          convention; flag if it doesn't match, but keep the row
        keyed by hero_code, later row in the file overwrites earlier
          (last submission wins)

    look up all matching existing heroes in one query (keyed by
      upper-cased hero_code, case-insensitive match)

    for each parsed row:
        if no matching hero: status = new
        else: diff row's fields against the hero (same field-level
          diff as the live sync); status = unchanged | update

    return { summary counts, rows, skipped }
```

`store()` then, inside one DB transaction: creates a hero directly for
every `new` row (populating both the `*_imported` and live columns since
this is the point of origin for that data), and calls the same
`diffAndQueue` revision logic per `update` row that the sync API uses.
Committing inside a transaction means a mid-import failure can't leave the
hero ledger half-updated.

## QR codes

A hero's QR code encodes their hero code as plain text/URL — nothing
sensitive, since it's meant to be handed out and scanned in public at
quests. Single-hero and bulk-sheet generation are the same underlying
QR-rendering call; the sheet endpoint just lays out many codes per page for
printing. Both live behind `guild_master` since printed physical guild runes
warrant tighter control than day-to-day lookups.

## API surface

| Route | Access | Purpose |
|---|---|---|
| `GET /heroes` | guildkeepers | List/search/filter |
| `GET /heroes/{hero}` | guildkeepers | Profile detail |
| `GET /heroes/search` | `guild_master` | Typeahead used elsewhere (e.g. quest enlistment) |
| `POST /heroes` | `guild_master` | Manual single-hero creation |
| `PATCH /heroes/{hero}` | `guild_master` | Direct field edit (guildkeepers editing their own data directly bypasses the revision flow — the revision flow exists for *outside* submissions, not guildkeepers' own corrections) |
| `PATCH /heroes/{hero}/verify` | `guild_master` | Advance verification state |
| `PATCH /heroes/{hero}/standing-status` | `guild_master` | Set guild standing |
| `PATCH /heroes/{hero}/guild-crest` | `guild_master` | Toggle fulfillment flag |
| `PATCH /revisions/{revision}/accept-field` | `guild_master` | Accept one field of a pending revision |
| `PATCH /revisions/{revision}/dismiss` | `guild_master` | Discard a pending revision |
| `POST /heroes/import/preview` | `guild_master` | CSV dry run |
| `POST /heroes/import` | `guild_master` | CSV commit |
| `GET /heroes/{hero}/qr-code` | `guild_master` | Single QR code |
| `GET /heroes/qr-sheet` | `guild_master` | Bulk print sheet |
