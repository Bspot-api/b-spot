# Tasks: Admin Authentication & Authorization

**Input**: Design documents from `/specs/better-auth-admin/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tâches regroupées par user story pour permettre une implémentation et une validation indépendantes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Peut tourner en parallèle (fichiers différents, pas de dépendance bloquante)
- **[Story]**: User story concernée (US1, US2, US3, US4)
- Chemins depuis la racine du monorepo (`apps/api/...`)

---

## Phase 1: Setup (Infrastructure partagée)

**Purpose**: Dépendances, variables d'environnement et scaffolding du module auth.

- [x] T001 Installer `better-auth` dans l'API avec `pnpm --filter api add better-auth`
- [x] T002 [P] Ajouter `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` et `SMTP_FROM` dans `apps/api/.env.example`
- [x] T003 [P] Créer la structure du module `apps/api/src/modules/auth/` avec sous-dossier `__tests__/`

---

## Phase 2: Foundational (Prérequis bloquants)

**Purpose**: Entités, migrations, factory Better-Auth, service email magic link — bloque toutes les user stories.

**⚠️ CRITICAL**: Aucune tâche US ne peut commencer avant la fin de cette phase.

- [ ] T004 [P] Créer les entités miroir Better-Auth (`User`, `Session`, `Account`, `Verification`) dans `apps/api/src/modules/auth/auth.entity.ts` — `@Entity({ tableName: 'user' })`, PK uuid `gen_random_uuid()`, relations `@ManyToOne` conformes à `data-model.md`
- [ ] T005 [P] Créer l'entité `Admin` dans `apps/api/src/modules/auth/admin.entity.ts` — `@Entity({ tableName: 'admins' })`, `@ManyToOne(() => User, { fieldName: 'userId', unique: true })`, `createdAt`
- [ ] T006 Enregistrer les 5 entités auth dans `apps/api/mikro-orm.config.ts` (dépend de T004 + T005)
- [ ] T007 Créer la migration `apps/api/src/migrations/Migration20260530000000_add_auth_tables.ts` — SQL des 4 tables Better-Auth (via `npx @better-auth/cli generate`) + table `admins` avec FK `userId → user.id`
- [ ] T008 [P] Créer la factory `createBetterAuth()` dans `apps/api/src/modules/auth/auth.config.ts` — `new Pool({ connectionString })`, plugin `magicLink({ expiresIn: 86400, disableSignUp: true })`, sans callback `sendMagicLink` (branché en US1)
- [ ] T009 [P] Ajouter la méthode `sendMagicLink({ to, url })` dans `apps/api/src/modules/cache/email.service.ts` — utilise le transport nodemailer existant avec `SMTP_FROM`
- [ ] T010 Créer `AuthService` dans `apps/api/src/modules/auth/auth.service.ts` — lazy init via `onModuleInit()`, expose `auth` et `api` (dépend de T008)
- [ ] T011 Créer `AuthModule` dans `apps/api/src/modules/auth/auth.module.ts` — importe `MikroOrmModule.forFeature([User, Session, Account, Verification, Admin])`, exporte `AuthService` (middleware ajouté en US1)
- [ ] T012 Importer `AuthModule` dans `apps/api/src/app.module.ts` (dépend de T011)
- [ ] T013 [P] Créer `AdminService` stub dans `apps/api/src/modules/auth/admin.service.ts` — méthode `findByUserId(userId: string)` et `isAdminByEmail(email: string)` pour le callback magic link (dépend de T005)

**Checkpoint**: Schéma DB prêt, factory Better-Auth instanciable, module auth enregistré — le travail sur les user stories peut commencer.

---

## Phase 3: User Story 1 — Admin se connecte via magic link (Priority: P1) 🎯 MVP

**Goal**: Un admin reçoit un magic link par email, clique dessus, obtient une session persistante. Emails inconnus ou non-admin restent silencieux.

**Independent Test**: `POST /api/auth/sign-in/magic-link` avec `bspot.api@gmail.com` → email reçu → clic sur le lien → `GET /api/auth/get-session` retourne une session active. Email inconnu → 200 sans envoi.

### Implementation

- [ ] T014 [US1] Brancher le callback `sendMagicLink` dans `apps/api/src/modules/auth/auth.config.ts` — vérifier `AdminService.isAdminByEmail(email)` avant d'appeler `EmailService.sendMagicLink`, retour silencieux si non-admin (dépend de T009 + T013)
- [ ] T015 [US1] Configurer le middleware Better-Auth dans `apps/api/src/modules/auth/auth.module.ts` — `toNodeHandler(authService.auth)` sur `{ path: 'api/auth/*', method: ALL }` via `MiddlewareConsumer` (dépend de T010 + T014)
- [ ] T016 [US1] Exécuter `cd apps/api && pnpm migration:up` pour créer les tables auth en base (dépend de T007)

**Checkpoint**: Magic link fonctionnel pour un admin existant en base. US1 livrable seul (nécessite au moins une ligne `admins` — voir US3 pour le seeder production).

---

## Phase 4: User Story 2 — Routes admin protégées par le statut admin (Priority: P1)

**Goal**: Les routes `/api/admin/*` retournent 401 sans session, 403 avec session non-admin, 200 avec session admin valide.

**Independent Test**: `GET /api/admin/me` → 401 sans cookie ; 403 avec session user non-admin ; 200 avec session admin.

### Tests for User Story 2

- [ ] T017 [P] [US2] Écrire les tests unitaires de `AuthGuard` dans `apps/api/src/modules/auth/__tests__/auth.guard.spec.ts` — mock `auth.api.getSession`, vérifier `UnauthorizedException` si pas de session

### Implementation

- [ ] T018 [P] [US2] Créer `AuthGuard` dans `apps/api/src/modules/auth/auth.guard.ts` — `fromNodeHeaders(request.headers)` + `authService.api.getSession()`, pose `request.session`
- [ ] T019 [P] [US2] Créer `AdminGuard` dans `apps/api/src/modules/auth/admin.guard.ts` — lit `request.session`, appelle `adminService.findByUserId(session.user.id)`, `ForbiddenException` si absent
- [ ] T020 [US2] Créer `AdminController` dans `apps/api/src/modules/auth/admin.controller.ts` — `@Controller('api/admin')`, `@UseGuards(AuthGuard, AdminGuard)`, endpoint `GET /me` retournant le profil admin courant (dépend de T018 + T019)
- [ ] T021 [US2] Enregistrer `AdminController`, `AdminService`, `AuthGuard`, `AdminGuard` dans `apps/api/src/modules/auth/auth.module.ts` (dépend de T020)
- [ ] T022 [US2] Ajouter le tag `admin` dans la config Swagger de `apps/api/src/main.ts` (dépend de T020)

**Checkpoint**: `GET /api/admin/me` respecte 401/403/200. US2 livrable indépendamment de US3/US4.

---

## Phase 5: User Story 3 — Admin par défaut disponible dès l'installation (Priority: P2)

**Goal**: Au premier démarrage, `bspot.api@gmail.com` existe comme admin — magic link immédiatement utilisable sans intervention manuelle.

**Independent Test**: `pnpm seed` sur base fraîche → magic link pour `bspot.api@gmail.com` aboutit à une session admin. Re-seed → pas de doublon.

### Implementation

- [ ] T023 [P] [US3] Créer le seeder idempotent dans `apps/api/src/seeders/admin.seed.ts` — upsert `User` (`bspot.api@gmail.com`, `emailVerified: true`) + upsert `Admin` lié, skip si déjà existant
- [ ] T024 [US3] Enregistrer `AdminSeeder` dans `apps/api/src/seeders/DatabaseSeeder.ts` (dépend de T023)

**Checkpoint**: `pnpm seed` crée l'admin par défaut. US3 complète le parcours MVP (US1 + US2 + US3).

---

## Phase 6: User Story 4 — Gestion des admins (promotion / révocation) (Priority: P3)

**Goal**: Un admin peut lister, promouvoir et révoquer d'autres admins. Révocation du dernier admin bloquée.

**Independent Test**: `POST /api/admin/admins` promeut un user → accès admin confirmé → `DELETE /api/admin/admins/:userId` révoque → 403 sur routes admin. `DELETE` sur le dernier admin → 400.

### Tests for User Story 4

- [ ] T025 [P] [US4] Écrire les tests unitaires de `AdminService` dans `apps/api/src/modules/auth/__tests__/admin.service.spec.ts` — couvrir `promote`, `revoke`, protection dernier admin (FR-006), user inexistant (400)

### Implementation

- [ ] T026 [US4] Compléter `AdminService` dans `apps/api/src/modules/auth/admin.service.ts` — ajouter `listAdmins()`, `promote(userId)`, `revoke(userId)` avec check `admins.count() === 1` (dépend de T013)
- [ ] T027 [P] [US4] Créer les DTOs admin dans `apps/api/src/modules/auth/dto/admin.dto.ts` — `PromoteAdminDto`, `AdminProfileDto`, `AdminRecordDto` avec décorateurs `@ApiProperty`
- [ ] T028 [US4] Étendre `AdminController` dans `apps/api/src/modules/auth/admin.controller.ts` — `GET /admins`, `POST /admins`, `DELETE /admins/:userId` conformes à `contracts/admin.yaml` (dépend de T026 + T027)

**Checkpoint**: CRUD admin complet. US4 livrable indépendamment une fois US2 en place.

---

## Phase 7: Polish & Vérifications transversales

**Purpose**: Tests d'intégration, qualité constitutionnelle, validation quickstart.

- [ ] T029 [P] Écrire les tests d'intégration auth dans `apps/api/src/modules/auth/__tests__/auth.integration.spec.ts` — `POST /api/auth/sign-in/magic-link` (email connu vs inconnu), `GET /api/admin/me` (401/403/200)
- [ ] T030 [P] Écrire les tests d'intégration admin CRUD dans `apps/api/src/modules/auth/__tests__/admin.integration.spec.ts` — flux promote/revoke, `DELETE` dernier admin → 400
- [ ] T031 [P] Vérifier que tous les nouveaux fichiers passent `pnpm --filter api lint` sans erreurs (strict mode, no `any`)
- [ ] T032 Valider manuellement `specs/better-auth-admin/quickstart.md` — exécuter les 5 scénarios curl (magic link, guard, promote, revoke, dernier admin)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Pas de dépendance — peut démarrer immédiatement
- **Phase 2 (Foundational)**: Dépend de Phase 1 — **bloque toutes les user stories**
- **Phase 3 (US1)**: Dépend de Phase 2 — MVP auth (nécessite un admin en base pour test manuel)
- **Phase 4 (US2)**: Dépend de Phase 2 — peut démarrer en parallèle de US1 après T013
- **Phase 5 (US3)**: Dépend de Phase 2 — recommandé avant validation finale de US1
- **Phase 6 (US4)**: Dépend de Phase 4 (AdminController + guards en place)
- **Phase 7 (Polish)**: Dépend de toutes les phases précédentes

### User Story Dependencies

- **US1 (P1)**: Après Phase 2 — test manuel requiert un admin en base (US3 ou insert manuel)
- **US2 (P1)**: Après Phase 2 — indépendant de US1 pour le code ; test requiert session (US1)
- **US3 (P2)**: Après Phase 2 — indépendant, complète le parcours US1 en production
- **US4 (P3)**: Après US2 — s'appuie sur guards et AdminController existants

### Within Each User Story

- T004/T005 parallèles → T006 → T007
- T008/T009/T013 parallèles → T010 → T011 → T012
- US1 : T014 → T015 → T016
- US2 : T017/T018/T019 parallèles → T020 → T021 → T022
- US4 : T025/T027 parallèles → T026 → T028

### Parallel Opportunities

- Phase 1 : T002 et T003 en parallèle
- Phase 2 : T004, T005, T008, T009, T013 en parallèle (avant T006)
- US2 : T017, T018, T019 en parallèle
- US4 : T025 et T027 en parallèle
- Polish : T029, T030, T31 en parallèle

---

## Parallel Example: User Story 2

```bash
# Lancer en parallèle (fichiers différents) :
Task T017: "Tests AuthGuard dans apps/api/src/modules/auth/__tests__/auth.guard.spec.ts"
Task T018: "AuthGuard dans apps/api/src/modules/auth/auth.guard.ts"
Task T019: "AdminGuard dans apps/api/src/modules/auth/admin.guard.ts"
# Puis séquentiellement :
Task T020: "AdminController GET /me"
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 5: US3 (seeder — débloque les tests US1)
4. Complete Phase 3: US1 (magic link)
5. Complete Phase 4: US2 (guards + `/api/admin/me`)
6. **STOP and VALIDATE**: Parcours complet admin par défaut → magic link → `/api/admin/me` 200

### Incremental Delivery

1. Setup + Foundational → infrastructure prête
2. US3 → admin par défaut seedé
3. US1 → magic link opérationnel (MVP auth)
4. US2 → routes protégées (MVP sécurité)
5. US4 → gestion multi-admins
6. Polish → tests d'intégration + quickstart

### Parallel Team Strategy

1. Équipe termine Setup + Foundational ensemble
2. Ensuite en parallèle :
   - Dev A : US1 (magic link middleware)
   - Dev B : US2 (guards + controller stub)
   - Dev C : US3 (seeder)
3. US4 après merge US2 ; Polish en dernier

---

## Notes

- Préfixe routes : `/api/auth/*` (middleware) et `/api/admin/*` (controller) — cohérent avec les controllers existants (`@Controller('api/scan')`)
- `BETTER_AUTH_URL` doit correspondre à `http://localhost:${PORT}` (PORT=3001 par défaut)
- Les routes Better-Auth ne sont pas dans Swagger — seules les routes `AdminController` le sont
- Pas de `bodyParser: false` dans `main.ts` (décision research.md)
- Un seul package ajouté : `better-auth` — pas de `@thallesp/nestjs-better-auth` ni `better-auth-mikro-orm`
