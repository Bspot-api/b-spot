# Data Model: Admin Authentication & Authorization

**Feature**: feat/better-auth-admin
**Date**: 2026-05-30

---

## Entities

### Better-Auth Core Tables

These four tables are required by Better-Auth. Their SQL is generated via `npx @better-auth/cli generate`, then intégré dans une migration MikroORM. Des entités miroir MikroORM permettent un accès typé en lecture.

#### `user`
Better-Auth's user record. Created on first magic link sign-in (or by seeder).

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `text` PK | NOT NULL | UUID v4 (`gen_random_uuid()`) |
| `name` | `text` | NOT NULL | Display name (defaults to email prefix) |
| `email` | `text` | NOT NULL, UNIQUE | Login identifier |
| `emailVerified` | `boolean` | NOT NULL, default false | Set true after first magic link use |
| `image` | `text` | nullable | Avatar URL |
| `createdAt` | `timestamp` | NOT NULL | |
| `updatedAt` | `timestamp` | NOT NULL | Auto-updated |

#### `session`
Active sessions created after magic link verification.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `text` PK | NOT NULL | |
| `userId` | `text` FK → `user.id` | NOT NULL | |
| `token` | `text` | NOT NULL, UNIQUE | httpOnly cookie value |
| `expiresAt` | `timestamp` | NOT NULL | Session lifetime |
| `ipAddress` | `text` | nullable | |
| `userAgent` | `text` | nullable | |
| `createdAt` | `timestamp` | NOT NULL | |
| `updatedAt` | `timestamp` | NOT NULL | |

#### `account`
Auth provider linkage. Used internally by Better-Auth even for magic link.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `text` PK | NOT NULL | |
| `userId` | `text` FK → `user.id` | NOT NULL | |
| `accountId` | `text` | NOT NULL | |
| `providerId` | `text` | NOT NULL | `"magic-link"` for this feature |
| `password` | `text` | nullable | Always null (no password auth) |
| `createdAt` | `timestamp` | NOT NULL | |
| `updatedAt` | `timestamp` | NOT NULL | |

#### `verification`
Single-use tokens for magic link flows. Reused by Better-Auth for all token-based operations.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `text` PK | NOT NULL | |
| `identifier` | `text` | NOT NULL | Token (hashed, per `storeToken: "hashed"`) |
| `value` | `text` | NOT NULL | JSON `{ email }` |
| `expiresAt` | `timestamp` | NOT NULL | `now + 86400s` (24h) |
| `createdAt` | `timestamp` | nullable | |
| `updatedAt` | `timestamp` | nullable | |

---

### Custom Application Table

#### `admins`
The admin registry. A user is an admin if and only if a row exists here for their `userId`. Deleting a row revokes admin access without touching the `user` record.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` PK | NOT NULL | Standard MikroORM UUID |
| `userId` | `text` FK → `user.id` | NOT NULL, UNIQUE | One admin row per user |
| `createdAt` | `timestamp` | NOT NULL | Promotion date |

**Indexes**: `userId` (UNIQUE — prevents duplicate admin rows)

---

## Relationships

```
user ─┬─< session   (one user → many sessions)
      ├─< account   (one user → many accounts, typically one for magic link)
      └── admin     (one user → zero or one admin record)

verification (standalone, linked by email in `identifier`)
```

---

## State Transitions

### Admin Status

```
User exists (no admin row)
    │
    ▼  AdminService.promote(userId)
Admin (admin row exists)
    │
    ▼  AdminService.revoke(userId)  [blocked if last admin]
User exists (no admin row)
```

### Magic Link Flow

```
Request magic link (POST /api/auth/sign-in/magic-link)
    │
    ▼ token created in `verification`, email sent
Pending (token in DB, unclicked)
    │  expires after 24h
    ├──────────────────────► Expired (token deleted)
    │
    ▼  User clicks link (GET /api/auth/magic-link/verify?token=...)
Token consumed (atomic, single-use) → session created in `session`
    │
    ▼
Authenticated (session cookie set, redirect to callbackURL)
```

---

## Migration Strategy

Better-Auth tables (`user`, `session`, `account`, `verification`) are defined as MikroORM entities. A single new migration covers:
1. Create all four Better-Auth tables
2. Create `admins` table with FK to `user.id`

Runs via existing `pnpm migration:up` workflow. No separate CLI step needed.

**Seeder** (`apps/api/src/seeders/admin.seed.ts`):
- Creates user `bspot.api@gmail.com` if not exists
- Creates admin row for that user if not exists
- Idempotent (safe to re-run)
