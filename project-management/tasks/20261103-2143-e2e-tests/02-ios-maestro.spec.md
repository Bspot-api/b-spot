# 02 — iOS journeys with Maestro

**Status:** ready
**Blocked by:** 01 — Web journeys with Playwright (the shared e2e
environment and the stable selectors)

Parent: [End-to-end tests for the critical journeys](../20261103-2143-e2e-tests.spec.md)
— its Scope, Seams and Implementation Decisions apply here unchanged.

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

**What to build:** with an iOS simulator booted and the dev build
installed, a developer types `pnpm e2e:mobile` and Maestro walks the same
critical journeys on the native app, against the same e2e environment as
the web suite. The scan journey starts from the company page's deep link
(`bspot://company/<id>`) since the simulator has no camera; everything
downstream — the company page, the history, the suggestion, the
magic-link login read from MailDev, the admin tab, moderation, an expired
session — is exercised through the app's own screens.

## Acceptance criteria

- [ ] **ios-journeys-pass** — every row of "The critical journeys" in the
  parent spec marked for iOS has a passing Maestro flow.
- [ ] **shared-environment** — the flows run against the environment slice
  01 built, with no second copy of the fixture server, seeding or reset.
- [ ] **one-command-mobile** — `pnpm e2e:mobile` brings the environment up,
  runs the flows, tears down what it started, and exits non-zero on a
  failure.
- [ ] **no-test-code-in-app** — the app gains `testID`s only: no screen,
  input or route exists only for the tests.
- [ ] **repeatable** — two consecutive `pnpm e2e:mobile` runs both pass.
- [ ] **suite-green** — `pnpm lint`, `pnpm test`, `pnpm build` pass.

---

> 🧑 **REVIEW IF RELEVANT** — notes written before the work document exists.

## Notes

- How the magic link reaches the app on the simulator (opening the link in
  Safari and letting the app's session polling pick it up, or a `bspot://`
  callback) is for the plan to settle against the login screen as built.
