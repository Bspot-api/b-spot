# Research: Historique des Scans

**Branch**: `feat/scan-history` | **Date**: 2026-05-30

## Decision 1: Stratégie de persistance locale

**Decision**: Hook custom `useScanHistory` avec lecture/écriture directe dans AsyncStorage.

**Rationale**: `@tanstack/query-async-storage-persister` (déjà installé) persiste l'intégralité du cache TanStack Query — pratique pour mettre le cache réseau hors ligne, mais inadapté pour gérer une liste ordonnée, dédoublonnée et limitée à 50 entrées. La logique métier (tri, déduplication, rotation à 50) doit vivre dans le hook, pas dans le cache de requêtes.

**Alternatives considered**:
- `persistQueryClient` + AsyncStorage persister : persiste l'ensemble du cache, ne supporte pas la déduplication ou la rotation par clé métier. Rejeté.
- Zustand + `zustand/middleware/persist` : viable mais ajoute une dépendance et un store supplémentaire pour une fonctionnalité simple. Rejeté (YAGNI).
- SQLite local (expo-sqlite) : overkill pour 50 entrées au format JSON. Rejeté.

**Chosen pattern**:
```
AsyncStorage key : '@b-spot/scan-history'
Format : JSON array de ScanHistoryEntry[], max 50, triées newest-first
```

---

## Decision 2: Point d'injection dans le flux de scan

**Decision**: Sauvegarder l'entrée dans `useBarcodeScanner.ts`, immédiatement après `result.company` est confirmé, avant `router.push`.

**Rationale**: C'est le seul endroit dans le code où on sait (1) que le scan a réussi, (2) qu'une entreprise a été résolue, et (3) qu'on a les données complètes (produit + entreprise). Injecter la sauvegarde ici garantit qu'une entrée n'est jamais créée si la navigation échoue ou si l'utilisateur abandonne.

**Alternatives considered**:
- Sauvegarder dans le composant `CompanyDetailScreen` au montage : risque de double-écriture si l'utilisateur revient à l'historique et retourne à la fiche. Rejeté.
- Middleware TanStack Query sur `useScanProduct` : accès aux données brutes de l'API mais pas aux données de l'entreprise formatées. Rejeté.

---

## Decision 3: Stratégie de l'endpoint API

**Decision**: `GET /api/scan/history` retourne `{ items: [], total: 0 }` dans cette phase (pas de stockage serveur, pas d'auth). L'endpoint est documenté dans le schéma OpenAPI.

**Rationale**: La spec FR-010 demande un endpoint scaffoldé pour préparer la sync future. Retourner une liste vide est correct : l'endpoint existe, le contrat est défini, l'intégration auth/DB viendra dans une phase ultérieure sans breaking change.

**Alternatives considered**:
- Ne pas créer l'endpoint du tout : non conforme à FR-010. Rejeté.
- Stocker les scans en base dès maintenant : implique une table supplémentaire, un lien user_id sans auth → complexité inutile en phase MVP. Rejeté.

**Query params prévus pour la future sync**:
- `limit` (default: 50, max: 100)
- `offset` (default: 0)

---

## Decision 4: Comportement hors ligne

**Decision**: L'historique est 100% offline-capable par nature (AsyncStorage). La navigation depuis l'historique vers la fiche entreprise fait un appel API frais — si offline, TanStack Query retourne le cache en mémoire ou affiche l'état d'erreur existant de `CompanyDetailScreen`.

**Rationale**: Conforme à la Constitution P3 (offline capability). Aucun effort supplémentaire requis : AsyncStorage persiste entre sessions, TanStack Query gère le cache réseau pour les fiches entreprise.

---

## Decision 5: Format de date affiché

**Decision**: Affichage relatif humanisé (aujourd'hui, hier, J J M, ou DD/MM/YYYY pour les dates > 7 jours), calculé au runtime sans dépendance externe (Date natif JS).

**Rationale**: Pas de bibliothèque date (pas de dayjs, pas de date-fns) pour rester léger. La logique est simple (< 1 jour, < 2 jours, sinon format court) et tient en moins de 20 lignes — conforme à la Constitution P5 (Simplicity).
