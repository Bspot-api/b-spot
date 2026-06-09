# Implementation Plan: User Authentication & Conditional Admin UI

**Branch**: `feat/user-auth-admin-ui` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/user-auth-admin-ui/spec.md`

## Summary

Add magic-link login, a central `useAuth()` hook, and a conditional Admin section to the B-Spot mobile app. After login, the app silently checks admin status (5-min cache) and conditionally renders an Admin tab giving access to brand suggestion moderation. Two new API endpoints are required in `AdminController` (`GET /api/admin/brand-suggestions` and `PATCH /api/admin/brand-suggestions/:id`). Session cookies must be forwarded on all requests (`credentials: include`).

## Technical Context

**Language/Version**: TypeScript 5 (strict mode — `strict: true`, `noImplicitAny`, `strictNullChecks`)
**Primary Dependencies**:
- Mobile: Expo ~52 / Expo Router 4, NativeWind 4, TanStack Query 5, existing Toast component at `apps/mobile/src/components/reacticx/Toast/`
- API: NestJS 10, MikroORM 6, Better-Auth (magic-link plugin)
**Storage**: PostgreSQL 15 (API) — no new tables; AsyncStorage not used for auth (session lives in cookie managed by Better-Auth)
**Testing**: Jest + Supertest (API); Jest + React Native Testing Library (mobile, optional per constitution)
**Target Platform**: iOS, Android, Web (all three via Expo)
**Project Type**: Mobile + API monorepo (`apps/mobile/` + `apps/api/`)
**Performance Goals**: Admin privilege check ≤1 req per 5 min under normal usage; suggestion list initial load ≤50 items per status
**Constraints**: No `any` types; functions ≤30 lines; files ≤300 lines; NativeWind only for styling; session cookie forwarding required (`credentials: include`)
**Scale/Scope**: Single admin user initially; ~50 suggestions per status at MVP

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| P1 — Type Safety First | ✅ PASS | All new types explicit; no `any`; mobile types extend existing `types.ts` |
| P2 — Resource Constraint Awareness | ✅ PASS | No Pappers API calls involved in this feature |
| P3 — Mobile-First UX | ✅ PASS | NativeWind only; works on iOS/Android/Web; loading and error states required |
| P4 — Feature-Based Architecture | ✅ PASS | Auth feature in `apps/mobile/src/features/auth/`; admin endpoints extend existing `AdminController` |
| P5 — Simplicity Over Abstraction | ✅ PASS | Single hook, no repository pattern; direct MikroORM in service |
| P6 — Test-Driven Quality | ✅ PASS | API endpoints tested (integration tests mandatory); mobile hook tests optional per constitution |

No violations. Complexity Tracking section not needed.

## Project Structure

### Documentation (this feature)

```text
specs/user-auth-admin-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── auth.yaml
│   └── admin-suggestions.yaml
└── tasks.md             # /speckit.tasks output (not created here)
```

### Source Code (repository root)

```text
# API — extends existing feature modules
apps/api/src/modules/auth/
├── admin.controller.ts          # ADD: GET brand-suggestions, PATCH brand-suggestions/:id
├── dto/
│   └── admin.dto.ts             # ADD: ListBrandSuggestionsQueryDto, UpdateBrandSuggestionStatusDto, BrandSuggestionListDto

apps/api/src/modules/brand-suggestion/
├── brand-suggestion.service.ts  # ADD: findByStatus(), updateStatus()

# Mobile — new auth feature module
apps/mobile/src/features/auth/
├── hooks/
│   └── useAuth.ts               # NEW: central auth hook (session + isAdmin + signOut)
└── types.ts                     # NEW: SessionDto, AdminProfileDto for mobile

# Mobile — API client extensions
apps/mobile/src/api/
├── client.ts                    # MODIFY: add credentials:'include'; add getSession, getAdminMe, signOut, listAdminSuggestions, updateSuggestionStatus
├── hooks.ts                     # MODIFY: add useAdminSuggestions, useUpdateSuggestionStatus
└── types.ts                     # MODIFY: add SessionDto, AdminProfileDto, BrandSuggestionListDto, UpdateSuggestionStatusDto

