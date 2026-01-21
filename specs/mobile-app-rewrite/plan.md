# Implementation Plan: Refonte B-Spot - Application Mobile de Scan Produits

**Branch**: `refactor/mobile-app-rewrite` | **Date**: 2026-01-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/mobile-app-rewrite/spec.md`

## Summary

Complete rebuild of B-Spot as a mobile-first application (similar to Yuka) that reveals corporate ownership networks through product barcode scanning. Users scan a product (e.g., Nespresso) and see the owning company (Nestlé), key executives, and major shareholders. The system leverages Pappers API (free tier: 250 calls/month) for French company data, Open Food Facts and Open Beauty Facts for product-to-brand mapping, with aggressive local caching to optimize API usage. Architecture: Expo React Native mobile app + NestJS API backend + PostgreSQL database + Docker deployment via Dokploy.

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode enabled)
**Mobile Framework**: Expo SDK ~52.0 (React Native)
**Backend Framework**: NestJS 10+ with TypeScript
**Primary Dependencies**:
- Mobile: Expo Router, NativeWind (Tailwind), Zustand, TanStack Query, expo-barcode-scanner, Lucide React Native
- Backend: NestJS, MikroORM 6+, PostgreSQL driver, Zod (validation), Swagger/OpenAPI, Nodemailer (email alerts)
**Storage**: PostgreSQL 15+ (Docker container for local dev, managed/self-hosted for production)
**Testing**:
- Backend: Jest + Supertest (integration tests mandatory for core modules)
- Mobile: Jest + React Native Testing Library (optional for MVP)
**Target Platform**:
- Mobile: iOS 13+ & Android 10+ via Expo
- Backend: Docker containers (Dok ploy deployment), Node.js 18+ runtime
**Project Type**: Monorepo (pnpm workspace) with mobile + API packages
**Performance Goals**:
- Scan → company display: <3 seconds (95th percentile)
- API response time: <500ms p95
- Cache hit rate: >90% for Pappers queries
**Constraints**:
- Pappers API: 250 calls/month maximum (hard limit on free tier)
- Cache TTL: 30 days minimum to achieve 500+ scans/month with 250 API calls
- No authentication system in MVP (deferred to post-MVP)
- Offline capability: display cached data only
**Scale/Scope**:
- MVP target: 100-500 seeded brands in Brand table
- Expected monthly users: 100-1000 for MVP phase
- Database entities: 6 core entities (Product, Brand, Company, Executive, Shareholder, PappersCache)
- Mobile screens: ~5-7 screens for MVP (Home, Scanner, Company Detail, Error states)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 1: Type Safety First
- ✅ **STATUS**: COMPLIANT
- **Evidence**: TypeScript 5.0+ with strict mode, OpenAPI-generated types for API contracts, explicit type annotations required
- **Action Items**:
  - Configure tsconfig.json with `strict: true` for both mobile and API
  - Generate mobile API client types from OpenAPI schema via `pnpm generate:types`
  - No `any` types except in explicitly justified edge cases

### Principle 2: Resource Constraint Awareness
- ✅ **STATUS**: COMPLIANT (design incorporates constraint)
- **Evidence**:
  - Pappers cache table with 30-day TTL
  - Cache-first service architecture
  - API call tracking in database
  - Email alerts at 80% quota usage
- **Action Items**:
  - Implement `PappersService` with cache-check-before-call logic
  - Create dashboard/admin endpoint showing monthly API usage
  - Load test with 1000 scans to validate >90% cache hit rate

### Principle 3: Mobile-First User Experience
- ✅ **STATUS**: COMPLIANT
- **Evidence**:
  - Expo React Native as primary UI
  - NativeWind for cross-platform styling
  - Offline support via TanStack Query persistence
  - Touch-optimized UI (44pt minimum touch targets)
- **Action Items**:
  - Use Expo Router file-based routing for navigation
  - Implement loading/error states for all async operations
  - Test barcode scanner on both iOS and Android physical devices

### Principle 4: Feature-Based Architecture
- ✅ **STATUS**: COMPLIANT
- **Evidence**:
  - Backend modules: `scan/`, `company/`, `product/`, `brand/`, `cache/`
  - Mobile features: `scanner/`, `company-detail/`, `common/`
- **Action Items**:
  - Create feature-based folder structure as outlined in Project Structure section
  - Document cross-feature dependencies (e.g., scanner depends on product service)

### Principle 5: Simplicity Over Abstraction
- ✅ **STATUS**: COMPLIANT
- **Evidence**:
  - Direct service implementations (no Repository pattern)
  - MikroORM used directly without custom abstractions
  - Simple caching logic: check DB, if miss call API
- **Action Items**:
  - Enforce 30-line function limit via ESLint rule
  - Enforce 300-line file limit via ESLint rule
  - Code review checklist: "Is this abstraction necessary?"

### Principle 6: Test-Driven Quality
- ✅ **STATUS**: COMPLIANT (with MVP pragmatism)
- **Evidence**:
  - Mandatory tests for API endpoints in core modules
  - Mandatory tests for Pappers caching logic
  - End-to-end test for scan → company flow
- **Action Items**:
  - Write integration tests for all `CompanyController` endpoints
  - Write unit tests for `PappersService.getCachedOrFetch()` method
  - Manual E2E testing for mobile flows (automated E2E deferred to Phase 2)

**GATE DECISION**: ✅ PASS - All principles compliant or have clear action items

---

## Project Structure

### Documentation (this feature)

```
specs/mobile-app-rewrite/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions and unknowns resolution
├── data-model.md        # Phase 1: Database schema and entity relationships
├── quickstart.md        # Phase 1: Developer onboarding guide
├── contracts/           # Phase 1: API endpoint specifications (OpenAPI fragments)
│   ├── scan.openapi.yaml
│   ├── company.openapi.yaml
│   └── product.openapi.yaml
├── CHANGELOG.md         # Feature changelog (already created)
└── tasks.md             # Phase 2: Detailed task breakdown (/speckit.tasks command)
```

### Source Code (repository root)

```
b-spot/
├── api/                           # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── scan/              # Barcode scanning & product lookup
│   │   │   │   ├── scan.controller.ts
│   │   │   │   ├── scan.service.ts
│   │   │   │   ├── scan.module.ts
│   │   │   │   └── __tests__/
│   │   │   ├── product/           # Product & Open Food Facts integration
│   │   │   │   ├── product.entity.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── product.module.ts
│   │   │   │   └── __tests__/
│   │   │   ├── brand/             # Brand → Company mapping
│   │   │   │   ├── brand.entity.ts
│   │   │   │   ├── brand.service.ts
│   │   │   │   ├── brand.controller.ts
│   │   │   │   ├── brand.module.ts
│   │   │   │   └── __tests__/
│   │   │   ├── company/           # Company data & Pappers integration
│   │   │   │   ├── company.entity.ts
│   │   │   │   ├── company.service.ts
│   │   │   │   ├── company.controller.ts
│   │   │   │   ├── company.module.ts
│   │   │   │   ├── pappers.service.ts      # Pappers API client
│   │   │   │   └── __tests__/
│   │   │   ├── cache/             # API usage tracking & quota management
│   │   │   │   ├── pappers-cache.entity.ts
│   │   │   │   ├── cache.service.ts
│   │   │   │   ├── cache.module.ts
│   │   │   │   └── __tests__/
│   │   │   └── health/            # Health check endpoint
│   │   │       ├── health.controller.ts
│   │   │       └── health.module.ts
│   │   ├── migrations/            # MikroORM database migrations
│   │   ├── seeders/               # Database seed data (brands mapping)
│   │   │   └── brands.seed.ts     # Top 100-500 French brands
│   │   ├── shared/                # Shared utilities
│   │   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── guards/            # (future: auth guards)
│   │   │   └── validators/        # Zod schemas
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── test/                      # E2E tests
│   │   └── scan-flow.e2e-spec.ts
│   ├── mikro-orm.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── mobile/                        # Expo React Native App
│   ├── app/                       # Expo Router file-based routing
│   │   ├── (tabs)/                # Tab navigation layout
│   │   │   ├── index.tsx          # Home/Scanner screen
│   │   │   └── _layout.tsx        # Tab layout
│   │   ├── company/
│   │   │   └── [id].tsx           # Company detail screen (dynamic route)
│   │   ├── _layout.tsx            # Root layout
│   │   └── +not-found.tsx         # 404 screen
│   ├── src/
│   │   ├── features/
│   │   │   ├── scanner/           # Barcode scanning feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── BarcodeScanner.tsx
│   │   │   │   │   └── ScanOverlay.tsx
│   │   │   │   └── hooks/
│   │   │   │       └── useBarcodeScanner.ts
│   │   │   ├── company/           # Company detail feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── CompanyHeader.tsx
│   │   │   │   │   ├── ExecutivesList.tsx
│   │   │   │   │   └── ShareholdersList.tsx
│   │   │   │   └── hooks/
│   │   │   │       └── useCompanyData.ts
│   │   │   └── common/            # Shared components
│   │   │       ├── components/
│   │   │       │   ├── ErrorMessage.tsx
│   │   │       │   ├── LoadingSpinner.tsx
│   │   │       │   └── EmptyState.tsx
│   │   │       └── hooks/
│   │   │           └── useOfflineStatus.ts
│   │   ├── api/                   # Generated API client
│   │   │   ├── client.ts          # Generated from OpenAPI
│   │   │   ├── types.ts           # Generated TypeScript types
│   │   │   └── hooks.ts           # TanStack Query hooks
│   │   ├── store/                 # Zustand stores (minimal)
│   │   │   └── uiStore.ts         # UI state (e.g., scanner active)
│   │   └── lib/                   # Utilities
│   │       ├── queryClient.ts     # TanStack Query config
│   │       └── constants.ts
│   ├── assets/                    # Images, fonts
│   ├── app.json                   # Expo configuration
│   ├── eas.json                   # EAS Build configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js         # NativeWind config
│   └── .env.example
│
├── docker-compose.yml             # PostgreSQL container for local dev
├── pnpm-workspace.yaml
├── package.json                   # Root package scripts
├── .gitignore
├── README.md
└── CLAUDE.md                      # Already updated with new architecture
```

---

## Phase 0: Outline & Research

### Unknowns to Resolve

1. **Pappers API Response Structure**
   - **Question**: What exact JSON structure does `/v2/entreprise?siren=XXX` return?
   - **Resolution**: Call Pappers API with example SIREN (e.g., 552 108 011 for Nestlé France) and document response schema
   - **Output**: Document in `research.md` with example response + mapping to Company/Executive/Shareholder entities

2. **Open Food Facts API Reliability**
   - **Question**: What's the success rate for French products? Does it return brand name consistently?
   - **Resolution**: Test 20-30 common French product barcodes (Danone, Nestlé, L'Oréal products)
   - **Output**: Document success rate, response time, and field mapping in `research.md`

3. **Open Beauty Facts Coverage**
   - **Question**: How complete is Open Beauty Facts for French cosmetics?
   - **Resolution**: Test 10-15 cosmetic product barcodes
   - **Output**: Document coverage and decide if OBF should be P1 or P2 feature

4. **Brand → SIREN Mapping Sources**
   - **Question**: Where can we source initial Brand → SIREN mappings for top 100-500 French brands?
   - **Resolution**: Research public datasets, scraping legal (e.g., Wikipedia infoboxes), or manual curation
   - **Output**: Document data source + initial seed list of 50-100 brands for MVP

5. **Expo Barcode Scanner Performance**
   - **Question**: Does `expo-barcode-scanner` or `expo-camera` with Vision API work better for EAN-13 codes?
   - **Resolution**: Prototype both approaches on physical iOS and Android devices
   - **Output**: Document chosen library + any platform-specific quirks

6. **Offline Data Persistence Strategy**
   - **Question**: How to persist TanStack Query cache for offline access?
   - **Resolution**: Research Expo SecureStore size limits vs AsyncStorage vs SQLite
   - **Output**: Choose storage mechanism for cached company data (likely AsyncStorage with 10MB limit awareness)

7. **Email Service for Admin Alerts**
   - **Question**: Use Nodemailer with SMTP or external service (SendGrid, AWS SES)?
   - **Resolution**: For MVP, use Nodemailer with Gmail SMTP (free, simple)
   - **Output**: Document SMTP configuration in `.env.example`

### Research Tasks

**Task R1**: Call Pappers API with test SIREN
- Use Postman/curl with free API key
- Document full JSON response structure
- Map fields to our `Company`, `Executive`, `Shareholder` entities

**Task R2**: Test Open Food Facts barcode lookups
- Test 30 barcodes from common French brands
- Measure response time and field availability
- Document `brands` field reliability

**Task R3**: Test Open Beauty Facts coverage
- Test 15 cosmetic barcodes
- Assess data quality vs Open Food Facts
- Decide priority (P1 vs P2)

**Task R4**: Source Brand → SIREN seed data
- Explore: Wikipedia data exports, Wikidata SPARQL, public registries
- Manually curate top 50 brands if no automated source found
- Create initial `brands.seed.ts` data file

**Task R5**: Prototype barcode scanning
- Create minimal Expo app with `expo-barcode-scanner`
- Test on iPhone and Android (physical devices mandatory)
- Measure scan detection speed

**Task R6**: Research TanStack Query offline persistence
- Review TanStack Query docs for persister plugins
- Test AsyncStorage-based persister
- Validate cache restoration on app restart

**Task R7**: Configure Nodemailer
- Set up Gmail SMTP with app-specific password
- Send test email from NestJS app
- Document environment variables needed

### Output: research.md

Document all findings in `specs/mobile-app-rewrite/research.md` with sections:
- Pappers API Schema
- Open Food Facts & Open Beauty Facts Analysis
- Brand Data Sources
- Barcode Scanner Technical Decision
- Offline Persistence Architecture
- Email Alert Configuration

---

## Phase 1: Design & Contracts

### Data Model Design

**Output**: `data-model.md`

#### Entity: Product (Backend - PostgreSQL)

```typescript
// api/src/modules/product/product.entity.ts
@Entity()
export class Product {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  barcode: string; // EAN-13 or UPC

