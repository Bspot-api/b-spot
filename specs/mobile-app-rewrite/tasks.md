# Tasks: Refonte B-Spot - Application Mobile de Scan Produits

**Input**: Design documents from `specs/mobile-app-rewrite/`
**Prerequisites**: [plan.md](./plan.md) ✅, [spec.md](./spec.md) ✅

**Tests**: Integration tests are MANDATORY for API core modules (scan, product, company, cache). Mobile UI tests are OPTIONAL for MVP.

**Organization**: Tasks are grouped by phase and user story to enable independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, Foundation, Research)
- All paths follow monorepo structure: `api/src/` and `mobile/src/`

---

## Phase 0: Research & Discovery (Must complete before implementation)

**Purpose**: Validate external APIs, understand data structures, source initial seed data

**⚠️ CRITICAL**: These tasks inform implementation decisions

- [X] R001 [P] [Research] Test Pappers API with real SIREN (552108011 - Nestlé France)
  - Document full JSON response structure
  - Map fields to Company/Executive/Shareholder entities
  - Test rate limiting behavior
  - **Output**: `specs/mobile-app-rewrite/research.md` (Pappers API section)
  - **Status**: ⚠️ BLOCKED - API key has no credits, proceed with tentative mapping

- [X] R002 [P] [Research] Test Open Food Facts with 30 French product barcodes
  - Test common brands: Danone, Nestlé, L'Oréal, Carrefour, etc.
  - Measure response time and `brands` field reliability
  - Document success rate
  - **Output**: `specs/mobile-app-rewrite/research.md` (Open Food Facts section)
  - **Result**: ✅ 80% success rate, 245ms avg response time

- [X] R003 [P] [Research] Test Open Beauty Facts with 15 cosmetic barcodes
  - Test L'Oréal, Nivea, Garnier products
  - Compare data quality vs Open Food Facts
  - Decision: P1 or P2 feature?
  - **Output**: `specs/mobile-app-rewrite/research.md` (Open Beauty Facts section)
  - **Result**: ⚠️ Only 10% success rate → **Decision: DEFER TO P2**

- [X] R004 [Research] Source Brand → SIREN seed data
  - Research: Wikidata SPARQL, Wikipedia exports, public registries
  - Manually curate top 50-100 French brands if no automated source
  - Create initial seed list: brand name + SIREN
  - **Output**: `api/src/seeders/brands.seed.ts` (initial data)
  - **Result**: ✅ Manual curation strategy defined (50-100 brands, 2-4 hours)

- [X] R005 [P] [Research] Prototype barcode scanner on physical devices
  - Create minimal Expo app with expo-barcode-scanner
  - Test on iOS device (iPhone)
  - Test on Android device
  - Measure scan detection speed
  - **Output**: `specs/mobile-app-rewrite/research.md` (Scanner section)
  - **Result**: ✅ Use `expo-camera` (expo-barcode-scanner deprecated in SDK 52)

- [X] R006 [P] [Research] Test TanStack Query offline persistence
  - Review TanStack Query persister docs
  - Test AsyncStorage-based persister in Expo
  - Validate cache restoration on app restart
  - **Output**: `specs/mobile-app-rewrite/research.md` (Offline persistence section)
  - **Result**: ✅ Fully supported, 7-day cache + 30min stale time recommended

- [X] R007 [P] [Research] Configure Nodemailer with Gmail SMTP
  - Set up Gmail app-specific password
  - Send test email from Node.js
  - Document environment variables
  - **Output**: `api/.env.example` (SMTP config)
  - **Result**: ✅ Gmail SMTP sufficient for MVP (<10 emails/month)

**Checkpoint**: Research complete - proceed to setup phase

---

## Phase 1: Setup & Infrastructure (Foundational)

**Purpose**: Project initialization and basic structure

**⚠️ CRITICAL**: No feature work can begin until this phase is complete

### Monorepo Setup

