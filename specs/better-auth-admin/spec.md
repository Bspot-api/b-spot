# Feature Specification: Admin Authentication & Authorization

**Feature Branch**: `feat/better-auth-admin`
**Created**: 2026-05-30
**Status**: Implemented
**Input**: User description: "Authentification avec Better-Auth dans NestJS avec table admins dédiée et guard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin se connecte via magic link (Priority: P1)

Un administrateur reçoit un lien de connexion par email. En cliquant dessus, il est authentifié sans avoir à saisir de mot de passe. Sa session est maintenue entre les visites.

**Why this priority**: Sans authentification fonctionnelle, aucune route admin n'est accessible. C'est le prérequis absolu de toute la feature.

**Independent Test**: Peut être testé en envoyant un magic link à l'adresse admin et en vérifiant que la session est bien créée après le clic.

**Acceptance Scenarios**:

1. **Given** un utilisateur avec une adresse email admin enregistrée, **When** il demande un magic link, **Then** il reçoit un email contenant un lien de connexion à usage unique
2. **Given** un lien magic link valide, **When** l'utilisateur clique dessus, **Then** il est authentifié et une session active est créée
3. **Given** un lien magic link déjà utilisé ou expiré, **When** l'utilisateur tente de l'utiliser, **Then** il reçoit un message d'erreur explicite et aucune session n'est créée
4. **Given** une adresse email inconnue du système, **When** elle demande un magic link, **Then** aucun email n'est envoyé (pas de fuite d'information)

---

### User Story 2 - Routes admin protégées par le statut admin (Priority: P1)

Toute ressource marquée comme "admin-only" est inaccessible sans une session valide ET un statut admin confirmé. Avoir un compte utilisateur seul ne suffit pas.

**Why this priority**: La séparation utilisateur/admin est le cœur de la feature. Sans ça, les routes admin sont soit ouvertes à tous, soit inaccessibles à quiconque.

**Independent Test**: Peut être testé en appelant une route protégée avec (a) aucune session, (b) une session utilisateur non-admin, (c) une session admin valide.

**Acceptance Scenarios**:

1. **Given** aucune session active, **When** une route admin est appelée, **Then** la réponse est 401 Unauthorized
2. **Given** une session valide d'un utilisateur non-admin, **When** une route admin est appelée, **Then** la réponse est 403 Forbidden
3. **Given** une session valide d'un utilisateur présent dans le registre admin, **When** une route admin est appelée, **Then** la ressource est retournée normalement
4. **Given** un admin dont le statut a été révoqué, **When** il tente d'accéder à une route admin, **Then** la réponse est 403 même si sa session est encore active

---

### User Story 3 - Admin par défaut disponible dès l'installation (Priority: P2)

Au premier démarrage du système, un compte admin est déjà présent avec l'adresse `bspot.api@gmail.com`. L'équipe peut immédiatement se connecter via magic link sans setup manuel en base de données.

**Why this priority**: Permet d'amorcer le système sans intervention en base de données. Valeur immédiate au déploiement.

**Independent Test**: Après initialisation, demander un magic link pour l'adresse admin par défaut et vérifier qu'une session admin est accordée.

**Acceptance Scenarios**:

1. **Given** un système fraîchement initialisé, **When** un magic link est demandé pour l'adresse admin par défaut, **Then** l'email est envoyé et la connexion aboutit à une session admin
2. **Given** que le compte admin par défaut existe déjà, **When** l'initialisation est relancée, **Then** aucun doublon n'est créé

---

### User Story 4 - Gestion des admins (promotion / révocation) (Priority: P3)

Un admin existant peut promouvoir un utilisateur au rang d'admin ou révoquer ce statut, sans supprimer le compte utilisateur.

**Why this priority**: Nécessaire pour la gestion à plusieurs admins, mais non bloquant pour le lancement initial.

**Independent Test**: Peut être testé en promouvant un utilisateur, vérifiant son accès admin, puis révoquant et vérifiant que l'accès est refusé.

