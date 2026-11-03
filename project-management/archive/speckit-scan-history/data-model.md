# Data Model: Historique des Scans

**Branch**: `feat/scan-history` | **Date**: 2026-05-30

## Entités

### ScanHistoryEntry (Mobile — AsyncStorage local uniquement)

Interface TypeScript représentant une entrée dans l'historique persisté localement.

```typescript
interface ScanHistoryEntry {
  barcode: string;           // clé de déduplication — EAN-8 ou EAN-13
  productName: string;       // nom du produit (ex: "Nutella")
  brandName: string;         // nom de la marque (ex: "Ferrero")
  companyName: string;       // nom légal de l'entreprise (ex: "Ferrero France SAS")
  companySiren: string;      // SIREN à 9 chiffres — clé de navigation vers company/[id]
  productSource: 'OFF' | 'OBF'; // Open Food Facts ou Open Beauty Facts
  scannedAt: string;         // ISO 8601 — ex: "2026-05-30T14:22:00.000Z"
}
```

**Stockage** : `AsyncStorage` sous la clé `@b-spot/scan-history`

**Format** : `JSON.stringify(ScanHistoryEntry[])` — tableau, max 50 entrées, trié `scannedAt` décroissant.

**Invariants** :
- Un seul enregistrement par `barcode` (déduplication à l'insertion)
- Si `barcode` existe déjà → `scannedAt` mis à jour, entrée remontée en tête
- Si taille > 50 après insertion → entrées excédentaires en queue supprimées

---

### ScanHistoryItemDto (API — réponse scaffoldée, sans stockage DB en phase 1)

DTO de réponse de l'endpoint `GET /api/scan/history`.

```typescript
class ScanHistoryItemDto {
  barcode: string;
  productName: string;
  brandName: string;
  companyName: string;
  companySiren: string;
  productSource: 'OFF' | 'OBF';
  scannedAt: string; // ISO 8601
}

class ScanHistoryResponseDto {
  items: ScanHistoryItemDto[];
  total: number;
  limit: number;
  offset: number;
}
```

**Note** : En phase 1, l'endpoint retourne toujours `{ items: [], total: 0, limit, offset }`. La table de stockage serveur et le lien user_id seront ajoutés lors de l'implémentation de l'authentification.

---

## Flux de données

```
[Scan réussi]
    │
    ▼
useBarcodeScanner.handleBarcodeScan()
    │  result.company est défini
    ▼
useScanHistory.addEntry(entry: ScanHistoryEntry)
    │  1. Lit la liste courante depuis AsyncStorage
    │  2. Retire l'entrée existante avec même barcode (si présente)
    │  3. Insère la nouvelle entrée en tête
    │  4. Tronque à 50 entrées
    │  5. Écrit en AsyncStorage
    ▼
router.push('/company/[id]')

[Onglet Historique ouvert]
    │
    ▼
useScanHistory.entries
    │  1. Lit AsyncStorage au montage
    │  2. Retourne le tableau ScanHistoryEntry[] (newest-first)
    ▼
<ScanHistoryList> → <ScanHistoryItem> × N
    │  tap sur une entrée
    ▼
router.push('/company/[companySiren]', { params: { ... } })
```
