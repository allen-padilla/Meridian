# 04 — Quests

## Overview

Quests are scheduled guild operations—expeditions, trials, diplomatic
missions, and faction gatherings. Meridian tracks who enlisted, who joined the
party, and who is currently in the field through rune-based muster. Each quest
asks different preparation questions, and not every signup maps cleanly to a
known hero. A prospective recruit or a player who mistyped a hero code must
still be captured, never silently dropped.

## Requirements

### Enlistments and wanderers

- A signup that's matched to an existing hero becomes an **enlistment**
  tied to that hero; a person can only have one enlistment per quest.
- A signup that can't be matched to a hero — no hero code given, or
  one that doesn't match anyone — becomes a **wanderer**: a lightweight,
  quest-scoped record of a non-hero attendee, carrying whatever contact
  details and answers they provided.
- Wanderers are matched to each other *within one quest* so a person who
  submits more than once (a corrected resubmission, a CSV re-import) lands
  on the same wanderer record rather than creating duplicates. Matching
  prefers whatever identifying detail was given, in order: hero code
  if quoted (even though it didn't match a hero — someone may have
  mistyped it consistently), then email, then name.
- A submission with none of hero code, email, or name is not captured
  at all — there's nothing to identify it by or reconcile it later, so it
  is rejected rather than stored as an anonymous, unreconcilable row.
- Guildkeepers can turn a wanderer into a proper enlistment two ways: **merge** it
  into an existing hero (for when guildkeepers realize "oh, this wanderer is
  actually hero #4821, they just mistyped it") or **promote** it into a
  brand-new hero record (for a genuine new sign-up who should join the
  hero ledger). Both remove the wanderer row once done.
- A merge only ever advances the resulting participation status — merging a
  wanderer who's marked "participated" into a hero who's merely "registered"
  produces "participated," never the reverse. A promotion carries the wanderer's
  answers onto the newly-created enlistment outright, with no
  ambiguity to resolve.

### Participation status

- Both enlistments and wanderers share one status vocabulary: registered
  interest, participated in person, participated virtually, and no-show. Exactly
  one of these applies at a time.
- Once someone is marked participated (in person or virtual), nothing —
  a repeat sync, a re-import, a merge — is allowed to silently move them
  back to a "not yet participated" status. Participation, once recorded, is a
  fact, not a guess to be overwritten by a later, less-informed
  submission.

### Dynamic sign-up questions

- Each quest's sign-up form can ask different questions. Rather than
  requiring guildkeepers to pre-configure a fixed set of fields per quest, the
  system accepts free-form question/answer pairs on every enlistment and
  wanderer, and the quest itself accumulates the running list of question
  labels it's seen — from the player portal, from a CSV import, from a
  wanderer being promoted — so the quest's guildkeeper view can render a full,
  consistent table of answers without any manual setup.
- An answer that's blank, or a question with a blank label, is never
  stored — an untouched form field shouldn't create a phantom column in
  the quest's answer table.

### On-site muster

- Guildkeepers scan a hero's QR code at the door to check them in. Scanning is
  fast, requires no lookup step, and works for someone who never
  registered ahead of time (a walk-in) exactly as well as for someone who
  did.
- A scan's direction — checking in vs. checking out — is inferred
  automatically from that hero's most recent scan at this quest **on
  the current calendar day**, not their scan history from a previous day
  of a multi-day quest. This matters because a multi-day quest's "who's
  currently on site" question resets each morning: someone who scanned in
  and never scanned out the night before (they just went home) should
  scan in again the next morning without guildkeepers having to manually reset
  anything.
- Checking a walk-in in for the first time creates their enlistment on
  the spot, marked participated — they don't need a separate "register" step
  before they can check in.
- Scouts can perform this action; it's one of the few
  write actions available to that role, because it's the time-pressured,
  door-side action the product has to make effortless (see
  [`02-auth-roles`](../02-auth-roles/spec.md)).

### CSV import

- Guildkeepers can import a CSV export of a quest's sign-up form, the same way
  they can import hero data. Every column other than the hero-code
  column becomes a dynamic question/answer pair, keyed by its column
  header — guildkeepers can optionally narrow which columns get imported as
  questions.
- Rows follow the exact same hero-match-or-wanderer rule as a live
  submission from the player portal.

## Acceptance criteria

- **Given** a signup with a hero code that matches an existing
  hero, **when** it's submitted, **then** an enlistment is created (or
  updated, if one already exists) for that hero on that quest.
- **Given** a signup with no hero code but an email that matches a
  wanderer already recorded on this quest, **when** it's submitted,
  **then** the existing wanderer record is updated with any new details
  rather than a second wanderer being created.
- **Given** a wanderer marked "participated," **when** guildkeepers merge them into a
  hero who has no existing enlistment for the quest, **then** the
  resulting enlistment is "participated," not "registered interest."
- **Given** a hero checked in ("in") earlier today at a multi-day quest
  who never checked out, **when** they scan in again the next calendar
  day, **then** the scan records as "in," not "out."
- **Given** a walk-in with no prior enlistment, **when** they're scanned
  in, **then** an enlistment is created for them automatically, marked
  participated.
- **Given** a quest whose form has a question no earlier enlistment
  answered, **when** the first answer to it comes in, **then** the
  quest's tracked question list grows to include it and the guildkeeper view
  renders it as a new column going forward.
