# Research: Admin Authentication & Authorization

**Phase**: 0 — Unknowns Resolution
**Date**: 2026-05-30
**Feature**: feat/better-auth-admin
**Reference implementation**: `/Users/tatiana/Workspace/e-enfance-3018`

---

## Decision 1: Better-Auth + NestJS Integration Pattern

**Decision**: `toNodeHandler(auth)` dans `AuthModule.configure()` via `MiddlewareConsumer` — aucun package tiers

**Rationale**: C'est le pattern utilisé en production dans e-enfance-3018. Better-Auth expose `toNodeHandler` (depuis `better-auth/node`) qui convertit son handler en handler Node.js compatible Express/NestJS. Le module NestJS intercepte toutes les routes `/auth/*` via `MiddlewareConsumer` et les délègue à ce handler. Aucune dépendance communautaire fragile.

**Pattern concret** :
```typescript
// auth.module.ts — NestModule.configure()
const handler = toNodeHandler(auth)
consumer.apply(handler).forRoutes({ path: '/auth/*', method: RequestMethod.ALL })
```

**AuthGuard** : appel direct à `auth.api.getSession({ headers: fromNodeHeaders(request.headers) })` — pas de décorateur externe.

**Alternatives rejetées** :
- `@thallesp/nestjs-better-auth` : package communautaire non utilisé dans les projets de référence, introduit une dépendance fragile, impose `bodyParser: false` globalement
- `toNodeHandler` en catch-all controller NestJS : fonctionne mais moins propre que le pattern middleware

---

## Decision 2: Database Adapter

**Decision**: `new Pool({ connectionString })` — Better-Auth utilise Kysely/pg en interne, MikroORM reste ORM principal

**Rationale**: C'est exactement ce que fait e-enfance-3018. Better-Auth gère ses 4 tables (`user`, `session`, `account`, `verification`) via son propre layer Kysely, indépendamment de MikroORM. MikroORM définit des entités qui **mirrorent** ces tables pour que le reste de l'app puisse les interroger de façon typée. Les deux coexistent sur la même base PostgreSQL sans conflit.

**Pas de `better-auth-mikro-orm`** : inutile. Better-Auth n'a pas besoin que MikroORM gère ses requêtes internes. On garde MikroORM pour nos entités (Admin, Brand, Company, etc.), Better-Auth fait ses propres requêtes via Pool/Kysely.

**Avantage** : accès au CLI Better-Auth (`npx @better-auth/cli generate` / `migrate`) pour générer le SQL initial des 4 tables. Les migrations MikroORM couvrent uniquement la table `admins` custom.

---

## Decision 3: Entités MikroORM pour les tables Better-Auth

**Decision**: Entités MikroORM standard (`@Entity`, `@Property`, `@ManyToOne`) qui mirrorent les 4 tables Better-Auth

**Rationale**: Pattern e-enfance. Les entités permettent d'accéder aux tables Better-Auth depuis NestJS (ex: `AuthGuard` lit `User`, `AuthService` lit `Verification` pour le reset de PIN). Elles ne pilotent pas la création des tables — c'est Better-Auth CLI / les migrations qui le font.

**Structure** (identique à e-enfance) :
- `User` — `@Entity({ tableName: 'user' })`, PK uuid, `role?: string`, `emailVerified: boolean`
- `Session` — `@ManyToOne(() => User)`, `token` unique, `expiresAt`
- `Account` — `@ManyToOne(() => User)`, `providerId`, `accountId`
- `Verification` — `identifier`, `value`, `expiresAt`

Note : PKs en `uuid` avec `defaultRaw: 'gen_random_uuid()'` (pas UUID v7, cohérent avec e-enfance).

---

## Decision 4: Magic Link Email Transport

**Decision**: Reuse existing SMTP transport and env vars already in the project

**Rationale**: `nodemailer` (^6.9.7) est déjà installé. Un `EmailService` dans `apps/api/src/modules/cache/email.service.ts` utilise déjà `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`. Better-Auth's `sendMagicLink` callback est provider-agnostic — on y branche nodemailer.

**Pattern e-enfance** : le `sendMagicLink` callback de Better-Auth vérifie d'abord si l'email appartient à un admin avant d'envoyer — protection contre l'énumération d'emails :
```typescript
sendMagicLink: async (data) => {
  const user = await this.em.findOne(User, { email: data.email.toLowerCase() })
  if (!isAdmin(user)) return  // silent — no email sent
  await emailService.sendMagicLink({ to: data.email, url: data.url })
}
```

**Config magic link** :
- `expiresIn: 86400` (24h, FR-008)
- `disableSignUp: true` (FR-001 — seuls les admins pré-seedés peuvent se connecter)
- Pas de `emailAndPassword` → password auth désactivé

**Env vars nécessaires** :
- `BETTER_AUTH_SECRET` — clé de signature 32+ chars
- `BETTER_AUTH_URL` — URL de base de l'API
- `SMTP_FROM` — adresse expéditeur (les autres vars SMTP existent déjà)

---

## Decision 5: AdminGuard Architecture

**Decision**: `AuthGuard` custom (pattern e-enfance) + `AdminGuard` custom qui vérifie la table `admins`

**Rationale**: L'`AuthGuard` utilise `auth.api.getSession({ headers: fromNodeHeaders(request.headers) })` — identique à e-enfance. L'`AdminGuard` ajoute une vérification MikroORM : `admins.findOne({ userId: session.user.id })`.

Différence avec e-enfance : e-enfance utilise un champ `role` sur `User` (Better-Auth `admin` plugin). B-Spot utilise une table `admins` dédiée (choix explicite). L'`AdminGuard` fait donc un lookup en base plutôt que de lire `session.user.role`.

**`AuthService`** : injectable NestJS qui wrape l'instance Better-Auth, initialisé via `onModuleInit()` (lazy init identique à e-enfance).

---

## Decision 6: Seeder

**Decision**: MikroORM seeder idempotent — crée `bspot.api@gmail.com` + ligne `admins`

**Rationale**: Le projet a déjà un répertoire `seeders/`. Le seeder insère directement en base via MikroORM (pas via l'API HTTP Better-Auth). Idempotent : skip si déjà existant (FR-005).

---

## Decision 7: Last Admin Protection

**Decision**: Guard dans `AdminService.revoke()` — compte avant suppression

**Rationale**: FR-006. Si `admins.count() === 1` et c'est l'utilisateur cible → `BadRequestException`. Simple check service-layer.

---

## Unknowns Resolved

Tous les NEEDS CLARIFICATION résolus :
- Email admin par défaut : `bspot.api@gmail.com` (confirmé par l'utilisateur)
- Transport email : SMTP nodemailer existant
- Pattern NestJS : `toNodeHandler` + `MiddlewareConsumer` (e-enfance)
- Adapter DB : `new Pool()` + entités MikroORM miroir (e-enfance)
- Magic link : 24h, disableSignUp, nodemailer callback avec vérification admin préalable
