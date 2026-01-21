# Feature Specification: Refonte B-Spot - Application Mobile de Scan Produits

**Feature Branch**: `refactor/mobile-app-rewrite`
**Created**: 2026-01-21
**Status**: Draft
**Input**: User description: "Refonte complète du projet B-Spot en application mobile de scan de produits type Yuka pour la transparence corporate. L'app permet de scanner un code-barres de produit et afficher l'entreprise propriétaire avec ses dirigeants et actionnaires principaux. Utilisation de l'API Pappers (plan gratuit 250 calls/mois) pour les données d'entreprise françaises, Open Food Facts et Open Beauty Facts pour le mapping produit→marque. Stack: Expo + NestJS + PostgreSQL. Déploiement Docker via Dokploy."

## User Scenarios & Testing

### User Story 1 - Scanner un produit et voir l'entreprise propriétaire (Priority: P1)

Un utilisateur ouvre l'application, scanne le code-barres d'un produit (ex: capsule Nespresso), et l'application affiche immédiatement l'entreprise mère (Nestlé SA) avec son nom, logo et un résumé des informations clés.

**Why this priority**: C'est la fonctionnalité cœur de l'application - sans elle, il n'y a pas de valeur utilisateur. C'est l'équivalent de scanner un produit sur Yuka et voir le Nutri-Score.

**Independent Test**: Peut être testé complètement en scannant n'importe quel code-barres référencé dans Open Food Facts et vérifiant que l'affichage de l'entreprise est correct et rapide (<3 secondes).

**Acceptance Scenarios**:

1. **Given** l'utilisateur a ouvert l'app, **When** il tape sur "Scanner un produit", **Then** la caméra s'active avec une interface de scan
2. **Given** la caméra est active, **When** un code-barres valide est détecté, **Then** l'app affiche le nom du produit et charge les infos entreprise
3. **Given** un produit Nespresso est scanné, **When** les données sont chargées, **Then** l'app affiche "Nestlé SA" comme entreprise mère avec logo
4. **Given** le produit n'est pas trouvé dans la base, **When** le scan est effectué, **Then** l'app affiche un message "Produit non référencé" avec option de contribution

---

### User Story 2 - Voir les dirigeants de l'entreprise (Priority: P1)

