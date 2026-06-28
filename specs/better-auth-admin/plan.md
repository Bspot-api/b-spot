# Implementation Plan: Admin Authentication & Authorization

**Branch**: `feat/better-auth-admin` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)
**Reference**: `/Users/tatiana/Workspace/e-enfance-3018/apps/api/src/modules/auth/`

## Summary

Intégrer Better-Auth dans l'API NestJS avec le pattern `toNodeHandler` + `MiddlewareConsumer` (identique à e-enfance-3018). Better-Auth gère ses 4 tables via son propre layer Kysely (`new Pool()`). MikroORM définit des entités miroir pour un accès typé. Une table `admins` dédiée (FK → `user`) et un `AdminGuard` custom complètent le dispositif. Seeder pour `bspot.api@gmail.com`.

## Technical Context

**Language/Version**: TypeScript 5 strict (`noImplicitAny`, `strictNullChecks`)
**Primary Dependencies**: NestJS 10, MikroORM 6, PostgreSQL 15, `better-auth` (à ajouter — seul nouveau package)
**Storage**: PostgreSQL 15 — 4 tables Better-Auth (via CLI/SQL) + table `admins` (via migration MikroORM)
**Testing**: Jest + Supertest
**Target Platform**: Linux server (Docker via Dokploy)
**Project Type**: API only — pas de changements mobile dans cette feature
**Performance Goals**: Auth endpoints < 200ms p95
**Constraints**: Un seul ORM (MikroORM), SMTP vars existantes réutilisées, pas de password auth

## Constitution Check

| Principe | Statut | Notes |
|---|---|---|
| P1 — Type Safety | ✅ PASS | Entités et DTOs fully typed, `fromNodeHeaders` typé |
| P2 — Resource Constraint | ✅ PASS | Aucun appel Pappers |
| P3 — Mobile-First UX | ✅ N/A | Backend only, mobile auth différé |
| P4 — Feature-Based Architecture | ✅ PASS | Module `apps/api/src/modules/auth/` |
| P5 — Simplicity | ✅ PASS | Pas de pattern repository, lookup direct MikroORM |
| P6 — Test-Driven Quality | ✅ PASS | Module `auth/` listé comme obligatoire dans la constitution |

## Project Structure

### Documentation (cette feature)

```text
specs/better-auth-admin/
├── plan.md              ← ce fichier
├── research.md          ← décisions d'architecture
├── data-model.md        ← entités et relations
├── quickstart.md        ← setup local
├── contracts/
│   ├── auth.yaml        ← routes Better-Auth proxiées
│   └── admin.yaml       ← routes admin management
└── tasks.md             ← /speckit.tasks
```

### Source Code

```text
apps/api/
├── src/
│   ├── app.module.ts                         ← MODIFY: importer AuthModule
│   └── modules/
│       └── auth/                             ← NEW module
│           ├── auth.config.ts                ← factory createBetterAuth() — pattern e-enfance
│           ├── auth.module.ts                ← NestModule: toNodeHandler + MiddlewareConsumer
│           ├── auth.service.ts               ← AuthService injectable (wrape l'instance BA)
│           ├── auth.guard.ts                 ← AuthGuard: api.getSession + fromNodeHeaders
│           ├── auth.entity.ts                ← entités MikroORM miroir (User, Session, Account, Verification)
│           ├── admin.entity.ts               ← table admins dédiée
│           ├── admin.service.ts              ← promote / revoke / last-admin check
│           ├── admin.controller.ts           ← /api/admin/* (protégé par AdminGuard)
│           ├── admin.guard.ts                ← AdminGuard: session valide + row dans admins
│           └── __tests__/
│               ├── auth.guard.spec.ts
│               └── admin.service.spec.ts
├── src/migrations/
│   └── Migration20260530000000_add_auth_tables.ts  ← NEW: table admins uniquement
└── src/seeders/
    └── admin.seed.ts                         ← NEW: bspot.api@gmail.com + row admins
```

**Note** : Les 4 tables Better-Auth (`user`, `session`, `account`, `verification`) sont créées via `npx @better-auth/cli generate` → SQL appliqué manuellement ou via migration dédiée. La migration MikroORM couvre uniquement la table `admins`.

## Étapes d'implémentation

### Étape 1 — Dépendance

```bash
pnpm --filter api add better-auth
```

Un seul nouveau package. Pas de `@thallesp/nestjs-better-auth`, pas de `better-auth-mikro-orm`.

### Étape 2 — `auth.config.ts` (factory)

Fichier standalone (pas un provider NestJS). Pattern identique à `e-enfance/src/config/better-auth.config.ts` :

```typescript
export function createBetterAuth(options: BetterAuthOptions) {
  return betterAuth({
    secret: options.secret,
    baseURL: options.baseURL,
    trustedOrigins: options.trustedOrigins,
    database: new Pool({ connectionString: options.connectionString }),
    plugins: [
      magicLink({
        expiresIn: 86400,        // 24h
        disableSignUp: true,
        sendMagicLink: options.sendMagicLink,
      }),
    ],
  })
}
```

