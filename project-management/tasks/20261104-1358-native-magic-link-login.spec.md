# Magic-link login works in the native app

**Status:** ready

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

- [ ] **native-login** — on the iOS simulator, requesting a link, then
  opening it, leaves the app logged in (a Maestro flow passes).
- [ ] **native-sign-out** — native sign-out returns 2xx against the API
  running with `NODE_ENV=production` settings for origin checks.
- [ ] **web-login-unchanged** — the web magic-link login journey of
  `pnpm e2e:web` passes.
- [ ] **ios-auth-journeys** — the four iOS auth rows of the e2e parent
  spec's journeys table have passing Maestro flows.
- [ ] **suite-green** — `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm e2e:web`
  pass.

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

## References

- `project-management/tasks/20261103-2143-e2e-tests/02-ios-maestro.work.md`,
  findings: the full analysis.
- `project-management/archive/speckit-user-auth-admin-ui/spec.md`: the
  login user stories.

## Notes

- 2026-11-04, Architect: the human chose to fix this in its own task
  rather than drop the iOS auth journeys or inject a session in tests.
