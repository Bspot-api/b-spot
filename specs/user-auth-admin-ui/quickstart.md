# Quickstart: User Authentication & Conditional Admin UI

**Feature**: `feat/user-auth-admin-ui`
**Branch**: `feat/user-auth-admin-ui`

---

## Prerequisites

- Database running: `pnpm db:up`
- Migrations applied: `cd apps/api && pnpm migration:up`
- API and mobile started: `pnpm dev`
- MailDev running (for magic link emails): `docker compose up maildev` or check `apps/api/.env` for `SMTP_*` config

---

## Testing the login flow

1. Open the mobile app (web: `http://localhost:8081`, or native via Expo Go)
2. Navigate to the profile/settings area → tap "Se connecter"
3. Enter your email and tap "Recevoir un lien de connexion"
4. The screen shows "Vérifiez votre boîte mail" — no redirect
5. Open MailDev at `http://localhost:1080` → open the magic link email → click the link
6. Return to the app (or reload the web tab) — the session is now active

---

## Testing admin detection

Admin status is seeded in development. Run `cd apps/api && pnpm seed` to create a seeded admin user (check `apps/api/src/seeders/admin.seed.ts` for the email).

1. Log in with the seeded admin email
2. The **Admin** tab should appear in the bottom navigation
3. Log in with any other email → Admin tab should not appear

---

## Testing brand suggestion moderation

1. Trigger a scan that creates a brand suggestion (scan a product with an unknown brand), or use the API directly:
   ```sh
   curl -X POST http://localhost:3001/api/brand-suggestions \
     -H "Content-Type: application/json" \
     -d '{"brandName":"TestBrand","barcode":"1234567890"}'
   ```
2. Log in as admin → open Admin tab → tap the "new" counter
3. The suggestion appears in the list → tap "Approuver" → status changes to `approved`

---

## Key files changed

| File | Change |
|------|--------|
| `apps/mobile/src/api/client.ts` | Add `credentials: 'include'`; new auth + admin API functions |
| `apps/mobile/src/api/types.ts` | Add `SessionDto`, `AdminProfileDto`, `BrandSuggestionListDto`, `UpdateSuggestionStatusDto` |
| `apps/mobile/src/api/hooks.ts` | Add `useAdminSuggestions`, `useUpdateSuggestionStatus` |
| `apps/mobile/src/features/auth/types.ts` | New: `Session`, `AdminProfile` types |
| `apps/mobile/src/features/auth/hooks/useAuth.ts` | New: central auth hook |
| `apps/mobile/app/login.tsx` | New: login screen |
| `apps/mobile/app/(tabs)/_layout.tsx` | Add conditional Admin tab |
| `apps/mobile/app/(tabs)/admin.tsx` | New: admin dashboard |
| `apps/mobile/app/admin/suggestions.tsx` | New: suggestion moderation screen |
| `apps/mobile/app/_layout.tsx` | Register new screens; 401 interception |
| `apps/api/src/modules/auth/admin.controller.ts` | Add GET + PATCH brand-suggestions endpoints |
| `apps/api/src/modules/auth/dto/admin.dto.ts` | Add `ListBrandSuggestionsQueryDto`, `UpdateBrandSuggestionStatusDto`, `BrandSuggestionListDto` |
| `apps/api/src/modules/brand-suggestion/brand-suggestion.service.ts` | Add `findByStatus()`, `updateStatus()` |

---

## Running tests

```sh
# API integration tests (mandatory — covers new admin endpoints)
cd apps/api && pnpm test

# Mobile (optional — hook tests if written)
cd apps/mobile && pnpm test
```
