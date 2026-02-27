# Changelog: Refonte B-Spot - Application Mobile de Scan Produits

All notable changes to this feature specification are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/)

## [2026-02-27 01:00] - /speckit.implement (Phase 12 Complete)

### Completed (Phase 12)

- Phase 12: Web Front-End (Expo Web Mode) — 3/4 tasks (T090 = manual validation)
  - T087: `Toast.web.tsx` — re-implemented with React Native `Animated` (no react-native-reanimated, no react-native-worklets). Same visual design and public API.
  - T088: `app/(tabs)/index.web.tsx` — barcode search form. Reuses `useBarcodeScanner` hook, NativeWind styling, validation (8-14 chars), loading + error states.
  - T089: `app/company/[id].tsx` — `Share.share()` guarded by `Platform.OS === 'web'`. Web: `navigator.clipboard.writeText()` + Toast confirmation. Native: unchanged.
- **Author**: AI (Claude Sonnet 4.6)
- **Files**: `apps/mobile/src/components/reacticx/Toast/Toast.web.tsx` (created), `apps/mobile/app/(tabs)/index.web.tsx` (created), `apps/mobile/app/company/[id].tsx` (modified), `specs/mobile-app-rewrite/tasks.md` (T087-T089 marked ✅), `specs/mobile-app-rewrite/plan.md` (template replaced)

---

## [2026-02-27 00:00] - /speckit.tasks

### Added (Phase 12)

- Phase 12: Web Front-End (Expo Web Mode) — 4 tasks (T087-T090)
  - T087: Toast.web.tsx — simplified Toast without react-native-worklets
  - T088: index.web.tsx — barcode search form (replaces camera scanner on web)
  - T089: Fix Share.share() in company/[id].tsx with Platform.OS guard
  - T090: Manual E2E validation of web front-end
- **Author**: AI (Claude Sonnet 4.6)
- **Files**: tasks.md (Phase 12 added), plan.md (template replaced with actual content)

---

## [2026-02-25 18:00] - /speckit.implement (Phase 5 Complete)

### Completed

- Phase 5: Mobile Scanner Screen — API client + barcode scanner UI (6/6 tasks)
  - T043: API client — `types.ts`, `client.ts`, `hooks.ts` (TanStack Query, hand-written from backend DTOs)
  - T044: Scanner feature structure — `src/features/scanner/{components,hooks}/`
  - T045: BarcodeScanner component — `expo-camera` CameraView + useCameraPermissions (SDK 54)
  - T046: ScanOverlay component — corner markers, loading spinner, error badge (StyleSheet + NativeWind)
  - T047: useBarcodeScanner hook — state machine (idle/loading/success/error), navigation on success
  - T048: Scanner screen — `app/(tabs)/index.tsx` fully wired up
- Bonus: Fixed `(tabs)/_layout.tsx` — replaced removed `lucide-react-native` with `@expo/vector-icons`

### Added

- `apps/mobile/src/api/types.ts`
- `apps/mobile/src/api/client.ts`
- `apps/mobile/src/api/hooks.ts`
- `apps/mobile/src/features/scanner/components/BarcodeScanner.tsx`
- `apps/mobile/src/features/scanner/components/ScanOverlay.tsx`
- `apps/mobile/src/features/scanner/hooks/useBarcodeScanner.ts`

### Modified

- `apps/mobile/app/(tabs)/index.tsx` — replaced placeholder with functional scanner screen
- `apps/mobile/app/(tabs)/_layout.tsx` — replaced lucide icons with @expo/vector-icons Ionicons

**Author**: AI (Claude)

---

## [2026-02-25 15:00] - /speckit.implement (Phase 4 Complete)
### Completed
- Phase 4: Backend Scan Endpoint — Orchestration & E2E Tests (7/7 tasks)
  - T036: ScanModule (imports ProductModule, CompanyModule, Brand entity)
  - T037: BrandService (exact match via `$ilike`, then partial/fuzzy fallback)
  - T038: ScanService orchestrator (OFF → brand lookup → Pappers → ScanResultDto)
  - T039: ScanController (`POST /api/scan`, body validation via class-validator)
  - T040: OpenAPI generation script (`pnpm generate:openapi`), Swagger plugin in nest-cli.json
  - T041: ScanService unit tests (5 tests — 404, no brand, no brand name, quota, happy path)
  - T042: E2E tests for scan flow (5 tests — 201, 400 validation, 404, unavailable)

