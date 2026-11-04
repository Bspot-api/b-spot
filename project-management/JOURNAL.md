# Journal

Project history, newest first. Written by hand, one dated entry per
task — never generated.

## 2026-11-04

- e2e runs take the lock themselves and clean up when killed
  (`chore/e2e-runner-lock`).
  - **The lock.** `pnpm e2e:web` and `pnpm e2e:mobile` take an exclusive
    lock before starting anything, and release it on every exit path.
    - It is one file, `b-spot-e2e.lock.json`, in the git common directory,
      so every worktree shares it. It is published atomically with
      `link(2)` and holds the pid, the command, the worktree and the start
      time.
    - A second run waits up to 20 minutes (`E2E_LOCK_WAIT_MINUTES`) and
      says so. A lock whose holder is dead is taken over, with a message.
  - **Killed runs.** On SIGINT or SIGTERM, the run stops everything it
    started and exits 130 or 143:
    - services (whole process groups), Metro, foreground children
      (Playwright, Maestro, `expo export`);
    - the containers it started itself, and no other.

    Once a signal has arrived, no new start is allowed.
  - **Found along the way.** The runners now start with
    `node --import tsx`: under Ctrl-C, the `tsx` CLI's signal relay
    SIGKILLs the runner before any cleanup (a probe showed it 4 times out
    of 4). A service whose group leader had died of a signal could also
    hang `stop()`; that is fixed.
  - **Added by Architect ruling.** Before starting services, a busy-port
    check fails, naming the port and its pid. It never kills anything.
  - **Proof.** Nine scripted kill runs left nothing. Two runs started
    together serialised. A stale lock was taken over. The suites still
    pass: web 25, mobile 4/4. The gates are green.
  - **Open.**
    - `kill -9` still leaves the services running; the next run reports
      the busy ports.
    - Stopping a container the run started itself is checked in review
      only.
  - Documents:
    `project-management/archive/20261104-1714-e2e-runner-lock-and-cleanup/`.

- Typecheck gate (`chore/typecheck-gate`): `pnpm typecheck` runs
  `tsc --noEmit` in api, mobile and e2e, and exits 0.
  - Mobile was at 103 errors, all in its 7 test files and all missing
    Jest types. `@types/jest` in the mobile devDependencies fixes them;
    no source, test or tsconfig file changed, and no real type error
    was hiding in the app.
  - The API script uses `tsconfig.eslint.json`, the only API config that
    also covers the specs and `test/`: narrowing it for ESLint narrows the
    typecheck too.
  - Proof: a deliberate `number = 'string'` in a mobile `src/` file fails
    the gate with TS2322, then reverted. `pnpm lint`, `pnpm test`,
    `pnpm build` green.
  - Declared in §F of `.agents/project.md` and in the pre-PR checks of
    `docs/agent-rules/git-workflow.md`.
  - Open: route types come from the gitignored `.expo/types`, so `app/**`
    route paths are only checked where `expo start` has run; e2e's `lint`
    still runs its own `tsc`; `CLAUDE.md` does not list the command yet.
  - Documents:
    `project-management/archive/20261104-1714-mobile-typecheck-gate/`.

- Split the admin suggestions screen (`refactor/split-admin-suggestions`):
  `apps/mobile/app/admin/suggestions.tsx` goes from 359 to 96 lines, with
  no behaviour change.
  - The new `src/features/admin/` feature holds three components
    (`SuggestionCard`, `SuggestionStatusTabs`, `SuggestionEditSheet`), the
    `useSuggestionEditor` hook (the edit state and the save), and the pure
    `suggestion-draft.ts`, which has a unit test.
  - Proof: `pnpm e2e:web` green before and after (25 passed), testIDs
    identical; `pnpm lint`, `pnpm test`, `pnpm build` green.
  - Rulings: PascalCase component files (matching the neighbours, against
    `docs/agent-rules/common.md`); JSX components over 30 lines accepted.
  - Open: mobile `tsc --noEmit` is red on every existing test file (no jest
    types); the spec's context still says 336 lines.
  - Documents:
    `project-management/archive/20261103-2256-split-admin-suggestions/`.

- e2e mobile ignores the local `.env` (`fix/e2e-mobile-local-env`):
  `pnpm e2e:mobile` now passes 4/4 even when the developer has an
  `apps/mobile/.env*` with another `EXPO_PUBLIC_API_URL`.
  - **Cause.** In development, Expo 54 bundles `apps/mobile/.env*` as
    modules: `@expo/metro-config`'s transform worker lists them with
    `require.context`. Their values win over Metro's process env, which
    goes against Expo's documented precedence. `EXPO_NO_DOTENV` does not
    reach this path. Slice 02's comment, which said the process env wins,
    was wrong.
  - **Fix.** The e2e Metro sets `B_SPOT_E2E_IGNORE_DOTENV_FILES=1`.
    `apps/mobile/metro.config.js` then adds `apps/mobile/.env*` to
    `resolver.blockList`, so they never enter Metro's file map. This
    relies on Expo internals. The e2e Metro also sets `EXPO_NO_DOTENV=1`.
    No developer file is moved or written.
  - **Guard.** A preflight reads the bundle the dev build loads, and fails
    before any flow when it carries another API URL, or none. Its parser
    is unit-tested (`apps/e2e` now has a `test` script, `tsx --test`).
  - **Open.**
    - The human should confirm the undocumented hook over the documented
      `--no-dev`, which would change what runs under test.
    - A killed `pnpm e2e:mobile` leaves Metro, the API and the fixture
      server running. This predates the task: no signal handler, and
      detached process groups.
  - Documents: `project-management/archive/20261104-1509-e2e-mobile-ignores-local-env/`.

