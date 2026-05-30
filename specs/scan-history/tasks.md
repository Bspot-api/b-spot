# Tasks: Historique des Scans

**Input**: Design documents from `/specs/scan-history/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tâches regroupées par user story pour permettre une implémentation et une validation indépendantes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Peut tourner en parallèle (fichiers différents, pas de dépendance bloquante)
- **[Story]**: User story concernée (US1, US2, US3)
- Chemins absolus depuis la racine du monorepo

---

## Phase 1: Setup (Infrastructure partagée)

**Purpose**: Créer la structure de fichiers et scaffolding API avant tout travail mobile.

- [ ] T001 Créer la structure de répertoires `apps/mobile/src/features/history/` avec sous-dossiers `hooks/` et `components/`
- [ ] T002 [P] Créer `apps/api/src/modules/scan/dto/scan-history.dto.ts` avec les classes `ScanHistoryItemDto` et `ScanHistoryResponseDto` (décorateurs `@ApiProperty`, champs : barcode, productName, brandName, companyName, companySiren, productSource enum OFF|OBF, scannedAt ISO string)
- [ ] T003 [P] Ajouter la méthode stub `getHistory(limit: number, offset: number): ScanHistoryResponseDto` dans `apps/api/src/modules/scan/scan.service.ts` — retourne `{ items: [], total: 0, limit, offset }`

---

## Phase 2: Foundational (Prérequis bloquants)

**Purpose**: API endpoint opérationnel + types OpenAPI régénérés + type local défini — bloque tout le travail mobile.

**⚠️ CRITICAL**: Aucune tâche US ne peut commencer avant la fin de cette phase.

- [x] T004 Ajouter l'endpoint `GET /api/scan/history` dans `apps/api/src/modules/scan/scan.controller.ts` avec paramètres de requête `limit` (default 50, max 100) et `offset` (default 0), réponse `ScanHistoryResponseDto` — appelle `scanService.getHistory(limit, offset)` (dépend de T002 + T003)
- [x] T005 [P] Écrire un test d'intégration pour `GET /api/scan/history` dans `apps/api/src/modules/scan/__tests__/scan.controller.history.spec.ts` — vérifier 200 OK + corps `{ items: [], total: 0, limit: 50, offset: 0 }` (peut s'écrire en parallèle de T004, s'exécute après)
- [ ] T006 Régénérer les types OpenAPI côté mobile avec `pnpm generate:types` depuis la racine (dépend de T004) ⚠️ À exécuter manuellement quand le serveur API tourne (`pnpm db:up && pnpm dev:api` puis `pnpm generate:types`) — non bloquant pour cette phase car le mobile n'appelle pas cet endpoint
- [x] T007 [P] Définir l'interface TypeScript `ScanHistoryEntry` dans `apps/mobile/src/features/history/types.ts` — champs : barcode, productName, brandName, companyName, companySiren, productSource `'OFF' | 'OBF'`, scannedAt string ISO 8601

**Checkpoint**: API disponible, types régénérés, interface mobile définie — le travail sur les user stories peut commencer.

---

## Phase 3: User Story 1 — Consulter son historique de scans (Priority: P1) 🎯 MVP

**Goal**: L'utilisateur voit sa liste de scans passés dans l'onglet Historique, persistée entre sessions.

**Independent Test**: Effectuer un scan réussi → ouvrir l'onglet Historique → vérifier que le produit apparaît avec date, marque, entreprise → fermer et rouvrir l'app → vérifier que l'entrée est toujours là.

### Implementation

- [ ] T008 [US1] Implémenter le hook `useScanHistory` dans `apps/mobile/src/features/history/hooks/useScanHistory.ts` — lecture initiale depuis AsyncStorage (clé `@b-spot/scan-history`), fonction `addEntry(entry: ScanHistoryEntry)` avec déduplication par barcode (met à jour scannedAt si barcode existant, sinon insère en tête) et rotation automatique à 50 entrées max, export de `entries: ScanHistoryEntry[]` et `addEntry` (dépend de T007)
- [ ] T009 [US1] Injecter `useScanHistory.addEntry` dans `apps/mobile/src/features/scanner/hooks/useBarcodeScanner.ts` — appeler `addEntry` avec les données produit et entreprise immédiatement après que `result.company` est confirmé, avant `router.push` (dépend de T008)
- [ ] T010 [P] [US1] Créer le composant `ScanHistoryEmpty` dans `apps/mobile/src/features/history/components/ScanHistoryEmpty.tsx` — affiche icône, message "Aucun scan pour l'instant" et CTA "Scanner ton premier produit" (bouton désactivé, rôle informatif uniquement)
- [ ] T011 [P] [US1] Créer le composant `ScanHistoryItem` dans `apps/mobile/src/features/history/components/ScanHistoryItem.tsx` — affiche nom produit, marque, nom entreprise, date formatée (today/yesterday/DD MMM/DD/MM/YYYY), reçoit une prop `onPress?: (entry: ScanHistoryEntry) => void` (prête pour US2, inactive ici)
- [ ] T012 [US1] Créer le composant `ScanHistoryList` dans `apps/mobile/src/features/history/components/ScanHistoryList.tsx` — FlatList sur `entries`, reçoit une prop `onItemPress?: (entry: ScanHistoryEntry) => void` qu'elle passe à chaque `ScanHistoryItem`, séparateur entre items (dépend de T010 + T011)
- [ ] T013 [US1] Remplacer le placeholder dans `apps/mobile/app/(tabs)/history.tsx` — appeler `useScanHistory`, rendre `<ScanHistoryList>` si `entries.length > 0`, sinon `<ScanHistoryEmpty>`, ajouter un état de chargement (ActivityIndicator) pendant la lecture AsyncStorage (dépend de T008 + T012)

**Checkpoint**: Scan → l'entrée apparaît dans l'onglet Historique, persistée entre sessions. US1 est livrable seul.

---

## Phase 4: User Story 2 — Navigation vers la fiche entreprise (Priority: P2)

**Goal**: Taper sur une entrée de l'historique navigue vers la fiche entreprise correspondante.

**Independent Test**: Depuis l'onglet Historique, taper sur une entrée → la fiche entreprise s'ouvre avec les bonnes données → appuyer Retour → revenir à l'onglet Historique (pas au scanner).

### Implementation

- [ ] T014 [US2] Activer la prop `onPress` dans `apps/mobile/src/features/history/components/ScanHistoryItem.tsx` — wrapper le contenu dans un `Pressable`, appeler `onPress(entry)` au tap, `activeOpacity` cohérent avec le design existant
- [ ] T015 [US2] Implémenter le handler de navigation dans `apps/mobile/app/(tabs)/history.tsx` — créer `handleItemPress(entry: ScanHistoryEntry)` qui appelle `router.push({ pathname: '/company/[id]', params: { id: entry.companySiren, productSource: entry.productSource } })`, passer ce handler à `<ScanHistoryList onItemPress={handleItemPress} />`

**Checkpoint**: Tap sur entrée → fiche entreprise ouverte. Retour → retour à l'historique. US2 livrable indépendamment.

---

## Phase 5: User Story 3 — Dédoublonnage des scans répétés (Priority: P3)

**Goal**: Rescanner le même produit ne crée pas de doublon — l'entrée existante est mise à jour et remontée en tête.

**Independent Test**: Scanner le même code-barres deux fois → vérifier dans l'onglet Historique qu'il n'y a qu'une seule entrée avec la date du deuxième scan en tête de liste.

*Note : La logique de déduplication est déjà implémentée en T008. Cette phase valide ce comportement via un test unitaire automatisé.*

### Implementation

- [ ] T016 [P] [US3] Écrire les tests unitaires pour `useScanHistory` dans `apps/mobile/src/features/history/hooks/__tests__/useScanHistory.test.ts` — couvrir : (a) addEntry crée une entrée, (b) rescan même barcode met à jour scannedAt et remonte en tête, (c) max 50 entrées — la 51e pousse la dernière hors de la liste, (d) persistance : mock AsyncStorage, vérifier getItem/setItem appelés correctement

**Checkpoint**: Tests verts. Comportement de déduplication et rotation validé automatiquement.

---

## Phase 6: Polish & Vérifications transversales

**Purpose**: Vérifications Constitution + qualité avant merge.

- [ ] T017 [P] Vérifier que tous les nouveaux fichiers TypeScript passent `pnpm lint` sans erreurs (strict mode, no `any`, no implicit returns)
- [ ] T018 Valider manuellement le quickstart.md dans `specs/scan-history/quickstart.md` — exécuter les 5 étapes de test manuel et confirmer que tous les scénarios passent

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Pas de dépendance — peut démarrer immédiatement
- **Phase 2 (Foundational)**: Dépend de Phase 1 — **bloque toutes les user stories**
- **Phase 3 (US1)**: Dépend de Phase 2 — MVP livrable seul
- **Phase 4 (US2)**: Dépend de Phase 3 (US1 doit être complet et fonctionnel)
- **Phase 5 (US3)**: Dépend de Phase 3 (T008 doit exister pour pouvoir tester)
- **Phase 6 (Polish)**: Dépend de toutes les phases précédentes

### User Story Dependencies

- **US1 (P1)**: Après Phase 2 — indépendant
- **US2 (P2)**: Après US1 (navigation s'appuie sur la liste existante)
- **US3 (P3)**: Après US1 (T008 implémente déjà la dédup, US3 valide uniquement)

### Within Each User Story

- T008 → T009 (hook avant injection)
- T010 et T011 peuvent tourner en parallèle → T012 dépend des deux
- T012 → T013

### Parallel Opportunities

- T002 et T003 (Phase 1) : en parallèle
- T005 et T007 (Phase 2) : en parallèle entre eux (T005 attend T004 pour s'exécuter, T007 est indépendant)
- T010 et T011 (Phase 3) : en parallèle
- T016 et T017 (Phases 5/6) : en parallèle

---

## Parallel Example: User Story 1

```bash
# Lancer en parallèle (fichiers indépendants) :
Task T010: "Create ScanHistoryEmpty in apps/mobile/src/features/history/components/ScanHistoryEmpty.tsx"
Task T011: "Create ScanHistoryItem in apps/mobile/src/features/history/components/ScanHistoryItem.tsx"

# Puis séquentiellement :
Task T012: "Create ScanHistoryList (depends on T010 + T011)"
Task T013: "Update history.tsx screen (depends on T008 + T012)"
```

---

## Implementation Strategy

### MVP First (User Story 1 seulement)

1. Compléter Phase 1 (Setup)
2. Compléter Phase 2 (Foundational — critique)
3. Compléter Phase 3 (US1)
4. **STOP et VALIDER** : tester US1 manuellement (scan → historique → persistance)
5. Merger si satisfaisant — valeur utilisateur délivrée

### Livraison incrémentale

1. Setup + Foundational → base prête
2. US1 → historique visible → **MVP** (déployable)
3. US2 → navigation depuis l'historique → **full feature**
4. US3 → tests de déduplication → **qualité validée**
5. Chaque story ajoute de la valeur sans casser les précédentes

---

## Notes

- `[P]` = tâches sur des fichiers différents sans dépendances bloquantes
- `[USN]` trace chaque tâche à sa user story dans la spec
- La déduplication est implémentée en T008 (US1) car elle est intrinsèque au comportement de base du hook — US3 se concentre sur la validation par tests
- Aucun appel Pappers supplémentaire (Constitution P2 ✅) — les données entreprise viennent du résultat du scan déjà effectué
