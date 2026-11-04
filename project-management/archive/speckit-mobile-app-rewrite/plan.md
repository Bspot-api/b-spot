# Implementation Plan: Refonte B-Spot — Application Mobile + Web Front-End

**Branch**: `refactor/mobile-app-rewrite` | **Date**: 2026-02-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/mobile-app-rewrite/spec.md`

## Summary

B-Spot est une app mobile (similaire à Yuka) permettant de scanner un code-barres produit et d'afficher l'entreprise propriétaire avec ses dirigeants et actionnaires. Le backend NestJS + PostgreSQL interroge Open Food Facts pour identifier le produit, mappe la marque vers un SIREN via une table de seed, et récupère les données d'entreprise via l'API Pappers (cache-first pour respecter la limite de 250 appels/mois).

**Phases 0-5 complètes** (infrastructure, backend, mobile scanner). La prochaine étape est le **web front-end** via Expo web mode : même code React Native compilé pour le navigateur, avec formulaire de recherche à la place du scanner caméra.

## Technical Context

**Language/Version**: TypeScript strict (`strict: true`, `noImplicitAny`, `strictNullChecks`)
**Primary Dependencies**: Expo ~52.0 (Metro bundler), NestJS 10, MikroORM 6, NativeWind 4, TanStack Query 5, Expo Router 6
**Storage**: PostgreSQL 15 (MikroORM) côté API ; TanStack Query + AsyncStorage côté mobile
**Testing**: Jest + Supertest (API, obligatoire) ; Jest + React Native Testing Library (mobile, optionnel)
**Target Platform**: iOS/Android (Expo) + Web navigateur (Expo web mode)
**Project Type**: Monorepo mobile + API (apps/api + apps/mobile)
**Performance Goals**: Scan → company < 3s (95th percentile) ; Cache hit Pappers > 90%
**Constraints**: 250 Pappers API calls/month (cache-first obligatoire) ; fichiers < 300 lignes ; fonctions < 30 lignes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Justification |
| --- | --- | --- |
| **P1 - Type Safety** | ✅ Pass | TypeScript strict sur toutes les apps, types générés depuis OpenAPI pour le mobile |
| **P2 - Resource Constraint** | ✅ Pass | Cache-first implémenté, quota tracker, alerte email à 200 calls |
| **P3 - Mobile-First** | ⚠️ Déviation justifiée (web) | Le web est hors scope par défaut. Exception : demande explicite de l'utilisateur. Fichiers natifs inchangés — variantes `.web.tsx` isolées |
| **P4 - Feature-Based Architecture** | ✅ Pass | `apps/api/src/modules/{feature}/` et `apps/mobile/src/features/{feature}/` respectés |
| **P5 - Simplicity** | ✅ Pass | Mécanisme `.web.tsx` natif Metro, aucune nouvelle abstraction, réutilisation des hooks existants |
| **P6 - Test-Driven Quality** | ✅ Pass | Tests obligatoires sur modules API core (41 unit + 5 e2e au checkpoint Phase 5) |

## Project Structure

### Documentation (this feature)

```text
specs/mobile-app-rewrite/
├── plan.md              # Ce fichier
├── spec.md              # Spécification fonctionnelle
├── research.md          # Phase 0 — APIs, librairies, décisions techniques
├── tasks.md             # Liste des tâches (Phases 0-11 + Phase 12 web)
├── backlog.md           # Fonctionnalités post-MVP
└── CHANGELOG.md         # Historique des modifications spec
```

### Source Code

```text
apps/api/src/
├── modules/
│   ├── cache/           # PappersCache + ApiUsageLog + EmailService (Phase 2 ✅)
│   ├── product/         # ProductEntity + ProductService + GET /api/products/:barcode (Phase 3 ✅)
│   ├── brand/           # BrandEntity + BrandService (Phase 4 ✅)
│   ├── company/         # CompanyEntity + PappersService + GET /api/companies/:siren (Phase 3 ✅)
│   └── scan/            # ScanService + POST /api/scan (Phase 4 ✅)
├── migrations/          # MikroORM migrations
└── seeders/             # Brand seed data (50+ marques françaises)

