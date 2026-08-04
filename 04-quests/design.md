# 04 — Quests: Design

## Data model

**`quests`**

| Column | Notes |
|---|---|
| `source_quest_id` | Nullable. The player portal's ID for this quest, when it originated there — the key the sync API upserts on. Null for quests created directly by guildkeepers. |
| `name`, `date`, `location`, `status` (`upcoming` \| `completed` \| `cancelled`) | Core fields. `date` stored as a UTC instant. |
| `response_fields` | JSON array of question labels seen so far, in first-seen order. Purely additive — order is preserved across imports/syncs so the guildkeeper view's columns don't jump around as new data lands. |

**`quest_enlistments`** — a hero's participation.

| Column | Notes |
|---|---|
| `quest_id`, `hero_id` | Unique together — one enlistment per hero per quest. |
| `status` | `interested` \| `participated` \| `participated_virtual` \| `no_show`. |
| `responses` | JSON map of `{ question_label: answer }`. |
| `registered_at` | |

**`quest_wanderers`** — a non-hero's participation, scoped to one quest.

| Column | Notes |
|---|---|
| `quest_id` | |
| `first_name`, `last_name`, `email`, `phone` | All nullable — a wanderer may be identified by only one of these. |
| `status`, `responses`, `registered_at` | Same shape as enlistments. |

No `hero_id` — a wanderer is, by definition, not (yet) a hero. It's kept
as its own table rather than an `quest_enlistments` row with a nullable
`hero_id`, because the enlistments table's whole shape (the unique key,
the joins that pull a hero's verification/faction info for the guildkeepers
view) assumes a real hero; giving a wanderer a fake or null hero reference
would mean special-casing every one of those call sites instead of just
the two or three that specifically handle wanderers.

**`quest_scans`** — the muster/check-out log.

| Column | Notes |
|---|---|
| `quest_id`, `hero_id` | |
| `direction` | `in` \| `out`. |
| `scanned_at` | UTC instant. |
| `scanned_by` | The guildkeepers user who performed the scan. |

Wanderers aren't scanned — muster in this design is a hero-only fast
path (a wanderer is walked through merge/promote to become a hero first if
they need to be tracked on-site, which in practice happens rarely enough
not to warrant its own scan path).

## Wanderer identity matching

```
upsertWandererFor(quest, details, responses, status):
    normalize each of hero_code, email, first_name, last_name, phone
      (trim; blank -> null)
    hero_code, if present, upper-cased; email, if present, lower-cased
      (so "c123" / "C123" and mixed-case emails match consistently)

    identity = first of:
        { hero_code }         if hero_code given
        { email }                 if email given
        { first_name, last_name } if either given
        null                      otherwise

    if identity is null: return null   # nothing to file this under

    wanderer = firstOrCreate(quest.wanderers, identity, {
        ...all normalized details, status, registered_at: now,
        responses: responses (or null if empty)
    })

    if wanderer was just created: return wanderer

    # existing wanderer: fill gaps, don't blank fields; merge new answers
    # over old (new answers win on conflict, old answers are kept where
    # the new submission didn't touch them); status is untouched here —
    # only guildkeepers change status directly, an upsert never does
    wanderer.update({
        each detail: normalized value ?? wanderer's existing value,
        responses: { ...wanderer.responses, ...responses }
    })
    return wanderer
```

The identity precedence (hero-code-as-quoted, then email, then name)
is deliberate: a hero code that didn't match anyone is still the
*most specific* thing the person provided, and is likely a typo of a real
number — keeping resubmissions from the same person landing on the same
wanderer row is more valuable than treating an unmatched number as noise.

## Merge and promote

**Merge** — fold a wanderer into an existing hero:

```
merge(quest, wanderer, hero):
    enlistment = quest.enlistments.firstOrCreate(
        { hero_id: hero.id },
        { status: wanderer.status, registered_at: wanderer.registered_at }
    )
    enlistment.status = furtherAlong(enlistment.status, wanderer.status)
    enlistment.responses = { ...enlistment.responses, ...wanderer.responses }
    delete wanderer

furtherAlong(current, incoming):
    rank = { interested: 0, no_show: 0, participated_virtual: 1, participated: 2 }
    return rank[incoming] > rank[current] ? incoming : current
```

