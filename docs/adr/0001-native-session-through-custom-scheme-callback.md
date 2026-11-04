---
status: accepted
---

# The native app receives its session through a custom-scheme callback

The admin magic link is verified in the browser (Mail hands it to Safari),
so the session cookie lands in the browser, not in the app. To log the
native app in, the API uses `@better-auth/expo`'s server plugin (`expo()`,
`apps/api/src/modules/auth/auth.config.ts`): verification redirects to
`bspot://auth/callback?cookie=<Set-Cookie>`, and the app keeps the session
cookie in the Keychain (`expo-secure-store`) and sends it in a `cookie`
header, with `expo-origin: bspot://` standing in for the Origin native
fetch does not send. Decided by the human on 2026-11-04, in the task
`project-management/archive/20261104-1358-native-magic-link-login.spec.md`.

## Consequences

- **The session token travels in a URL.** iOS does not guarantee that a
  custom scheme belongs to one app. A malicious app registering `bspot://`,
  combined with a link email an attacker triggers for an admin (sign-in is
  unauthenticated), could capture an admin session. Accepted for an
  admin-only login. The real fix is a universal link (https, associated
  domains), which needs a domain: a later task.
- **Only trusted schemes receive the cookie.** The plugin appends it only
  when the redirect's scheme is a trusted origin. `AUTH_APP_ORIGINS`
  defaults to `bspot://`; `bspot-dev://` is trusted only where the
  environment says so (local dev, e2e).
- **Origin checks run everywhere**, `NODE_ENV=test` included
  (`advanced.disableOriginCheck: false`), so the e2e suites see what
  production enforces.
- **Safari keeps the same session** (verification sets the cookie there
  too). App sign-out deletes it server-side, so it ends in both.
- **The Keychain survives a reinstall** on iOS: a reinstall within the
  7-day session stays logged in.

## Considered Options

- **`@better-auth/expo`'s client half (`expoClient`)**: rejected. It only
  handles social sign-in redirects (through `expo-web-browser`), not a
  magic link opened from Mail; it adds `better-auth` and the native module
  `expo-network` to the app; the app would keep two clients for one cookie.
- **Running the e2e API with `NODE_ENV=production`** to get production
  origin checks: rejected, it also turns on Better-Auth's rate limit
  (5 magic-link requests per minute per IP) and breaks the suites.