- [ ] T001 Initialize pnpm workspace structure
  - Create `api/` and `mobile/` directories
  - Update `pnpm-workspace.yaml`
  - Create root package.json scripts (dev, build, test)

- [ ] T002 [P] Setup API package structure
  - Create `api/package.json`
  - Install NestJS 10+ dependencies
  - Install MikroORM 6+ with PostgreSQL driver
  - Install Zod, Nodemailer, @nestjs/swagger
  - Create `api/tsconfig.json` with strict mode

- [ ] T003 [P] Setup Mobile package structure
  - Initialize Expo project in `mobile/`
  - Install Expo SDK ~52.0
  - Install Expo Router, NativeWind, Zustand, TanStack Query
  - Install expo-barcode-scanner, Lucide React Native
  - Create `mobile/tsconfig.json` with strict mode

### Database Setup

- [ ] T004 Create docker-compose.yml for PostgreSQL
  - PostgreSQL 15+ service
  - Environment variables for credentials
  - Volume for data persistence
  - Expose port 5432

- [ ] T005 Configure MikroORM
  - Create `api/mikro-orm.config.ts`
  - Configure PostgreSQL connection
  - Set up migrations directory: `api/src/migrations/`
  - Set up seeders directory: `api/src/seeders/`

- [ ] T006 Create initial database migration
  - Run `pnpm migration:create` to generate initial migration
  - Verify migration structure
  - Test: `pnpm db:up && pnpm migration:up`

### API Foundation

- [ ] T007 [P] Setup NestJS application structure
  - Create `api/src/main.ts` with NestJS bootstrap
  - Create `api/src/app.module.ts`
  - Configure CORS for mobile access
  - Configure Swagger/OpenAPI at `/api` endpoint
  - Add global validation pipe (Zod)

- [ ] T008 [P] Create Health module
  - Create `api/src/modules/health/health.controller.ts`
  - Implement `GET /health` endpoint
  - Return { status: 'ok', timestamp, version }
  - Test: `curl http://localhost:3000/health`

### Mobile Foundation

- [ ] T009 [P] Setup Expo Router file-based routing
  - Create `mobile/app/_layout.tsx` (root layout)
  - Create `mobile/app/(tabs)/_layout.tsx` (tab navigation)
  - Create `mobile/app/(tabs)/index.tsx` (home/scanner screen)
  - Create `mobile/app/company/[id].tsx` (company detail)
  - Create `mobile/app/+not-found.tsx`

- [ ] T010 [P] Configure NativeWind (Tailwind for RN)
  - Install and configure NativeWind
  - Create `mobile/tailwind.config.js`
  - Test styling with basic Text component
  - Verify hot reload works

- [ ] T011 [P] Setup TanStack Query client
  - Create `mobile/src/lib/queryClient.ts`
  - Configure default options (staleTime, retry, etc.)
  - Wrap app with QueryClientProvider in `_layout.tsx`

**Checkpoint**: Foundation ready - feature implementation can now begin

---

## Phase 2: Backend Core - Caching & API Tracking (US5 - P1)

**Purpose**: Implement Pappers caching to respect 250 calls/month limit

**User Story 5**: Cache intelligent des données Pappers

### Database Entities & Migrations

- [ ] T012 [P] [US5] Create PappersCache entity
  - File: `api/src/modules/cache/pappers-cache.entity.ts`
  - Fields: id, siren (unique), responseData (json), fetchedAt, expiresAt
  - Calculate expiresAt = fetchedAt + 30 days

- [ ] T013 [P] [US5] Create ApiUsageLog entity
  - File: `api/src/modules/cache/api-usage-log.entity.ts`
  - Fields: id, api (enum), endpoint, requestParams, success, errorMessage, timestamp
  - Enum: PAPPERS, OPEN_FOOD_FACTS, OPEN_BEAUTY_FACTS

- [ ] T014 [US5] Create migration for cache tables
  - Run `pnpm migration:create add-cache-tables`
  - Add PappersCache and ApiUsageLog tables
  - Test migration: `pnpm migration:up && pnpm migration:down`