**Acceptance Scenarios**:

1. **Given** un utilisateur existant, **When** un admin le promeut, **Then** il apparaît dans le registre admin et accède aux routes protégées
2. **Given** un admin existant, **When** son statut est révoqué, **Then** il est retiré du registre admin et ses prochaines requêtes admin retournent 403
3. **Given** qu'un utilisateur n'existe pas encore, **When** on tente de le promouvoir admin, **Then** une erreur explicite est retournée

---

### Edge Cases

- Que se passe-t-il si l'email du magic link n'est pas délivré (provider SMTP indisponible) ? Le callback `sendMagicLink` doit logger l'erreur et propager une exception — l'API retourne 500 à l'appelant.
- Que se passe-t-il si le dernier admin révoque son propre accès ? Le système doit empêcher de se retrouver sans aucun admin (retourne 400).
- Un magic link déjà utilisé ou expiré retourne une erreur explicite de Better-Auth — aucune session n'est créée.
- Un magic link cliqué depuis un appareil différent de celui qui l'a demandé est-il valide ? Oui, c'est le comportement par défaut de Better-Auth.
- Que se passe-t-il si une session admin expire en cours d'utilisation d'une route protégée ? La prochaine requête doit retourner 401.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT permettre l'authentification par magic link (lien à usage unique envoyé par email) sans mot de passe
- **FR-002**: Le système DOIT maintenir une liste distincte d'administrateurs, séparée des utilisateurs ordinaires
- **FR-003**: L'appartenance à la liste admin DOIT être vérifiée à chaque requête sur une route protégée, indépendamment de la validité de la session
- **FR-004**: Toute route marquée "admin-only" DOIT retourner 401 en l'absence de session et 403 en cas de session sans statut admin
- **FR-005**: Le système DOIT créer un compte admin par défaut à l'initialisation si aucun admin n'existe déjà
- **FR-006**: Le système DOIT empêcher la révocation du dernier admin actif
- **FR-007**: La promotion et la révocation d'un admin DOIT être possible sans supprimer le compte utilisateur associé
- **FR-008**: Un magic link DOIT expirer après usage ou après 24 heures, selon ce qui arrive en premier
- **FR-009**: Le système NE DOIT PAS révéler si une adresse email est connue — la réponse à une demande de magic link est toujours HTTP 200 identique, qu'un email soit envoyé ou non (protection contre l'énumération)

### Key Entities

- **User**: Compte d'authentification (email, sessions actives). Un utilisateur peut exister sans être admin.
- **Admin**: Entrée dans le registre des administrateurs. Référence un User, contient la date de promotion. Supprimer une entrée Admin révoque le statut sans toucher au compte User.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un admin peut se connecter via magic link en moins de 60 secondes, hors délai de livraison email (mesuré entre l'appel API de demande et la création de session après clic)
- **SC-002**: 100% des routes admin retournent 401/403 en l'absence de session ou de statut admin valide
- **SC-003**: L'initialisation du système crée le compte admin par défaut sans intervention manuelle dans 100% des cas
- **SC-004**: La révocation d'un admin prend effet immédiatement sur les requêtes suivantes, sans délai de propagation
- **SC-005**: Le système empêche dans 100% des cas la révocation du dernier admin actif

## Assumptions

- L'authentification par mot de passe n'est pas souhaitée pour les admins : magic link uniquement.
- Les utilisateurs non-admin n'ont pas de mode de connexion dans le périmètre de cette feature (scope limité à l'admin).
- Un admin révoqué conserve son compte utilisateur et peut être re-promu sans recréer de compte.
- La durée de validité d'un magic link est de 24h.
- La durée de vie d'une session après authentification est gérée par Better-Auth (défaut : 7 jours, configurable via `BETTER_AUTH_SESSION_TTL`).
- L'envoi d'emails pour les magic links nécessite une configuration SMTP ou un provider email dans les variables d'environnement.
