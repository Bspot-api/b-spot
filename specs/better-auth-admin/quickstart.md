# Quickstart: Admin Authentication & Authorization

## Prerequisites

- PostgreSQL running (`pnpm db:up`)
- `apps/api/.env` configured (see env vars below)

## New Environment Variables

Add to `apps/api/.env` (copy from `.env.example`):

```bash
# Better-Auth
BETTER_AUTH_SECRET=<generate: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3001

# Email — MailDev local (started with `pnpm db:up`)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="B-Spot <noreply@localhost>"
```

## Setup

```bash
# 1. Install new dependencies
pnpm --filter api install

# 2. Run migrations (creates Better-Auth tables + admins table)
cd apps/api && pnpm migration:up

# 3. Seed default admin (bspot.api@gmail.com)
cd apps/api && pnpm seed

# 4. Start the API
pnpm dev:api
```

## Request a Magic Link (test)

```bash
curl -X POST http://localhost:3001/api/auth/sign-in/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "bspot.api@gmail.com", "callbackURL": "http://localhost:3001/api/admin/me"}'
```

Open MailDev at http://localhost:1080 to view the magic link email.

## Test Admin Guard

```bash
# Without session → 401
curl http://localhost:3001/api/admin/me

# With valid admin session cookie (after clicking magic link)
curl http://localhost:3001/api/admin/me \
  -H "Cookie: session_token=<token-from-cookie>"
```

## Promote a User to Admin

```bash
curl -X POST http://localhost:3001/api/admin/admins \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=<admin-token>" \
  -d '{"userId": "<target-user-id>"}'
```

## Revoke Admin Status

```bash
curl -X DELETE http://localhost:3001/api/admin/admins/<userId> \
  -H "Cookie: session_token=<admin-token>"
# Returns 400 if target is the last admin
```

## Swagger

Auth routes are not in Swagger (handled by Better-Auth internally).
Admin routes are documented at `http://localhost:3001/api` under the `admin` tag.
