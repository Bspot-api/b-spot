# Cosmetics are labelled as food products — work

Created by the Crewmate at the plan step, 2026-11-04. Spec:
`project-management/tasks/20261103-2256-product-source-label.spec.md`.

**Plan:** approved by the Architect, 2026-11-04 (see Rulings).

## Program Design

### Which side changes: the app, the API stays as it is

The app adopts the API's short form `'OFF' | 'OBF'`. The API is not touched.

- The API's values are its storage, not only its wire format: the
  `ProductSource` enum of `apps/api/src/modules/product/product.entity.ts`
  is a MikroORM `@Enum` column holding `'OFF'` / `'OBF'`. Changing the
  spelling on that side means a migration plus rewriting the
  `product.service.ts` mapping, its specs, `scan-flow.e2e-spec.ts` and the
  `ScanHistoryItemDto` of `apps/api/src/modules/scan/dto/scan-history.dto.ts`
  (which already declares `enum: ['OFF', 'OBF']`).
- The app already speaks the short form everywhere but one place: history
  entries on devices (`ScanHistoryEntry.productSource` in
  `apps/mobile/src/features/history/types.ts`), the history screen's
  navigation params, and `CompanyHeader`, which already accepts `'OBF'`.
  Only `apps/mobile/src/api/types.ts` and the one comparison in
  `useBarcodeScanner` hold the long form.
- It keeps this diff out of `apps/api`, where the lint Crewmate works in
  parallel.

### The defect, exactly

`useBarcodeScanner.handleBarcodeScan` computes
`result.product.source === 'OPEN_BEAUTY_FACTS' ? 'OBF' : 'OFF'`. The API
sends `'OBF'`, the comparison is never true, so every scan stores and
navigates with `'OFF'`, and `CompanyHeader` shows "Produit alimentaire".
The bug is on the scan path only: an entry stored as `'OBF'` would reopen
correctly from the history, but none is ever stored as `'OBF'` today.

### Files and changes

| File | Change |
|---|---|
| `apps/mobile/src/api/types.ts` | `export const PRODUCT_SOURCES = ['OFF', 'OBF'] as const;` and `export type ProductSource = (typeof PRODUCT_SOURCES)[number];` — the runtime list exists so the contract check can compare it with the OpenAPI schema. |
| `apps/mobile/src/features/scanner/hooks/useBarcodeScanner.ts` | The mapping goes: `productSource` is `result.product.source` as is. |
| `apps/mobile/src/features/history/types.ts` | `productSource: ProductSource` (imported from `api/types`), same two values, so stored entries stay valid. |
| `apps/mobile/src/features/company/components/CompanyHeader.tsx` | Prop typed `ProductSource`; `isBeautySource` becomes `source === 'OBF'`; the long-form literals go. |
| `apps/mobile/app/company/[id].tsx` | The `productSource` route param typed `ProductSource`; the long-form literals go. |
| `apps/e2e/checks/api-contract.spec.ts` (new) | The contract check, see below. |
| `apps/e2e/web/scan.spec.ts` | The cosmetic-label test loses `test.fixme` and its defect comment; the food scan test gains one assertion, label "Produit alimentaire". |
| `apps/e2e/web/history.spec.ts` | One new test: a cosmetic reopened from the history keeps "Produit cosmetique" (see open question on history coverage). |

No new test id: `TEST_IDS.companyProductSource` already exists in
`apps/e2e/support/test-ids.ts`. No API file, no ESLint config, no
dependency changes.

Route params arrive as untrusted strings (a deep link can carry anything).
`CompanyHeader` keeps today's behaviour for that case: anything but `'OBF'`
reads as food. No validation is added; it is out of the spec's scope.

### How the types are tied to the API contract (`types-match-api`)

A check in the e2e `environment` project, `apps/e2e/checks/api-contract.spec.ts`:

1. `GET ${API_URL}/api-json` — the OpenAPI document the API already serves
   unconditionally (`SwaggerModule.setup('api', …)` in `apps/api/src/main.ts`);
   the e2e run starts the API, so it is the real, current schema.
2. Read `components.schemas.ProductDto.properties.source.enum` (from
   `@ApiProperty({ enum: ProductSource })` in
   `apps/api/src/modules/product/dto/product.dto.ts`) and
   `components.schemas.ScanHistoryItemDto.properties.productSource.enum`.
3. Assert each equals `PRODUCT_SOURCES`, imported from
   `apps/mobile/src/api/types.ts` (a plain TypeScript module, no React
   Native import, so Playwright and `tsc` in `apps/e2e` can load it).

Since `ProductSource` is derived from `PRODUCT_SOURCES`, a drift on either
side turns the check red. Rejected alternatives:

- **Generating the types** (`pnpm generate:types`, openapi-typescript into
  `apps/mobile/src/api/generated.ts`): needs a running API on :3001 and a
  database, `openapi.json` is not tracked, and switching the app to
  generated types widens the diff far past this task.
