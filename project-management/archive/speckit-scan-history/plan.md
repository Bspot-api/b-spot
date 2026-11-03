# Implementation Plan: Historique des Scans

**Branch**: `feat/scan-history` | **Date**: 2026-05-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/scan-history/spec.md`

## Summary

Implémenter l'onglet Historique de l'app mobile B-Spot : chaque scan réussi (entreprise résolue) est automatiquement sauvegardé localement dans AsyncStorage via un hook custom `useScanHistory`. L'historique est persisté entre sessions, dédoublonné par code-barres, limité à 50 entrées, et permet la navigation directe vers la fiche entreprise. Côté API, un endpoint `GET /api/scan/history` est scaffoldé (retourne une liste vide) pour préparer la future synchronisation authentifiée.

## Technical Context

**Language/Version**: TypeScript strict (strict: true, noImplicitAny, strictNullChecks)
**Primary Dependencies**:
- Mobile : Expo ~52.0, React Native, TanStack Query v5, Expo Router v6, NativeWind v4, `@react-native-async-storage/async-storage` ^2.1.0 (déjà installé)
- API : NestJS 10, MikroORM 6, class-validator, Swagger/OpenAPI
**Storage**: Mobile — AsyncStorage local (clé `@b-spot/scan-history`). API — aucun stockage DB en phase 1.
**Testing**: Jest + React Native Testing Library (mobile), Jest + Supertest (API)
**Target Platform**: iOS / Android (Expo), Docker (API)
**Project Type**: Mobile + API (monorepo pnpm, `apps/`)
**Performance Goals**: Chargement historique < 1s pour 50 entrées (lecture AsyncStorage synchrone en pratique)
**Constraints**: Offline-capable (AsyncStorage), max 50 entrées, zéro appel Pappers supplémentaire (données déjà fetchées au moment du scan)
**Scale/Scope**: MVP — usage mono-device, historique local uniquement

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Notes |
|----------|--------|-------|
| P1 Type Safety | ✅ | `ScanHistoryEntry` interface fully typed. DTOs API avec `@ApiProperty`. Types générés OpenAPI utilisés côté mobile. |
| P2 Resource Constraint | ✅ | Zéro appel Pappers supplémentaire. Les données entreprise sont déjà dans le résultat du scan. |
| P3 Mobile-First UX | ✅ | Offline-capable (AsyncStorage). État vide explicite. Touch targets ≥ 44pt. Loading state sur lecture AsyncStorage. |
| P4 Feature-Based Arch | ✅ | `apps/mobile/src/features/history/` (nouveau). Extension de `apps/api/src/modules/scan/` (existant). |
| P5 Simplicity | ✅ | Hook custom direct AsyncStorage, pas de Zustand store supplémentaire ni de persistQueryClient complexe. |
| P6 Test-Driven Quality | ✅ | Unit test `useScanHistory` (déduplication, rotation). Integration test `GET /api/scan/history`. |

**Résultat** : Aucune violation. Plan validé.

## Project Structure

### Documentation (this feature)

```text
specs/scan-history/
├── plan.md              ← ce fichier
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── scan-history.yaml
├── checklists/
│   └── requirements.md
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code

```text
# Mobile — nouveau feature module
apps/mobile/src/features/history/
├── components/
│   ├── ScanHistoryEmpty.tsx    # état vide avec CTA "Scanner ton premier produit"
│   ├── ScanHistoryItem.tsx     # une ligne : produit, marque, entreprise, date
│   └── ScanHistoryList.tsx     # FlatList + pull-to-refresh (no-op en local)
└── hooks/
    └── useScanHistory.ts       # lecture/écriture AsyncStorage + logique métier

# Mobile — fichiers modifiés
apps/mobile/src/features/scanner/hooks/useBarcodeScanner.ts   # injection addEntry
apps/mobile/app/(tabs)/history.tsx                            # remplace le placeholder

# API — extension du module scan existant
apps/api/src/modules/scan/
├── dto/
│   └── scan-history.dto.ts     # ScanHistoryItemDto + ScanHistoryResponseDto (nouveau)
├── scan.controller.ts           # ajouter GET /api/scan/history
└── scan.service.ts              # ajouter getHistory() → { items: [], total: 0 }

# Tests
apps/mobile/src/features/history/hooks/__tests__/useScanHistory.test.ts
apps/api/src/modules/scan/__tests__/scan.controller.history.spec.ts
```

**Structure Decision** : Option 3 (Mobile + API). Le feature module `history/` est créé ex nihilo côté mobile. Le module `scan/` existant côté API est étendu (pas de nouveau module — conforme P5 Simplicity et P4 Feature-Based Architecture : le scan history fait partie du domaine scan).

## Complexity Tracking

> Aucune violation constitutionnelle — section vide.
