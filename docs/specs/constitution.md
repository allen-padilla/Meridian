# Constitution

Principles every spec in this guide assumes. Read this first — the feature
specs don't repeat these; they only call out where a feature departs from
them.

## Product principles

**Users.** Guild operators, collectively called guildkeepers, working under two roles:
`guild_master` (full management) and `scout` (view and scan). They log in
exclusively through SSO. Their work splits across two contexts: at a desk,
browsing and filtering hero lists, editing records, and running exports on
a larger screen; and on-site at quests, using a phone or tablet to scan
hero QR codes and do quick musters and lookups. Because the on-site
context is real and frequent, responsive layout, comfortable tap targets,
and fast quick-scan flows matter as much as dense desktop tables.

**Purpose.** Meridian is the single source of truth for the Guild's
heroes and quests. It lets guildkeepers manage hero records and quest
participation, keep those records clean, and check heroes in at quests. The
Guild's player portal syncs heroes and quests into it over an
authenticated API, so Meridian also serves as the canonical back office
behind the public-facing site. Success is guildkeepers trusting the data and
reaching for this tool by reflex: finding a hero in seconds, checking
someone in at a quest without friction, and running an export without
second-guessing what's in it.

**Brand personality.** Storied and atmospheric, but never cutesy or costume-like.
The interface should feel like a premium cartographer's field console: calm,
capable, tactile, and quietly magical. Fantasy is expressed through names,
materials, iconography, and small moments of delight; operational copy stays
plain-spoken and data remains easy to scan.

**Anti-references.** Not a sterile enterprise CRM, a generic blue-gradient
dashboard, or a theme-park medieval UI. Avoid faux-gothic body copy, ornamental
frames around every surface, novelty cursor effects, and low-contrast parchment.
Atmosphere must support the work rather than compete with it.

**Design principles:**

- **Trust through clarity** — guildkeepers must always know what the data says and
  that it's correct; never hide state or make an edit ambiguous.
- **Fast by default** — the common paths (find a hero, scan at a quest,
  run an export) should be the shortest paths, with the fewest taps.
- **Atmospheric, not theatrical** — personality comes from material, color,
  iconography, and language, not decoration competing with the work.
- **Works in the hand and at the desk** — every surface earns its keep on a
  phone at a quest as much as on a wide screen; density adapts, it doesn't
  just shrink.
- **Calm under load** — long lists, bulk imports, and busy quest days should
  still feel orderly; reduce visible complexity as data grows, don't
  multiply it.

**Accessibility.** Target WCAG 2.1 AA: body text at ≥4.5:1 contrast, visible
keyboard focus on every interactive element, full keyboard navigability, and
a reduced-motion alternative for all animation. Given the on-site mobile
context, keep tap targets comfortable and legibility high in variable
lighting.

## Engineering conventions

**Stack.** Laravel 13 (PHP 8.4) + Inertia v3 + React 19 + Tailwind v4 +
shadcn/ui, tested with Pest 4, formatted with Pint. Full detail in
[`01-tech-foundation`](01-tech-foundation/spec.md).

**Do things the framework's way.** Use `php artisan make:*` to scaffold new
files rather than hand-rolling boilerplate. Prefer named routes and the
`route()`/Wayfinder helpers over hardcoded URLs. Default to Eloquent API
Resources and API versioning for new APIs unless an existing route group
already establishes a different convention — then follow that convention.

**Types and structure.** Explicit return types and parameter type hints on
every method. PHP 8 constructor property promotion. TitleCase enum keys.
Array-shape PHPDoc blocks over inline comments — comments are for the *why*,
not the *what*, and only when the reasoning isn't obvious from the code
itself.

**Don't overbuild.** No feature flags or backwards-compatibility shims for
a system with one deployment target. No abstraction until a third caller
needs it. A bug fix doesn't need surrounding refactors.

**Testing is not optional.** Every change ships with a test that proves it.
Feature tests are the default; reach for a unit test only when there's no
sensible way to exercise the behavior through a request. Use model
factories, not manually constructed models, in tests.

**Formatting is automatic, not negotiated.** Run the formatter after every
change; never hand-format to match a style guide the formatter already
enforces.

**Consistency over local optimization.** When a new file's shape isn't
obvious, look at the closest sibling file and match it — naming, structure,
error handling — rather than introducing a new pattern for the same kind of
problem.
