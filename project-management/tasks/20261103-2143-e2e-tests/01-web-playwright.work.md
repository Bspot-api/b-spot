# 01 — Web journeys with Playwright — work

Created by the Crewmate at the plan step, 2026-11-03. Spec:
`project-management/tasks/20261103-2143-e2e-tests/01-web-playwright.spec.md`
(parent: `project-management/tasks/20261103-2143-e2e-tests.spec.md`).

**Plan:** approved by the Architect, 2026-11-03 (with the human's rulings on the non-admin journey and the Open Beauty Facts fix, see Rulings).

## Program Design

Grounded in the code as of commit `6d27c7b`. Every path below is real
unless marked **new**.

### Where it lives

A new pnpm workspace package **`apps/e2e`** (`@b-spot/e2e`), picked up by
the existing `apps/*` glob of `pnpm-workspace.yaml`. It owns the e2e
environment, the fixture server, the helpers and the Playwright suite;
slice 2 adds its Maestro flows beside them (`apps/e2e/maestro/`). Nothing of
it is imported by `apps/api` or `apps/mobile` (**no test code in the
app**).

```
apps/e2e/                         (new)
  package.json        scripts: e2e:web, lint, fixtures — no `test`, no `build`
  tsconfig.json       strict, noImplicitAny, strictNullChecks
  .eslintrc.js        same rules as apps/api (no-explicit-any, max-lines 300,
                      max-lines-per-function 30, max-params 5)
  playwright.config.ts
  env/
    e2e-env.ts        constants: ports, URLs, DB name, e2e emails
    run-web.ts        `pnpm e2e:web` entry point (orchestrator)
    docker.ts         compose up / health wait / stop-what-we-started
    database.ts       drop+create, migrate, seed, e2e users, per-test reset
    web-build.ts      expo export --platform web into apps/e2e/.web-build
    static-server.ts  serves the export with SPA fallback
    block-external-hosts.ts   preloaded into the API process (see below)
  fixtures-server/
    server.ts         node:http entry, routes by prefix
    catalogue.ts      the named catalogue
    responses.ts      found / not-found bodies per API
  support/
    test.ts           extended `test`: page-error guard + per-test DB reset
    db.ts             expireSessionsOf, revokeAdminRole, findSuggestionsByNotes
    maildev.ts        fetchLatestMagicLink
    login.ts          loginAs(page, email)
    test-ids.ts       the testID names, as constants
  checks/
    environment.spec.ts   Playwright "environment" project (runs first)
  web/
    scan.spec.ts, brand-search.spec.ts, brand-suggestion.spec.ts,
    history.spec.ts, login.spec.ts, admin-entry.spec.ts,
    moderation.spec.ts, session-expiry.spec.ts
```

Root `package.json` gains `"e2e:web": "pnpm --filter @b-spot/e2e e2e:web"`.
Because `apps/e2e` defines no `test` and no `build` script, `pnpm test` and
`pnpm build` (recursive) skip it; `pnpm lint` runs its `tsc --noEmit &&
eslint`. `.gitignore` gains `apps/e2e/.web-build/`, `apps/e2e/test-results/`,
`apps/e2e/playwright-report/`.

Dependencies to add to `apps/e2e` at the code step (none installed now):
`@playwright/test`, `pg`, `@types/pg`, `tsx`, `typescript`, `@types/node`,
and the eslint set already used by `apps/api`. Chromium only, installed once
with `pnpm --filter @b-spot/e2e exec playwright install chromium` (README).

### Seam 1 — External API base URLs (API)

**New** `apps/api/src/config/external-api-urls.ts`:

```ts
export interface ExternalApiUrls {
  openFoodFacts: string;        // OPEN_FOOD_FACTS_BASE_URL
  openBeautyFacts: string;      // OPEN_BEAUTY_FACTS_BASE_URL
  rechercheEntreprises: string; // RECHERCHE_ENTREPRISES_BASE_URL
  pappers: string;              // PAPPERS_BASE_URL
}
export const DEFAULT_EXTERNAL_API_URLS: ExternalApiUrls = {
  openFoodFacts: 'https://world.openfoodfacts.org',
  openBeautyFacts: 'https://world.openbeautyfacts.org',
  rechercheEntreprises: 'https://recherche-entreprises.api.gouv.fr',
  pappers: 'https://api.pappers.fr',
};
export function readExternalApiUrls(env: NodeJS.ProcessEnv = process.env): ExternalApiUrls;
```

- A base URL is an origin plus an optional path prefix; unset or blank →
  default; a trailing `/` is stripped. The path each service appends stays
  in the service, so the defaults reproduce today's URLs exactly:
  - `product.service.ts`: `${openFoodFacts|openBeautyFacts}/api/v2/product/${barcode}`
    (replaces the `OFF_API` / `OBF_API` constants);
  - `brand-discovery.service.ts`: `${rechercheEntreprises}/search`
    (replaces `ENTREPRISE_SEARCH_API`);
  - `pappers.service.ts`: `${pappers}/v2/entreprise` (replaces `PAPPERS_API`).
- Read at call time (a plain function call inside each fetch method), not
  injected: no provider token, no change to the existing `TestingModule`
  setups in `product.service.spec.ts` / `pappers.service.spec.ts`.
- `apps/api/.env.example` documents the four variables, commented out.
- No "test mode" anywhere: the API only learns four optional variables.

### Seam 2 — Fixture server

**New** `apps/e2e/fixtures-server/`, plain `node:http`, no dependency, one
port (`4010`), one path prefix per API so OFF and OBF (same path shape) do
not collide. The e2e API process gets:

| Variable | Value |
|---|---|
| `OPEN_FOOD_FACTS_BASE_URL` | `http://localhost:4010/off` |
| `OPEN_BEAUTY_FACTS_BASE_URL` | `http://localhost:4010/obf` |
| `RECHERCHE_ENTREPRISES_BASE_URL` | `http://localhost:4010/recherche-entreprises` |
| `PAPPERS_BASE_URL` | `http://localhost:4010/pappers` |
| `PAPPERS_API_KEY` | `e2e-fake-token` (the service refuses to call without one) |

Routes and their "not found" answers, copied from the real APIs (probed by
hand on 2026-11-03):

- `GET /off/api/v2/product/:barcode`, `GET /obf/api/v2/product/:barcode` —
  found: `200 {code, status: 1, product: {product_name, brands, categories}}`;
  not found: **`404 {code, status: 0, status_verbose: "product not found"}`**.
- `GET /recherche-entreprises/search?q=…` — match on the normalised `q`:
  `200 {results: [...], total_results, page, per_page, total_pages}`; no
  match: `200 {results: [], total_results: 0, …}`.
- `GET /pappers/v2/entreprise?siren=…&api_token=…` — found: `200` with
  `siren, denomination, representants[], beneficiaires_effectifs[]`;
  unknown SIREN: `404 {statusCode: 404, error: "Not Found", message}`;
  missing token: `401` like the real API.
- Any other path: `404`. Each request is logged to stdout (one line) so a
  run shows which fixtures were hit.

**The catalogue** (`catalogue.ts`, named constants exported so the specs
assert against the same values). Barcodes and SIRENs of seeded brands are
real; everything a fixture invents is visibly fictional (executive and
shareholder names end in "Fixture"), so no fake fact is attached to a real
person.

| Name | Input | Resolves through | Company |
|---|---|---|---|
| `KNOWN_FOOD` | barcode `3017620422003`, brand `Nutella` | seeded brand → SIREN `602018897` | Pappers fixture "FERRERO FRANCE (fixture)", 2 executives, 1 shareholder |
| `KNOWN_COSMETIC` | barcode `3600000000017`, OFF 404 → OBF, brand `Ombrelis` | recherche-entreprises fixture → SIREN `900000002` | Pappers fixture "OMBRELIS (fixture)" |
| `BRAND_SEARCH` | brand name `Brovane` (not seeded) | recherche-entreprises fixture → SIREN `900000001`, auto_active | Pappers fixture "BROVANE (fixture)" |
| `UNKNOWN_BRAND_PRODUCT` | barcode `3700000000014`, brand `Zorbaq` | recherche-entreprises → no result → `needs_user_input` | — |
| `MISSING_PRODUCT` | barcode `3000000000000` | OFF 404 (and OBF 404) | — |

Invented brand names were checked against `apps/api/src/seeders/brand-data.ts`
and the partial matching of `BrandService.findBrandByName`: none contains a
seeded label (watch out for `LU`: "Verdalune" would match it) nor the
reverse. The cosmetic row depends on the open question about the OBF
fallback below.

### Seam 3 — E2E environment

Constants (`env/e2e-env.ts`): API `3101`, web `8182`, fixtures `4010`
(dev uses `3001` / `8082`, so a dev stack can keep running and a stray dev
API can never be mistaken for the e2e one), Postgres and MailDev from the
existing `docker-compose.yml` containers, database **`b_spot_e2e`**.

`pnpm e2e:web` → `tsx env/run-web.ts`, in order:

1. `docker compose up -d postgres maildev` from the repo root, after
   recording which of the two were already running; wait for
   `pg_isready` and MailDev's `GET /email`.
2. Reset the database (`env/database.ts`):
   `assertE2eDatabaseName(name)` throws unless the name ends in `_e2e`
   (the **dev-data-untouched** guard, run before any write); connect to the
   `postgres` maintenance DB, `DROP DATABASE IF EXISTS b_spot_e2e WITH
   (FORCE)`, `CREATE DATABASE b_spot_e2e`; then
   `pnpm --filter @b-spot/api exec mikro-orm migration:up` and
   `… mikro-orm seeder:run` with `DATABASE_NAME=b_spot_e2e` in the child
   env (process env wins over `apps/api/.env`, which `dotenv` never
   overrides). The default `DatabaseSeeder` gives the default admin and the
   brands; then `seedE2eUsers()` inserts, through `pg`, one user per auth
   journey, each with an `admins` row (see "Users" below).
3. Build the web app: `expo export --platform web --output-dir
   ../e2e/.web-build --clear` run in `apps/mobile` with
   `EXPO_PUBLIC_API_URL=http://localhost:3101` (same command as
   `apps/mobile/Dockerfile.web`; `--clear` so no Metro cache inlines the
   dev URL).
4. Spawn `playwright test` (args forwarded) and keep its exit code.
5. Teardown: Playwright already stopped its web servers; `docker compose
   stop` only the containers step 1 started. Exit with Playwright's code
   (non-zero on any failure, including a failed step 1–3).

`playwright.config.ts`: `workers: 1`, `fullyParallel: false`, `retries: 0`,
`baseURL: http://localhost:8182`, Chromium only, trace on failure, and a
`webServer` array (Playwright waits on each URL and kills them at the end,
`reuseExistingServer: false`):

- fixtures: `tsx fixtures-server/server.ts`, ready on `:4010/health`;
- API: `pnpm --filter @b-spot/api exec nest start` with the e2e env
  (`PORT=3101`, `DATABASE_NAME=b_spot_e2e`, the four base URLs,
  `PAPPERS_API_KEY`, `BETTER_AUTH_URL=http://localhost:3101`,
  `BETTER_AUTH_SECRET=<fixed e2e value>`, `CORS_ORIGIN=http://localhost:8182`,
  `SMTP_HOST=localhost`, `SMTP_PORT=1025`, `NODE_ENV=test`,
  `NODE_OPTIONS=--import tsx --import <abs>/env/block-external-hosts.ts`),
  ready on `:3101/health`;
- web: `tsx env/static-server.ts` serving `.web-build` with an
  `index.html` fallback (what nginx does in `Dockerfile.web`), ready on
  `:8182`.

Projects: `environment` (`checks/environment.spec.ts`) then `web`
(`web/*.spec.ts`, `dependencies: ['environment']`).

`CORS_ORIGIN` must be the web origin: with today's `'*'` default and
`credentials: true` the browser rejects every credentialed call, and
Better-Auth's `trustedOrigins` is derived from it.

**no-external-network.** `env/block-external-hosts.ts` is preloaded into
the API process only (via `NODE_OPTIONS`); it wraps `globalThis.fetch` and
rejects, with a loud log line, any request to `world.openfoodfacts.org`,
`world.openbeautyfacts.org`, `recherche-entreprises.api.gouv.fr`,
`api.pappers.fr`. It ships nowhere: it lives in `apps/e2e` and is attached
at launch, like an OS firewall rule would be. In the browser, the
`support/test.ts` fixture adds `context.route` aborts for the same four
hosts. A leak therefore turns into a failed journey, every run.

**Per-test clean state.** The run-level reset gives the seeded baseline;
an automatic `beforeEach` in `support/test.ts` calls
`resetMutableState()` while the API keeps running:
`TRUNCATE product, company, pappers_cache, api_usage_log, brand_suggestion,
session, verification RESTART IDENTITY CASCADE`, `DELETE FROM brand WHERE
match_source IS DISTINCT FROM 'seed'`, and re-inserts any missing `admins`
row of the e2e users. Each test also gets a fresh browser context (empty
`localStorage`, so empty local history). No journey reads another's writes.
Safe because MikroORM's Nest module forks the entity manager per request.

**Users** (all created by `seedE2eUsers`, all admins at the start of each
test, since `sendMagicLink` in `auth.service.ts` only mails admins):
`login@e2e.test`, `moderation@e2e.test`, `expiry@e2e.test`,
`regular@e2e.test`. One per journey, so expiring or demoting one user
never touches another journey's session.

### Seam 4 — Magic link from MailDev

`support/maildev.ts`:

```ts
export interface MagicLinkQuery { email: string; since: Date; timeoutMs?: number }
export async function fetchLatestMagicLink(query: MagicLinkQuery): Promise<string>;
```

Polls `GET http://localhost:1080/email` every 250 ms up to `timeoutMs`
(default 10 s), keeps messages whose `to[].address` equals `email` and whose
`date` is after `since`, takes the newest, extracts
`http://localhost:3101/api/auth/magic-link/verify?token=…` from its `text`
part (the template in `apps/api/src/modules/cache/email.service.ts` puts
the bare URL on its own line). Throws with the list of recipients seen
when nothing arrives. Filtering by recipient and time (not `DELETE
/email/all`) leaves a developer's own MailDev inbox alone.

`support/login.ts` — `loginAs(page, email): Promise<void>`: goto `/login`,
fill `login-email-input`, click `login-submit`, wait for `login-sent`,
fetch the link, open it in a second page of the same browser context
(the cookie is set on `localhost:3101`, same site as `localhost:8182`),
close that page, then wait for the first page to leave `/login` (the login
screen polls the session every 3 s and `router.replace('/')`s) and for
`nav-login-link` to show the email.

### Seam 5 — Stable selectors

`testID` added to the app (RN Web renders `data-testid`, Playwright's
`getByTestId` default). Names are kebab-case string literals in the app,
mirrored as constants in `apps/e2e/support/test-ids.ts`; the app never
imports the e2e package.

| File | testIDs |
|---|---|
| `apps/mobile/app/(tabs)/_layout.web.tsx` | `nav-admin-link`, `nav-login-link` |
| `apps/mobile/app/(tabs)/index.web.tsx` | `search-mode-barcode`, `search-mode-brand`, `search-input`, `search-submit`, `search-error` |
| `apps/mobile/app/company/[id].tsx` | `company-error` |
| `src/features/company/components/CompanyHeader.tsx` | `company-legal-name`, `company-siren` |
| `src/features/company/components/ExecutivesList.tsx` | `executive-item` |
| `src/features/company/components/ShareholdersList.tsx` | `shareholder-item` |
| `apps/mobile/app/brand-suggestion/new.tsx` | `suggestion-brand-input`, `suggestion-notes-input`, `suggestion-submit` |
| `src/features/history/components/ScanHistoryItem.tsx` / `ScanHistoryEmpty.tsx` | `history-item`, `history-empty` |
| `apps/mobile/app/login.tsx` | `login-email-input`, `login-submit`, `login-sent`, `login-error` |
| `apps/mobile/app/(tabs)/admin.tsx` | `admin-profile-email`, `admin-sign-out`, `admin-counter-<status>` |
| `apps/mobile/app/admin/suggestions.tsx` | `suggestions-tab-<status>`, `suggestion-card`, `suggestion-approve`, `suggestion-review`, `suggestion-reject`, `suggestion-edit`, `suggestion-delete`, `suggestions-empty`, `suggestion-edit-sheet` (the existing `BottomSheet` `testID` prop), `suggestion-edit-brand-input`, `suggestion-edit-save` |

Only attributes are added: no behaviour, no layout change. Native-only
files (`app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`) are left to
slice 2, which reuses the same names.

### The journeys (one spec file each)

Every spec imports `test` from `support/test.ts`, which fails the test on
any `pageerror` (the "no crash" guard) and runs the per-test reset.

- **scan.spec.ts** — main: `search-input` ← `KNOWN_FOOD.barcode`, submit →
  URL `/company/602018897`, `company-legal-name`, 2 `executive-item`,
  1 `shareholder-item` with the fixture names. Failure: `MISSING_PRODUCT` →
  `search-error` shows "Produit introuvable dans notre base de données.".
  Plus the cosmetic case (OBF badge "Produit cosmetique") — see open
  question.
- **brand-search.spec.ts** — main: `search-mode-brand`, `Brovane` →
  company page of SIREN `900000001` and the "on a ajouté cette marque"
  toast. Failure: an unknown name → `search-error` with the API message.
- **brand-suggestion.spec.ts** — `UNKNOWN_BRAND_PRODUCT.barcode` → URL
  `/brand-suggestion/new` with `Zorbaq` prefilled; fill
  `suggestion-notes-input` with a unique note, click `suggestion-submit`,
  wait for the `POST /api/brand-suggestions` 201; then assert through
  `db.findSuggestionsByNotes(note)` that the row exists with the barcode.
  (On web `Alert.alert` is a no-op, so the screen shows no confirmation —
  see findings.)
- **history.spec.ts** — `/history` shows `history-empty`; scan
  `KNOWN_FOOD`; `page.goto('/history')` → one `history-item` labelled
  "Nutella — FERRERO FRANCE (fixture)"; clicking it opens the company page.
- **login.spec.ts** — `loginAs(login@e2e.test)` → `nav-login-link` shows
  the email. Failure: a reused link (opened a second time) does not log a
  fresh context in.
- **admin-entry.spec.ts** — logged out: no `nav-admin-link`. Admin:
  `loginAs(login@e2e.test)` → `nav-admin-link`
  visible, `/admin` shows `admin-profile-email`. Regular user:
  `loginAs(regular@e2e.test)`, then `db.revokeAdminRole(email)`, reload →
  no `nav-admin-link`; `goto('/admin')` lands back on `/`.
- **moderation.spec.ts** — `beforeEach` creates three suggestions through
  the public `POST /api/brand-suggestions` (Playwright `request`); login as
  `moderation@e2e.test`; `/admin/suggestions`: approve the first → it
  leaves "Nouvelles" and appears under `suggestions-tab-approved`; edit the
  second via `suggestion-edit` → sheet → new brand name saved and shown;
  delete the third (accept the `window.confirm` dialog) → gone.
- **session-expiry.spec.ts** — login as `expiry@e2e.test`, open
  `/admin/suggestions`; `db.expireSessionsOf(email)`; click
  `suggestions-tab-approved` (a new query → `401`) → toast "Votre session
  a expirée" and URL `/login`; `goto('/')` → `nav-login-link` reads
  "Se connecter", no `nav-admin-link`; no page error.

### Session expiry, server-side

`support/db.ts`:

```ts
export async function expireSessionsOf(email: string): Promise<number>;
// UPDATE session SET "expiresAt" = now() - interval '1 minute'
//   WHERE "userId" = (SELECT id FROM "user" WHERE email = $1)
```

A real expiry, not a deletion: Better-Auth's `getSession` sees the past
`expiresAt`, drops the session and answers `null`; `AuthGuard` then
answers 401 on `/api/admin/*`. No cookie cache is configured in
`auth.config.ts`, so the next request sees it. The app's existing
`QueryCache.onError` in `app/_layout.tsx` produces the toast and the
redirect. No hook in the app.

### Test order (test-first at the seams)

1. API Jest, red then green: `src/config/__tests__/external-api-urls.spec.ts`
   (defaults equal today's four URLs; each variable overrides its own;
   blank falls back; trailing slash stripped). Then one case each in
   `product.service.spec.ts`, `pappers.service.spec.ts` and a **new**
   `brand/__tests__/brand-discovery.service.spec.ts`: with the variable
   set, `fetch` is called on the overridden URL; unset, on today's URL.
2. Fixture server + `checks/environment.spec.ts` (red first): each route
   answers its found and not-found shape for the catalogue; the API
   answers `/health` on 3101; `select current_database()` through the e2e
   pool is `b_spot_e2e`.
3. Orchestrator, DB reset, web build, static server: `pnpm e2e:web` runs
   the environment project green.
4. `login.spec.ts` written first against missing testIDs (red), then
   MailDev helper + login testIDs (green) — login is the dependency of four
   journeys.
5. Then, each red then green with its testIDs: scan, brand search, history,
   brand suggestion, admin entry, moderation, session expiry.
6. No-network guard and browser route aborts; two consecutive
   `pnpm e2e:web` runs (**repeatable**); `pnpm lint && pnpm test && pnpm
   build`; README section.

### Decisions the spec left to the implementation

- Package `apps/e2e`, not a root folder: inside the existing workspace glob,
  its own lint, shared by slice 2.
- Fixed e2e ports (3101 / 8182 / 4010) distinct from dev.
- Web served from `expo export` (production-like, deterministic) through a
  tiny static server, not the Metro dev server.
- Base URL = origin + optional prefix; the path stays in each service; read
  at call time.
- One shared fixture server, routed by prefix.
- DB: drop/recreate per run + truncate mutable tables per test; one
  dedicated user per auth journey; `workers: 1`.
- Network blocking by a fetch guard preloaded into the API process plus
  browser route aborts, rather than an OS firewall rule.
- Expiry by moving `expiresAt` into the past, not by deleting the row.
- Brand-suggestion success asserted on the HTTP 201 and the database row.
- History reached by URL on web.

## Worklog

- 2026-11-03 — Plan written from a read of the API modules (product,
  brand discovery, pappers, scan, brand-suggestion, auth/admin, seeders,
  MikroORM config, `main.ts`), the web screens and `Dockerfile.web`, and a
  hand probe of the four external APIs' not-found answers.

## Implementation Checkboxes

- [ ] External API URL config + unit tests (defaults kept, override read)
- [ ] Wire the config into product, brand-discovery and pappers services
- [ ] `apps/e2e` package skeleton (package.json, tsconfig, eslint, root script, .gitignore)
- [ ] Fixture server + catalogue + environment check spec
- [ ] Orchestrator: docker, DB reset/seed/guard, web export, static server, Playwright webServers, teardown
- [ ] Per-test reset + page-error guard + network guards
- [ ] MailDev helper + login journey + login testIDs
- [ ] Scan journey + testIDs
- [ ] Brand search journey + testIDs
- [ ] History journey + testIDs
- [ ] Brand suggestion journey + testIDs
- [ ] Admin entry journey + testIDs
- [ ] Moderation journey + testIDs
- [ ] Session expiry journey
- [ ] Two consecutive green `pnpm e2e:web` runs
- [ ] Gates: `pnpm lint`, `pnpm test`, `pnpm build`
- [ ] README section: running the web suite

## Notes & Snippets

### Findings in the code that touch the spec

- **A regular user cannot log in.** `magicLink({ disableSignUp: true })` in
  `auth.config.ts` plus the `isAdminByEmail` gate in `auth.service.ts`
  mean only admins ever receive a link. The parent row "a regular user
  does not [see the admin entry]" therefore cannot be walked through the
  login UI with a non-admin. Plan: log in as a seeded admin, then demote
  server-side (delete its `admins` row) and reload. Open question below.
- **OBF fallback is dead against the real OFF API.** OFF answers an
  unknown barcode with HTTP **404** (`status: 0`); `ProductService`
  treats any non-OK response as `technical_error` and skips OBF. A
  faithful fixture reproduces the 404, so `KNOWN_COSMETIC` can never be
  reached by barcode. Open question below.
- **Brand suggestion gives no feedback on web.** `brand-suggestion/new.tsx`
  confirms with `Alert.alert`, a no-op in React Native Web: the submit
  succeeds silently and the screen stays. Not fixed here; asserted on the
  201 and the DB row.
- **Visiting `/admin` logged out shows "session expirée".**
  `app/(tabs)/admin.tsx` calls `useAdminSuggestions()` unconditionally;
  logged out it gets 401, and the root `QueryCache.onError` toasts
  "Votre session a expirée" and redirects to `/login`. The admin-entry
  journey does not assert on that path; reported, not fixed.
- **History has no entry point on web.** `app/(tabs)/_layout.web.tsx`
  links only Admin and login; `/history` works by URL. Only barcode
  lookups are recorded (`useBarcodeScanner`), not brand searches.
- **Slice 2's deep link scheme.** `app.config.ts` gives the development
  variant (the EAS `development` profile, i.e. the dev build Maestro will
  drive) the scheme `bspot-dev`, not `bspot`. Slice 2's spec writes
  `bspot://company/<id>`.
- `CLAUDE.md` says Expo ~52; `apps/mobile/package.json` is on Expo 54 /
  Expo Router 6. No impact on the plan.

### Rulings — Architect, 2026-11-03

- **Blocking external hosts:** the fetch guard loaded through
  `NODE_OPTIONS` from `apps/e2e` is accepted. It ships in neither the API
  nor the app, so it is not test code in the app.
- **History by URL:** accepted. Adding a history link to the web navbar is
  outside this slice.
- **Brand suggestion on web:** asserting on the 201 response and the
  database row is accepted. The silent `Alert.alert` on web is reported to
  the human as a separate bug.
- **`/admin` while logged out:** reported to the human as a separate bug.
  Not fixed here.
- **Slice 2 scheme:** the dev build's `bspot-dev` scheme is noted in the
  slice 2 spec for its plan to settle.
- **Regular user and Open Beauty Facts fallback:** brought to the human,
  because both change what a row of the approved journeys table means.
  The human ruled on 2026-11-03:
  - **Non-admin journey:** tested as a logged-out visitor, plus an admin
    demoted server-side who loses the entry on reload. Login stays
    admin-only.
  - **Open Beauty Facts fallback:** fixed in this slice. A 404 from Open
    Food Facts means "not found" and falls through to Open Beauty Facts.
    The fix comes with an API regression test written first, and the
    cosmetic journey is tested end to end.

### Real not-found answers (probed 2026-11-03)

- OFF / OBF unknown barcode: `404 {"code":"…","status":0,"status_verbose":"product not found"}`.
- recherche-entreprises no match: `200 {"results":[],"total_results":0,"page":1,"per_page":5,"total_pages":0}`.
- Pappers bad token: `401 {"statusCode":401,"error":"Unauthorized","message":"…"}`.

## Diff-Review Findings

_Filled at the review step._
