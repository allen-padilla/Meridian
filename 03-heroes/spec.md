# 03 — Heroes

## Overview

The hero ledger is the Guild's system of record for who its
heroes are. Heroes originate from two places: the player portal (an
application/enlistment form heroes fill out themselves) and guildkeepers
directly (manual entry, or a bulk CSV import of an offline enlistment
drive). Wherever they originate, the hero ledger has one non-negotiable rule:
**a hero's on-file data is never silently overwritten by an outside
submission.** Every incoming change from outside guildkeepers — a resync from the
player portal, a CSV import — is diffed against what's on file and queued
for a human to approve, field by field.

## Requirements

### Identity and core record

- Each hero has a unique **hero code** — an identifier issued outside
  this system (by whatever registry or application process the Guild
  uses) that this system treats as the stable key for matching incoming
  data to an existing hero.
- A hero record holds player contact fields (name, email, and phone),
  character fields (ancestry, class, level, and home realm), and guild
  fields (assigned faction, guild standing, and whether a physical guild
  crest has been issued).
- Required-for-completeness fields (first name, last name, email) may
  still be blank on a record — a hero isn't blocked from existing in the
  system just because their submitted data was incomplete. The system
  tracks and surfaces which required fields are missing rather than
  refusing to create or display an incomplete record.

### Verification

- A hero's `verification_status` is independent from whether all their
  data is filled in — it's a guildkeeper judgment call that this record has been
  reviewed and is trustworthy, not a computed completeness check.
- Status moves forward in one direction under normal operation:
  `unverified` → `pending_review` → `verified`, one guildkeeper action at a time.
- A `verified` hero is automatically dropped back to `pending_review`
  whenever an outside submission introduces a change to their record that
  guildkeepers haven't yet reviewed (see "Hero revisions" below) — verification is
  a statement about the record *as it currently stands*, and stops being
  true the moment an unreviewed change lands on top of it.

### Guild standing and fulfillment

- `standing_status` (`confirmed` / `pending` / `not_confirmed`) tracks
  whether an external guild council authority has confirmed this
  person's eligibility — a fact guildkeepers record about the hero, not
  something this system verifies itself. It's independent of
  `verification_status`.
- `guild_crest_issued` is a simple boolean fulfillment flag guildkeepers toggle once
  a guild crest has been mailed to a verified hero. It doesn't
  drive any other workflow; it's a checklist item guildkeepers need visible on the
  record.

### Factions

- Heroes are optionally assigned to a **faction** — a regional or local
  subdivision of the Guild. The set of valid factions is a
  guildkeeper-managed whitelist (an admin resource), not free text, so the value is
  always one of a known, current set of factions and typos/duplicates
  can't accumulate in the data.

### Hero revisions (the never-silently-overwrite rule)

- When an outside source (player-portal resync or CSV import) submits
  data for a hero code that already exists, the system does **not**
  write the new values directly to the record. It compares every
  submitted field against the current value and, for each field that
  differs, creates one pending **hero revision** capturing both the
  current and submitted value.
- If the submission matches the record exactly, nothing is created and
  nothing changes — an unchanged resubmission is a no-op, not noise.
- Guildkeepers review a pending revision field by field: **accept** a field (writes
  the submitted value to the hero, removes that field from the revision)
  or **dismiss** the whole revision (discards it, record stays as-is). Once
  every field on a revision has been accepted or the revision dismissed, it's
  marked reviewed.
- If accepting/resolving the last pending revision on a hero leaves no
  other pending revisions, and the hero was `verified` before the revision
  was queued, the hero's `verification_status` returns to `verified`
  automatically — closing the loop opened when the revision was created.

### CSV import

- Guildkeepers can import a CSV export of the player portal's enlistment form
  to bulk-load or bulk-update heroes — e.g. after an in-person
  enlistment drive that used paper forms later transcribed to a form
  export.
- Import is a two-step, preview-then-commit flow: guildkeepers see, before
  anything is written, how many rows are new heroes, how many are updates
  to existing heroes (and to which fields), how many are unchanged, and
  how many rows are malformed enough to skip — with a reason for each
  skip.
- Rows are matched to existing heroes by hero code. New hero codes create
  new (unverified) heroes immediately. Existing hero codes go through the
  same revision flow as a player-portal resync
  — an import can never overwrite a record any more than a live sync can.
- The system validates that hero codes follow the Guild's known
  code convention (e.g. a required prefix) but does not reject rows
  that don't — it imports them and flags them, so guildkeepers can find and
  correct bad data after the fact rather than losing the row entirely.
- If the same person appears more than once in one CSV (e.g. they
  resubmitted the form), the later row in the file wins, since it's the
  more recent submission.

### QR codes

- Any individual hero can have a scannable QR code generated
  (encoding their hero code) for use at quest muster.
- Guildkeepers can generate a print-ready sheet of QR codes for many heroes at
  once, for pre-printing badges or cards ahead of a quest.
- Generating QR codes is a `guild_master`-only action.

## Acceptance criteria

- **Given** a hero code that doesn't exist yet, **when** a
  player-portal resync submits data for it, **then** a new unverified
  hero is created immediately with the submitted data.
- **Given** an existing, verified hero, **when** a resync submits a
  different email address for them, **then** no field on the hero
  changes, a pending revision is created holding both the old and new
  email, and the hero's status drops to `pending_review`.
- **Given** a pending revision with three changed fields, **when**
  guildkeepers accept one field and dismiss nothing else, **then** that field is
  written to the hero and removed from the revision, the other two fields
  remain pending, and the hero stays `pending_review`.
- **Given** a pending revision with one changed field, **when** guildkeepers
  accept that field and the hero has no other pending revisions, **then**
  the revision is marked reviewed and the hero returns to `verified`.
- **Given** a CSV import preview, **when** a row's hero code matches
  an existing hero and no field differs, **then** that row is classified
  "unchanged" and importing does nothing for it.
- **Given** a CSV row with a hero code that doesn't match the
  Guild's code convention, **when** it's imported, **then** the
  hero is still created/updated normally, flagged for guildkeeper attention.