### Étape 3 — Entités MikroORM (`auth.entity.ts`)

Entités miroir pour les 4 tables Better-Auth — strictement identiques au pattern e-enfance :

- `User` — `@Entity({ tableName: 'user' })`, PK uuid (`gen_random_uuid()`), `emailVerified: boolean`
- `Session` — `@ManyToOne(() => User, { fieldName: 'userId' })`, `token` unique, `expiresAt`
- `Account` — `@ManyToOne(() => User, { fieldName: 'userId' })`, `providerId`, `accountId`
- `Verification` — `identifier`, `value`, `expiresAt`

Ces entités permettent à MikroORM de lire les tables Better-Auth mais ne pilotent pas leur création.

### Étape 4 — `Admin` entity (`admin.entity.ts`)

```typescript
@Entity({ tableName: 'admins' })
export class Admin {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string

  @ManyToOne(() => User, { fieldName: 'userId', unique: true })
  user!: User

  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date()
}
```

### Étape 5 — `AuthService` (`auth.service.ts`)

Injectable NestJS qui wrape l'instance Better-Auth — lazy init via `onModuleInit()` :

```typescript
@Injectable()
export class AuthService implements OnModuleInit {
  private _auth: ReturnType<typeof createBetterAuth> | null = null

  async onModuleInit() { /* initialise _auth */ }

  get auth() { return this._auth! }
  get api() { return this.auth.api }
}
```

Le `sendMagicLink` callback vérifie que l'email appartient à un admin avant d'envoyer (protection énumération — pattern e-enfance).

### Étape 6 — `AuthModule` (`auth.module.ts`)

`NestModule` qui délègue `/auth/*` à Better-Auth via `toNodeHandler` :

```typescript
async configure(consumer: MiddlewareConsumer) {
  const handler = toNodeHandler(this.authService.auth)
  consumer.apply(handler).forRoutes({ path: '/auth/*', method: RequestMethod.ALL })
}
```

Pas de `bodyParser: false` dans `main.ts`. Pas de catch-all controller.

### Étape 7 — `AuthGuard` (`auth.guard.ts`)

Pattern e-enfance — `fromNodeHeaders` + `api.getSession()` :

```typescript
const session = await this.authService.api.getSession({
  headers: fromNodeHeaders(request.headers),
})
request.session = session
if (!session) throw new UnauthorizedException()
```

### Étape 8 — `AdminGuard` (`admin.guard.ts`)

```typescript
const session = request.session  // posé par AuthGuard
const admin = await this.adminService.findByUserId(session.user.id)
if (!admin) throw new ForbiddenException()
```

Routes admin décorées `@UseGuards(AuthGuard, AdminGuard)` dans ce ordre.

### Étape 9 — `AdminService` (`admin.service.ts`)

Méthodes :

- `findByUserId(userId)` — lookup pour le guard
- `listAdmins()` — tous les admins avec join user
- `promote(userId)` — crée une ligne `admins`, valide que le user existe
- `revoke(userId)` — supprime la ligne, bloque si dernier admin (FR-006)

### Étape 10 — `AdminController` (`admin.controller.ts`)

Routes sous `/api/admin`, `@UseGuards(AuthGuard, AdminGuard)` :

- `GET /me` — profil admin courant
- `GET /admins` — liste
- `POST /admins` — promotion
- `DELETE /admins/:userId` — révocation

### Étape 11 — Migration + tables Better-Auth

1. Générer le SQL des 4 tables Better-Auth : `npx @better-auth/cli generate --config src/modules/auth/auth.config.ts`
2. Intégrer ce SQL dans une migration MikroORM dédiée
3. Créer la migration `admins` (table avec FK vers `user`)
4. `pnpm migration:up`

### Étape 12 — Seeder (`admin.seed.ts`)

1. Upsert `User` avec email `bspot.api@gmail.com` (PK uuid, `emailVerified: true`)
2. Upsert `Admin` pointant vers cet user
3. Idempotent — skip si déjà existant

### Étape 13 — Variables d'environnement

Ajouter dans `apps/api/.env.example` :

```bash
BETTER_AUTH_SECRET=        # openssl rand -base64 32
BETTER_AUTH_URL=           # ex: http://localhost:3000
SMTP_FROM=                 # ex: B-Spot <noreply@bspot.fr>
```

(`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` déjà présents)

### Étape 14 — Tests d'intégration

Dans `auth/__tests__/` :

- `POST /auth/sign-in/magic-link` → 200 pour email connu, silencieux pour email inconnu
- `GET /api/admin/me` → 401 sans session, 403 avec session non-admin, 200 avec session admin
- `POST /api/admin/admins` + `DELETE /api/admin/admins/:userId` → flux promote/revoke
- `DELETE` sur le dernier admin → 400

## Complexity Tracking

Aucune violation de la constitution.
