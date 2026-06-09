# Tasks: User Authentication & Conditional Admin UI

**Input**: Design documents from `/specs/user-auth-admin-ui/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Integration tests are included for new API endpoints (mandatory per constitution Principle 6 — `auth/` module). Mobile hook and screen tests are optional and not included.

**Organization**: Tasks grouped by user story. Setup and Foundational phases are prerequisites for all stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no conflicting dependencies)
- **[Story]**: Which user story this task belongs to
- All paths are relative to repository root

## Path Conventions (Mobile + API monorepo)

- API: `apps/api/src/modules/`
- Mobile screens: `apps/mobile/app/`
- Mobile features: `apps/mobile/src/features/`
- Mobile API client: `apps/mobile/src/api/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Wire in cookie forwarding and add all new types. No business logic. All 3 tasks touch different files and can run in parallel.

- [x] T001 Modify `apps/mobile/src/api/client.ts` — add `credentials: 'include'` to the `apiFetch` options spread, and add 6 new exported async functions: `getSession(): Promise<SessionDto | null>`, `signInMagicLink(email: string): Promise<void>`, `signOut(): Promise<void>`, `getAdminMe(): Promise<AdminProfileDto>`, `listAdminSuggestions(status?: SuggestionStatus): Promise<BrandSuggestionListDto>`, `updateSuggestionStatus(id: number, status: SuggestionStatus): Promise<BrandSuggestionDto>` — `getAdminMe` must NOT catch 403 (let it propagate as ApiError)
- [x] T002 [P] Extend `apps/mobile/src/api/types.ts` — add `SessionDto`, `AdminProfileDto`, `BrandSuggestionListDto`, `UpdateSuggestionStatusDto`, and `SuggestionStatus` (union type `'new' | 'reviewed' | 'approved' | 'rejected'`) per data-model.md
- [x] T003 [P] Create `apps/mobile/src/features/auth/types.ts` — export `Session` and `AdminProfile` domain interfaces (mirrors of SessionDto/AdminProfileDto, kept in feature module per constitution Principle 4)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `useAuth` hook and API query hooks are used by ALL user story phases. No user story work begins until these are complete.

**⚠️ CRITICAL**: No user story implementation can begin until T004 and T005 are complete.

- [x] T004 Create `apps/mobile/src/features/auth/hooks/useAuth.ts` — two TanStack Query queries: `queryKey: ['auth', 'session']` (always active, calls `getSession`, `staleTime: 5 * 60 * 1000`) and `queryKey: ['auth', 'admin']` (enabled only when `session !== null`, calls `getAdminMe`, treats 403 ApiError as `isAdmin: false` without throwing, `staleTime: 5 * 60 * 1000`); return `{ session, isAdmin, adminProfile, isLoading, signOut }` where `signOut` calls `signOut()` then `queryClient.invalidateQueries({ queryKey: ['auth'] })` (depends on T001, T002, T003)
- [x] T005 [P] Add `useAdminSuggestions(status?: SuggestionStatus)` and `useUpdateSuggestionStatus()` to `apps/mobile/src/api/hooks.ts` — `useAdminSuggestions` is a `useQuery` with `queryKey: ['admin', 'suggestions', status]` and `staleTime: 2 * 60 * 1000`; `useUpdateSuggestionStatus` is a `useMutation` that invalidates `['admin', 'suggestions']` on success (depends on T001, T002)

**Checkpoint**: Foundation ready — user story phases can begin

---

## Phase 3: User Story 1 - Magic Link Login (Priority: P1) 🎯 MVP

**Goal**: Users can request a magic link by email and see a confirmation message. Already-logged-in users are redirected away. Login screen is accessible from the app.

**Independent Test**: Navigate to `/login` → enter email → tap button → "Vérifiez votre boîte mail" message appears. Log in via MailDev link → reload app → session is detected. Already-authenticated user navigating to `/login` → immediately redirected to previous screen.