- Product source label (`fix/product-source-label`): cosmetics are now
  labelled "Produit cosmetique" on their company page.
  - The app now uses the API's `'OFF' | 'OBF'` source values. Before, the
    scanner compared the API's `'OBF'` with `'OPEN_BEAUTY_FACTS'`, so every
    product was stored and shown as food. The API did not change.
  - The app's `ProductSource` derives from `PRODUCT_SOURCES`. A new e2e
    check, `apps/e2e/checks/api-contract.spec.ts`, compares that list
    with the enums the API's OpenAPI schema declares.
  - The cosmetic-label e2e test is no longer `fixme`. The suite now also
    checks the food label, and that a cosmetic reopened from the history
    keeps its label.
  - Device history is not migrated: entries scanned before this fix are
    all stored as `'OFF'`, cosmetics included, and nothing tells them
    apart, so old cosmetic entries stay labelled as food.
  - Found along the way: from a git worktree, `pnpm e2e:web` needs
    `COMPOSE_PROJECT_NAME=b-spot`, otherwise docker compose collides with
    the running `b-spot` containers.
  - Documents: `project-management/archive/20261103-2256-product-source-label/`.
- Repair lint (`chore/repair-lint`): `pnpm lint` is green and read-only.
  - Mobile: `@typescript-eslint` moves to 8, to match
    `eslint-config-expo` 10. The 118 "rule not found" errors disappear.
    The prettier ESLint packages are now declared explicitly instead of
    relying on pnpm hoisting.
  - API: a `tsconfig.eslint.json` lets ESLint parse the spec files and
    `test/`, and the test files get prettier formatting.
    `max-lines-per-function` is turned off for test files and migrations,
    with the reasons written in `.eslintrc.js`. Dead code is removed.
  - API production functions over 30 lines are split into private
    helpers, with no behaviour change. 21 pinning tests guard the change.
  - Scripts: `lint` no longer carries `--fix` in the API or e2e. Each
    package has a `lint:fix`.
  - The build is no longer red: `pnpm build` and `pnpm test` pass.
  - Documents:
    `project-management/archive/20261103-2256-repair-lint/`.

## 2026-11-04

- e2e-tests, slice 02 (iOS, Maestro): `pnpm e2e:mobile` is a new command.
  - With a booted simulator and the dev build installed
    (`APP_VARIANT=development expo run:ios`), it brings up the same
    environment as `pnpm e2e:web`. Both runners now share one starter,
    `apps/e2e/env/environment.ts`, which replaces Playwright's
    `webServer`. Docker compose runs under the `b-spot` project name from
    any worktree.
  - The dev build loads its JavaScript from an e2e Metro (`:8183`), which
    is where the e2e API URL is set. A control server (`:4011`) lets the
    flows reset the database and pre-fill the app's stored history.
  - Flows: logged-out admin entry, scan through the company deep link,
    brand suggestion through its screen's deep link, history from a stored
    entry. The four auth journeys move to the native magic-link login task:
    as built, a magic link opened outside the app cannot log the iOS app in.
  - Open: one unexplained failure of the scan flow in seven runs (a 5xx the
    API did not log).

## 2026-11-03

- e2e-tests, slice 01 (web, Playwright): `pnpm e2e:web` is a new command,
  run from `apps/e2e`.
  - It walks every critical web journey through the real app, the real
    API and its own `b_spot_e2e` database. A local fixture server stands
    in for Open Food Facts, Open Beauty Facts, recherche-entreprises and
    Pappers.
  - The API now reads the four external base URLs from optional variables.
  - The Open Beauty Facts fallback is fixed: Open Food Facts answers 404
    for an unknown barcode, and the code used to treat that as an outage.
  - The web export works again: the favicon is now a PNG.
  - Found along the way:
    - every product is labelled "alimentaire" (the `'OBF'` vs
      `'OPEN_BEAUTY_FACTS'` mismatch);
    - `pnpm lint` was already red on old debt.
- Web UX fixes (`fix/web-ux-bugs`): brand suggestion messages now go
  through the toast, so the web build shows them. Reject and delete use one
  cross-platform `confirmAction` (the web already used `window.confirm`; the
  spec was corrected). `/admin` and `/admin/suggestions` wait for the
  session: a logged-out visitor goes to the login screen, with no
  "session expirée" toast and no admin request. The web navbar links to
  the history. On native the brand suggestion messages stay native alerts
  (human ruling: a toast could hide behind the iOS modal); the toast is
  web only. Open items: native not checked on a simulator; lint and build
  red for reasons that predate this task. Documents:
  `project-management/archive/20261103-2226-web-ux-fixes/`.
- chisel init: installed the dev-workflow socle.
