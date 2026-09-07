# 02 — Auth & Roles: Design

## Login flow

1. `GET /auth/sso/redirect` — `Socialite::driver('azure')->scopes(['openid', 'profile', 'email', 'User.Read'])->redirect()`.
   Request the minimum Graph scope needed to read the user's own profile;
   group membership is read via a separate Graph call in step 2, not via a
   broader `Group.Read.All`-style scope, which would require admin consent
   and is more access than this system needs.
2. `GET /auth/sso/callback` — exchange the code for a token via
   `Socialite::driver('azure')->user()`, then resolve a role (below). If no
   role resolves, redirect to `/auth/denied` without creating a session.
   Otherwise, `User::firstOrNew(['email' => ...])`, update name and role,
   set a random unusable password on first creation (there is no
   password-based login path, so this only exists to satisfy the
   `users.password` column), log the user in, and redirect to the
   dashboard.

## Role resolution

```
resolveRole(accessToken):
    groupIds = GET https://graph.microsoft.com/v1.0/me/heroOf (Graph API, using accessToken)
                 -> pluck id
    if config('services.azure.group_guild_master_id') in groupIds: return 'guild_master'
    if config('services.azure.group_scout_id')   in groupIds: return 'scout'
    return null
```

Group IDs are configuration (`AZURE_GROUP_SUPER_ADMIN_ID` /
`AZURE_GROUP_READ_ONLY_ID` env vars), never hardcoded — they're specific to
whichever Entra ID tenant a given deployment runs against.

## Role re-verification cache

Checking Graph on every request would add a network round-trip to every
guildkeeper page load. Instead:

- On successful login, cache a simple "verified" marker keyed by user ID,
  with a 24-hour TTL.
- Middleware protecting guildkeeper routes checks the **local session role**
  (fast, no network call) on every request, but additionally checks that
  the cache marker hasn't expired.
- When the marker is missing (never set, or expired), the middleware logs
  the user out and redirects them back into the SSO flow — forcing step 2
  above to run again, which re-derives the role from a fresh Graph call.

This means a role change in the identity provider takes effect for an
already-logged-in user within at most 24 hours, without paying a Graph
round-trip on every request. If a deployment needs a tighter bound, lower
the TTL — the mechanism doesn't change.

```php
class RequireGuildkeepersLogin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check() || ! in_array(Auth::user()->role, ['guild_master', 'scout'])) {
            return redirect()->route('home');
        }

        if (! Cache::has(roleCacheKey(Auth::id()))) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('sso.redirect');
        }

        return $next($request);
    }
}
```

## Middleware

Two aliases, registered once in the application's middleware config:

| Alias | Class | Requires |
|---|---|---|
| `guildkeepers` | `RequireGuildkeepersLogin` | `guild_master` or `scout`, with a live role-cache entry |
| `guild_master` | `RequireSuperAdmin` | `guild_master` only |

Route groups nest these: everything guildkeeper-facing sits behind `guildkeepers`;
routes that also need `guild_master` add that middleware on top rather than
duplicating the guildkeepers check.

## Data model

`users` table: standard Laravel auth columns plus a nullable `role` string
column (`guild_master` | `scout` | `null`). `null` represents "known
user, no granted role" — reachable if a user is later removed from both SSO
groups; the row isn't deleted, it just stops passing the `guildkeepers` middleware
check.