  @Property()
  name: string;

  @Property({ nullable: true })
  category?: string;

  @Property({ nullable: true })
  imageUrl?: string;

  @Enum(() => ProductSource)
  source: ProductSource; // 'OFF' | 'OBF'

  @ManyToOne(() => Brand, { nullable: true })
  brand?: Brand;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

enum ProductSource {
  OPEN_FOOD_FACTS = 'OFF',
  OPEN_BEAUTY_FACTS = 'OBF',
}
```

#### Entity: Brand (Backend - PostgreSQL)

```typescript
// api/src/modules/brand/brand.entity.ts
@Entity()
export class Brand {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property({ unique: true })
  siren: string; // 9-digit French company ID

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relation: Brand has many Products
  @OneToMany(() => Product, product => product.brand)
  products = new Collection<Product>(this);
}
```

#### Entity: Company (Backend - PostgreSQL)

```typescript
// api/src/modules/company/company.entity.ts
@Entity()
export class Company {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  siren: string;

  @Property()
  legalName: string;

  @Property({ nullable: true })
  logoUrl?: string;

  @Property({ type: 'json', nullable: true })
  rawPappersData?: any; // Store full Pappers response for future features

  @Property()
  lastFetchedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  // Embedded collections (not separate tables for MVP simplicity)
  @Property({ type: 'json' })
  executives: Executive[] = [];

