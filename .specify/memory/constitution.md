<!--
Sync Impact Report - Constitution v1.0.0
═══════════════════════════════════════════════════════════════════════════════

Version Change: INITIAL → 1.0.0
Rationale: Initial constitution creation for B-Spot platform

New Sections Added:
  - Complete constitutional framework
  - Six core principles established
  - Governance section with amendment procedures
  - Versioning policy defined

Principles Defined:
  1. Type Safety First - Strict typing enforcement
  2. Resource Constraint Awareness - API call limits and cost optimization
  3. Mobile-First User Experience - Cross-platform consistency
  4. Feature-Based Architecture - Module organization
  5. Simplicity Over Abstraction - Pragmatic engineering
  6. Test-Driven Quality - Comprehensive testing strategy

Templates Requiring Updates:
  ✅ Updated: .specify/templates/plan-template.md
     - Constitution Check section now validates against 6 principles
  ✅ Updated: .specify/templates/spec-template.md
     - User scenarios align with mobile-first principle
     - Requirements validation includes type safety checks
  ✅ Updated: .specify/templates/tasks-template.md
     - Task categorization reflects constitution-driven priorities
     - Resource constraint tasks included in foundational phase

Follow-up TODOs:
  - None: All placeholders filled with concrete values

Dependencies Scanned:
  - README.md: ✅ Aligned
  - CLAUDE.md: ✅ Aligned
  - Plan template: ✅ Validated
  - Spec template: ✅ Validated
  - Tasks template: ✅ Validated

Commit Message (suggested):
  docs: establish project constitution v1.0.0 (governance + 6 core principles)

═══════════════════════════════════════════════════════════════════════════════
-->

# B-Spot Project Constitution

**Project Name**: B-Spot Platform
**Project Type**: Mobile-First Transparency Platform (Expo + NestJS Monorepo)
**Target Platform**: iOS/Android (Expo ~52.0) + Docker-deployed Backend
**Primary Language**: TypeScript
**Constitution Version**: 1.0.0
**Ratification Date**: 2026-01-21
**Last Amended Date**: 2026-01-21

---

## Purpose

This constitution establishes the immutable principles and governance framework for the B-Spot platform—a mobile application empowering consumers to understand corporate ownership and influence networks through product barcode scanning. These principles guide all development activities, ensuring consistency, quality, and alignment with the project's mission across all features and contributions.

---

## Core Principles

### Principle 1: Type Safety First

**Declaration**: All code MUST use explicit TypeScript types with strict type checking enabled. No use of `any`, `unknown` without proper type guards, or untyped values is permitted.

**Rationale**: Type safety prevents runtime errors, improves IDE support, enables reliable refactoring, and ensures API contract consistency between mobile and backend through generated OpenAPI types. Given the mobile-backend architecture, type mismatches could cause production crashes that damage user trust.

**Enforcement Rules**:
- `strict: true` MUST be enabled in all `tsconfig.json` files
- `noImplicitAny: true` and `strictNullChecks: true` are non-negotiable
- Code review MUST reject PRs containing `any` types without explicit justification
- Generated API types from OpenAPI schema MUST be used in mobile app (no manual type definitions for API contracts)
- All function parameters, return types, and exported values MUST have explicit type annotations

**Examples**:
```typescript
// ❌ VIOLATION
function processData(input) {
  return input.map(x => x.value);
}

// ✅ COMPLIANT
function processData(input: Array<{ value: string }>): string[] {
  return input.map(x => x.value);
}
```

**Trade-off Guidance**: If rapid prototyping requires temporary relaxation, isolate untyped code in a clearly marked `experimental/` directory with a plan and date for proper typing.

---

### Principle 2: Resource Constraint Awareness

**Declaration**: All development MUST respect the 250 API calls/month limit on the free Pappers API tier. Features MUST implement aggressive caching, rate limiting, and cost tracking to prevent quota exhaustion.

**Rationale**: Exceeding the Pappers free tier would require paid plans or render the application non-functional. This constraint is a fundamental project requirement, not an optimization. The project's viability depends on operating within this limit.

**Enforcement Rules**:
- ALL Pappers API responses MUST be cached locally with at least 30-day TTL
- Cache-first strategy MUST be implemented: check cache before making any API call
- API call counter MUST be tracked and exposed via admin dashboard
- Warning alerts MUST trigger at 200 calls (80% of quota)
- Features MUST NOT make redundant API calls for already-cached data
- Load testing MUST simulate 1000+ product scans to verify cache efficiency
- Database MUST include `cache_pappers` table for response storage

**Monitoring Requirements**:
- Weekly API usage reports in development logs
- Pre-production deployment gate: verify cache hit rate >95% on test data
- Production monitoring: alert if monthly call count exceeds 200

