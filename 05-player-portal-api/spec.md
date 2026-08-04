# 05 — Player Portal API

## Overview

The player portal is a separate self-service application where players submit
heroes and enlist in quests. It has no direct database access to Meridian and
no user-level login to it — it talks to Meridian exclusively through a
small, purpose-built API, authenticated as a trusted system, not as any
individual user.

## Requirements

- The API authenticates the player portal as a single trusted client
  system (client-credentials OAuth2), not as any individual hero or
  guildkeeper. There is no concept of a hero "logging into" Meridian
  through this API—the portal is the only caller, and it is fully
  trusted once authenticated.
- Every write this API performs must be safe to retry. The player portal
  may resend the same submission (a flaky connection, a user
  double-clicking submit, an operator manually replaying a backlog) and
  the result must be the same as if it had only been sent once — no
  duplicate records, no double-counted answers.
- The API never lets an external submission silently overwrite existing
  hero data — it goes through the same revision mechanism described
  in [`03-heroes`](../03-heroes/spec.md), not a special API-only bypass.
- The API never lets an external submission downgrade a quest
  participation status that's already been recorded on-site — see
  [`04-quests`](../04-quests/spec.md)'s status rules.
- Requests are rate-limited to protect Meridian from an unexpected traffic
  spike or a misbehaving retry loop on the caller's side.
- The API accepts quests and enlistments in whatever shape the player
  portal's dynamic sign-up forms produce — it does not require the
  player portal to know Meridian's internal field names beyond a
  hero-code and a handful of contact fields; everything else is
  passed through as free-form question/answer pairs.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/heroes/lookup` | Find a hero by hero code (e.g. so the player portal can pre-fill a returning hero's known info). |
| `POST /api/heroes/sync` | Create-or-update a hero from a submitted application/enlistment. |
| `POST /api/quests` | Create a quest (or update it, if it already exists by the portal's quest ID). |
| `PUT /api/quests/{source_quest_id}` | Update an existing quest. |
| `POST /api/quests/{source_quest_id}/enlistments` | Register one signup for a quest. |
| `POST /api/quests/{source_quest_id}/enlistments/bulk` | Replay many signups for a quest at once (e.g. a "force resync" the player-portal operator can trigger to push everything it has on file, in case earlier individual syncs were missed). |

## Acceptance criteria

- **Given** a request without valid client credentials, **when** it hits
  any endpoint under this API, **then** it's rejected before touching
  application logic.
- **Given** the same hero-sync payload sent twice in a row, **when**
  both requests are processed, **then** the second is a no-op (no
  duplicate revision, no error) if nothing changed between the two sends.
- **Given** a quest enlistment bulk-replay that includes a person
  already marked "participated" from an earlier on-site scan, **when** the
  replay is processed, **then** that person's status remains "participated."
- **Given** a quest creation request that includes a naive (no
  timezone offset) date string and a source timezone, **when** it's
  processed, **then** the date is interpreted in that timezone before
  being stored, not assumed to be UTC or the server's local time.