- **An API Jest test building the Swagger document**: touches `apps/api`
  (the lint Crewmate's ground) and still cannot see the app's type.
- **A type-level equality in the app only**: checks the app against itself,
  not against the schema.

Cost: the check runs under `pnpm e2e:web`, not `pnpm test`. The spec asks
for both commands green, so the check is part of the gate.

### Test order

1. **Red, contract:** write `checks/api-contract.spec.ts`. Red: `PRODUCT_SOURCES`
   does not exist (and the long form would not match). Run alone with
   `pnpm e2e:web --project=environment -g contract` (under the lock).
2. **Red, label:** un-fixme the cosmetic test, add the food assertion and the
   history test. Red on the cosmetic and history tests, green on food.
3. **Green:** the five mobile edits. Then `pnpm --filter mobile exec tsc
   --noEmit`, `pnpm test`, the full `pnpm e2e:web`.
4. Gates of §F · Gate commands of `.agents/project.md`, scoped to my diff
   for lint (see Notes).

Each run of `pnpm e2e:web` takes the lock
`/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/e2e.lock`
first and releases it at the end, failure included. Logs go to
`/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/product-source/`.

### Decisions left open

- **History entries already on devices** were all written as `'OFF'`,
  cosmetics included, because of this very defect. They stay labelled as
  food: nothing in an entry tells a cosmetic apart. Proposed: accept, no
  migration, say so in the journal.
- **Where the contract check lives** — the e2e `environment` project, as
  above, rather than a new Playwright project. It is a schema check, not a
  fixture-environment check; a dedicated `contract` project is one more
  config entry in `apps/e2e/playwright.config.ts`. Proposed: keep it in
  `checks/`, file name says what it is.
- **History coverage** — the spec's scope says "on the company page and in
  the history". The history list shows no source label; the history's part
  is the stored entry and the company page reopened from it. Proposed: the
  one new `history.spec.ts` test covers it.

## Worklog

- 2026-11-04, Crewmate: plan written; `pnpm install` run in the worktree.
  No code yet.
- 2026-11-04, Crewmate: coded in the plan's order.
  - The contract check went red first (`PRODUCT_SOURCES is not iterable`).
    The web label tests did not run in that run, because the `web` project
    depends on `environment`.
  - With the mobile edits stashed, `--project=web --no-deps -g
    "cosmetic|food"` showed the expected red. The two cosmetic tests (scan
    page and history) failed on `toHaveText`, and the food test passed.
  - After the five mobile edits:
    - `pnpm test`: mobile 23/23, API 89/89.
    - `pnpm build`: green.
    - `pnpm e2e:web`: 25/25, twice in a row.
  - Mobile `tsc --noEmit` shows 93 errors before and after the change. All
    of them are missing jest globals in `__tests__` files, so they predate
    this task.
  - Mobile eslint on the touched files fails on line 1 of each file:
    "Definition for rule '@typescript-eslint/no-empty-object-type' was not
    found". This is the ESLint-deps debt that the lint-repair task owns.
  - e2e eslint on the touched files: green.
  - Commit bf004c5.
- 2026-11-04, Crewmate, environment finding: from a git worktree,
  `pnpm e2e:web` fails at `docker compose up`.
  - Cause: compose derives its project name from the directory
    (`b-spot-product-source`). It does not see the running `b-spot`
    containers, tries to create its own, and collides on the container
    names `b-spot-maildev` / `b-spot-postgres`.
  - Workaround: run with `COMPOSE_PROJECT_NAME=b-spot`.
  - I removed the network and volume the failed run had created; the
    Architect's containers were never touched.
  - Not fixed here: the fix belongs to `apps/e2e/env/docker.ts`, outside
    this task's scope.

## Implementation Checkboxes

- [x] Contract check `apps/e2e/checks/api-contract.spec.ts` written, red
- [x] Cosmetic test un-fixmed, food assertion and history test added, red
- [x] `apps/mobile/src/api/types.ts`: `PRODUCT_SOURCES`, short-form `ProductSource`
- [x] `useBarcodeScanner`: mapping removed
- [x] `history/types.ts`, `CompanyHeader`, `company/[id].tsx` typed `ProductSource`
- [x] Mobile `tsc --noEmit` (no new error), `pnpm test` green
- [x] `pnpm e2e:web` green (under the lock)
- [x] Lint on the touched files: e2e green; mobile red on the pre-existing ESLint config debt only
- [ ] `code-review` run, findings recorded
- [ ] Close: criteria ticked, journal entry, archive, retro

## Notes & Snippets

- Callers of the long form, found with `git grep`: only
  `apps/mobile/src/api/types.ts` (the type),
  `useBarcodeScanner.ts` (the comparison), and the widened unions in
  `CompanyHeader.tsx` and `app/company/[id].tsx`. `OPEN_FOOD_FACTS` /
  `OPEN_BEAUTY_FACTS` in `apps/api/src/modules/cache/api-usage-log.entity.ts`
  are a separate enum (API usage log), unrelated, untouched.
- The web search box (`app/(tabs)/index.web.tsx`) goes through the same
  `useBarcodeScanner.handleBarcodeScan` as the camera, so the e2e web test
  exercises the fixed path.
- Lint: `apps/e2e`'s `lint` script runs `eslint --fix`, and the API's too.
  I run eslint on my own files only (`pnpm --filter @b-spot/e2e exec tsc
  --noEmit` plus eslint on the touched paths, and the mobile eslint on its
  touched paths), and revert anything a `--fix` rewrites outside my diff.

### Rulings — Architect, 2026-11-04

- **History already on devices:** accepted. Entries stored as `'OFF'` stay
  as they are, with no migration. The journal entry says so.
- **Contract check:** it lives in `apps/e2e/checks/`, in the `environment`
  project, and runs under `pnpm e2e:web`.
- **"In the history":** read as the stored entry, plus the company page
  reopened from it.
- **`apps/e2e` importing `apps/mobile/src/api/types.ts`:** accepted. The
  copied list is only a fallback, and it must be recorded if used.

## Diff-Review Findings

_(none yet)_