**Trade-off Guidance**: When choosing between feature completeness and API efficiency, prioritize efficiency. Missing data is preferable to quota exhaustion. If a feature requires frequent Pappers calls, defer it or redesign with caching.

---

### Principle 3: Mobile-First User Experience

**Declaration**: The mobile application is the primary user interface. All features MUST be designed for mobile interaction first, with touch-optimized controls, offline capability, and cross-platform (iOS/Android) visual consistency.

**Rationale**: B-Spot is a consumer mobile app similar to Yuka—users scan products in stores. Desktop or web interfaces are secondary. Poor mobile UX would make the app unusable in its primary context.

**Enforcement Rules**:
- All new features MUST work on both iOS and Android without platform-specific fallbacks (unless justified by platform APIs)
- UI components MUST use NativeWind (Tailwind for React Native) for consistent styling
- Touch targets MUST be minimum 44x44 points per platform guidelines
- Critical user flows (scan → company view) MUST function offline using cached data
- Navigation MUST use Expo Router file-based routing (no programmatic navigation for primary flows)
- Loading states MUST be implemented for all async operations (no blank screens)
- Error states MUST provide actionable user guidance, not technical stack traces

**Accessibility Requirements**:
- Screen reader compatibility for primary flows
- Color contrast WCAG AA minimum for text
- Interactive elements MUST have accessible labels

**Trade-off Guidance**: If a feature requires web-only technology (e.g., complex data viz), consider if it truly serves the mobile user or if it's feature creep. Defer web features until post-MVP.

---

### Principle 4: Feature-Based Architecture

**Declaration**: Code MUST be organized by business feature/domain, not by technical layer. Each feature module MUST encapsulate its models, services, and controllers/components.

**Rationale**: Feature-based architecture supports parallel development, independent testing, easier onboarding, and clear feature ownership. With a mobile + backend monorepo, this prevents "big ball of mud" anti-pattern.

**Enforcement Rules**:
- Backend modules MUST be in `api/src/modules/{feature}/` (e.g., `company/`, `scan/`, `auth/`)
- Mobile features MUST be in `mobile/src/features/{feature}/` (e.g., `scanner/`, `company-detail/`)
- Each feature module MUST contain: models/types, service logic, API routes (backend) or screens (mobile), and tests
- Shared utilities go in `shared/` or `common/` but MUST NOT contain business logic
- Maximum 10 feature modules per application (if more needed, justify architectural refactoring)
- Cross-feature dependencies MUST be documented in module README with explicit justification

**File Organization Example (Backend)**:
```
api/src/modules/
├── company/
│   ├── company.entity.ts
│   ├── company.service.ts
│   ├── company.controller.ts
│   ├── company.module.ts
│   └── __tests__/
├── scan/
│   ├── scan.entity.ts
│   ├── scan.service.ts
│   ├── scan.controller.ts
│   └── __tests__/
```

**Trade-off Guidance**: If two features are tightly coupled (e.g., scan always requires company data), consider merging them or creating a shared abstraction layer—but avoid premature abstraction.

---

### Principle 5: Simplicity Over Abstraction

**Declaration**: Code MUST favor pragmatic, straightforward solutions over clever abstractions, design patterns, or premature optimization. Maximum function length is 30 lines; maximum function parameters is 5; maximum file length is 300 lines.

**Rationale**: The project is an MVP with a small team. Over-engineering slows velocity, increases cognitive load, and creates maintenance debt. Readable code that works is superior to "clean" code that's hard to understand.

**Enforcement Rules**:
- Functions exceeding 30 lines MUST be split unless clear justification provided
- Functions with >5 parameters MUST use configuration objects or be refactored
- Files exceeding 300 lines MUST be split by feature concern
- Avoid Repository pattern, Factory pattern, Strategy pattern unless there are 3+ implementations requiring abstraction
- No custom ORM abstractions—use MikroORM directly
- No custom state management beyond Zustand + TanStack Query
- YAGNI principle: implement only what's needed for current user stories

**Examples**:
```typescript
// ❌ VIOLATION: Premature abstraction
interface DataFetcher<T> {
  fetch(): Promise<T>;
}
class PappersDataFetcher implements DataFetcher<Company> { ... }
class OpenFoodFactsFetcher implements DataFetcher<Product> { ... }

// ✅ COMPLIANT: Direct implementation
async function fetchCompanyFromPappers(siren: string): Promise<Company> {
  // Direct fetch logic
}
async function fetchProductFromOpenFoodFacts(barcode: string): Promise<Product> {
  // Direct fetch logic
}
```

**Trade-off Guidance**: If you're considering a design pattern, ask: "Do I have 3 concrete examples that need this abstraction?" If no, write simple code.

---

### Principle 6: Test-Driven Quality

**Declaration**: Critical user flows and business logic MUST have automated tests. Tests are OPTIONAL for UI components and non-critical features, but required for API endpoints, data transformations, and core services.

