# 07 — Data Import/Export

## Overview

Distinct from the per-row, review-gated CSV import described in
[`03-heroes`](../03-heroes/spec.md), this is whole-hero ledger data movement:
exporting every hero to a CSV for reporting or backup, and re-importing a
full hero ledger export — typically the Guild's own prior export, edited
externally (e.g. a bulk cleanup done in a spreadsheet) — back in. Because
this path is about restoring/replacing bulk data rather than reconciling
individual outside submissions, it operates directly on records rather
than through the revision queue, and is gated more tightly as a result.

## Requirements

- Export produces a CSV of the full hero ledger in a stable column
  order, suitable for opening in a spreadsheet tool and re-importing
  later.
- Import accepts a CSV in that same export format and treats it as
  authoritative for the fields it contains — this is a direct-write path
  for guildkeepers who have already reviewed the data externally (e.g. in a
  spreadsheet), not another instance of the outside-submission review
  flow. It is restricted to `guild_master` for exactly this reason: it can
  write hero data without the safety net the rest of the system relies
  on.
- Rows that can't be matched or parsed (malformed hero code, missing
  required field) are not silently dropped — they're collected into a
  separate "skipped rows" report guildkeepers can download, so nothing
  disappears without a trace.
- A full "reset" operation exists to clear the hero ledger entirely — an
  intentionally rare, heavily-gated action (e.g. for resetting a
  staging/test copy of the system, or a full re-load from a corrected
  source), never something a guildkeeper should reach for as part of
  routine data cleanup.

## Acceptance criteria

- **Given** a full hero export, **when** it's immediately re-imported
  with no edits, **then** the hero ledger is unchanged — the export/import
  round-trip is lossless and idempotent.
- **Given** an import file with a row that has no hero code,
  **when** it's imported, **then** that row appears in the skipped-rows
  report and no partial/garbage record is created for it.
- **Given** a non-`guild_master` guildkeeper, **when** they attempt any
  export, import, or reset action, **then** the request is rejected.
