# Changelog: Admin Authentication & Authorization

All notable changes to this feature specification are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/)

## [2026-05-30 00:00] - /speckit.specify

### Added

- Initial feature specification created from user description: "Authentification avec Better-Auth dans NestJS avec table admins dédiée et guard"
- **Author**: AI (Claude)
- **Files**: spec.md, checklists/requirements.md

## [2026-05-30 13:00] - correction plan (pattern e-enfance-3018)

### Changed

- research.md — corrigé : `toNodeHandler` + `MiddlewareConsumer` au lieu de `@thallesp/nestjs-better-auth` ; `new Pool()` au lieu de `better-auth-mikro-orm` ; entités MikroORM standard miroir
- plan.md — corrigé en conséquence : un seul package (`better-auth`), pas de `bodyParser: false`, `AuthService` injectable lazy-init, `AuthGuard` via `fromNodeHeaders` + `api.getSession()`
- **Author**: AI (Claude) sur instruction utilisateur
- **Files**: research.md, plan.md

## [2026-05-30 16:00] - /speckit.implement

### Changed

- Completed Phase 1: Setup (Infrastructure partagée)
- Tasks completed: T001, T002, T003
- **Author**: AI (Claude)
- **Files**: apps/api/package.json, pnpm-lock.yaml, apps/api/.env.example, apps/api/src/modules/auth/__tests__/

## [2026-05-30 15:30] - /speckit.tasks

### Added

- Task list generated with 32 tasks across 7 phases
- User stories covered: US1 (magic link), US2 (admin guards), US3 (default admin seeder), US4 (promote/revoke)
- **Author**: AI (Claude)
- **Files**: tasks.md

## [2026-05-30 12:00] - /speckit.plan

### Added

- Technical implementation plan with 12 implementation steps
- research.md — 6 architecture decisions (NestJS integration, MikroORM adapter, magic link, guard, seeder, last-admin protection)
- data-model.md — 5 entities (4 Better-Auth tables + admins custom table) with state transitions
- contracts/auth.yaml — Better-Auth proxied auth endpoints
- contracts/admin.yaml — Custom admin management endpoints (promote/revoke)
- quickstart.md — Local setup and test commands
- **Author**: AI (Claude)
- **Files**: plan.md, research.md, data-model.md, quickstart.md, contracts/auth.yaml, contracts/admin.yaml

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