`no_show` ranks alongside `interested` (both "hasn't participated") rather than
below it, so a merge can't use "no_show" to overwrite someone who's
already known to have participated, but also doesn't treat "no_show" as more
significant than a bare enlistment.

**Promote** — turn a wanderer into a new hero outright: requires guildkeepers to
supply a hero code, first name, last name, and email (the minimum a
real hero record needs), validated unique against existing hero
numbers. Creates the hero (pre-verified by the guildkeeper doing the
promotion, since a human is vouching for this record at the point of
creation), creates their enlistment on this quest carrying the wanderer's
status and responses, and deletes the wanderer row.

## Dynamic response fields

Every write path that accepts `responses` (the sync API, CSV import, wanderer
merge/promote) runs answers through the same normalization before storage:
trim every label and answer, drop any pair where either is blank. Then it
appends any newly-seen labels to `quest.response_fields` (deduplicated,
preserving first-seen order) if there are any it hasn't seen yet. This is
the only mechanism that grows the quest's known question set — there's no
separate "configure this quest's form fields" step for guildkeepers to remember.

## Muster scan direction

```
recordScan(quest, heroNumber, scannedByUserId):
    hero = find by heroNumber, or 404

    lastScanToday = quest.scans
        .where(hero_id: hero.id)
        .where(scanned_at >= localDayStart(quest's timezone))
        .latest(scanned_at)
        .first()

    direction = (lastScanToday?.direction == 'in') ? 'out' : 'in'

    create QuestScan(quest, hero, direction, scanned_at: now, scanned_by)

    if direction == 'in':
        enlistment = quest.enlistments.firstOrCreate(
            { hero_id: hero.id },
            { status: 'participated', registered_at: now }
        )
        walkIn = enlistment was just created
        if not walkIn and enlistment.status in ['interested', 'no_show']:
            enlistment.status = 'participated'

    return { direction, walk_in: walkIn, scanned_at, hero summary }
```

**Local-day scoping is the crux of this design.** Scans are stored as UTC
instants, but "today" for the purpose of direction-toggling must be the
organization's local calendar day, not a flat 24-hour UTC window and not a
literal midnight-to-midnight UTC boundary. A multi-day quest in a US/Canada
timezone crosses UTC midnight mid-evening — using UTC boundaries would flip
everyone's scan direction hours before the quest floor considers the day
"over." Compute the local-day boundary by converting local midnight (in the
organization's configured timezone) to its UTC instant, and use that as the
lower bound; this also has to account for daylight-saving transitions
making some local days 23 or 25 hours long, so the boundary must be
computed from the local calendar date, not by adding a fixed 24 hours to
the previous boundary.

Guildkeepers viewing "who's currently on site" for a day other than today (e.g.
reviewing yesterday's participation the morning after) pass an explicit local
date; the same local-day boundary logic applies to that date instead of
today, with an invalid or missing date falling back to today rather than
erroring.

## API surface

| Route | Access | Purpose |
|---|---|---|
| `GET /quests` | guildkeepers | List |
| `GET /quests/{quest}` | guildkeepers | Detail: enlistments, wanderers, scan log |
| `POST /quests/{quest}/scan` | guildkeepers (incl. `scout`) | Muster/out |
| `PATCH /quests/{quest}/enlistments/{enlistment}` | guildkeepers (incl. `scout`) | Move participation status |
| `PATCH /quests/{quest}/wanderers/{wanderer}` | guildkeepers (incl. `scout`) | Move wanderer participation status |
| `POST /quests/{quest}/enlistments` | `guild_master` | Manually add an enlistment |
| `DELETE /quests/{quest}/enlistments/{enlistment}` | `guild_master` | Remove |
| `POST /quests/{quest}/wanderers/{wanderer}/merge` | `guild_master` | Merge into hero |
| `POST /quests/{quest}/wanderers/{wanderer}/promote` | `guild_master` | Promote to new hero |
| `DELETE /quests/{quest}/wanderers/{wanderer}` | `guild_master` | Remove wanderer |
| `POST /quests/{quest}/enlistments/import/preview` \| `.../import` | `guild_master` | CSV dry-run / commit |
| `GET /quests/{quest}/qr-sheet` | `guild_master` | Print sheet for this quest's expected attendees |