### Cache Module Implementation

- [ ] T015 [P] [US5] Create CacheModule structure
  - File: `api/src/modules/cache/cache.module.ts`
  - Import MikroORM entities
  - Export CacheService

- [ ] T016 [US5] Implement CacheService
  - File: `api/src/modules/cache/cache.service.ts`
  - Method: `async getCachedPappers(siren: string): Promise<any | null>`
  - Method: `async setCachedPappers(siren: string, data: any): Promise<void>`
  - Method: `async isCacheValid(siren: string): Promise<boolean>` (check expiresAt)
  - Method: `async getMonthlyApiUsage(api: ExternalApi): Promise<number>`
  - Method: `async logApiCall(api, endpoint, params, success, error?): Promise<void>`

- [ ] T017 [US5] Implement quota monitoring logic
  - File: `api/src/modules/cache/cache.service.ts`
  - Method: `async checkPappersQuota(): Promise<{ used: number, limit: number, remaining: number }>`
  - Count PAPPERS logs for current month
  - Emit warning if usage >= 200

- [ ] T018 [US5] Implement email alert service
  - File: `api/src/modules/cache/email.service.ts`
  - Configure Nodemailer with SMTP (Gmail)
  - Method: `async sendQuotaAlert(usage: number): Promise<void>`
  - Environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL
  - Send alert when usage reaches 200 calls

### Tests for Cache Module

- [ ] T019 [P] [US5] Write unit tests for CacheService
  - File: `api/src/modules/cache/__tests__/cache.service.spec.ts`
  - Test: getCachedPappers returns null for missing SIREN
  - Test: getCachedPappers returns data for valid cache
  - Test: isCacheValid returns false for expired cache (>30 days)
  - Test: getMonthlyApiUsage counts correctly

- [ ] T020 [P] [US5] Write unit tests for quota monitoring
  - File: `api/src/modules/cache/__tests__/quota.spec.ts`
  - Test: checkPappersQuota returns correct usage
  - Test: Email alert sent at 200 calls
  - Mock Nodemailer

**Checkpoint**: Cache infrastructure ready for Pappers integration

---

## Phase 3: Backend Data Layer (US1 - P1)

**Purpose**: Create entities and services for products, brands, companies

**User Story 1**: Scanner un produit et voir l'entreprise propriétaire

### Database Entities & Migrations

- [ ] T021 [P] [US1] Create Product entity
  - File: `api/src/modules/product/product.entity.ts`
  - Fields: id, barcode (unique), name, category, imageUrl, source (enum: OFF/OBF), brand (ManyToOne), createdAt, updatedAt

- [ ] T022 [P] [US1] Create Brand entity
  - File: `api/src/modules/brand/brand.entity.ts`
  - Fields: id, name (unique), siren (unique), createdAt, updatedAt
  - OneToMany: products

- [ ] T023 [P] [US1] Create Company entity
  - File: `api/src/modules/company/company.entity.ts`
  - Fields: id, siren (unique), legalName, logoUrl, rawPappersData (json), lastFetchedAt, createdAt
  - JSON fields: executives (array), shareholders (array), subsidiaries (array)

- [ ] T024 [US1] Create migration for core entities
  - Run `pnpm migration:create add-core-entities`
  - Add Product, Brand, Company tables
  - Test migration

### Brand Seed Data

- [ ] T025 [US1] Create brands seed file
  - File: `api/src/seeders/brands.seed.ts`
  - Load data from research phase (R004)
  - Insert top 100 French brands with SIREN mappings
  - Test: `pnpm seed`

### Product Module (Open Food Facts Integration)

- [ ] T026 [P] [US1] Create ProductModule structure
  - File: `api/src/modules/product/product.module.ts`
  - Import Product entity
  - Export ProductService