### Added
- `apps/api/src/modules/brand/brand.service.ts`
- `apps/api/src/modules/scan/scan.module.ts`
- `apps/api/src/modules/scan/scan.service.ts`
- `apps/api/src/modules/scan/scan.controller.ts`
- `apps/api/src/modules/scan/dto/scan.dto.ts`
- `apps/api/src/modules/scan/__tests__/scan.service.spec.ts`
- `apps/api/src/generate-openapi.ts`
- `apps/api/test/scan-flow.e2e-spec.ts`
- `class-validator` + `class-transformer` dependencies

### Changed
- `apps/api/src/app.module.ts` — ScanModule registered
- `apps/api/package.json` — added `generate:openapi` script
- `apps/api/nest-cli.json` — added `@nestjs/swagger` CLI plugin

### Technical Notes
- ScanResultDto uses `dataFreshness: 'fresh' | 'cached' | 'unavailable'` to signal data quality
- Brand fuzzy matching: exact `$ilike` → partial containment scan of all brands
- class-validator `@Length(8, 14)` validates EAN-8 to EAN-13 barcodes
- `import request = require('supertest')` required (namespace import not callable)
- 46 unit tests + 5 E2E tests = 51 tests total passing

### Author
AI (Claude Sonnet 4.6)

---

## [2026-02-25 14:50] - /speckit.implement (Phase 3 Complete)
### Completed
- Phase 3: Backend Data Layer — Entities, Modules, Tests (15/15 tasks)
  - T021: Product entity (barcode, name, category, imageUrl, source enum, ManyToOne Brand)
  - T022: Brand entity (name unique, siren, timestamps)
  - T023: Company entity (siren, legalName, json: executives/shareholders/subsidiaries)
  - T024: Migration `Migration20260225010000_add_core_entities` (manual — DB offline)
  - T025: Brand seed data (~50 French brands with SIREN), BrandsSeeder, DatabaseSeeder
  - T026: ProductModule (Product + Brand entities, exports ProductService)
  - T027: ProductService (fetchFromOpenFoodFacts, saveProduct with brand linking)
  - T028: ProductController (`GET /api/products/:barcode`)
  - T029: CompanyModule (imports CacheModule, exports CompanyService + PappersService)
  - T030: PappersService (cache-first, quota guard, parse executives/shareholders)
  - T031: CompanyService (getOrCreateCompany, refreshCompany, toDto)
  - T032: CompanyController (`GET /api/companies/:siren`, 404 on miss)
  - T033: ProductService tests (8 tests — OFF fetch, saveProduct, brand linking)
  - T034: PappersService tests (10 tests — cache hit, quota exhausted, API call, errors)
  - T035: CompanyController tests (4 tests — 200 with DTO, 404 with French message)

### Added
- `apps/api/src/modules/brand/brand.entity.ts`
- `apps/api/src/modules/product/product.entity.ts`
- `apps/api/src/modules/company/company.entity.ts`
- `apps/api/src/migrations/Migration20260225010000_add_core_entities.ts`
- `apps/api/src/seeders/brand-data.ts`
- `apps/api/src/seeders/brands.seed.ts`
- `apps/api/src/seeders/DatabaseSeeder.ts`
- `apps/api/src/modules/product/product.module.ts`
- `apps/api/src/modules/product/product.service.ts`
- `apps/api/src/modules/product/product.controller.ts`
- `apps/api/src/modules/product/dto/product.dto.ts`
- `apps/api/src/modules/company/company.module.ts`
- `apps/api/src/modules/company/pappers.service.ts`
- `apps/api/src/modules/company/company.service.ts`
- `apps/api/src/modules/company/company.controller.ts`
- `apps/api/src/modules/company/dto/company.dto.ts`
- `apps/api/src/modules/product/__tests__/product.service.spec.ts`
- `apps/api/src/modules/company/__tests__/pappers.service.spec.ts`
- `apps/api/src/modules/company/__tests__/company.controller.spec.ts`

### Changed
- `apps/api/src/app.module.ts` — ProductModule + CompanyModule registered
- `apps/api/src/modules/product/product.service.ts` — fixed MikroORM createdAt/updatedAt
- `apps/api/src/modules/company/company.service.ts` — fixed MikroORM createdAt

### Technical Notes
- Native `fetch` (Node 18) used for both OFF API and Pappers API (no @nestjs/axios)
- Brand→Company link via `siren` on Brand entity (no FK join, MVP simplicity)
- PappersService: cache-first → quota guard → API call → log + cache response
- OneToMany on Brand deliberately omitted to avoid circular import at MVP
- EntityManager injected directly in ProductService/CompanyService for persistAndFlush
- 41/41 unit tests pass (full suite)

### Author
AI (Claude Sonnet 4.6)

---

