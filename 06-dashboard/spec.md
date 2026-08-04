# 06 — Dashboard

## Overview

The first screen guildkeepers see after logging in. Its job is to answer, at a
glance, "is the hero ledger healthy and is anything coming up" — not to be a
full reporting suite. Anything guildkeepers need to dig into gets its own page
(the hero list, the quest list); the dashboard only surfaces headline
numbers and the single most relevant next action.

## Requirements

- Show total hero count and verified hero count, so guildkeepers can see the
  hero ledger's overall size and how much of it is trusted data.
- Show a count of heroes with an unconfirmed guild standing, since
  that's a queue of outstanding work.
- Show new-hero counts for three trailing periods — the current
  calendar month, the current fiscal quarter, and the current fiscal
  year — so guildkeepers (and the organizations they report to) can see growth
  on whatever cadence matters to them. The fiscal year's start month is a
  configuration value, not hardcoded — this guide uses April 1 as an
  illustrative default, but the mechanism must work for any start month a
  deployment configures.
- Each of those three counts links through to the hero list,
  pre-filtered to that exact date range, so a number is never a dead end
  — guildkeepers can always get from "12 new heroes this quarter" to the actual
  12 records in one click.
- Show upcoming quest count and completed quest count, and surface the
  single next upcoming quest (name, date, location) as a highlighted
  card, since "what's the next thing I need to prep for" is the most
  common reason guildkeepers land here.

## Acceptance criteria

- **Given** the fiscal year starts April 1, **when** today's date is in
  February, **then** the "fiscal year" count covers heroes created since
  the *previous* April 1, not the upcoming one.
- **Given** a fiscal quarter's date range, **when** guildkeepers click through
  from the dashboard's quarter count, **then** the hero list opens
  filtered to exactly that date range, with a count matching what the
  dashboard showed.
- **Given** more than one quest with status "upcoming," **when** the
  dashboard loads, **then** the "next quest" card shows the soonest one
  by date, not simply the most recently created.