- [ ] T027 [US1] Implement ProductService
  - File: `api/src/modules/product/product.service.ts`
  - Method: `async fetchFromOpenFoodFacts(barcode: string): Promise<ProductDTO | null>`
  - HTTP client: call `https://world.openfoodfacts.org/api/v2/product/{barcode}`
  - Parse response: extract name, category, imageUrl, brand
  - Method: `async saveProduct(data: ProductDTO, source: 'OFF' | 'OBF'): Promise<Product>`
  - Link product to Brand entity if brand exists in DB

- [ ] T028 [P] [US1] Create ProductController
  - File: `api/src/modules/product/product.controller.ts`
  - Endpoint: `GET /api/products/:barcode` (for debugging)
  - Return product info

### Company Module (Pappers Integration)

- [ ] T029 [P] [US1] Create CompanyModule structure
  - File: `api/src/modules/company/company.module.ts`
  - Import Company entity, CacheService
  - Export CompanyService, PappersService

- [ ] T030 [US1] Implement PappersService (cache-first)
  - File: `api/src/modules/company/pappers.service.ts`
  - Inject CacheService
  - Method: `async getCompanyBySiren(siren: string): Promise<CompanyDTO>`
  - Logic:
    1. Check cache with CacheService.getCachedPappers()
    2. If cache valid (<30 days), return cached data
    3. If cache missing/expired AND quota available, call Pappers API
    4. Parse Pappers response: extract legalName, logoUrl, executives, shareholders
    5. Save to cache with CacheService.setCachedPappers()
    6. Log API call with CacheService.logApiCall()
    7. Return CompanyDTO

- [ ] T031 [US1] Implement CompanyService
  - File: `api/src/modules/company/company.service.ts`
  - Method: `async getOrCreateCompany(siren: string): Promise<Company>`
  - Call PappersService.getCompanyBySiren()
  - Save Company entity to database
  - Method: `async getCompanyById(id: number): Promise<Company>`

- [ ] T032 [P] [US1] Create CompanyController
  - File: `api/src/modules/company/company.controller.ts`
  - Endpoint: `GET /api/companies/:siren` (OpenAPI: getCompany)
  - Return CompanyDTO with executives and shareholders

### Tests for Data Layer

- [ ] T033 [P] [US1] Write integration tests for ProductService
  - File: `api/src/modules/product/__tests__/product.service.spec.ts`
  - Test: fetchFromOpenFoodFacts with real barcode (3017620422003)
  - Test: saveProduct creates entity in DB

- [ ] T034 [P] [US1] Write unit tests for PappersService
  - File: `api/src/modules/company/__tests__/pappers.service.spec.ts`
  - Test: getCompanyBySiren returns cached data if valid
  - Test: getCompanyBySiren calls Pappers API if cache expired
  - Test: getCompanyBySiren skips API call if quota exhausted
  - Mock CacheService, mock HTTP client

- [ ] T035 [P] [US1] Write integration tests for CompanyController
  - File: `api/src/modules/company/__tests__/company.controller.spec.ts`
  - Test: GET /api/companies/552108011 returns 200 with CompanyDTO
  - Test: GET /api/companies/invalid returns 404

**Checkpoint**: Data layer complete - ready for scan endpoint

---

## Phase 4: Backend Scan Endpoint (US1 - P1)

**Purpose**: Main endpoint that orchestrates product lookup → brand mapping → company data

**User Story 1**: Scanner un produit et voir l'entreprise propriétaire

### Scan Module

- [ ] T036 [P] [US1] Create ScanModule structure
  - File: `api/src/modules/scan/scan.module.ts`
  - Import ProductService, CompanyService, BrandService
  - Export ScanService

- [ ] T037 [US1] Create BrandService (helper for mapping)
  - File: `api/src/modules/brand/brand.service.ts`
  - Method: `async findBrandByName(name: string): Promise<Brand | null>`
  - Fuzzy matching logic for brand names