# Mobile — Expo Router screens
apps/mobile/app/
├── login.tsx                    # NEW: magic-link login screen
├── (tabs)/
│   ├── _layout.tsx              # MODIFY: add conditional Admin tab (href:null when !isAdmin)
│   └── admin.tsx                # NEW: admin dashboard (name/email + suggestion counters + sign-out)
└── admin/
    └── suggestions.tsx          # NEW: suggestion list with status filter tabs + moderation actions

# Mobile — root layout
apps/mobile/app/_layout.tsx      # MODIFY: register login + admin/suggestions screens; add 401 interceptor
```

**Structure Decision**: Mobile + API (Option 3). New auth feature module in `apps/mobile/src/features/auth/` following existing `features/` pattern. Admin screens under `apps/mobile/app/admin/` as a separate stack group, referenced from the Admin tab.

## Complexity Tracking

> No constitution violations — section not applicable.

---

## Phase 0 — Research

> See [research.md](./research.md) for full findings.

### R-001 — Cookie forwarding with Better-Auth across origins

**Decision**: Add `credentials: 'include'` to all `apiFetch` calls.

**Rationale**: Better-Auth uses an HTTP-only session cookie (`better-auth.session_token`). Fetch defaults to `credentials: 'omit'` for cross-origin calls, meaning the cookie is never sent. Adding `credentials: 'include'` in `apiFetch` globally fixes this for all existing and new API calls without per-call changes.

**Alternatives considered**: Token-based auth (localStorage JWT) — rejected because Better-Auth's magic-link plugin manages cookies automatically server-side; switching to token mode would require significant backend changes outside this feature's scope.

---

### R-002 — Conditional tab visibility in Expo Router Tabs

**Decision**: Use `href: null` on `<Tabs.Screen>` to hide a tab without removing it from the router tree.

**Rationale**: Expo Router v3+ supports `href: null` on `<Tabs.Screen options={{ href: null }}>` to suppress a tab from the tab bar while keeping its route mounted. This is the officially documented approach for conditional tabs. Calling `useAuth()` directly in `_layout.tsx` ensures the tab responds to auth state changes in real time.

**Alternatives considered**: Conditional JSX rendering of `<Tabs.Screen>` — rejected because dynamically adding/removing screens in Tabs causes remount flicker and is not supported cleanly; `href: null` is the idiomatic pattern.

---

### R-003 — 401 session expiry interception

**Decision**: Throw a typed `ApiError(401, ...)` from `apiFetch` (already done), then handle it in a `QueryCache` `onError` callback registered on the root `QueryClient`.

**Rationale**: TanStack Query's `QueryCache` global `onError` is the centralized place to intercept query errors. When a query fails with `ApiError.statusCode === 401`, the handler shows a toast (via `useToast` context — already present in the app) and calls `router.replace('/login')`. This avoids scattered error handling across individual hooks.

**Alternatives considered**: Axios interceptors — rejected (project uses native `fetch`). Zustand global error flag — rejected as unnecessarily complex; `QueryCache.onError` is sufficient and already in scope of the existing `QueryClient`.

---

### R-004 — useAuth() hook design

**Decision**: Two parallel TanStack Query queries in a single hook — `session` (always active) and `adminMe` (enabled only when session exists). Return merged state.

**Rationale**: Separating the two queries lets TanStack Query cache them independently with `staleTime: 5 * 60 * 1000`. The admin check is skipped entirely (no network call) when the user is not logged in. When the session query returns null, `isAdmin` is immediately `false` with no extra request. `queryKey: ['auth', 'session']` and `queryKey: ['auth', 'admin']` give standard cache keys.

**Alternatives considered**: Single combined query — rejected because it ties the cache lifetime of session and admin check together, making invalidation (e.g., sign-out only needs to invalidate both) more complex. Zustand for auth state — rejected per constitution (Principle 5: no custom state management beyond Zustand + TanStack Query for server state; session is server state).

---

### R-005 — Admin brand-suggestion endpoints placement

**Decision**: Add `GET /api/admin/brand-suggestions` and `PATCH /api/admin/brand-suggestions/:id` to the existing `AdminController`.

**Rationale**: These endpoints are admin-only operations (guarded by `AdminGuard`). Placing them in `AdminController` keeps all admin-gated routes together, reusing the existing `@UseGuards(AuthGuard, AdminGuard)` at controller level. The `BrandSuggestionService` gains two new methods (`findByStatus`, `updateStatus`) — the controller stays thin.

**Alternatives considered**: New `AdminBrandSuggestionController` — rejected; unnecessary file proliferation for two endpoints. Adding admin routes to `BrandSuggestionController` — rejected; that controller has no auth guards and would require duplicating guard setup.

---

## Phase 1 — Design & Contracts

> See [data-model.md](./data-model.md) and [contracts/](./contracts/) for full artifacts.

### Data model additions

**New on API side** (no new DB tables — existing `brand_suggestion` table):

| DTO | Location | Purpose |
|-----|----------|---------|
| `ListBrandSuggestionsQueryDto` | `auth/dto/admin.dto.ts` | Query param `status` for `GET /api/admin/brand-suggestions` |
| `UpdateBrandSuggestionStatusDto` | `auth/dto/admin.dto.ts` | Body `{ status }` for `PATCH /api/admin/brand-suggestions/:id` |
| `BrandSuggestionListDto` | `auth/dto/admin.dto.ts` | Response `{ items: BrandSuggestionDto[], total: number }` |

**New on mobile side** (added to `apps/mobile/src/api/types.ts`):

| Type | Shape |
|------|-------|
| `SessionDto` | `{ user: { id: string; email: string; name: string } }` |
| `AdminProfileDto` | `{ adminId: string; userId: string; email: string; name: string; promotedAt: string }` |
| `BrandSuggestionListDto` | `{ items: BrandSuggestionDto[]; total: number }` |
| `UpdateSuggestionStatusDto` | `{ status: 'new' \| 'reviewed' \| 'approved' \| 'rejected' }` |

**New in `apps/mobile/src/features/auth/types.ts`**:

```ts
export interface Session {
  user: { id: string; email: string; name: string };
}

