# Meridian — Fantasy Guild Operations

Meridian is a portfolio-ready fantasy RPG operations portal for running an
adventurers' guild. Guildkeepers maintain a trusted hero ledger, organize
quests, enlist parties, reconcile unknown wanderers, and muster heroes on site
with scannable guild runes.

## Run locally

```bash
composer run setup
composer run dev
```

The seeded portfolio account is `guildmaster@meridian.test` with password
`password`. Visit the welcome screen, enter the guild, and use that account to
open the operational console.

The theme is fictional; the product and engineering problems are deliberately
real. Meridian demonstrates role-based access, review-gated data changes,
idempotent system integrations, dynamic form data, CSV reconciliation,
timezone-safe activity tracking, and responsive operational workflows.

## Portfolio pitch

> A full-stack guild operations console that turns messy hero applications and
> quest signups into a trustworthy system of record—complete with approval
> workflows, party management, live rune scanning, and a resilient player
> portal API.

## Product vocabulary

| Meridian concept | Familiar product pattern |
|---|---|
| Hero ledger | Member or character directory |
| Hero code | Stable external identifier |
| Guild standing | Eligibility or credential status |
| Faction | Chapter, region, or team |
| Quest | Event or campaign session |
| Enlistment | Registration |
| Wanderer | Unmatched guest or provisional character |
| Muster scan | QR attendance check-in/out |
| Hero revision | Human-reviewed external data change |
| Player portal | External self-service application |

## Signature demo flow

1. Sign in as a guild master and review the guild health dashboard.
2. Open a pending hero revision and approve selected field changes.
3. Create a quest and inspect its dynamic signup questions.
4. Merge an unmatched wanderer into a known hero—or promote them as new.
5. Switch to the mobile muster view and scan a hero's rune in and out.
6. Show that repeated portal syncs are safe and never downgrade participation.

## Reading order

| # | Specification | Covers |
|---|---|---|
| — | [`constitution.md`](constitution.md) | Product and engineering principles |
| 00 | [`00-product-vision`](00-product-vision/spec.md) | Positioning, personas, scope, and success |
| 01 | [`01-tech-foundation`](01-tech-foundation/spec.md) | Laravel, Inertia, React, and repository conventions |
| 02 | [`02-auth-roles`](02-auth-roles/spec.md) | SSO, guild-master/scout roles, and access control |
| 03 | [`03-heroes`](03-heroes/spec.md) | Hero ledger, verification, revisions, factions, and runes |
| 04 | [`04-quests`](04-quests/spec.md) | Quests, enlistments, wanderers, and live muster |
| 05 | [`05-player-portal-api`](05-player-portal-api/spec.md) | Idempotent player-portal integration |
| 06 | [`06-dashboard`](06-dashboard/spec.md) | Guild health, growth, and next-quest overview |
| 07 | [`07-data-import-export`](07-data-import-export/spec.md) | Bulk hero-ledger export, restore, and reset |
| 08 | [`08-frontend-ux`](08-frontend-ux/spec.md) | The visual system and interaction conventions |

Each feature folder contains a `spec.md` for requirements and, where the
technical decisions warrant it, a `design.md` for data models, algorithms,
state transitions, and API contracts.

## Visual direction

The application should feel like a premium cartographer's field console, not a
medieval novelty website: parchment neutrals, ink-dark surfaces, restrained
brass accents, faction colors, crisp typography, and subtle map-line texture.
Fantasy language stays in nouns and moments of delight; actions and feedback
remain direct and accessible.

## Technology

Laravel 13, PHP 8.4, Inertia v3, React 19, Tailwind CSS v4, shadcn/ui,
PostgreSQL, Passport, Socialite, Pest 4, and Wayfinder. See
[`01-tech-foundation/spec.md`](01-tech-foundation/spec.md) for the complete
implementation contract.