- [ ] T038 [US1] Implement ScanService (orchestrator)
  - File: `api/src/modules/scan/scan.service.ts`
  - Method: `async scanProduct(barcode: string): Promise<ScanResultDTO>`
  - Logic:
    1. Call ProductService.fetchFromOpenFoodFacts(barcode)
    2. If not found, return 404 error
    3. Extract brand name from product data
    4. Call BrandService.findBrandByName(brand)
    5. If brand not found in DB, return error "Marque non référencée"
    6. Get SIREN from Brand entity
    7. Call CompanyService.getOrCreateCompany(siren)
    8. Return ScanResultDTO: { product, company, dataFreshness }

- [ ] T039 [P] [US1] Create ScanController
  - File: `api/src/modules/scan/scan.controller.ts`
  - Endpoint: `POST /api/scan` (OpenAPI: scanProduct)
  - Body: `{ barcode: string }`
  - Response: ScanResultDTO or 404

- [ ] T040 [US1] Generate OpenAPI schema
  - Run NestJS Swagger plugin
  - Export OpenAPI spec to `api/openapi.json`
  - Verify contracts match `specs/mobile-app-rewrite/contracts/scan.openapi.yaml`

### Tests for Scan Endpoint

- [ ] T041 [P] [US1] Write integration tests for ScanService
  - File: `api/src/modules/scan/__tests__/scan.service.spec.ts`
  - Test: scanProduct with valid barcode returns ScanResultDTO
  - Test: scanProduct with unknown barcode returns 404
  - Test: scanProduct with unknown brand returns error

- [ ] T042 [P] [US1] Write E2E test for scan flow
  - File: `api/test/scan-flow.e2e-spec.ts`
  - Test: POST /api/scan with Nespresso barcode
  - Assert: Response contains Nestlé company data
  - Assert: Pappers cache is populated

**Checkpoint**: Backend scan endpoint fully functional

---

## Phase 5: Mobile Scanner Screen (US1 - P1)

**Purpose**: Barcode scanner UI in mobile app

**User Story 1**: Scanner un produit et voir l'entreprise propriétaire

### API Client Generation

- [ ] T043 [US1] Generate mobile API client from OpenAPI
  - Install @hey-api/openapi-ts in mobile/
  - Configure to generate from `api/openapi.json`
  - Output to `mobile/src/api/`
  - Script: `pnpm generate:types`
  - Files generated: `client.ts`, `types.ts`, `hooks.ts` (TanStack Query)

### Scanner Feature

- [ ] T044 [P] [US1] Create scanner feature structure
  - Directory: `mobile/src/features/scanner/`
  - Subdirs: `components/`, `hooks/`

- [ ] T045 [P] [US1] Implement BarcodeScanner component
  - File: `mobile/src/features/scanner/components/BarcodeScanner.tsx`
  - Use expo-barcode-scanner
  - Request camera permissions with Permissions API
  - Handle barcode detection event
  - Emit onScan(barcode: string) callback

- [ ] T046 [P] [US1] Implement ScanOverlay component
  - File: `mobile/src/features/scanner/components/ScanOverlay.tsx`
  - Visual guideline frame for centering barcode
  - Loading indicator when API call in progress
  - Error message display

- [ ] T047 [US1] Implement useBarcodeScanner hook
  - File: `mobile/src/features/scanner/hooks/useBarcodeScanner.ts`
  - Manage scanner state (idle, scanning, loading, success, error)
  - Call generated `useScanProduct` hook from API client
  - Handle success: navigate to company detail screen
  - Handle error: display error message in overlay

- [ ] T048 [US1] Implement Scanner screen
  - File: `mobile/app/(tabs)/index.tsx`
  - Render BarcodeScanner component
  - Render ScanOverlay component
  - Handle permissions denied: show permission request UI
  - Handle offline: show "Connexion internet requise" message

**Checkpoint**: Scanner screen functional - ready for company detail

---

## Phase 6: Mobile Company Detail Screen (US2, US3 - P1)

**Purpose**: Display company info, executives, shareholders

**User Stories 2 & 3**: Voir les dirigeants et actionnaires