**Rationale**: Tests prevent regressions in critical paths (barcode scan → company display) and enable confident refactoring. However, excessive test coverage for UI components has diminishing returns. Focus testing effort on high-value areas.

**Testing Requirements (MANDATORY)**:
- All API endpoints in `company/`, `scan/`, `product/`, `auth/` modules MUST have integration tests
- All Pappers API caching logic MUST have unit tests verifying cache-first behavior
- Barcode → company resolution flow MUST have end-to-end test coverage
- Database migrations MUST be tested (up and down) before merging

**Testing Requirements (OPTIONAL)**:
- Mobile UI component unit tests (unless user-submitted data is involved)
- Admin-only features
- Experimental features in `experimental/` directory

**Testing Tools**:
- Backend: Jest for unit/integration tests, Supertest for API testing
- Mobile: Jest + React Native Testing Library (when tests are written)
- E2E: Manual testing for MVP; automated E2E deferred to Phase 2

**CI/CD Requirements**:
- All tests MUST pass before PR merge
- Test coverage report MUST be generated (target: >80% for core modules)

**Trade-off Guidance**: If writing a test takes longer than manually testing, and the feature is low-risk, defer automated testing. Document test deferral in PR description.

---

## Governance

### Amendment Procedure

1. **Proposal**: Any team member may propose a constitutional amendment via GitHub issue with label `constitution-amendment`.
2. **Discussion**: Amendment proposal MUST be discussed for minimum 7 days to allow community feedback.
3. **Approval**: Amendments require approval from project maintainers (majority vote if multiple maintainers).
4. **Implementation**: Approved amendments MUST be merged with version bump (see Versioning Policy below).
5. **Propagation**: Amender MUST update dependent templates and documentation per Sync Impact Report checklist.

### Versioning Policy

Constitution version follows semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward-incompatible changes (e.g., removing a principle, fundamentally redefining constraints)
- **MINOR**: New principles added or existing principles materially expanded with new enforcement rules
- **PATCH**: Clarifications, wording improvements, typo fixes, example additions (no semantic changes)

### Compliance Review

- Every feature specification (`spec.md`) MUST reference relevant constitutional principles
- Every implementation plan (`plan.md`) MUST include "Constitution Check" section validating compliance
- The `/speckit.analyze` command SHOULD be run after task generation to detect violations
- PRs MAY be blocked if they contain CRITICAL constitutional violations per `/speckit.analyze` report

### Conflict Resolution

When constitutional principles conflict:
1. **User Value First**: Principles that directly impact user experience (Principle 3) take precedence
2. **Sustainability Next**: Resource constraints (Principle 2) trump development convenience
3. **Explicit Justification**: Developers MUST document trade-offs in PR descriptions when principles conflict
4. **Escalation Path**: Unresolved conflicts escalate to project maintainers for binding decision

---

## Scope and Interpretation

### Applicability

This constitution applies to:
- All features developed for B-Spot mobile app (`mobile/`)
- All features developed for B-Spot backend API (`api/`)
- All shared utilities, libraries, and infrastructure code
- All documentation and design artifacts in `.specify/` and `docs/`

### Non-Applicability

This constitution does NOT apply to:
- Third-party dependencies (npm packages)
- Generated code (OpenAPI client, migration files) unless explicitly modified
- Experimental prototypes in `experimental/` directory (subject to time-boxed exception)

### Interpretation Guidelines

- Principles are **prescriptive**, not aspirational—MUST/MUST NOT language is binding
- "SHOULD" indicates strong recommendation; deviation requires justification
- "MAY" indicates optionality with no default preference
- When in doubt, favor simpler interpretation that reduces development friction

---

## Appendix: Principle Priority Matrix

When multiple principles conflict, use this matrix to prioritize (higher number = higher priority):

| Principle | Priority | Context Where It Dominates |
|-----------|----------|----------------------------|
| Resource Constraint Awareness (P2) | 5 | Quota-impacting features, API integration design |
| Type Safety First (P1) | 4 | API contracts, shared libraries, data models |
| Mobile-First UX (P3) | 4 | User-facing features, interaction design |
| Feature-Based Architecture (P4) | 3 | Codebase organization, module boundaries |
| Simplicity Over Abstraction (P5) | 3 | Internal refactoring, utility libraries |
| Test-Driven Quality (P6) | 2 | Core business logic (higher priority), UI polish (lower) |

---

## Document History

| Version | Date | Changes | Amended By |
|---------|------|---------|------------|
| 1.0.0 | 2026-01-21 | Initial constitution ratification | System |

---

**End of Constitution**

*This document supersedes all prior informal agreements and serves as the authoritative governance framework for the B-Spot project. All contributors and AI agents MUST adhere to these principles.*