## [2026-02-25 00:00] - /speckit.implement (Phase 2 Complete)
### Completed
- Phase 2: Backend Core — Caching & API Tracking (9/9 tasks)
  - T012: PappersCache entity (siren unique, json data, 30d TTL)
  - T013: ApiUsageLog entity (ExternalApi enum, success/error tracking)
  - T014: Migration `Migration20260225000000_add_cache_tables` (manual — DB offline)
  - T015: CacheModule (MikroORM entities, exports CacheService)
  - T016: CacheService — getCachedPappers, setCachedPappers, isCacheValid, logApiCall
  - T017: Quota monitoring — checkPappersQuota, isPappersQuotaExhausted (alert at 200)
  - T018: EmailService — Nodemailer SMTP, sendQuotaAlert
  - T019: Unit tests CacheService (12 tests — cache hit/miss/expiry/upsert)
  - T020: Unit tests quota monitoring (8 tests — threshold, exhausted, logApiCall)

### Added
- `apps/api/src/modules/cache/pappers-cache.entity.ts`
- `apps/api/src/modules/cache/api-usage-log.entity.ts`
- `apps/api/src/migrations/Migration20260225000000_add_cache_tables.ts`
- `apps/api/src/modules/cache/cache.module.ts`
- `apps/api/src/modules/cache/cache.service.ts`
- `apps/api/src/modules/cache/email.service.ts`
- `apps/api/src/modules/cache/__tests__/cache.service.spec.ts`
- `apps/api/src/modules/cache/__tests__/quota.spec.ts`

### Changed
- `apps/api/src/app.module.ts` — CacheModule registered

### Technical Notes
- `ExternalApi` enum exported from `api-usage-log.entity.ts` (shared by CacheService)
- `QuotaStatus` interface exported from `cache.service.ts` (used by future PappersService)
- Migration created manually (DB not running); run `pnpm db:up && pnpm migration:up` before Phase 3
- 20/20 unit tests pass

### Author
AI (Claude Sonnet 4.6)

---

## [2026-01-21 16:00] - /speckit.implement (Phase 1 Complete)
### Completed
- Phase 1: Setup & Infrastructure (11/11 tasks completed)
  - T001: pnpm workspace structure (api/ + mobile/)
  - T002: API package structure (NestJS, MikroORM, TypeScript strict mode)
  - T003: Mobile package structure (Expo SDK 52, Expo Router, NativeWind, TanStack Query)
  - T004: docker-compose.yml (PostgreSQL 15 with healthcheck)
  - T005: MikroORM configuration (migrations, seeders, PostgreSQL driver)
  - T006: Initial database migration (test entity, successfully applied)
  - T007: NestJS application structure (main.ts, app.module.ts, Swagger/OpenAPI)
  - T008: Health module (`GET /health` endpoint with tests)
  - T009: Expo Router file-based routing (tabs, company detail, 404)
  - T010: NativeWind configuration (Tailwind CSS for React Native)
  - T011: TanStack Query client (AsyncStorage persister, 7-day cache)

### Added
- `api/` package with NestJS backend foundation
- `mobile/` package with Expo React Native app foundation
- `docker-compose.yml` for local PostgreSQL development
- `SETUP.md` - Complete setup guide for Phase 1
- Health module with controller, service, DTO, and tests
- Expo Router tab navigation structure
- API: ESLint, Prettier, Jest configuration
- Mobile: ESLint, Prettier, Tailwind, Metro, Babel configuration

### Changed
- `pnpm-workspace.yaml` - Updated to point to api/ and mobile/
- `specs/mobile-app-rewrite/tasks.md` - Marked T001-T011 as completed

### Technical Notes
- Used `expo-camera` (not deprecated expo-barcode-scanner)
- Strict TypeScript enabled for both packages
- Global CORS enabled for mobile access
- Swagger/OpenAPI documentation at `/api` endpoint
- AsyncStorage persister configured for offline support

### Author
AI (Claude Sonnet 4.5)

### Files
- api/ (created - complete package structure)
- mobile/ (created - complete package structure)
- docker-compose.yml (created)
- SETUP.md (created)
- tasks.md (updated)
- CHANGELOG.md (updated)

---

## [2026-01-21 15:45] - /speckit.implement (Phase 0 Complete)
### Completed
- Phase 0: Research & Discovery (7/7 tasks completed)
  - R001: Pappers API testing (blocked - no valid key, tentative mapping documented)
  - R002: Open Food Facts testing (80% success rate, 245ms avg response time)
  - R003: Open Beauty Facts testing (10% success rate → **deferred to P2**)
  - R004: Brand → SIREN seed data sourcing (manual curation strategy defined)
  - R005: Barcode scanner research (use `expo-camera`, NOT `expo-barcode-scanner`)
  - R006: TanStack Query offline persistence (fully supported, config documented)
  - R007: Nodemailer Gmail SMTP (sufficient for MVP alerts)

