# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Vision

B-Spot is a mobile application (similar to Yuka) that empowers consumers to understand corporate ownership and influence networks by scanning product barcodes. The app reveals:
- Which company owns the brand
- Key executives and decision-makers
- Major shareholders and ownership structure
- Corporate relationships and subsidiaries

**Primary Use Case**: User scans a Nespresso product → App shows it's owned by Nestlé → Displays CEO, board members, and ownership network.

**Data Sources**:
- **Pappers API** (free tier: 250 calls/month) for French company data (SIREN, executives, shareholders, subsidiaries)
- **Open Food Facts** for food product database (barcode → brand mapping)
- **Open Beauty Facts** for cosmetics/hygiene products
- Local cache to optimize API usage

**Target Stack**:
- Mobile app built with Expo (React Native)
- Backend API with NestJS + PostgreSQL
- Docker deployment via Dokploy

## Common Development Commands

### Project Setup

- `pnpm install` - Install all dependencies for monorepo
- `cp apps/api/.env.example apps/api/.env` - Set up API environment variables
- `cp apps/mobile/.env.example apps/mobile/.env` - Set up mobile environment variables
- `pnpm db:up` - Start PostgreSQL database with Docker
- `cd apps/api && pnpm migration:up` - Run database migrations

### Development

- `pnpm dev` - Start both mobile and API in development mode
- `pnpm dev:mobile` - Start only Expo mobile app
- `pnpm dev:api` - Start only NestJS API (port defined in .env)
- `pnpm generate:types` - Generate TypeScript types from OpenAPI schema for mobile

### Mobile Development (Expo)

- `cd apps/mobile && pnpm start` - Start Expo development server
- `cd apps/mobile && pnpm android` - Run on Android emulator/device
- `cd apps/mobile && pnpm ios` - Run on iOS simulator/device (macOS only)
- `cd apps/mobile && pnpm web` - Run in web browser (for quick testing)
- `cd apps/mobile && eas build --platform android` - Build Android APK with EAS
- `cd apps/mobile && eas build --platform ios` - Build iOS app with EAS

### Database Management

- `pnpm db:up` - Start PostgreSQL container
- `pnpm db:down` - Stop PostgreSQL container
- `pnpm db:logs` - View PostgreSQL logs
- `cd apps/api && pnpm migration:create` - Create new database migration
- `cd apps/api && pnpm migration:up` - Apply pending migrations
- `cd apps/api && pnpm migration:down` - Rollback last migration
- `cd apps/api && pnpm seed` - Seed database with initial data
- `cd apps/api && pnpm seed:clear` - Clear database and reseed

### Build & Test

- `pnpm build` - Build both mobile and API
- `pnpm build:mobile` - Build Expo app for production
- `pnpm build:api` - Build NestJS API
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Run ESLint for all packages
- `cd apps/api && pnpm test:watch` - Run API tests in watch mode
- `cd apps/api && pnpm test:e2e` - Run API end-to-end tests
- `cd apps/api && pnpm test:cov` - Run API tests with coverage
- `cd apps/mobile && pnpm test` - Run mobile tests with Jest

## Architecture Overview

### Monorepo Structure

