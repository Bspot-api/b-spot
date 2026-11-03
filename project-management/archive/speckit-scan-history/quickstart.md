# Quickstart: Historique des Scans

**Branch**: `feat/scan-history`

## Ce que tu vas construire

1. Un hook `useScanHistory` qui lit/écrit dans AsyncStorage
2. L'injection de la sauvegarde dans `useBarcodeScanner` après un scan réussi
3. L'onglet `history.tsx` branché sur `useScanHistory`
4. Deux composants : `ScanHistoryList` et `ScanHistoryItem`
5. Un endpoint `GET /api/scan/history` scaffoldé dans le module `scan`

## Prérequis

```bash
pnpm db:up
cd apps/api && pnpm migration:up
pnpm dev  # lance API + mobile en parallèle
```

## Ordre d'implémentation recommandé

### 1. Hook `useScanHistory` (mobile)

Fichier : `apps/mobile/src/features/history/hooks/useScanHistory.ts`

- Lire depuis AsyncStorage à l'init
- `addEntry(entry)` : déduplique par barcode, insère en tête, tronque à 50, écrit
- Exporte `entries: ScanHistoryEntry[]` et `addEntry`

### 2. Injection dans `useBarcodeScanner`

Fichier : `apps/mobile/src/features/scanner/hooks/useBarcodeScanner.ts`

- Importer `useScanHistory`
- Après `result.company` confirmé, appeler `addEntry(...)` avant `router.push`

### 3. Composants UI (mobile)

```
apps/mobile/src/features/history/components/
├── ScanHistoryEmpty.tsx   # état vide
├── ScanHistoryItem.tsx    # une ligne d'historique
└── ScanHistoryList.tsx    # FlatList wrappée
```

### 4. Screen `history.tsx`

Fichier : `apps/mobile/app/(tabs)/history.tsx`

- Utiliser `useScanHistory`
- Rendre `<ScanHistoryList>` ou `<ScanHistoryEmpty>`
- Navigation vers `/company/[companySiren]` au tap

### 5. API endpoint (backend)

Fichiers :
- `apps/api/src/modules/scan/dto/scan-history.dto.ts` (nouveau)
- `apps/api/src/modules/scan/scan.controller.ts` (ajouter `GET /history`)
- `apps/api/src/modules/scan/scan.service.ts` (ajouter `getHistory()`)

### 6. Regénérer les types OpenAPI

```bash
pnpm generate:types
```

## Tester manuellement

1. Scanne un produit → vérifie qu'il apparaît dans l'onglet Historique
2. Rescanne le même produit → vérifie qu'il n'y a pas de doublon, date mise à jour
3. Ferme et rouvre l'app → vérifie que l'historique est toujours là
4. Tape sur une entrée → vérifie la navigation vers la fiche entreprise
5. Appuie Retour → vérifie le retour à l'onglet Historique (pas au scanner)

## Tests automatisés à écrire

- `useScanHistory.test.ts` : déduplication, rotation à 50, persistance
- `scan.controller.spec.ts` : vérifier que `GET /api/scan/history` retourne 200 + `{ items: [], total: 0 }`
