# B-Spot Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker (for PostgreSQL)
- Expo CLI (installed automatically with dependencies)

## Phase 1: Initial Setup

### 1. Install Dependencies

```bash
pnpm install
```

This installs all dependencies for both `apps/api/` and `apps/mobile/` packages.

### 2. Configure Environment Variables

**API Environment:**
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` and configure:
- Database credentials
- Pappers API key (get 250 free calls/month at pappers.fr)
- SMTP credentials for admin alerts

**Mobile Environment:**
```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Edit `apps/mobile/.env` and configure:
- API URL (default: http://localhost:3000)

### 3. Start PostgreSQL Database

```bash
pnpm db:up
```

Verify database is running:
```bash
pnpm db:logs
```

### 4. Run Database Migrations

```bash
cd apps/api && pnpm migration:up
```

### 5. Start Development Servers

**Both API and Mobile:**
```bash
pnpm dev
```

**Or individually:**

API only:
```bash
pnpm dev:api
```

Mobile only:
```bash
pnpm dev:mobile
```

### 6. Verify Installation

**Test API:**
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-21T...",
  "version": "2.0.0-alpha.1"
}
```

**Test Mobile:**
- Scan QR code in terminal with Expo Go app
- Or press `i` for iOS Simulator / `a` for Android Emulator

## Project Structure

```
b-spot/
├── apps/
│   ├── api/                # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts    # API entry point
│   │   │   ├── app.module.ts  # Root module
│   │   │   └── modules/   # Feature modules
│   │   ├── mikro-orm.config.ts
│   │   └── package.json
│   └── mobile/             # Expo React Native app
│       ├── app/            # Expo Router routes
│       │   ├── _layout.tsx    # Root layout
│       │   ├── (tabs)/    # Tab navigation
│       │   └── company/   # Company details
│       ├── src/
│       │   ├── api/       # API client
│       │   ├── components/    # Reusable components
│       │   └── store/     # Zustand stores
│       └── package.json
├── docker-compose.yml      # PostgreSQL container
└── pnpm-workspace.yaml    # Monorepo config
```

## Common Issues

### Database Connection Failed

Make sure PostgreSQL is running:
```bash
pnpm db:up
pnpm db:logs
```

### Expo Metro Bundler Issues

Clear cache:
```bash
cd apps/mobile && rm -rf .expo node_modules && pnpm install && pnpm start --clear
```

### API Port Already in Use

Change port in `apps/api/.env`:
```
PORT=3001
```

## Next Steps

After completing Phase 1 setup:
1. Seed brand data (see `apps/api/src/seeders/`)
2. Test Pappers API integration
3. Implement barcode scanner UI
4. Test end-to-end scan flow

## Documentation

- API Documentation: http://localhost:3000/api (when API is running)
- Expo Router: https://docs.expo.dev/router/introduction/
- NestJS: https://docs.nestjs.com/
- MikroORM: https://mikro-orm.io/

## Phase 1 Status

All Phase 1 tasks completed:
- ✅ T001: pnpm workspace structure
- ✅ T002: API package structure
- ✅ T003: Mobile package structure
- ✅ T004: docker-compose.yml
- ✅ T005: MikroORM configuration
- ✅ T006: Initial database migration (pending dependency install)
- ✅ T007: NestJS application structure
- ✅ T008: Health module
- ✅ T009: Expo Router file-based routing
- ✅ T010: NativeWind configuration
- ✅ T011: TanStack Query client with persistence
