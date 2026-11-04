# A typecheck gate for the whole repo — work

Created by the Crewmate at the plan step, 2026-11-04. Spec:
`project-management/tasks/20261104-1714-mobile-typecheck-gate.spec.md`.

**Plan:** approved by the Architect, 2026-11-04 (see Rulings).

## Program Design

### Measured state (2026-11-04, branch `chore/typecheck-gate`, after `pnpm install`)

| Package | Command | Result |
|---|---|---|
| `apps/api` | `tsc --noEmit -p tsconfig.json` (app code only) | 0 errors |
| `apps/api` | `tsc --noEmit -p tsconfig.eslint.json` (app code + `*.spec.ts` + `test/`) | 0 errors |
| `apps/mobile` | `tsc --noEmit` | **103 errors, all in 7 test files** |
| `apps/e2e` | `tsc --noEmit` | 0 errors (already run by its `lint` script) |

Mobile errors per file: `useScanHistory.test.ts` 20, `adminAccess.test.ts`
19, `confirmAction.test.ts` 18, `showFeedback.test.ts` 13,
`confirmAction.web.test.ts` 12, `showFeedback.web.test.ts` 11,
`suggestion-draft.test.ts` 10.

Mobile errors per code — every one is "Jest types are missing":

- TS2304 "cannot find name" (50): `expect` 43, `beforeEach` 4, `afterEach` 3;
- TS2582 "cannot find name, install test runner types" (36): `describe`, `it`;
- TS2708 "cannot use namespace `jest` as a value" (12): `jest.fn`, `jest.spyOn`;
- TS2694 "namespace `jest` has no exported member" (5): `jest.SpyInstance`,
  `jest.Mock`.

**Probe.** A throwaway tsconfig in the scratchpad that only adds the
`@types/jest@29.5.14` already present in the pnpm store (pulled by the API)
to the type roots brings mobile to **0 errors**. A second probe that also
includes the typed-routes declaration Expo Router generates (`typedRoutes`
is on in `app.json`) and `expo/types` is also at **0 errors**. So the app
code carries **no real type error** today: the whole task is plumbing.
Logs: `/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/typecheck/`.

### How Jest types get into mobile — decision: `@types/jest` as a devDependency