  @Property({ type: 'json' })
  shareholders: Shareholder[] = [];

  @Property({ type: 'json', nullable: true })
  subsidiaries?: string[]; // Array of SIREN codes
}

// These are JSON-embedded, not separate tables
interface Executive {
  name: string;
  role: string; // e.g., "Directeur Général"
  startDate?: string; // ISO date
}

interface Shareholder {
  name: string;
  percentage: number; // e.g., 15.5 for 15.5%
  type: 'individual' | 'corporate';
}
```

#### Entity: PappersCache (Backend - PostgreSQL)

```typescript
// api/src/modules/cache/pappers-cache.entity.ts
@Entity()
export class PappersCache {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  siren: string;

  @Property({ type: 'json' })
  responseData: any; // Full Pappers API response

  @Property()
  fetchedAt: Date = new Date();

  @Property()
  expiresAt: Date; // fetchedAt + 30 days
}
```

#### Entity: ApiUsageLog (Backend - PostgreSQL)

```typescript
// api/src/modules/cache/api-usage-log.entity.ts
@Entity()
export class ApiUsageLog {
  @PrimaryKey()
  id: number;

  @Enum(() => ExternalApi)
  api: ExternalApi; // 'PAPPERS' | 'OPEN_FOOD_FACTS' | 'OPEN_BEAUTY_FACTS'

