# 01 — Web journeys with Playwright

**Status:** ready
**Blocked by:** None — can start immediately

Parent: [End-to-end tests for the critical journeys](../20261103-2143-e2e-tests.spec.md)
— its Scope, Seams and Implementation Decisions apply here unchanged.

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

**What to build:** a developer with Docker running types `pnpm e2e:web`
and, a few minutes later, knows whether every critical journey still
works in the browser. Behind that command, the shared e2e environment
comes up for the first time — test database, fixture server standing in
for the four external APIs, API, web build, MailDev — and Playwright walks
each journey the way a user would: look up a product by barcode or brand
name, read the company page, submit a suggestion for an unknown brand,
find the lookup in the history, log in through a magic link read from
MailDev, see (or not see) the admin entry, moderate a suggestion, and
survive an expired session.

## Acceptance criteria

- [ ] **web-journeys-pass** — every row of "The critical journeys" in the
  parent spec marked for the web has a passing Playwright test.
- [ ] **no-external-network** — the suite passes with the four external
  API hosts blocked.
- [ ] **default-urls-unchanged** — an API unit test proves that, unset,
  the four base URLs are today's.
- [ ] **one-command-web** — `pnpm e2e:web` brings the environment up, runs
  the suite, tears down what it started, and exits non-zero on a failure.
- [ ] **dev-data-untouched** — the run uses its own database, reset at
  start; the development database is never written.
- [ ] **repeatable** — two consecutive `pnpm e2e:web` runs both pass.
- [ ] **suite-green** — `pnpm lint`, `pnpm test`, `pnpm build` pass.

---

> 🧑 **REVIEW IF RELEVANT** — notes written before the work document exists.

## Notes

_None yet._
