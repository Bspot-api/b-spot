# A typecheck gate for the whole repo

**Status:** in-progress

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

## Context

`tsc --noEmit` in `apps/mobile` fails on every `__tests__` file: the
mobile tsconfig has no Jest types, which gives about 93 errors, all in
test files. Because of that, no gate checks the app's types. Expo's
bundler strips types without checking them, and `pnpm build` passes, so a
type error in the app can ship. Crewmates have been checking "zero errors
outside test files" by hand. The project's rules ask for strict typing,
with no `any` (`CLAUDE.md`, "Code Quality Standards").

## Scope

**Included:**
- Jest types for the mobile test files, so mobile `tsc --noEmit` passes.
- A `typecheck` script in each package (`apps/api`, `apps/mobile`,
  `apps/e2e`) and a root `pnpm typecheck` that runs them all.
- Fixing the real type errors this reveals, or stating why one can't be
  fixed here.
- A **Typecheck** line in §F · Gate commands of `.agents/project.md`.

**Not Included:**
- Loosening any strictness flag.
- New lint rules.

## Acceptance Criteria

- [ ] **typecheck-green** — `pnpm typecheck` exits 0 from the repo root.
- [ ] **typecheck-catches** — a deliberate type error in an app file
  (`apps/mobile/app/**` or `src/**`) makes `pnpm typecheck` fail. Shown
  once, then reverted.
- [ ] **strict-kept** — no `strict`, `noImplicitAny` or `strictNullChecks`
  flag is turned off, and no new `any` or `@ts-ignore` is added.
- [ ] **gate-declared** — §F of `.agents/project.md` lists the typecheck
  command.
- [ ] **suite-green** — `pnpm lint`, `pnpm test` and `pnpm build` pass.

## Seams

- The root command `pnpm typecheck`.

---

> 🧑 **REVIEW IF RELEVANT** — decisions, testing, slicing.

## Notes

- 2026-11-04, Architect: proposed by the Crewmate of the admin
  suggestions split. The human asked for it to be launched.
