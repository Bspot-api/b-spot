# Feature Specification: Historique des Scans

**Feature Branch**: `feat/scan-history`
**Created**: 2026-05-30
**Status**: Draft
**Input**: User description: "Historique des scans : afficher la liste des produits/entreprises déjà scannés par l'utilisateur dans l'onglet History de l'app mobile. Dans un premier temps sans authentification (stockage local device avec AsyncStorage persisté via TanStack Query), avec un endpoint GET /api/scan/history côté API pour une future sync. L'onglet affiche la date du scan, le nom du produit, la marque, et le nom de l'entreprise associée. On peut retapper sur un scan pour revenir à la fiche entreprise."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consulter son historique de scans (Priority: P1)

L'utilisateur ouvre l'onglet "Historique" et voit la liste de tous les produits qu'il a scannés avec succès (c'est-à-dire dont l'entreprise propriétaire a été identifiée). Chaque entrée affiche la date du scan, le nom du produit, la marque et le nom de l'entreprise associée.

**Why this priority**: C'est le cœur de la fonctionnalité — sans ça, l'onglet est un placeholder inutilisable. Les utilisateurs veulent retrouver rapidement un produit déjà scanné sans re-scanner.

**Independent Test**: Peut être testé en effectuant un scan réussi puis en naviguant vers l'onglet Historique. Valeur livrée : l'utilisateur retrouve ses scans passés.

**Acceptance Scenarios**:

1. **Given** l'utilisateur a effectué au moins un scan réussi, **When** il ouvre l'onglet Historique, **Then** il voit une liste ordonnée du plus récent au plus ancien, avec pour chaque entrée : date/heure, nom du produit, nom de la marque, et nom de l'entreprise.
2. **Given** l'utilisateur n'a jamais scanné de produit, **When** il ouvre l'onglet Historique, **Then** il voit un état vide avec un message d'invitation à scanner son premier produit.
3. **Given** l'historique contient des entrées, **When** l'utilisateur ferme et rouvre l'app, **Then** l'historique est toujours présent (persistance locale).

---

### User Story 2 - Naviguer vers la fiche entreprise depuis l'historique (Priority: P2)

L'utilisateur tape sur une entrée de l'historique et est redirigé vers la fiche détaillée de l'entreprise correspondante, exactement comme après un scan direct.

**Why this priority**: Sans navigation, l'historique est en lecture seule et perd sa principale utilité : permettre de retrouver et consulter l'info d'une entreprise sans rescanner.

**Independent Test**: Peut être testé indépendamment en ayant un historique avec des entrées et en vérifiant que chaque tap navigue bien vers la fiche entreprise attendue.

**Acceptance Scenarios**:

1. **Given** l'historique affiche une entrée pour "Nespresso → Nestlé", **When** l'utilisateur tape dessus, **Then** il est redirigé vers la fiche entreprise Nestlé.
2. **Given** l'utilisateur est sur la fiche entreprise issue de l'historique, **When** il appuie sur Retour, **Then** il revient à l'onglet Historique (pas à l'écran scanner).

---

### User Story 3 - Dédoublonnage des scans répétés (Priority: P3)

Quand l'utilisateur scanne un code-barres déjà présent dans son historique, l'entrée existante est mise à jour avec la nouvelle date plutôt que de créer un doublon.

**Why this priority**: Évite de polluer l'historique avec des doublons quand l'utilisateur rescanne régulièrement les mêmes produits (ex. courses hebdomadaires). Améliore la lisibilité de la liste.

**Independent Test**: Peut être testé en scannant deux fois le même produit et en vérifiant que l'historique ne contient qu'une seule entrée avec la date la plus récente, remontée en tête de liste.

**Acceptance Scenarios**:

1. **Given** un produit est déjà dans l'historique avec une date J-1, **When** l'utilisateur rescanne le même code-barres, **Then** l'entrée dans l'historique est mise à jour avec la nouvelle date et remontée en tête de liste.
2. **Given** deux produits différents sont scannés, **When** l'utilisateur consulte l'historique, **Then** deux entrées distinctes apparaissent.

---

### Edge Cases

