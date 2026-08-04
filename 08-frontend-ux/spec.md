# 08 — Frontend & UX Conventions

## Overview

This isn't a new feature — it's the set of frontend conventions the
features above should all follow, so the app reads as one system rather
than a pile of independently-built pages. Requirements here are about
consistency and feel, not new business logic.

## Requirements

### Page/layout structure

- Every page is a single Inertia page component under a `pages/` tree that
  mirrors the URL structure. Layout (the persistent chrome — nav, header,
  breadcrumbs) is applied by convention based on the page's location in
  that tree, not by each page manually wrapping its own JSX in a layout
  component — a login page and a settings page shouldn't each need to
  remember to import and apply the right wrapper.
- A page declares its own breadcrumbs, title, and description declaratively
  (a static property on the page component), and the layout-resolution
  layer reads that to render chrome — the page's business logic and its
  chrome metadata stay separate concerns.
- Typed, generated helpers are used for every link to a backend route or
  controller action — no hand-written URL strings scattered through
  components. Regenerate these helpers whenever backend routes change;
  never hand-edit the generated output.

### Live data on shared surfaces

- Any page multiple guildkeepers are likely to be looking at
  simultaneously during the exact activity the page supports (quest
  muster during a quest; the hero list during an import) refreshes
  its data on an interval automatically — guildkeepers should never need to
  manually reload to see a colleague's scan or edit show up.
- Polling intervals are tuned to the page's urgency: a muster-heavy
  quest-detail view polls aggressively (a few seconds) since stale
  presence data directly causes double-scans and confusion at the door; a
  browsing-oriented list view polls more gently (order-of-ten-seconds),
  since the cost of slightly-stale data there is low and aggressive
  polling would just waste bandwidth.
- Polling must survive the tab being backgrounded on mobile — the quest
  muster view is the canonical case: a phone at the front table spends
  most of its time in a pocket or with the screen off between scans, and
  presence data must still be fresh when someone looks at it again.
- Polling pauses automatically while the user has an in-progress action
  open that a background refresh could corrupt (e.g. a scan dialog mid-
  interaction) and resumes when that action completes.

### Design system application

Every page follows the tone and principles set in
[`constitution.md`](../constitution.md):

- Use an ink-and-parchment palette with restrained brass accents and one
  configurable color per faction. Dark ink surfaces carry navigation and live
  muster; pale parchment surfaces carry records and forms. Every combination
  must meet WCAG 2.1 AA contrast.
- Pair a characterful display serif for page titles with a highly legible sans
  serif for controls, tables, and body copy. Never use blackletter for working
  text.
- Use subtle topographic lines, constellation marks, or etched dividers only
  on low-information surfaces. Dense tables and forms stay visually quiet.
- Icons should read as a coherent engraved-line set. Familiar actions keep
  familiar symbols and labels; fantasy terminology never replaces clarity.
- Motion is brief and purposeful: a successful rune scan may resolve with a
  soft radial glow, while ordinary navigation and table operations remain
  immediate. Respect `prefers-reduced-motion` with a non-animated equivalent.

- Desktop-dense views (the hero list, a quest's full enlistment
  table) and mobile-first views (the QR scan flow) are genuinely
  different layouts tuned to their context, not one responsive layout
  stretched to cover both — density adapts to the surface rather than
  simply shrinking.
- Every write action gives immediate, legible feedback (a toast, an
  inline state change) — guildkeepers should never wonder whether a click
  registered.
- Destructive or hard-to-reverse actions (delete, reset, dismiss a revision)
  require an explicit confirmation step; routine actions (accept an
  revision field, move a participation status) do not, since adding friction
  to routine actions works against the fast-by-default principle.

## Acceptance criteria

- **Given** a new page is added anywhere under the guildkeeper-facing section
  of the app, **when** it's placed in the page tree, **then** it
  automatically receives the standard app chrome with no per-page layout
  wiring required.
- **Given** two guildkeepers viewing the same quest's muster view on
  separate devices, **when** one scans a hero in, **then** the other's
  view reflects that scan within the view's polling interval without a
  manual reload.
- **Given** a guildkeeper has a scan dialog open on the quest page,
  **when** a background poll would otherwise land, **then** the poll is
  held off until the dialog closes.
- **Given** a guildkeeper attempts a destructive action (e.g. wiping the
  hero ledger), **when** they trigger it, **then** they must explicitly
  confirm before it takes effect.