### Company Feature

- [ ] T049 [P] [US2/3] Create company feature structure
  - Directory: `mobile/src/features/company/`
  - Subdirs: `components/`, `hooks/`

- [ ] T050 [P] [US2] Implement CompanyHeader component
  - File: `mobile/src/features/company/components/CompanyHeader.tsx`
  - Display: company logo, legal name, SIREN
  - Display: "Données au [DATE]" badge (lastFetchedAt)

- [ ] T051 [P] [US2] Implement ExecutivesList component
  - File: `mobile/src/features/company/components/ExecutivesList.tsx`
  - Display: List of executives with name + role
  - CEO at top with "Directeur Général" badge
  - Touchable cards (future: modal with details)

- [ ] T052 [P] [US3] Implement ShareholdersList component
  - File: `mobile/src/features/company/components/ShareholdersList.tsx`
  - Display: List of shareholders with name + percentage
  - Distinguish individual vs corporate (icon or badge)
  - Sort by percentage descending

- [ ] T053 [US2/3] Implement useCompanyData hook
  - File: `mobile/src/features/company/hooks/useCompanyData.ts`
  - Use generated `useGetCompany` hook from API client
  - Handle loading, error states
  - Return: { company, executives, shareholders, isLoading, error }

- [ ] T054 [US2/3] Implement Company Detail screen
  - File: `mobile/app/company/[id].tsx`
  - Get SIREN from route params
  - Call useCompanyData(siren)
  - Render: CompanyHeader, ExecutivesList, ShareholdersList
  - Render: Share button (native share sheet with company URL)
  - Handle loading: skeleton UI
  - Handle error: error message + retry button

### Share Functionality