  @Property()
  endpoint: string; // e.g., '/v2/entreprise'

  @Property({ nullable: true })
  requestParams?: string; // JSON string of query params

  @Property()
  success: boolean;

  @Property({ nullable: true })
  errorMessage?: string;

  @Property()
  timestamp: Date = new Date();
}

enum ExternalApi {
  PAPPERS = 'PAPPERS',
  OPEN_FOOD_FACTS = 'OPEN_FOOD_FACTS',
  OPEN_BEAUTY_FACTS = 'OPEN_BEAUTY_FACTS',
}
```

### API Contracts (OpenAPI Fragments)

**Output**: `contracts/*.openapi.yaml`

#### Scan Endpoint

```yaml
# contracts/scan.openapi.yaml
/api/scan:
  post:
    summary: Scan a product barcode and return company information
    operationId: scanProduct
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - barcode
            properties:
              barcode:
                type: string
                example: "3017620422003"
                description: EAN-13 or UPC barcode
    responses:
      200:
        description: Successfully found product and company
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ScanResult'
      404:
        description: Product not found in any database
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Produit non référencé"
      500:
        description: Internal server error

components:
  schemas:
    ScanResult:
      type: object
      properties:
        product:
          $ref: '#/components/schemas/ProductDTO'
        company:
          $ref: '#/components/schemas/CompanyDTO'
        dataFreshness:
          type: string
          format: date
          example: "2026-01-15"
          description: Date when company data was last fetched from Pappers

    ProductDTO:
      type: object
      properties:
        barcode:
          type: string
        name:
          type: string
        category:
          type: string
        imageUrl:
          type: string
        source:
          type: string
          enum: [OFF, OBF]

    CompanyDTO:
      type: object
      properties:
        siren:
          type: string
        legalName:
          type: string
        logoUrl:
          type: string
        executives:
          type: array
          items:
            $ref: '#/components/schemas/ExecutiveDTO'
        shareholders:
          type: array
          items:
            $ref: '#/components/schemas/ShareholderDTO'
        lastFetchedAt:
          type: string
          format: date-time

    ExecutiveDTO:
      type: object
      properties:
        name:
          type: string
        role:
          type: string
        startDate:
          type: string
          format: date

    ShareholderDTO:
      type: object
      properties:
        name:
          type: string
        percentage:
          type: number
          format: float
        type:
          type: string
          enum: [individual, corporate]
```

#### Company Endpoint

```yaml
# contracts/company.openapi.yaml
/api/companies/{siren}:
  get:
    summary: Get company details by SIREN
    operationId: getCompany
    parameters:
      - name: siren
        in: path
        required: true
        schema:
          type: string
          example: "552108011"
    responses:
      200:
        description: Company found
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CompanyDTO'
      404:
        description: Company not found
```

### Developer Quickstart Guide

**Output**: `quickstart.md`

```markdown
# B-Spot Developer Quickstart

## Prerequisites
- Node.js 18+
- pnpm 8+
- Docker (for PostgreSQL)
- Physical iOS/Android device (for barcode scanner testing)

## Initial Setup

1. Clone repository and install dependencies:
   \`\`\`bash
   git clone <repo-url> b-spot
   cd b-spot
   pnpm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp api/.env.example api/.env
   cp mobile/.env.example mobile/.env
   # Edit api/.env: add PAPPERS_API_KEY, SMTP credentials
   \`\`\`

3. Start PostgreSQL:
   \`\`\`bash
   pnpm db:up
   \`\`\`

4. Run migrations and seed data:
   \`\`\`bash
   cd api
   pnpm migration:up
   pnpm seed
   \`\`\`

5. Start API:
   \`\`\`bash
   pnpm dev:api
   # API runs on http://localhost:3000
   \`\`\`

6. Start mobile app:
   \`\`\`bash
   pnpm dev:mobile
   # Scan QR code with Expo Go app
   \`\`\`

## Development Workflow

- **Backend changes**: Edit files in `api/src/modules/`, hot reload enabled
- **Mobile changes**: Edit files in `mobile/app/` or `mobile/src/`, fast refresh enabled
- **Database changes**: Create migration with `cd api && pnpm migration:create`, then run `pnpm migration:up`
- **API contract changes**: Update contracts in `specs/mobile-app-rewrite/contracts/`, regenerate mobile client with `pnpm generate:types`

## Testing

- Run API tests: `cd api && pnpm test`
- Run mobile tests: `cd mobile && pnpm test` (when tests exist)
- Manual E2E: Use Expo Go app to test full scan flow on physical device

## Debugging

- API logs: Watch terminal running `pnpm dev:api`
- Mobile logs: Expo Dev Tools shows console logs
- Database: Connect with `psql -h localhost -U bspot -d bspot` (password: `password`)
\`\`\`

---

## Phase 2: Task Breakdown

**Note**: Detailed task breakdown is generated by the `/speckit.tasks` command in a separate file (`tasks.md`). This section provides a high-level outline of task categories.

### Task Categories

1. **Setup & Infrastructure** (Foundational)
   - Initialize monorepo structure
   - Configure TypeScript strict mode
   - Set up Docker Compose for PostgreSQL
   - Configure MikroORM + create initial migration
   - Set up Expo project with Router
   - Configure NativeWind (Tailwind)

2. **Backend Core** (User Story 5 - P1: Caching)
   - Create PappersCache entity + migration
   - Implement PappersService with cache-first logic
   - Implement API usage logging
   - Implement email alerts for quota threshold
   - Write tests for caching logic

3. **Backend Data Layer** (User Story 1 - P1: Scan flow)
   - Create Product, Brand, Company entities + migrations
   - Create Brand seed file with top 100 French brands
   - Run seed migration
   - Implement ProductService (Open Food Facts integration)
   - Implement CompanyService (Pappers integration)
   - Write integration tests for services

4. **Backend API** (User Story 1 - P1: Scan endpoint)
   - Implement ScanController with POST /api/scan endpoint
   - Implement CompanyController with GET /api/companies/:siren
   - Generate OpenAPI schema
   - Write integration tests for controllers

5. **Mobile Scanner** (User Story 1 - P1: Scan UI)
   - Implement BarcodeScanner component (expo-barcode-scanner)
   - Implement Scanner screen with camera permissions handling
   - Implement scan overlay UI (guideline frame)
   - Handle barcode detection and API call
   - Implement loading/error states

6. **Mobile Company Detail** (User Stories 2 & 3 - P1: Display data)
   - Generate API client from OpenAPI schema
   - Configure TanStack Query client
   - Implement Company Detail screen
   - Implement ExecutivesList component
   - Implement ShareholdersList component
   - Implement share functionality (native share sheet)

7. **Mobile Offline Support** (Clarified: Cache limited)
   - Configure TanStack Query persister with AsyncStorage
   - Implement offline detection hook
   - Implement "Data cached at [DATE]" badge
   - Handle offline gracefully (show cached data, disable scan)

8. **Open Beauty Facts Support** (User Story 4 - P2)
   - Extend ProductService to query OBF if OFF fails
   - Add "Product type" badge (Food vs Cosmetic)
   - Test with cosmetic barcodes

9. **Error Handling & Edge Cases** (FR-026 to FR-029)
   - Implement "Product not found" error state
   - Implement "Company not in Pappers" error state
   - Implement "Quota exhausted" degraded mode
   - Implement camera permission denial handling

10. **Testing & Validation** (Principle 6: Test-Driven Quality)
    - Write API integration tests (scan flow)
    - Write unit tests for Pappers caching
    - Manual E2E testing on iOS and Android
    - Load testing (simulate 1000 scans, verify cache hit rate)

11. **Deployment** (Docker + Dokploy)
    - Create Dockerfile for API
    - Create docker-compose.yml for production
    - Configure environment variables for Dokploy
    - Deploy to Dokploy instance
    - Verify EAS Build for mobile (Android APK + iOS TestFlight)

---

## Complexity Tracking

| Complexity Source | Justification | Mitigation Strategy |
|-------------------|---------------|---------------------|
| **Multi-API Integration** (Pappers, OFF, OBF) | Required for feature: product lookup needs multiple data sources | Use service abstraction per API, implement circuit breaker pattern if API is down |
| **Pappers API Rate Limiting** | Hard constraint: 250 calls/month on free tier | Aggressive caching with 30-day TTL, cache-first always, extensive testing to validate cache hit rate |
| **Offline Support in Mobile** | User requirement: display cached data without internet | Use TanStack Query persister, thoroughly test app restart scenarios |
| **Barcode Scanning Cross-Platform** | Must work on iOS & Android with different camera hardware | Use stable Expo library (expo-barcode-scanner), test on physical devices early |
| **Seed Data Curation** | Need 100-500 brand→SIREN mappings for MVP | Manual curation with validation, document sources, plan for automated discovery in Phase 2 |

**Violations of Simplicity Principle**: None - all complexity is justified by functional requirements or hard constraints.

---

## Post-Plan Validation Checklist

- [x] All entities defined with clear relationships
- [x] API contracts specified in OpenAPI format
- [x] Caching strategy explicitly designed for Pappers quota
- [x] Constitution principles validated (all 6 principles compliant)
- [x] Cross-platform mobile considerations addressed
- [x] Offline capability scoped correctly (cache-only, no new scans)
- [x] No authentication system (deferred per clarifications)
- [x] Email alerting mechanism chosen (Nodemailer + SMTP)
- [ ] Phase 0 research tasks executed (to be done next)
- [ ] Phase 1 contracts generated (to be done after research)

---

**Next Command**: `/speckit.tasks` - Generate detailed task breakdown from this plan