- [ ] T006 [US1] Create `apps/mobile/app/login.tsx` — email `TextInput` + submit `Pressable` ("Recevoir un lien de connexion"); on submit calls `signInMagicLink(email)` (via useMutation wrapping the client function) and renders confirmation message "Vérifiez votre boîte mail" in place of the form (no redirect); on mount, if `useAuth().session` is non-null, call `router.back()` (or `router.replace('/')` if no history); loading state on the button during submission (depends on T004)
- [ ] T007 [US1] Register `login` and `admin/suggestions` screens in `apps/mobile/app/_layout.tsx` — add `<Stack.Screen name="login" options={{ title: 'Connexion', presentation: 'modal' }} />` and `<Stack.Screen name="admin/suggestions" options={{ title: 'Suggestions', presentation: 'card' }} />`; add a "Se connecter" header button to one of the existing tabs (e.g., `history` tab screen options) that calls `router.push('/login')` when session is null, or displays the user email when logged in (depends on T006)

**Checkpoint**: User Story 1 fully functional — magic link login works end-to-end

---

## Phase 4: User Story 2 - Admin Detection After Login (Priority: P1)

**Goal**: After login, the Admin tab appears automatically for admin users and remains absent for non-admin users. Survives reload.

**Independent Test**: Log in as seeded admin → Admin tab appears in tab bar. Log out → Admin tab disappears immediately. Log in as non-admin → Admin tab never appears. Reload web app as admin → Admin tab still present.

- [ ] T008 [US2] Modify `apps/mobile/app/(tabs)/_layout.tsx` — import `useAuth` from `../../src/features/auth/hooks/useAuth`; call `useAuth()` at top of component; add a third `<Tabs.Screen name="admin" options={{ title: 'Admin', href: isAdmin ? undefined : null, tabBarIcon: ... }} />` after the existing two screens (depends on T004)
- [ ] T009 [US2] Create `apps/mobile/app/(tabs)/admin.tsx` — basic admin dashboard: show `adminProfile.name` and `adminProfile.email` from `useAuth()`; show a "Déconnexion" button that calls `signOut()` from `useAuth()`; add `isAdmin` guard at top — if `!isAdmin && !isLoading`, call `router.replace('/')` (protects direct URL access on web); placeholder text "Chargement des suggestions..." for the counters section (to be enhanced in T014) (depends on T004, T008)

**Checkpoint**: User Stories 1 and 2 fully functional — login + admin tab conditional display works

---

## Phase 5: User Story 3 - Admin Dashboard Overview (Priority: P2)

**Goal**: Admin sees suggestion counts grouped by status. Tapping a counter navigates to the filtered list.

**Independent Test**: As admin, open Admin tab → 4 counters visible (new, reviewed, approved, rejected) with correct counts. Tap "new" counter → navigates to `/admin/suggestions?status=new`.

### API implementation

- [ ] T010 [US3] Add 3 DTOs to `apps/api/src/modules/auth/dto/admin.dto.ts` — `ListBrandSuggestionsQueryDto` with optional `@IsEnum(BrandSuggestionStatus) status?`; `UpdateBrandSuggestionStatusDto` with required `@IsEnum(BrandSuggestionStatus) @IsNotEmpty() status`; `BrandSuggestionListDto` with `items: BrandSuggestionDto[]` and `total: number` — import `BrandSuggestionDto` from `../../brand-suggestion/dto/brand-suggestion.dto`
- [ ] T011 [US3] Add `findByStatus(status?: BrandSuggestionStatus): Promise<{ items: BrandSuggestion[]; total: number }>` to `apps/api/src/modules/brand-suggestion/brand-suggestion.service.ts` — if status provided, filter by `{ status }`; otherwise return all; order by `createdAt DESC`; limit 50; return `{ items, total: items.length }` (depends on T010)
- [ ] T012 [US3] Add `@Get('brand-suggestions') listSuggestions(@Query() query: ListBrandSuggestionsQueryDto): Promise<BrandSuggestionListDto>` to `apps/api/src/modules/auth/admin.controller.ts` — inject `BrandSuggestionService` in constructor; call `brandSuggestionService.findByStatus(query.status)`; return mapped result using `brandSuggestionService.toDto()` per item (depends on T010, T011)
- [ ] T013 [US3] Add integration tests for `GET /api/admin/brand-suggestions` to `apps/api/src/modules/auth/__tests__/admin.integration.spec.ts` — test: returns 200 with `{ items, total }` as admin; filters correctly by status; returns 403 for non-admin session; returns 401 for no session (depends on T012)