This is a pnpm workspace monorepo with two main packages in `apps/`:
- **apps/api/**: NestJS backend with PostgreSQL and MikroORM
- **apps/mobile/**: Expo (React Native) mobile application

### Backend (NestJS API)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with MikroORM as ORM
- **Authentication**: Better-Auth integration
- **Architecture**: Feature-based modules in `src/modules/`
  - `auth/` - Authentication and authorization
  - `product/` - Product and barcode management
  - `brand/` - Brand to company mapping
  - `company/` - Company data (cached from Pappers)
  - `scan/` - Scan history and analytics
  - `cache/` - Pappers API response caching
  - `user/` - User management

**Key Services**:
- **Pappers Service**: Manages Pappers API calls with rate limiting and caching
- **Product Service**: Queries Open Food Facts / Open Beauty Facts APIs
- **Matching Service**: Maps brands to companies (AI-enhanced in future)

### Mobile (Expo/React Native)

- **Framework**: Expo (~52.0) with React Native
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand for local state, TanStack Query for server state
- **Camera**: expo-camera or expo-barcode-scanner for barcode scanning
- **API Integration**: Generated hooks from OpenAPI schema
- **Icons**: Lucide React Native

**Key Features**:
- Barcode scanner with camera
- Product → Company detail view
- Company network visualization
- Scan history
- Offline support with cached data

### Key Configuration Files

- `apps/api/mikro-orm.config.ts` - Database ORM configuration
- `pnpm-workspace.yaml` - Monorepo workspace definition (apps/*)
- `apps/mobile/app.json` - Expo configuration
- `apps/mobile/eas.json` - EAS Build configuration
- API uses standard NestJS configuration with Swagger/OpenAPI

### Database Schema

- **products** - Product catalog (barcode, name, brand)
- **brands** - Brand registry with company associations
- **companies** - Cached company data from Pappers (SIREN, name, executives, shareholders)
- **scans** - User scan history
- **cache_pappers** - Pappers API response cache (to stay under 250 calls/month)
- **users** - User accounts

### Authentication Flow

- Better-Auth handles authentication logic
- Mobile app uses secure storage (expo-secure-store) for tokens
- JWT-based authentication system
- Optional: Social auth (Google, Apple) for mobile

### External API Integration

**Pappers API** (Free tier: 250 calls/month):
- Endpoint: `https://api.pappers.fr/v2/entreprise`
- Returns: Company info, executives, shareholders, subsidiaries
- Caching strategy: Store responses locally, refresh monthly
- Rate limiting: Track usage, warn at 200 calls

**Open Food Facts**:
- Endpoint: `https://world.openfoodfacts.org/api/v2/product/{barcode}`
- Returns: Product name, brand, category, image
- Free, unlimited usage

**Open Beauty Facts**:
- Endpoint: `https://world.openbeautyfacts.org/api/v2/product/{barcode}`
- Returns: Cosmetic product info
- Free, unlimited usage

## Development Workflow

When working with this codebase:

1. Always start the database first with `pnpm db:up`
2. Run API migrations: `cd api && pnpm migration:up`
3. Start API: `pnpm dev:api`
4. Start mobile app: `pnpm dev:mobile`
5. Scan a barcode in the app → API fetches from Open Food Facts → Maps brand to company → Fetches from Pappers (or cache)
6. Generate mobile types after API changes: `pnpm generate:types`

## Code Quality Standards

- **Strict typing** - All values must be typed, no `any` or untyped values allowed
- **Function limits** - Max 30 lines per function, max 5 parameters
- **File limits** - Max 300 lines per file, max 10 sub-files per folder
- **Feature-based architecture** - Organize code by business feature
- **Clean code principles** - One responsibility per file, fail fast, use explicit constants

## API Type Generation Workflow

Mobile types are auto-generated from the API's OpenAPI schema:
1. API changes trigger OpenAPI schema updates
2. Run `pnpm generate:types` to regenerate mobile client hooks
3. Mobile uses type-safe API client with TanStack Query integration
4. Generated files are in `apps/mobile/src/api/`

## Important Notes

- This is a complete rewrite of B-Spot focused on mobile-first product scanning
- **Pappers free tier limit**: 250 API calls/month - aggressive caching is essential
- Environment variables required in both `api/.env` and `mobile/.env`
- Database must be running before starting the API
- Mobile app generates API client from the backend's OpenAPI schema
- All packages use TypeScript with strict type checking enabled
- Node.js >=18.0.0 and pnpm >=8.0.0 required
- Expo SDK ~52.0 required for mobile development

## MVP Scope

**Phase 1 (Current Focus)**:
- Barcode scanning (food products via Open Food Facts)
- Display: Company name, logo, executives, shareholders
- Pappers API integration with local caching
- Basic scan history

**Phase 2 (Future)**:
- Open Beauty Facts integration (cosmetics)
- AI-powered brand → company matching for unknown products
- Community contributions (user-submitted product mappings)
- Advanced network visualization
- Automated monitoring and alerts

## Deployment

- **API**: Docker container deployed via Dokploy
- **Mobile**: Expo EAS Build for app store distribution
- **Database**: PostgreSQL (managed or self-hosted)
- **Hosting**: Optimized for low-cost deployment (Pappers free tier constraint)