Après avoir scanné un produit, l'utilisateur peut consulter la liste des dirigeants de l'entreprise (CEO, membres du conseil d'administration, directeurs clés) avec leurs noms et fonctions.

**Why this priority**: C'est l'information clé qui différencie B-Spot d'une simple app de traçabilité produit - révéler qui sont les décideurs derrière les marques.

**Independent Test**: Scanner n'importe quel produit d'une grande entreprise (ex: Danone, L'Oréal) et vérifier que la liste des dirigeants est affichée avec au minimum le CEO et les principaux membres du board.

**Acceptance Scenarios**:

1. **Given** l'utilisateur est sur la page entreprise, **When** il scrolle vers la section "Dirigeants", **Then** il voit une liste de cartes avec nom + fonction
2. **Given** les données Pappers sont disponibles, **When** l'entreprise a un CEO, **Then** le CEO apparaît en premier avec badge "Directeur Général"
3. **Given** l'utilisateur tape sur une carte dirigeant, **When** plus d'infos sont disponibles, **Then** une modal affiche les détails (mandats, historique)

---

### User Story 3 - Voir les actionnaires principaux (Priority: P1)

L'utilisateur peut consulter qui détient l'entreprise : actionnaires majoritaires, fonds d'investissement, structure de capital, pourcentage de détention pour les actionnaires principaux.

**Why this priority**: Révéler la structure de propriété est essentiel pour la transparence corporate - savoir qui contrôle réellement les marques qu'on achète.

**Independent Test**: Scanner un produit d'une entreprise cotée (ex: LVMH) et vérifier que les actionnaires principaux sont listés avec leurs pourcentages de détention.

**Acceptance Scenarios**:

1. **Given** l'utilisateur est sur la page entreprise, **When** il accède à l'onglet "Actionnaires", **Then** il voit la liste des détenteurs de capital
2. **Given** l'entreprise a des actionnaires >5%, **When** les données Pappers sont chargées, **Then** chaque actionnaire apparaît avec son % de détention
3. **Given** l'actionnaire est une personne physique, **When** affiché, **Then** son nom et % sont visibles
4. **Given** l'actionnaire est un fonds, **When** l'utilisateur tape dessus, **Then** l'app affiche les infos du fonds (si disponibles)

---

### User Story 4 - Support cosmétiques via Open Beauty Facts (Priority: P2)

L'application peut scanner des produits cosmétiques et d'hygiène (shampoings, crèmes, maquillage) en interrogeant Open Beauty Facts en plus d'Open Food Facts.

**Why this priority**: Élargit le scope de l'app au-delà de l'alimentaire, couvrant un secteur majeur de consommation quotidienne.

**Independent Test**: Scanner un produit cosmétique (ex: shampoing L'Oréal) et vérifier que les infos produit + entreprise s'affichent correctement.

**Acceptance Scenarios**:

1. **Given** un produit cosmétique est scanné, **When** il n'est pas dans Open Food Facts, **Then** l'app interroge automatiquement Open Beauty Facts
2. **Given** le produit est trouvé dans Open Beauty Facts, **When** les données sont chargées, **Then** l'app affiche "Produit cosmétique" avec le mapping vers l'entreprise
3. **Given** le produit n'est ni dans OFF ni OBF, **When** le scan échoue, **Then** l'app propose à l'utilisateur de contribuer

---

### User Story 5 - Cache intelligent des données Pappers (Priority: P1 - technique)

Le système met en cache localement toutes les réponses de l'API Pappers pour ne pas dépasser la limite de 250 calls/mois, et rafraîchit uniquement les données obsolètes (>30 jours).

**Why this priority**: Technique mais critique - sans cache efficace, l'app sera inutilisable après 250 scans dans le mois. C'est une contrainte forte du plan gratuit Pappers.

**Independent Test**: Scanner le même produit 10 fois de suite et vérifier que l'API Pappers n'est appelée qu'une seule fois (monitoring des appels API côté backend).

**Acceptance Scenarios**:

1. **Given** une entreprise n'est pas en cache, **When** elle est demandée, **Then** l'API appelle Pappers et stocke la réponse en BDD
2. **Given** une entreprise est déjà en cache (<30 jours), **When** elle est redemandée, **Then** l'API retourne le cache sans appeler Pappers
3. **Given** le cache est vieux (>30 jours), **When** l'entreprise est demandée ET qu'on a du quota Pappers, **Then** l'API rafraîchit les données
4. **Given** le quota Pappers est épuisé (<10 calls restants), **When** une nouvelle entreprise est demandée, **Then** l'API retourne le cache ou une erreur gracieuse

---

### Edge Cases

- **Produit non référencé**: Le code-barres n'existe ni dans Open Food Facts ni dans Open Beauty Facts
- **Marque sans mapping**: Le produit est trouvé mais on ne peut pas le relier à une entreprise (marque locale, marque disparue)
- **Entreprise sans données Pappers**: La marque pointe vers une entreprise non-française ou absente de Pappers
- **Quota Pappers épuisé**: On a dépassé les 250 calls du mois, l'app doit continuer à fonctionner avec les données en cache
- **Scan hors-ligne**: L'utilisateur scanne un produit sans connexion internet (affichage des données en cache uniquement, nouveau scan impossible)
- **Code-barres invalide**: Le code scanné n'est pas un EAN-13/UPC valide
- **Caméra refusée**: L'utilisateur refuse la permission caméra
- **Données Pappers incomplètes**: L'entreprise existe dans Pappers mais n'a pas de dirigeants/actionnaires renseignés

## Requirements

### Functional Requirements

#### Scan & Identification Produit

- **FR-001**: L'app DOIT permettre de scanner un code-barres EAN-13 ou UPC via la caméra du smartphone
- **FR-002**: L'app DOIT interroger Open Food Facts pour les produits alimentaires
- **FR-003**: L'app DOIT interroger Open Beauty Facts pour les produits cosmétiques si non trouvé dans OFF
- **FR-004**: L'app DOIT afficher le nom du produit, sa catégorie et son image (si disponible) après scan
- **FR-005**: L'app DOIT permettre de saisir manuellement un code-barres si le scan échoue

#### Mapping Produit → Entreprise

- **FR-006**: Le système DOIT mapper chaque marque de produit vers une entreprise propriétaire
- **FR-007**: Le système DOIT maintenir une table de correspondance marque → SIREN d'entreprise pré-remplie par seed manuel (top marques françaises)
- **FR-008**: Le système DOIT gérer les cas où le mapping n'existe pas (marque inconnue) en affichant un message clair
- **FR-009**: Le système DOIT gérer les cas où le produit est trouvé mais l'entreprise n'est pas dans Pappers

#### Données Entreprise (Pappers)

- **FR-010**: Le système DOIT récupérer les informations d'entreprise via l'API Pappers (https://api.pappers.fr/v2/entreprise)
- **FR-011**: Le système DOIT afficher le nom légal de l'entreprise, son logo, son SIREN
- **FR-012**: Le système DOIT afficher la liste des dirigeants (nom, fonction, date de début mandat)
- **FR-013**: Le système DOIT afficher les actionnaires principaux avec leur % de détention
- **FR-014**: Le système DOIT afficher les filiales de l'entreprise (si disponibles)
- **FR-015**: Le système DOIT mettre en cache les réponses Pappers en base de données PostgreSQL

#### Cache & Rate Limiting

- **FR-016**: Le système DOIT limiter les appels à l'API Pappers à 250 par mois maximum
- **FR-017**: Le système DOIT tracker le nombre d'appels Pappers effectués dans le mois en cours
- **FR-018**: Le système DOIT servir les données depuis le cache si elles existent et sont récentes (<30 jours)
- **FR-019**: Le système DOIT rafraîchir le cache uniquement si les données sont obsolètes (>30 jours) ET qu'il reste du quota
- **FR-020**: L'app DOIT afficher un badge "Données au [DATE]" pour indiquer la fraîcheur du cache
- **FR-021**: Le système DOIT alerter l'admin par email (adresse configurée en variable d'environnement) quand le quota mensuel atteint 80% (200 calls)

#### Interface & Navigation

- **FR-022**: L'app DOIT avoir un écran d'accueil avec bouton "Scanner un produit"
- **FR-023**: L'app DOIT afficher l'interface de scan avec guidage visuel (cadre pour centrer le code-barres)
- **FR-024**: L'app DOIT afficher une page de résultats avec : produit + entreprise + dirigeants + actionnaires
- **FR-025**: L'app DOIT permettre de partager les informations d'une entreprise (via share sheet natif)

#### Gestion d'erreurs

- **FR-026**: L'app DOIT afficher un message clair si le produit n'est pas trouvé
- **FR-027**: L'app DOIT afficher un message clair si l'entreprise n'a pas de données Pappers
- **FR-028**: L'app DOIT fonctionner en mode dégradé si le quota Pappers est épuisé (afficher cache uniquement)
- **FR-029**: L'app DOIT gérer gracieusement le refus de permission caméra

### Key Entities

- **Product**: Représente un produit scannable avec son code-barres (EAN/UPC), nom, marque, catégorie, image, source (OFF/OBF)
- **Brand**: Représente une marque commerciale avec son nom et le mapping vers une entreprise (SIREN)
- **Company**: Représente une entreprise avec données Pappers : SIREN, nom légal, logo, date de création, dirigeants, actionnaires, filiales
- **Executive**: Représente un dirigeant d'entreprise : nom, fonction, date début mandat
- **Shareholder**: Représente un actionnaire : nom/raison sociale, pourcentage de détention, type (personne physique/morale)
- **PappersCache**: Représente une entrée de cache Pappers : SIREN, données JSON, timestamp dernière mise à jour

## Clarifications

### Session 2026-01-21

- Q: Authentication & comptes utilisateurs - L'app nécessite-t-elle des comptes utilisateurs ? → A: Pas d'authentification pour le MVP. L'authentification sera ajoutée plus tard comme feature à venir.
- Q: Capacité hors-ligne - Quelle partie de l'app fonctionne sans internet ? → A: Cache limité - Les données déjà consultées sont disponibles hors-ligne, les nouvelles requêtes nécessitent internet.
- Q: Initialisation du mapping Brand → SIREN - Comment pré-remplir et maintenir cette table ? → A: Seed manuel pour MVP avec marques courantes. Découverte automatique via Pappers et contribution communautaire reportées en post-MVP.
- Q: Alerting admin quota Pappers - Comment alerter l'admin quand le quota atteint 80% ? → A: Email simple vers adresse configurée en variable d'environnement.
- Q: Photos des dirigeants - D'où proviennent les photos des dirigeants ? → A: Pas de photos pour le MVP. Photos hors scope.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Un utilisateur peut scanner un produit et voir l'entreprise propriétaire en moins de 3 secondes (95% des cas)
- **SC-002**: Le système maintient un taux de cache hit >90% pour les requêtes Pappers (éviter de saturer le quota)
- **SC-003**: L'app couvre au minimum 80% des produits alimentaires français disponibles via Open Food Facts
- **SC-004**: Chaque page entreprise affiche au minimum le nom de l'entreprise, le CEO, et 3 actionnaires principaux (si disponibles dans Pappers)
- **SC-005**: Le quota mensuel Pappers (250 calls) permet de supporter au minimum 500 scans uniques par mois (grâce au cache)
- **SC-006**: 90% des utilisateurs réussissent à scanner un produit du premier coup (UX du scan)
- **SC-007**: L'app fonctionne sans crash même quand le quota Pappers est épuisé (mode dégradé avec cache uniquement)
