# Research: User Authentication & Conditional Admin UI

**Feature**: `feat/user-auth-admin-ui`
**Date**: 2026-06-09

---

## R-001 — Cookie forwarding with Better-Auth across origins

**Decision**: Add `credentials: 'include'` globally to `apiFetch` in `apps/mobile/src/api/client.ts`.

**Rationale**: Better-Auth issues an HTTP-only session cookie (`better-auth.session_token`). The native `fetch` API defaults to `credentials: 'omit'` for cross-origin requests, so the cookie is never sent unless explicitly opted in. Adding `credentials: 'include'` once in the shared `apiFetch` helper covers all existing and future API calls without per-call changes.

**Alternatives considered**:
- Token-based auth (localStorage JWT): rejected — Better-Auth's magic-link plugin manages the full session lifecycle server-side via cookies; switching to token mode would require significant backend changes outside this feature's scope.
- Per-endpoint `credentials` option: rejected — unnecessarily verbose and error-prone; a global default is simpler and correct.

---

## R-002 — Conditional tab visibility in Expo Router Tabs

**Decision**: Set `href: null` on `<Tabs.Screen>` options to hide a tab without removing its route.

**Rationale**: Expo Router v3+ supports `href: null` as the canonical way to suppress a tab from the tab bar while keeping the route in the router tree. Calling `useAuth()` in `app/(tabs)/_layout.tsx` gives real-time reactivity: when `isAdmin` flips (login / logout), the tab bar updates on the next render cycle with no flicker or remount of sibling tabs.

**Alternatives considered**:
- Conditional JSX rendering of `<Tabs.Screen>`: rejected — dynamically adding/removing screens causes remount flicker and is explicitly flagged as unsupported in Expo Router docs.
- Separate stack navigator for admin: rejected — unnecessary nesting; the tab pattern is simpler and aligns with how the existing `history` tab works.

---

## R-003 — 401 session expiry interception

**Decision**: Handle `ApiError(401)` in a `QueryCache` global `onError` callback on the root `QueryClient`.

**Rationale**: TanStack Query's `QueryCache` `onError` is the single centralized location for cross-cutting query error handling. When a query fails with `statusCode === 401`, the handler calls `router.replace('/login')` and shows a toast via the existing `ToastContext`. The `QueryClient` already lives in `app/_layout.tsx`, so the handler has access to both the router and the toast context without prop drilling.

**Alternatives considered**:
- Axios interceptors: rejected — the project uses native `fetch`, not Axios.
- Zustand global error flag + polling component: rejected — adds unnecessary state management for a simple redirect.
- Per-hook `onError` callbacks: rejected — would require duplicating the logic across every hook.

**Implementation note**: The `onError` callback must be installed at `QueryClient` construction time (in `app/_layout.tsx`). The toast and router calls must be deferred to the next tick if called during a render (`setTimeout(..., 0)`) to avoid React state update warnings.

---

## R-004 — useAuth() hook design

**Decision**: Two independent TanStack Query queries in a single hook: `queryKey: ['auth', 'session']` (always active) and `queryKey: ['auth', 'admin']` (enabled only when session is non-null). Both with `staleTime: 5 * 60 * 1000`.

**Rationale**: Separating the two queries keeps their cache entries independent. The admin check fires zero network requests when the user is not logged in. On sign-out, invalidating `['auth']` (prefix) clears both in one call. The hook signature matches the spec exactly:

```ts
{
  session: Session | null,
  isAdmin: boolean,
  adminProfile: AdminProfile | null,
  isLoading: boolean,
  signOut: () => Promise<void>,
}
```

`signOut` calls `DELETE /api/auth/sign-out`, then invalidates `['auth']` cache, causing the dependent `isAdmin` query to re-run (returning null) on next access.

**Alternatives considered**:
- Single combined query fetching both session and admin status: rejected — ties their invalidation together unnecessarily; admin check would run even if session was already known to be null.
- Zustand store for auth state: rejected — session is server state (belongs in TanStack Query); constitution Principle 5 prohibits custom state management beyond Zustand + TanStack Query for server state.

---

## R-005 — Admin brand-suggestion endpoints placement

**Decision**: Add `GET /api/admin/brand-suggestions` and `PATCH /api/admin/brand-suggestions/:id` to the existing `AdminController`, with `BrandSuggestionService` gaining `findByStatus()` and `updateStatus()` methods.

**Rationale**: `AdminController` is already decorated with `@UseGuards(AuthGuard, AdminGuard)` at the controller level, so both new endpoints inherit admin protection automatically. The controller stays thin (delegates to service). `BrandSuggestionService` already has the `BrandSuggestion` repository injected, so no new module dependencies are needed.

**Alternatives considered**:
- New `AdminBrandSuggestionController`: rejected — unnecessary file for two endpoints; would require registering a new provider in `AuthModule`.
- Adding admin routes to `BrandSuggestionController`: rejected — that controller has no auth guards and mixing public + admin routes in one controller violates separation of concerns.

---

## R-006 — Suggestion list initial load scope

**Decision**: Return all suggestions for a given status in a single call (no pagination). Add an optional `limit` defaulting to 50 server-side.

**Rationale**: MVP admin audience is a single user managing a low volume of suggestions. Pagination adds complexity (infinite scroll or page controls) that is not justified at this stage. The `total` field is included in the response so pagination can be added later without a contract change.

**Alternatives considered**:
- Cursor-based pagination: deferred to Phase 2.
- Client-side filtering of a full dump: rejected — keeps list manageable server-side and avoids overfetching as volume grows.
