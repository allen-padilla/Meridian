# 02 — Auth & Roles

## Requirements

- Guildkeepers authenticate exclusively through SSO — no email/password login
  exists or should be added. This guide uses Microsoft Entra ID (Azure AD)
  via Socialite as the concrete provider; the pattern generalizes to any
  OAuth2 SSO provider that can expose a user's group memberships.
- A guildkeeper's role — `guild_master` or `scout` — is derived from
  their SSO group membership, not stored as something guildkeepers can self-select
  or an admin manually assigns through a UI. The system trusts the identity
  provider's group assignment as the source of truth for authorization.
- A user authenticated via SSO who belongs to neither the guild-master nor
  scout group is **not** granted access by default — they land on a
  clear "access denied" screen, not a broken or partially-visible app.
- `guild_master` can do everything `scout` can do, plus every
  destructive or configuration action (delete, bulk import, export/reset,
  quest creation).
- `scout` can view everything and perform the specific on-site actions
  that don't require judgment calls about data correctness: looking up
  heroes, scanning them in at quests, moving an enlistment between
  participation statuses. See [`04-quests`](../04-quests/spec.md) for why
  muster specifically is granted to `scout` despite being a write
  action — the on-site, time-pressured nature of that action makes gating
  it behind `guild_master` counter to the product's fast-by-default
  principle.
- Role changes made in the identity provider (e.g. someone is removed from
  the guildkeeper group) must take effect for a logged-in user within a bounded,
  short window — not only the next time they happen to log out and back in
  themselves. See `design.md` for how this is enforced without checking
  the identity provider on every request.

## Acceptance criteria

- **Given** a user who is a member of the guild-master group, **when** they
  complete SSO login, **then** they land on the dashboard with full access.
- **Given** a user who is in neither configured group, **when** they
  complete SSO login, **then** they are redirected to an access-denied page
  and no session role is granted.
- **Given** a logged-in scout guildkeeper, **when** they attempt a
  guild-master-only action (e.g. deleting a hero) directly via a request
  to that route, **then** the request is rejected with a 403, regardless of
  what the UI does or doesn't show them.
- **Given** a guildkeeper is removed from their SSO group, **when** their
  cached role verification expires, **then** their next request forces a
  fresh SSO round-trip, and if they no longer belong to either group they
  are denied — access is not revoked instantly, but it does not silently
  persist indefinitely either.
