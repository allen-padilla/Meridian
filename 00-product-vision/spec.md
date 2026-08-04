# 00 — Product Vision

> Principles that inform every decision below live in
> [`constitution.md`](../constitution.md); this spec covers who Meridian is
> for, what it must do, and what it deliberately leaves out.

## Positioning

The authoritative operations console for an adventurers' guild—one trusted
place to manage heroes, assemble quests, and run live muster.

## Personas

**Guild masters.** Lead operators who manage the hero ledger, resolve
data-quality issues, run imports and exports, and configure quests. They work
primarily at a desk but may also run muster in the field.

**Scouts.** Field operators whose role is narrower: look heroes up, scan them
in at quests, and view quest or hero details. They cannot edit canonical
records, run imports, or delete anything. They usually work on a phone.

**The player portal.** A separate self-service application where players
submit heroes, update profiles, and enlist in quests. It talks to Meridian
only through the player portal API and has no direct database access.

## Core user stories

- As a scout at a quest muster point, I want to scan a hero's
  QR code and have it just work — no lookup, no typing — so the line keeps
  moving.
- As a guildkeeper, I want to find any hero by name, code, or partial info in
  seconds, whether I'm at my desk or on my phone at a faction meetup.
- As a guild master, I want confidence that importing a CSV or accepting a
  sync from the player portal can never silently overwrite a hero's
  verified data — I want to see exactly what changed and approve it myself.
- As a guild master, I want to run a quest's sign-in sheet through a CSV
  import and have every row land somewhere sensible — matched to a hero,
  or captured as a wanderer I can reconcile later — never silently dropped.
- As a guildkeeper, I want the dashboard to tell me, at a glance, whether the
  hero ledger is growing and whether there's anything (pending reviews,
  unconfirmed standing reviews) that needs my attention.
- As a guild master, I want to export the full hero ledger to CSV for
  reporting, and import a corrected version back in, without risking data
  I didn't intend to touch.

## Scope

**In scope:**

- Hero ledger management, verification, and faction assignment
- Guildkeeper authentication and role-based access
- Quest management: enlistments, walk-in wanderers, QR muster/participation
- The player portal API the player portal uses to push heroes and quest
  signups into Meridian
- A guildkeeper dashboard with hero ledger and quest stats
- Bulk CSV import/export of the hero ledger

**Explicitly out of scope** (not part of this system, whether or not a real
deployment pairs it with something that does this):

- Payment processing or dues collection
- Any hero-facing self-service UI — players interact with the player
  portal, never with Meridian directly
- Email/SMS campaign tooling
- General content management for the player portal

## Success criteria

- A guildkeeper can locate any hero's record from the desk or from a
  quest floor in a handful of taps or keystrokes.
- No external submission (player portal sync, CSV import) ever overwrites
  an existing hero field without a guild master explicitly approving it.
- Quest muster remains fast and unambiguous even when the same person is
  scanned multiple times, or scanned by different guildkeepers on different
  devices, during the same quest day.
- Bulk data operations (import, export, reset) are safe enough that a guild
  master never has to second-guess what an action is about to do.