### Added
- `specs/mobile-app-rewrite/research.md` - Complete research findings with 7 sections
- `specs/mobile-app-rewrite/backlog.md` - Post-MVP features backlog

### Changed
- `specs/mobile-app-rewrite/tasks.md` - Marked R001-R007 as completed with results

### Decisions
- Open Beauty Facts: Deferred to P2 (only 10% coverage vs 80% for Open Food Facts)
- Barcode Scanner: Use `expo-camera` (expo-barcode-scanner deprecated in SDK 52)
- Brand Seed Data: Manual curation of 50-100 brands (2-4 hours work)
- Offline Persistence: TanStack Query with 7-day cache, 30-minute stale time

### Blockers Identified
- Pappers API key has no credits (need new account for 250 free calls/month)
- Documentation needs update (CLAUDE.md, plan.md, tasks.md): expo-barcode-scanner → expo-camera

### Author
AI (Claude Sonnet 4.5)

### Files
- research.md (created)
- backlog.md (created)
- tasks.md (updated)
- CHANGELOG.md (updated)

---

## [2026-01-21 12:30] - /speckit.tasks
### Added
- Task breakdown: 86 detailed tasks organized in 11 phases
- Research phase: 7 tasks (Pappers API, Open Food Facts, brand seed data)
- Setup phase: 11 tasks (monorepo, database, API/mobile foundation)
- Backend phases: 31 tasks (caching, data layer, scan endpoint)
- Mobile phases: 17 tasks (scanner UI, company detail, offline support)
- Testing & deployment: 16 tasks (integration tests, E2E, Docker, EAS Build)
- **Author**: AI (Claude)
- **Files**: tasks.md

## [2026-01-21 12:20] - /speckit.plan
### Added
- Technical implementation plan with complete architecture
- Constitution check: all 6 principles validated
- Phase 0 research tasks (7 unknowns to resolve)
- Phase 1 design: 6 database entities, OpenAPI contracts
- Phase 2 task categories: 11 groups organized by user story
- Project structure: monorepo with api/ and mobile/ packages
- Complexity tracking and mitigation strategies
- **Author**: AI (Claude)
- **Files**: plan.md

## [2026-01-21 11:45] - /speckit.clarify
### Changed
- Clarified: Pas d'authentification pour le MVP (feature post-MVP)
- Clarified: Capacité hors-ligne limitée au cache des données déjà consultées
- Clarified: Seed manuel de la table Brand → SIREN avec top marques françaises
- Clarified: Alerting admin par email via variable d'environnement
- Clarified: Pas de photos des dirigeants dans le MVP
- **Author**: Human + AI (Claude)
- **Files**: spec.md

## [Unreleased]

### Added
- Initial feature specification created

---

<!--
CHANGELOG GUIDELINES

This changelog tracks all modifications to the feature specification documents.
Each speckit command MUST add an entry when modifying files.

## Entry Format

## [YYYY-MM-DD HH:MM] - /speckit.<command>
### Added | Changed | Fixed | Removed
- Description of what was added/changed/fixed/removed
- **Author**: Human | AI (Claude)
- **Files affected**: spec.md, plan.md, etc.

## Commands and their changelog actions

| Command | Action | Section |
|---------|--------|---------|
| /speckit.specify | Create spec | Added |
| /speckit.clarify | Clarify requirements | Changed |
| /speckit.plan | Create plan | Added |
| /speckit.tasks | Create tasks | Added |
| /speckit.checklist | Create checklist | Added |
| /speckit.implement | Complete task | Changed |
| /speckit.analyze | Analysis report | Added (if issues found) |

## Example entries

## [2025-01-09 14:30] - /speckit.specify
### Added
- Initial feature specification created from user description
- **Author**: AI (Claude)
- **Files**: spec.md

## [2025-01-09 15:00] - /speckit.clarify
### Changed
- Clarified authentication method: OAuth2 selected
- Clarified data retention period: 90 days
- **Author**: Human + AI (Claude)
- **Files**: spec.md

## [2025-01-09 16:00] - /speckit.plan
### Added
- Technical implementation plan created
- Research document with technology decisions
- Data model with 3 entities
- API contracts for 5 endpoints
- **Author**: AI (Claude)
- **Files**: plan.md, research.md, data-model.md, contracts/
-->