export interface AdminProfile {
  adminId: string;
  userId: string;
  email: string;
  name: string;
  promotedAt: string;
}
```

### API Contracts summary

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|---------|
| `POST` | `/api/auth/sign-in/magic-link` | None | `{ email }` | `{ message: "Magic link sent" }` |
| `GET` | `/api/auth/get-session` | Cookie | — | `SessionDto \| null` |
| `DELETE` | `/api/auth/sign-out` | Cookie | — | `{ message: "Signed out" }` |
| `GET` | `/api/admin/me` | Cookie + Admin | — | `AdminProfileDto` / 403 |
| `GET` | `/api/admin/brand-suggestions` | Cookie + Admin | `?status=new\|reviewed\|approved\|rejected` (optional) | `BrandSuggestionListDto` |
| `PATCH` | `/api/admin/brand-suggestions/:id` | Cookie + Admin | `{ status }` | `BrandSuggestionDto` |

Full OpenAPI YAML contracts in [contracts/auth.yaml](./contracts/auth.yaml) and [contracts/admin-suggestions.yaml](./contracts/admin-suggestions.yaml).

### Component / hook inventory (mobile)

| File | Type | Description |
|------|------|-------------|
| `features/auth/types.ts` | Types | `Session`, `AdminProfile` |
| `features/auth/hooks/useAuth.ts` | Hook | Session + admin check + signOut |
| `api/client.ts` | API | +`credentials:'include'`; +`getSession`, `getAdminMe`, `signOut`, `listAdminSuggestions`, `updateSuggestionStatus` |
| `api/types.ts` | Types | +`SessionDto`, `AdminProfileDto`, `BrandSuggestionListDto`, `UpdateSuggestionStatusDto` |
| `api/hooks.ts` | Hooks | +`useAdminSuggestions`, `useUpdateSuggestionStatus` |
| `app/login.tsx` | Screen | Magic-link login form |
| `app/(tabs)/_layout.tsx` | Layout | Conditional Admin tab via `href: null` |
| `app/(tabs)/admin.tsx` | Screen | Admin dashboard with suggestion counters |
| `app/admin/suggestions.tsx` | Screen | Filterable suggestion list + moderation actions |
| `app/_layout.tsx` | Layout | Register new screens; 401 → toast + redirect |
