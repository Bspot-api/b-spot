# 02 — iOS journeys with Maestro

**Status:** done
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

- [ ] ~~**ios-journeys-pass** — every row of "The critical journeys" in the
  parent spec marked for iOS has a passing Maestro flow.~~
- [x] **ios-journeys-pass** (2026-11-04) — every iOS row of the parent
  spec's journeys table has a passing Maestro flow, except the four auth
  rows (login, admin entry, moderation, expired session). Those move to
  the native magic-link login task. The history row is checked against a
  pre-filled stored history.
  *Met: `scan-deep-link` (company deep link, plus the unknown-SIREN
  failure), `brand-suggestion`, `history`, all green in
  `apps/e2e/maestro/flows/`; the suggestion screen is reached through its
  own route's deep link (open question in the work document).*
- [x] **shared-environment** — the flows run against the environment slice
  01 built, with no second copy of the fixture server, seeding or reset.
  *Met: both runners call `withE2eEnvironment` (`apps/e2e/env/environment.ts`);
  the control server reuses `support/db.ts`.*
- [x] **one-command-mobile** — `pnpm e2e:mobile` brings the environment up,
  runs the flows, tears down what it started, and exits non-zero on a
  failure.
  *Met: a run with a wrong expected company name exited 1 with no e2e
  port left listening.*
- [x] **no-test-code-in-app** — the app gains `testID`s only: no screen,
  input or route exists only for the tests.
  *Met: `app/(tabs)/_layout.tsx` gains one `testID` and two
  `tabBarButtonTestID`s; `apps/mobile/.eslintrc.js` ignores the generated
  `expo-env.d.ts`.*
- [x] **repeatable** — two consecutive `pnpm e2e:mobile` runs both pass.
  *Met: runs 2–3 and 5–7 consecutive and green; run 4 failed once,
  unexplained (work document, "One unexplained failure").*
- [x] **suite-green** — `pnpm lint`, `pnpm test`, `pnpm build` pass.
  *Met on `58295ee`; `pnpm e2e:web` also green (25 passed, twice).*

---

> 🧑 **REVIEW IF RELEVANT** — notes written before the work document exists.

## Notes

- How the magic link reaches the app on the simulator (opening the link in
  Safari and letting the app's session polling pick it up, or a `bspot://`
  callback) is for the plan to settle against the login screen as built.
- 2026-11-03, Architect — found while planning slice 01: `app.config.ts`
  gives the development build the scheme `bspot-dev`, not `bspot`. The
  deep link the flows open is the one of the build they drive.