apps/mobile/
├── app/
│   ├── _layout.tsx                # Root layout (Stack + QueryClient + Toast)
│   ├── (tabs)/
│   │   ├── _layout.tsx            # Tabs navigation (scanner + history)
│   │   ├── index.tsx              # Scanner caméra (natif iOS/Android)
│   │   └── index.web.tsx          # ← CRÉER : formulaire recherche web (Phase 12)
│   ├── company/
│   │   └── [id].tsx               # Company detail (modifier Phase 12 : Share.share() guard)
│   └── brand-suggestion/
│       └── new.tsx                # Formulaire suggestion marque
└── src/
    ├── api/
    │   ├── client.ts              # Fetch client (web-safe ✅)
    │   ├── hooks.ts               # TanStack Query hooks (web-safe ✅)
    │   └── types.ts               # TypeScript types
    ├── features/
    │   ├── scanner/
    │   │   ├── components/
    │   │   │   ├── BarcodeScanner.tsx     # Caméra (natif uniquement)
    │   │   │   └── ScanOverlay.tsx        # UI overlay scan
    │   │   └── hooks/
    │   │       └── useBarcodeScanner.ts   # Logique scan (web-safe ✅ — réutilisable)
    │   └── company/
    │       ├── components/
    │       │   ├── CompanyHeader.tsx      # Header (web-safe ✅)
    │       │   ├── ExecutivesList.tsx     # Liste dirigeants (web-safe ✅)
    │       │   └── ShareholdersList.tsx   # Liste actionnaires (web-safe ✅)
    │       └── hooks/
    │           └── useCompanyData.ts      # Données entreprise (web-safe ✅)
    └── components/
        └── reacticx/Toast/
            ├── Toast.tsx                  # Toast animé natif (react-native-reanimated + worklets)
            ├── Toast.web.tsx              # ← CRÉER Phase 12 : Toast simplifié sans worklets
            ├── ToastViewPort.tsx          # Viewport (useSafeAreaInsets retourne 0 sur web ✅)
            ├── index.tsx                  # Exports + Toast.show() imperative API
            ├── Toast.types.ts             # Types partagés
            ├── context/ToastContext.tsx   # Context React (web-safe ✅)
            └── hooks/useToast.ts          # Hook toast (web-safe ✅)
```

**Structure Decision**: Monorepo Option 3 (Mobile + API). Web mode via Expo Metro bundler — les fichiers `.web.tsx` sont automatiquement résolus à la place des `.tsx` lors du build web, sans modifier les imports existants.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| P3 déviation (web support) | Demande explicite utilisateur — valeur métier pour accès desktop | App mobile seule : rejetée, l'utilisateur veut un front web |

## How Expo Web Mode Works

Metro bundler résout automatiquement les variantes platform-specific à l'import :

```text
Toast.web.tsx        ← utilisé sur web  (pnpm web)
Toast.tsx            ← utilisé sur iOS/Android  (pnpm ios / pnpm android)
```

Aucune modification des imports n'est nécessaire. Les fichiers `.web.tsx` prennent la priorité sur `.tsx` lors du build web.

### Compatibilité web des fichiers existants

| Fichier | Compatibilité |
| --- | --- |
| `src/api/client.ts` | ✅ fetch standard |
| `src/api/hooks.ts` | ✅ TanStack Query cross-platform |
| `src/features/scanner/hooks/useBarcodeScanner.ts` | ✅ logique pure, pas de caméra |
| `src/features/company/components/*.tsx` | ✅ View/Text → div/span via react-native-web |
| `src/components/reacticx/Toast/ToastViewPort.tsx` | ✅ useSafeAreaInsets retourne {0,0,0,0} sur web |
| `app/company/[id].tsx` | ⚠️ OK sauf `Share.share()` — à corriger Phase 12 |

### Fichiers nécessitant une variante `.web.tsx`

| Fichier natif | Problème web | Solution |
| --- | --- | --- |
| `app/(tabs)/index.tsx` | `expo-camera` crash sur web | `index.web.tsx` avec TextInput formulaire |
| `src/components/reacticx/Toast/Toast.tsx` | `react-native-worklets` incompatible web | `Toast.web.tsx` sans worklets, Animated RN standard |

## Implementation Phases Summary

### Phases 0-5 : Complètes ✅

- **Phase 0** — Research & Discovery (R001-R007)
- **Phase 1** — Setup & Infrastructure (T001-T011)
- **Phase 2** — Backend Cache & Rate Limiting (T012-T020)
- **Phase 3** — Backend Data Layer (T021-T035)
- **Phase 4** — Backend Scan Endpoint & E2E (T036-T042)
- **Phase 5** — Mobile Scanner Screen (T043-T048)

### Phases 6-11 : En cours (voir tasks.md)

- **Phase 6** — Mobile Company Detail
- **Phase 7** — Offline Support
- **Phase 8** — Open Beauty Facts (P2)
  - Politique fallback: OFF d'abord, puis OBF uniquement si OFF retourne "produit introuvable" (pas de fallback OBF sur erreur technique OFF).
- **Phase 9** — Error Handling
- **Phase 10** — Testing & Validation
- **Phase 11** — Deployment

### Phase 12 : Web Front-End — 7 tâches (T087-T093)

Voir `tasks.md` Phase 12.

## Verification

```bash
# Démarrer l'environnement
pnpm db:up
cd apps/api && pnpm migration:up && cd ../..
pnpm dev:api

# Lancer le web
cd apps/mobile && pnpm web
# → Ouvre http://localhost:8081

# Tests E2E web
# 1. / → formulaire de saisie code-barres visible
# 2. Saisir 3017620422003 (Nutella) → navigate /company/{SIREN}
# 3. http://localhost:8081/company/552108011 → Nestlé affiché
# 4. Bouton partage → lien copié + toast de confirmation
# 5. pnpm ios → scanner caméra natif inchangé (non-regression)
```