### Mobile implementation

- [ ] T014 [US3] Enhance `apps/mobile/app/(tabs)/admin.tsx` — replace placeholder with 4 tappable `Pressable` counters (new / en révision / approuvé / rejeté) using `useAdminSuggestions()` for all statuses (4 separate queries or one unfiltered query); each counter shows count and status label; on press calls `router.push({ pathname: '/admin/suggestions', params: { status } })`; loading skeleton while queries are pending (depends on T005, T012)

**Checkpoint**: User Stories 1, 2, and 3 fully functional — admin dashboard shows live suggestion counts

---

## Phase 6: User Story 4 - Brand Suggestion Review (Priority: P2)

**Goal**: Admin can approve, reject (with confirmation), or mark as reviewed any suggestion from a filterable list.

**Independent Test**: Open Admin tab → tap "new" counter → suggestions list with status filter tabs appears → tap "Approuver" on an item → item disappears from "new" tab → appears in "approuvé" tab.

### API implementation

- [ ] T015 [US4] Add `updateStatus(id: number, status: BrandSuggestionStatus): Promise<BrandSuggestion>` to `apps/api/src/modules/brand-suggestion/brand-suggestion.service.ts` — find suggestion by id (throw `NotFoundException` if not found); assign new status; call `em.persistAndFlush`; return updated entity (depends on T010)
- [ ] T016 [US4] Add `@Patch('brand-suggestions/:id') updateSuggestion(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBrandSuggestionStatusDto): Promise<BrandSuggestionDto>` to `apps/api/src/modules/auth/admin.controller.ts` — call `brandSuggestionService.updateStatus(id, body.status)` and return `brandSuggestionService.toDto(result)` (depends on T010, T015)
- [ ] T017 [US4] Add integration tests for `PATCH /api/admin/brand-suggestions/:id` to `apps/api/src/modules/auth/__tests__/admin.integration.spec.ts` — test: returns 200 with updated suggestion as admin; returns 404 for unknown id; returns 400 for invalid status; returns 403 for non-admin; returns 401 for no session (depends on T016)

### Mobile implementation

- [ ] T018 [US4] Create `apps/mobile/app/admin/suggestions.tsx` — reads `status` from `useLocalSearchParams()`; filter tabs at top (new / en révision / approuvé / rejeté) that update `activeStatus` local state; `FlatList` using `useAdminSuggestions(activeStatus)` showing per item: `brandName`, `productName?`, `barcode?`, image thumbnail (`Image`) if `productImageUrl` present, `createdAt` formatted date; action buttons per item based on status: "Approuver" (→ approved), "Rejeter" (→ rejected, with `Alert.alert` confirmation), "Marquer en révision" (→ reviewed); each action calls `useUpdateSuggestionStatus` mutation then invalidates `['admin', 'suggestions']`; add `isAdmin` guard — redirect if not admin; empty state when list is empty; error state with retry (depends on T005, T016)

**Checkpoint**: User Stories 1–4 fully functional — full suggestion moderation workflow works

---

## Phase 7: User Story 5 - Session Expiry Handling (Priority: P3)

**Goal**: When a session expires mid-use, a toast appears and the user is redirected to the login screen.

**Independent Test**: Simulate expired session (clear cookie manually or wait for expiry) → attempt any API action → toast "Votre session a expiré" appears → user is on login screen within 2 seconds.

- [ ] T019 [US5] Add global 401 interceptor to `apps/mobile/app/_layout.tsx` — move `QueryClient` construction outside `RootLayout` to module scope; pass `queryCache: new QueryCache({ onError: (error) => { if (error instanceof ApiError && error.statusCode === 401) { setTimeout(() => { toast.show('Votre session a expiré'); router.replace('/login'); queryClient.invalidateQueries({ queryKey: ['auth'] }); }, 0); } } })` to `new QueryClient()`; import `ApiError` from `../src/api/client`; use `useToast()` hook or call toast imperatively via a module-level reference (depends on T007)

**Checkpoint**: All 5 user stories fully functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification and cleanup across all stories.

