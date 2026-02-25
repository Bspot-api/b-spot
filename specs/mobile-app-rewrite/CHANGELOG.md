# Changelog: Refonte B-Spot - Application Mobile de Scan Produits

All notable changes to this feature specification are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/)

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