- Que se passe-t-il si un scan aboutit à un produit identifié mais sans entreprise trouvée ? → L'entrée n'est **pas** ajoutée à l'historique (seuls les scans avec entreprise résolue sont conservés).
- Que se passe-t-il si le stockage local est plein ou corrompu ? → L'historique affiche un état vide sans planter l'app ; un nouveau scan repart de zéro.
- Que se passe-t-il si l'utilisateur a plus de 50 entrées ? → Les 50 entrées les plus récentes sont conservées, les plus anciennes sont supprimées automatiquement.
- Que se passe-t-il si les données d'une entreprise ont changé depuis le scan (nom, dirigeants) ? → La fiche entreprise affiche les données **actuelles** de l'API (pas les données snapshotées au moment du scan).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT enregistrer automatiquement chaque scan réussi (entreprise identifiée) dans l'historique local de l'appareil, au moment où l'utilisateur est redirigé vers la fiche entreprise.
- **FR-002**: L'historique DOIT persister entre les sessions (fermeture/réouverture de l'app).
- **FR-003**: L'historique DOIT être limité aux 50 entrées les plus récentes ; au-delà, les plus anciennes sont supprimées automatiquement.
- **FR-004**: Chaque entrée de l'historique DOIT contenir : date et heure du scan, nom du produit, nom de la marque, nom de l'entreprise, et une référence permettant la navigation vers la fiche entreprise.
- **FR-005**: L'onglet Historique DOIT afficher les entrées de la plus récente à la plus ancienne.
- **FR-006**: L'onglet Historique DOIT afficher un état vide explicite quand aucun scan n'a été effectué, avec un message invitant l'utilisateur à scanner son premier produit.
- **FR-007**: L'utilisateur DOIT pouvoir naviguer vers la fiche entreprise en tapant sur une entrée de l'historique.
- **FR-008**: Si le même code-barres est scanné plusieurs fois, l'entrée existante DOIT être mise à jour avec la nouvelle date et remontée en tête de liste (pas de doublon).
- **FR-009**: Les scans échoués (produit non trouvé ou entreprise non résolue) NE DOIVENT PAS apparaître dans l'historique.
- **FR-010**: L'API DOIT exposer un endpoint permettant de récupérer une liste paginée d'entrées d'historique, structuré pour une future intégration avec authentification. Cet endpoint n'est pas utilisé par le mobile dans cette phase.

### Key Entities

- **Entrée d'historique** : représente un scan réussi. Attributs : identifiant du code-barres, nom du produit, nom de la marque, nom de l'entreprise, identifiant de l'entreprise (pour la navigation), source du produit (Open Food Facts / Open Beauty Facts), date et heure du scan.
- **Historique local** : collection ordonnée (plus récent en premier) des entrées d'historique, stockée sur l'appareil. Maximum 50 entrées.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un utilisateur peut retrouver et rouvrir la fiche d'un produit scanné il y a plusieurs jours en moins de 5 secondes depuis l'onglet Historique.
- **SC-002**: L'historique survit à la fermeture complète et à la réouverture de l'app dans 100% des cas (hors désinstallation ou effacement du stockage de l'appareil).
- **SC-003**: L'onglet Historique se charge et affiche les données en moins d'une seconde, même avec 50 entrées.
- **SC-004**: Aucun doublon n'apparaît dans l'historique suite à plusieurs scans du même produit.
- **SC-005**: L'endpoint API d'historique est disponible et documenté dans le schéma OpenAPI, prêt pour l'intégration d'une future synchronisation multi-appareils.

## Assumptions

- Seuls les scans ayant abouti à une entreprise identifiée sont enregistrés dans l'historique.
- L'historique est strictement local (par appareil) dans cette phase — pas de compte utilisateur, pas de sync cross-device.
- La limite de 50 entrées est un choix pragmatique pour éviter la saturation du stockage local ; elle pourra être ajustée ultérieurement.
- La navigation depuis l'historique vers la fiche entreprise recharge les données fraîches depuis l'API (pas de snapshot des données entreprise au moment du scan).
- L'endpoint API `GET /api/scan/history` est scaffoldé pour la phase suivante (authentification) mais non connecté au mobile dans cette phase.
- Il n'y a pas de fonctionnalité de suppression manuelle d'entrées dans cette phase (scope MVP).
