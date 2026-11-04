# Journal

Project history, newest first. Written by hand, one dated entry per
task — never generated.

## 2026-11-04

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
