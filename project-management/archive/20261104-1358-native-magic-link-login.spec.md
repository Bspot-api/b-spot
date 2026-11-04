# Magic-link login works in the native app

**Status:** done

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

## Context

Found while planning slice 02 of
[End-to-end tests for the critical journeys](20261103-2143-e2e-tests.spec.md),
from reading the code and Better-Auth's source. It has not yet been seen
on a device. The session is a Better-Auth cookie. `signInMagicLink` sends
no `callbackURL`, so the emailed link verifies in whatever opens it
(Safari, Mail), and the cookie lands in that browser's store, not in the
app's. The login screen's session polling then keeps getting no session.
On the web it works only because the tab and the app share one cookie jar.

There is also a related defect. Better-Auth rejects a cookie-carrying
POST with no `Origin` header, which native fetch does not send, so native
sign-out would get a 403 in production. The e2e environment hides this
because `NODE_ENV=test` skips the check.

## Scope

**Included:**
- **Login:** tapping the emailed link on the device logs the native app in
  (iOS first; Android follows the same path).
- **Sign-out:** native sign-out works against a production-like API (no
  `NODE_ENV=test` bypass).
- **Web:** web login keeps working as today.
- **Tests:** the four iOS auth journeys of slice 02 (login, admin entry,
  moderation, expired session), added to its Maestro suite once this
  lands.

**Not Included:**
- Opening login to non-admins: login stays admin-only.
- Social login.

## Acceptance Criteria

- [x] **native-login** — on the iOS simulator, requesting a link, then
  opening it, leaves the app logged in (a Maestro flow passes).
  Evidence: the Maestro flow `login`, which logs in through Safari and
  the `bspot-dev://auth/callback` link, passed in two consecutive full
  `pnpm e2e:mobile` runs (8/8 each).
- [x] **native-sign-out** — native sign-out returns 2xx against the API
  running with `NODE_ENV=production` settings for origin checks.
  Evidence: the production origin checks are forced on (see Amendments).
  `checks/native-auth.spec.ts` gets 403 with no Origin, 403 with
  `evil://`, then 200 with `expo-origin: bspot-dev://`. The Maestro flow
  `login` signs out from the app, after which the user has 0 sessions
  left.
- [x] **web-login-unchanged** — the web magic-link login journey of
  `pnpm e2e:web` passes. Evidence: `pnpm e2e:web` passed 27 tests, with
  origin checks now enforced.
- [x] **ios-auth-journeys** — the four iOS auth rows of the e2e parent
  spec's journeys table have passing Maestro flows. Evidence: `login`,
  `admin-entry` (including the demoted admin), `moderation` and
  `session-expiry` passed in both full runs.
- [x] **suite-green** — `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm e2e:web`
  pass. Evidence: lint has 0 errors (8 old warnings); tests pass (API 114,
  mobile 37, e2e 6); the build passes; e2e:web passed 27 tests.

## Seams

- **Callback:** the magic link's callback, which says where verification
  lands (the app's `bspot://` scheme on native, the web origin on web).
- **Session storage:** where the native app keeps the session and how it
  sends it to the API.

## Architecture

**System design:** the plan picks between Better-Auth's Expo integration
(`@better-auth/expo`: deep-link callback plus secure-store session) and a
hand-rolled `bspot://` callback that the app verifies with its own fetch.
Prefer the maintained integration unless the plan shows a blocker.

---

> 🧑 **REVIEW IF RELEVANT** — decisions, testing, slicing.

## Slices & Dependencies

- Blocked by: slice 02 of the e2e task (`02-ios-maestro`), whose Maestro
  harness the auth flows reuse.

## Amendments — 2026-11-04

- **Callback seam**: the web keeps sending no `callbackURL`, as
  `web-login-unchanged` requires. The native callback uses the build's
  scheme: `bspot://` in production, `bspot-dev://` in dev and e2e builds.
- **`native-sign-out`**: met with Better-Auth's production origin checks
  forced on in every environment (`disableOriginCheck: false`), rather
  than by running the API with `NODE_ENV=production`. That setting would
  also enable rate limiting and break the suites.
- **Integration**: only the server half of `@better-auth/expo` is used, by
  the human's decision. Its client half does not handle a magic link
  opened from Mail, and it would add a native module.
- **Security**: the session token travels in the custom-scheme callback
  URL. The human accepted and documented this for an admin-only login.
  Universal links come later.

## References

- `project-management/archive/20261103-2143-e2e-tests/02-ios-maestro.work.md`,
  findings: the full analysis.
- `project-management/archive/speckit-user-auth-admin-ui/spec.md`: the
  login user stories.

## Notes

- 2026-11-04, Architect: the human chose to fix this in its own task
  rather than drop the iOS auth journeys or inject a session in tests.