- [ ] T020 [P] Verify web platform compatibility — open `apps/mobile/app/(tabs)/_layout.web.tsx` and confirm `<Slot />` renders correctly with conditional admin tab logic (no tab bar on web is expected); navigate directly to `/admin` and `/admin/suggestions` as non-admin on web and verify `isAdmin` guard redirects; check NativeWind classes render on web
- [ ] T021 Run quickstart.md end-to-end validation — follow all steps in `specs/user-auth-admin-ui/quickstart.md`: login via magic link, verify admin tab, moderate a suggestion, sign out, verify tab disappears; confirm `pnpm test` passes in `apps/api/` with new integration tests

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T001/T002/T003 are parallel
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user story phases; T004/T005 can be parallel
- **Phase 3 (US1)**: Depends on Phase 2 — T006 then T007 sequentially
- **Phase 4 (US2)**: Depends on Phase 2 — can run in parallel with Phase 3 (different files)
- **Phase 5 (US3)**: Depends on Phases 2, 3, 4 — T010 → T011 → T012 → T013; T014 parallel with T013
- **Phase 6 (US4)**: Depends on Phase 5 (T010 already done) — T015 → T016 → T017; T018 parallel with T017
- **Phase 7 (US5)**: Depends on Phase 3 (T007) — single task T019
- **Phase 8 (Polish)**: Depends on all previous phases — T020/T021 parallel

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only — no story dependencies
- **US2 (P1)**: Depends on Foundational only — can run in parallel with US1 (different files: `_layout.tsx` vs `login.tsx`)
- **US3 (P2)**: Depends on US1 + US2 being complete (needs login + admin tab to test end-to-end)
- **US4 (P2)**: Depends on US3 (T010 already complete, service method is additive)
- **US5 (P3)**: Depends on US1 only (T007 registers the login screen target)

### Within Each Phase

- T001 → T002/T003 parallel (different files)
- T004 → T005 parallel (different files, both depend on T001-T003)
- T010 → T011 → T012 → T013 (sequential, same service/controller)
- T014 parallel with T013 (different files — mobile screen vs API tests)
- T015 → T016 → T017 (sequential)
- T018 parallel with T017 (different files — mobile screen vs API tests)

---

## Parallel Example: Phase 1 Setup

```bash
# All 3 tasks touch different files — launch simultaneously:
Task T001: "Modify apps/mobile/src/api/client.ts — add credentials + 6 auth functions"
Task T002: "Add SessionDto, AdminProfileDto, BrandSuggestionListDto, UpdateSuggestionStatusDto to apps/mobile/src/api/types.ts"
Task T003: "Create apps/mobile/src/features/auth/types.ts with Session and AdminProfile"
```

## Parallel Example: Phase 5 (US3 API + Mobile)

```bash
# After T012 is done — T013 and T014 can run simultaneously:
Task T013: "Integration tests for GET /api/admin/brand-suggestions in apps/api/src/modules/auth/__tests__/admin.integration.spec.ts"
Task T014: "Enhance apps/mobile/app/(tabs)/admin.tsx with suggestion counters"
```

---

## Implementation Strategy

### MVP First (US1 only — login screen)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005)
3. Complete Phase 3: User Story 1 (T006–T007)
4. **STOP and VALIDATE**: Magic link login works end-to-end
5. Deploy/demo

### Incremental Delivery

1. Phases 1–2 → Foundation ready
2. Phase 3 (US1) → Login works → Demo
3. Phase 4 (US2) → Admin tab conditional → Demo
4. Phase 5 (US3) → Suggestion counters → Demo
5. Phase 6 (US4) → Suggestion moderation → Demo
6. Phase 7 (US5) → Session expiry graceful → Complete

### Solo Developer Strategy

Follow phases sequentially (3→4→5→6→7). Each phase is independently testable before moving to the next.

---

## Notes

- [P] tasks = different files with no conflicting in-flight dependencies
- `[US#]` maps each task to its user story for traceability
- Constitution Principle 6: integration tests in `auth/__tests__/` are mandatory (T013, T017)
- `signInMagicLink` and `signOut` in T001 handle responses that may have no JSON body — use `response.text()` or no-body handling
- The `getAdminMe` function must let 403 propagate as `ApiError(403)` so `useAuth` can distinguish "not admin" from network errors
- `Alert.alert` (T018) works on both native and web in Expo
- Commit after each completed phase checkpoint