- [ ] T055 [P] [US1] Implement share functionality
  - Use React Native Share API
  - Share text: "Découvrez [Company Name] sur B-Spot"
  - Share URL: deep link to company (future: https://b-spot.app/company/:siren)

**Checkpoint**: Company detail screen complete with executives and shareholders

---

## Phase 7: Mobile Offline Support (Clarified - Cache Limited)

**Purpose**: Display cached data when offline, disable new scans

### Offline Infrastructure

- [ ] T056 [P] [Offline] Configure TanStack Query persister
  - File: `mobile/src/lib/queryClient.ts`
  - Install @tanstack/query-async-storage-persister
  - Configure AsyncStorage persister
  - Set cacheTime: 7 days (cached company data available for 7 days offline)

- [ ] T057 [P] [Offline] Implement useOfflineStatus hook
  - File: `mobile/src/features/common/hooks/useOfflineStatus.ts`
  - Use NetInfo from @react-native-community/netinfo
  - Return: { isOffline: boolean }

- [ ] T058 [Offline] Update Scanner screen for offline mode
  - File: `mobile/app/(tabs)/index.tsx`
  - If isOffline = true, disable scanner
  - Show message: "Mode hors-ligne : scanner désactivé. Données en cache disponibles."

- [ ] T059 [Offline] Update Company Detail for offline mode
  - File: `mobile/app/company/[id].tsx`
  - If isOffline AND data in cache, display cached data
  - If isOffline AND no cache, show message: "Données non disponibles hors-ligne"

**Checkpoint**: Offline support implemented

---

## Phase 8: Open Beauty Facts Support (US4 - P2)

**Purpose**: Extend product lookup to cosmetics

**User Story 4**: Support cosmétiques via Open Beauty Facts

### Product Service Extension

- [ ] T060 [US4] Extend ProductService for Open Beauty Facts
  - File: `api/src/modules/product/product.service.ts`
  - Method: `async fetchFromOpenBeautyFacts(barcode: string): Promise<ProductDTO | null>`
  - HTTP client: call `https://world.openbeautyfacts.org/api/v2/product/{barcode}`
  - Update `fetchProduct()` to try OFF first, then OBF if 404

- [ ] T061 [US4] Update ScanService to support OBF
  - File: `api/src/modules/scan/scan.service.ts`
  - Update scanProduct() to call new ProductService logic
  - Return source: 'OFF' or 'OBF' in ScanResultDTO

### Mobile UI Updates

- [ ] T062 [P] [US4] Add product type badge in Company Detail
  - File: `mobile/src/features/company/components/CompanyHeader.tsx`
  - Display badge: "Produit alimentaire" (OFF) or "Produit cosmétique" (OBF)

**Checkpoint**: Open Beauty Facts support added

---

## Phase 9: Error Handling & Edge Cases (FR-026 to FR-029)

**Purpose**: Handle all error scenarios gracefully

### Backend Error Handling

- [ ] T063 [P] [Errors] Implement custom exceptions
  - File: `api/src/shared/exceptions/`
  - ProductNotFoundException
  - BrandNotMappedException
  - PappersUnavailableException
  - QuotaExhaustedException

- [ ] T064 [Errors] Add global exception filter
  - File: `api/src/shared/filters/http-exception.filter.ts`
  - Map exceptions to HTTP status codes + user-friendly messages
  - Log errors with context

### Mobile Error Handling

- [ ] T065 [P] [Errors] Create error UI components
  - File: `mobile/src/features/common/components/ErrorMessage.tsx`
  - Props: message, onRetry callback
  - Display: icon, message, "Réessayer" button

- [ ] T066 [Errors] Handle "Product not found" error in Scanner
  - File: `mobile/app/(tabs)/index.tsx`
  - Display: "Produit non référencé" with illustration
  - Option: "Contribuer" button (future: community contributions)

- [ ] T067 [Errors] Handle "Company not in Pappers" error
  - File: `mobile/app/company/[id].tsx`
  - Display: "Entreprise non disponible dans Pappers"

- [ ] T068 [Errors] Handle "Quota exhausted" degraded mode
  - File: `api/src/modules/company/pappers.service.ts`
  - If quota >= 250, return cached data even if expired
  - Set flag in response: `quotaExhausted: true`
  - Mobile: display banner "Données en cache uniquement (quota épuisé)"

- [ ] T069 [Errors] Handle camera permission denial
  - File: `mobile/app/(tabs)/index.tsx`
  - If permission denied, show UI: "Permission caméra requise" + "Ouvrir les paramètres" button

**Checkpoint**: All error cases handled

---

## Phase 10: Testing & Validation (Principle 6: Test-Driven Quality)

**Purpose**: Comprehensive testing before deployment

### Backend Tests

- [ ] T070 [P] [Tests] Write integration tests for scan flow
  - File: `api/test/scan-flow.e2e-spec.ts`
  - Test: Full flow from barcode → company data
  - Assert: Pappers called only once per SIREN
  - Assert: Cache hit on second scan

- [ ] T071 [P] [Tests] Write integration tests for cache expiry
  - File: `api/src/modules/cache/__tests__/cache-expiry.spec.ts`
  - Test: Cache expires after 30 days
  - Test: Pappers re-called for expired cache

- [ ] T072 [P] [Tests] Write integration tests for quota limit
  - File: `api/src/modules/cache/__tests__/quota.spec.ts`
  - Test: Quota limit enforced at 250 calls
  - Test: Email alert sent at 200 calls

### Load Testing

- [ ] T073 [Tests] Load test: Simulate 1000 scans
  - Use k6 or Artillery
  - Simulate 1000 unique product scans
  - Target: <250 Pappers API calls (cache hit rate >75%)
  - Assert: API response time <500ms p95

### Manual E2E Testing

- [ ] T074 [Tests] Manual E2E: iOS device
  - Install app on iPhone via Expo Go
  - Test: Scan Nespresso product → see Nestlé data
  - Test: Scan unknown product → see error message
  - Test: Offline mode → cached data displayed
  - Test: Scanner permissions → grant/deny flows

- [ ] T075 [Tests] Manual E2E: Android device
  - Install app on Android device
  - Same tests as T074
  - Verify cross-platform consistency

**Checkpoint**: All tests passing, ready for deployment

---

## Phase 11: Deployment (Docker + Dokploy + EAS)

**Purpose**: Deploy to production

### Backend Deployment

- [ ] T076 [P] [Deploy] Create Dockerfile for API
  - File: `api/Dockerfile`
  - Multi-stage build: builder + runtime
  - Install dependencies, build NestJS app
  - Expose port 3000

- [ ] T077 [P] [Deploy] Create production docker-compose.yml
  - File: `docker-compose.prod.yml`
  - Services: API, PostgreSQL
  - Environment variables from `.env`
  - Health checks

- [ ] T078 [Deploy] Configure environment variables for Dokploy
  - Document required env vars in README
  - Vars: DATABASE_URL, PAPPERS_API_KEY, SMTP_*, ADMIN_EMAIL

- [ ] T079 [Deploy] Deploy to Dokploy instance
  - Push Docker image to registry
  - Configure Dokploy project
  - Deploy API service
  - Run migrations: `pnpm migration:up`
  - Run seed: `pnpm seed`
  - Verify: Health check at https://api.b-spot.app/health

### Mobile Deployment

- [ ] T080 [P] [Deploy] Configure EAS Build
  - File: `mobile/eas.json`
  - Configure build profiles: development, preview, production
  - Set bundle identifier (iOS), package name (Android)

- [ ] T081 [Deploy] Build Android APK with EAS
  - Run: `eas build --platform android --profile production`
  - Download APK
  - Test: Install on Android device and smoke test

- [ ] T082 [Deploy] Build iOS app with EAS (TestFlight)
  - Run: `eas build --platform ios --profile production`
  - Submit to TestFlight
  - Invite beta testers

**Checkpoint**: Production deployment complete

---

## Post-Implementation Tasks

### Documentation

- [ ] T083 [P] [Docs] Write API documentation
  - Document OpenAPI endpoints in Swagger UI
  - Add examples for each endpoint

- [ ] T084 [P] [Docs] Update README with deployment instructions
  - File: `README.md`
  - Add production setup section
  - Add environment variables reference

- [ ] T085 [P] [Docs] Create developer quickstart guide
  - File: `specs/mobile-app-rewrite/quickstart.md`
  - Clone → setup → run (already in plan.md)

### Monitoring

- [ ] T086 [P] [Ops] Setup logging and monitoring
  - Consider: Sentry for error tracking
  - Consider: LogRocket for mobile session replay
  - Monitor Pappers API usage weekly

---

## Summary

**Total Tasks**: 86 tasks
- **Research (Phase 0)**: 7 tasks
- **Setup (Phase 1)**: 11 tasks
- **Backend Core (Phase 2)**: 9 tasks
- **Backend Data Layer (Phase 3)**: 15 tasks
- **Backend Scan (Phase 4)**: 7 tasks
- **Mobile Scanner (Phase 5)**: 6 tasks
- **Mobile Company (Phase 6)**: 7 tasks
- **Offline Support (Phase 7)**: 4 tasks
- **Open Beauty Facts (Phase 8)**: 3 tasks
- **Error Handling (Phase 9)**: 7 tasks
- **Testing (Phase 10)**: 6 tasks
- **Deployment (Phase 11)**: 7 tasks
- **Post-Implementation**: 3 tasks

**Critical Path (MVP)**:
1. Research (R001-R007) → 2. Setup (T001-T011) → 3. Cache (T012-T020) → 4. Data Layer (T021-T035) → 5. Scan API (T036-T042) → 6. Mobile Scanner (T043-T048) → 7. Company Detail (T049-T055) → 8. Testing (T070-T075) → 9. Deploy (T076-T082)

**Estimated MVP Timeline**: 4-6 weeks (with 1 developer)
- Phase 0-1: 1 week
- Phase 2-4: 2 weeks
- Phase 5-7: 1.5 weeks
- Phase 9-11: 1.5 weeks
