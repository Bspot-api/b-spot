# Changelog: User Authentication & Conditional Admin UI

All notable changes to this feature specification are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/)

## [2026-06-09 00:00] - /speckit.specify

### Added

- Initial feature specification created from user description: "Auth utilisateur + UI conditionnelle admin"
- **Author**: AI (Claude)
- **Files**: spec.md, checklists/requirements.md

---

## [2026-06-09 01:00] - /speckit.plan

### Added

- Technical implementation plan with 6 research decisions (R-001–R-006)
- research.md: cookie forwarding, conditional tabs, 401 interception, useAuth design, endpoint placement, list scope
- data-model.md: 3 new API DTOs, 4 new mobile types, service method signatures
- contracts/auth.yaml: POST magic-link, GET session, DELETE sign-out
- contracts/admin-suggestions.yaml: GET /api/admin/me, GET /api/admin/brand-suggestions, PATCH /api/admin/brand-suggestions/:id
- quickstart.md: local dev setup and test walkthrough
- **Author**: AI (Claude)
- **Files**: plan.md, research.md, data-model.md, contracts/auth.yaml, contracts/admin-suggestions.yaml, quickstart.md

---

## [2026-06-09 04:00] - /speckit.implement

### Changed

- Completed Phase 2: Foundational
- Tasks completed: T004, T005
- **Author**: AI (Claude)
- **Files**: apps/mobile/src/features/auth/hooks/useAuth.ts, apps/mobile/src/api/hooks.ts

---

## [2026-06-09 03:00] - /speckit.implement

### Changed

- Completed Phase 1: Setup
- Tasks completed: T001, T002, T003
- **Author**: AI (Claude)
- **Files**: apps/mobile/src/api/client.ts, apps/mobile/src/api/types.ts, apps/mobile/src/features/auth/types.ts

---

## [2026-06-09 02:00] - /speckit.tasks

### Added

- Task list generated with 21 tasks across 8 phases
- User stories covered: US1 (Magic Link Login), US2 (Admin Detection), US3 (Admin Dashboard), US4 (Brand Suggestion Review), US5 (Session Expiry)
- Integration tests included for T013 and T017 (mandatory per constitution Principle 6)
- **Author**: AI (Claude)
- **Files**: tasks.md

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
