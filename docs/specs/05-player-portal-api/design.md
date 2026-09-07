# 05 — Player Portal API: Design

## Authentication and transport

- Every route in this API sits behind two middleware layers: a `throttle`
  rate limiter, and a client-credentials check (Passport's resource-owner
  guard configured for the `client` grant only — no user-context access
  tokens are accepted here, only tokens issued directly to the registered
  system client). This is a deliberately narrow trust boundary: one
  registered OAuth client represents "the player portal," full stop.
- The OAuth client is provisioned once via the framework's client-creation
  command and its credentials are held by the player portal's own
  backend, never exposed to its front end or its visitors.

## Hero endpoints

`lookup` is a direct read: find by hero code, 404 if not found.

`sync` reuses the diff-and-queue mechanism from
[`03-heroes`](../03-heroes/design.md) verbatim:

```
sync(payload):
    validate payload shape (hero_code required; other fields optional)
    existing = find hero by payload.hero_code

    if existing is null:
        create hero from payload (both *_imported and live columns)
        return 201

    diffAndQueue(existing, payload)   # same routine CSV import uses
    return 200 or 202 depending on whether anything changed
```

Putting this logic in one place that both the API and the CSV importer
call is what makes the "never silently overwritten, whatever the source"
guarantee in the requirements actually hold — there's only one code path
that's allowed to touch an existing hero's fields from an external
submission, and it always goes through the revision queue.

## Quest endpoints

**Create/update** upsert on `source_quest_id` when present:

```
store(payload):
    normalizedDate = normalizeDate(payload.date, payload.timezone)
    if payload.source_quest_id present:
        quest = updateOrCreate({ source_quest_id }, { ...payload, date: normalizedDate })
    else:
        quest = create({ ...payload, date: normalizedDate })
    return quest, 201 if newly created else 200

normalizeDate(dateString, timezone):
    if dateString already carries an explicit offset/Z: parse as-is, convert to UTC
    elif timezone given: parse dateString as wall-clock time IN that timezone, convert to UTC
    else: parse as-is (assume the string's own timezone or none), convert to UTC
```

The `timezone` parameter exists because the player portal's form builder
may emit naive datetime strings ("2026-09-14 18:00") stamped in the
player portal's own configured timezone, not UTC and not the server's timezone —
without this, an evening quest could silently shift to the wrong day
depending on where Meridian happens to be hosted.

**Register one signup** — the same hero-or-wanderer branch used everywhere
wanderers are created:

```
register(quest, payload):
    responses = normalizeResponses(payload.responses)   # trim, drop blanks
    status = payload.status ?? 'interested'

    hero = payload.hero_code given ? find hero by it : null

    if hero:
        enlistment = quest.enlistments.firstOrCreate(
            { hero_id: hero.id },
            { status, registered_at: now }
        )
        if responses not empty:
            enlistment.responses = { ...enlistment.responses, ...responses }
        # note: status is deliberately NOT overwritten here on an
        # existing enlistment — a replayed submission must not
        # downgrade an already-recorded status
    else:
        wanderer = upsertWandererFor(quest, payload, responses, status)  # 04-quests design
        if wanderer is null:
            return 422 "nothing to identify this submission by"

    appendNewResponseLabels(quest, responses.keys())
    return the enlistment or wanderer, 201 if newly created else 200
```

**Bulk replay** accepts two shapes, since the "force resync" use case
mostly wants to push exactly what it already has, in whatever
completeness that is:

- `hero_codes: [...]` — a flat list of hero codes, the fast
  path when the caller only has identifiers and no other details. Each
  gets an `interested` enlistment created if one doesn't exist;
  existing enlistments for those heroes are left untouched entirely
  (not even a status check — this shape carries no status to apply).
- `entries: [{ hero_code?, first_name?, ..., responses?, status? }]`
  — full submissions, run through the *exact same* single-register logic
  above, per entry, inside one database transaction so a bulk replay
  either fully lands or fully rolls back rather than partially applying.

Both shapes cap the batch size (e.g. 200 entries) so one request can't
become an unbounded, slow transaction — a caller with more than that
paginates across multiple requests.

## Idempotency, end to end

Every write endpoint in this API is safe to call twice with the same
payload because every one of its effects is expressed as an idempotent
operation: `updateOrCreate`/`firstOrCreate` keyed on a stable identifier
(hero code, `source_quest_id`, or the wanderer identity rule), a diff step
that's a no-op when nothing changed, and a response-field append that
dedupes. There is no endpoint in this API whose second identical call
produces a different result than its first.