Add `"@types/jest": "^29.5.14"` to `apps/mobile/package.json`
devDependencies (same major as `jest` 29 and as the API's). The mobile
tsconfig has no `types` field, so TypeScript picks up every package in
`node_modules/@types` on its own: no tsconfig change at all.

Why this one:

- The test files use the ambient globals and the `@types/jest` namespace
  types (`jest.SpyInstance`, `jest.Mock`). With `@types/jest` they compile
  untouched — no test file is edited, which keeps
  `src/features/auth/__tests__/adminAccess.test.ts` (the other Crewmate's
  zone) out of the diff.
- It is what the Expo docs recommend for jest-expo, and the editor sees the
  same types as the gate (one tsconfig, one project).

Rejected:

- **Import from `@jest/globals` in each test.** Seven test files to edit
  (one in the auth zone), `jest.SpyInstance` does not exist there and must
  be rewritten, and `@jest/globals` is only a transitive dependency of
  jest-expo, so it would have to be declared anyway.
- **A separate `tsconfig.test.json`** (main tsconfig excludes `__tests__`,
  the test tsconfig adds `types: ["jest"]`). It keeps `expect` out of app
  files, but the editor would then open test files under the main
  tsconfig and show them red, and the gate would need two `tsc` runs. Cost
  above the benefit.

Accepted cost: the Jest globals are visible to app files too, so a stray
`expect(...)` in app code would compile. ESLint and review cover that.

### The scripts

| File | Script |
|---|---|
| `apps/mobile/package.json` | `"typecheck": "tsc --noEmit"` |
| `apps/api/package.json` | `"typecheck": "tsc --noEmit -p tsconfig.eslint.json"` |
| `apps/e2e/package.json` | `"typecheck": "tsc --noEmit"` |
| root `package.json` | `"typecheck": "pnpm --recursive typecheck"` |

- API: `tsconfig.eslint.json` already extends the build tsconfig with
  `noEmit`, `incremental: false`, and includes `src/**`, `test/**` and the
  spec files that the build tsconfig excludes. Reusing it checks the tests
  too, with no new file. (The build tsconfig alone with `--noEmit` would
  skip the specs and write an `incremental` build-info file.)
- Root: `--recursive`, like the root `lint`, `test` and `build`.
- e2e: its `lint` script already runs `tsc --noEmit && eslint`. It is left
  as it is (see the open decisions), so e2e is type-checked twice by
  `pnpm lint && pnpm typecheck`; harmless.

### Real errors and their fixes

None. Every one of the 103 errors is a missing Jest type, fixed by the
devDependency above. No source file, no test file, no tsconfig changes.
If the real run after the install shows anything the probe did not, it is
fixed or reported here before going further.

### Gate declaration

Add to §F · Gate commands of `.agents/project.md`, after **Lint**:
`- **Typecheck:** \`pnpm typecheck\` (\`tsc --noEmit\` in every package;
mobile's typed routes are checked only when \`.expo/types\` exists)`.

### Expected file list

- `apps/mobile/package.json` — `typecheck` script, `@types/jest` devDependency
- `pnpm-lock.yaml` — the `@types/jest` entry for the mobile importer
- `apps/api/package.json` — `typecheck` script
- `apps/e2e/package.json` — `typecheck` script (the other Crewmate's zone:
  one added line in `scripts`)
- `package.json` (root) — `typecheck` script
- `.agents/project.md` — the **Typecheck** gate line
- task documents: this file, the spec's criteria, then both archived;
  `project-management/JOURNAL.md`

Not touched: `apps/api/src/modules/auth/**`, `apps/mobile/src/api/client.ts`,
the auth hooks, any `auth/` file, any test file, any tsconfig.

Merge-conflict exposure with the magic-link Crewmate: `pnpm-lock.yaml` if
it also adds a dependency, and `apps/e2e/package.json` if it edits the
same `scripts` block. Both resolve by keeping both sides.

### Test order

1. Baseline red: mobile `tsc --noEmit` at 103 errors (recorded above).
2. Add `@types/jest` to mobile, `pnpm install`; mobile `tsc --noEmit` → 0;
   mobile `pnpm test` still green.
3. Add the four `typecheck` scripts; `pnpm typecheck` from the root → exit 0
   (**typecheck-green**).
4. **typecheck-catches**: add `const broken: number = 'x';` to an app file
   (`apps/mobile/src/...`), run `pnpm typecheck`, keep the red output in
   the scratchpad log, revert, run again green. Never committed.
5. **strict-kept**: `git diff main -- '**/tsconfig*.json'` empty;
   `git diff main` grep for `any` / `@ts-ignore` / `@ts-expect-error` empty.
6. **gate-declared**: §F line added.
7. **suite-green**: `pnpm lint`, `pnpm test`, `pnpm build`.

### Open decisions

- **Typed routes in the gate.** `.expo/types/router.d.ts` and
  `expo-env.d.ts` are gitignored and written by `expo start`. A fresh
  checkout or CI checks routes as plain strings; a dev machine with a
  stale `.expo/types` checks them against that stale list. Recommendation:
  accept it and say so in the gate line; generating the file before
  `tsc` needs Expo Router internals (`expo-router/build/typed-routes`),
  too fragile for this task. Both variants are green today.
- **e2e `lint` keeps its `tsc --noEmit`.** Recommendation: keep it for
  now (removing it touches the other Crewmate's `apps/e2e/package.json`
  scripts more), and drop the duplicate in a later cleanup.
- **`CLAUDE.md` lists the commands too** ("Build & Test"). Recommendation:
  leave it to the human; `.agents/project.md` §F is the gate source the
  workflow reads.

## Worklog

- 2026-11-04 — Plan step: `pnpm install`, measured the three packages,
  probed the `@types/jest` fix and the typed routes from the scratchpad,
  wrote this design. No code.

## Implementation Checkboxes

- [ ] Mobile: `@types/jest` devDependency, mobile `tsc --noEmit` at 0, mobile tests green
- [ ] `typecheck` scripts in api, mobile, e2e and root; `pnpm typecheck` exits 0
- [ ] Deliberate error shown failing `pnpm typecheck`, then reverted
- [ ] strict-kept checks (tsconfig diff, `any` / `@ts-ignore` grep)
- [ ] §F gate line in `.agents/project.md`
- [ ] `pnpm lint`, `pnpm test`, `pnpm build` green
- [ ] `code-review`, findings recorded
- [ ] Close: criteria ticked, journal, archive, `retro`

## Notes & Snippets

- `jest-expo` 54 depends on `@jest/globals` but not on `@types/jest`.
- Mobile ESLint is not type-aware (no `parserOptions.project`), so the new
  types do not change `pnpm lint`.
- The API's ESLint already uses `tsconfig.eslint.json`, the same file the
  API `typecheck` will use.

### Rulings — Architect, 2026-11-04

- **Jest types:** `@types/jest` in the mobile devDependencies, picked up
  automatically. Jest globals being visible in app files is accepted.
- **Typed routes:** accepted as they are. The §F line says route types are
  only as fresh as the last `expo start`.
- **e2e `lint`:** it keeps its own `tsc` for now. Remove the duplicate
  later.
- **`CLAUDE.md`:** not edited here. The Architect brings the gap to the
  human.
- **Spec mismatches:** 103 errors rather than 93, no real errors, and e2e
  and the API already type-checked. Noted. The criteria are unchanged.

## Diff-Review Findings

_(after the review step)_
