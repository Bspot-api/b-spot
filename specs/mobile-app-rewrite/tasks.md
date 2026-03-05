# Tasks: Refonte B-Spot - Application Mobile de Scan Produits

**Input**: Design documents from `specs/mobile-app-rewrite/`
**Prerequisites**: [plan.md](./plan.md) ✅, [spec.md](./spec.md) ✅

**Tests**: Integration tests are MANDATORY for API core modules (scan, product, company, cache). Mobile UI tests are OPTIONAL for MVP.

**Organization**: Tasks are grouped by phase and user story to enable independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, Foundation, Research)
- All paths follow monorepo structure: `apps/api/src/` and `apps/mobile/src/`

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
  - **Output**: `apps/api/src/seeders/brands.seed.ts` (initial data)
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
  - **Output**: `apps/api/.env.example` (SMTP config)
  - **Result**: ✅ Gmail SMTP sufficient for MVP (<10 emails/month)

**Checkpoint**: Research complete - proceed to setup phase

---

## Phase 1: Setup & Infrastructure (Foundational)

**Purpose**: Project initialization and basic structure

**⚠️ CRITICAL**: No feature work can begin until this phase is complete

### Monorepo Setup

- [X] T001 Initialize pnpm workspace structure
  - Create `api/` and `mobile/` directories
  - Update `pnpm-workspace.yaml`
  - Create root package.json scripts (dev, build, test)

- [X] T002 [P] Setup API package structure
  - Create `api/package.json`
  - Install NestJS 10+ dependencies
  - Install MikroORM 6+ with PostgreSQL driver
  - Install Zod, Nodemailer, @nestjs/swagger
  - Create `api/tsconfig.json` with strict mode

- [X] T003 [P] Setup Mobile package structure
  - Initialize Expo project in `mobile/`
  - Install Expo SDK ~52.0
  - Install Expo Router, NativeWind, Zustand, TanStack Query
  - Install expo-camera, Lucide React Native
  - Create `mobile/tsconfig.json` with strict mode

### Database Setup

- [X] T004 Create docker-compose.yml for PostgreSQL
  - PostgreSQL 15+ service
  - Environment variables for credentials
  - Volume for data persistence
  - Expose port 5432

- [X] T005 Configure MikroORM
  - Create `api/mikro-orm.config.ts`
  - Configure PostgreSQL connection
  - Set up migrations directory: `apps/api/src/migrations/`
  - Set up seeders directory: `apps/api/src/seeders/`

- [X] T006 Create initial database migration
  - Run `pnpm migration:create` to generate initial migration
  - Verify migration structure
  - Test: `pnpm db:up && pnpm migration:up`

### API Foundation

- [X] T007 [P] Setup NestJS application structure
  - Create `apps/api/src/main.ts` with NestJS bootstrap
  - Create `apps/api/src/app.module.ts`
  - Configure CORS for mobile access
  - Configure Swagger/OpenAPI at `/api` endpoint
  - Add global validation pipe (Zod)

- [X] T008 [P] Create Health module
  - Create `apps/api/src/modules/health/health.controller.ts`
  - Implement `GET /health` endpoint
  - Return { status: 'ok', timestamp, version }
  - Test: `curl http://localhost:3001/health`

### Mobile Foundation

- [X] T009 [P] Setup Expo Router file-based routing
  - Create `apps/mobile/app/_layout.tsx` (root layout)
  - Create `apps/mobile/app/(tabs)/_layout.tsx` (tab navigation)
  - Create `apps/mobile/app/(tabs)/index.tsx` (home/scanner screen)
  - Create `apps/mobile/app/company/[id].tsx` (company detail)
  - Create `apps/mobile/app/+not-found.tsx`

- [X] T010 [P] Configure NativeWind (Tailwind for RN)
  - Install and configure NativeWind
  - Create `mobile/tailwind.config.js`
  - Test styling with basic Text component
  - Verify hot reload works

- [X] T011 [P] Setup TanStack Query client
  - Create `apps/mobile/src/api/query-client.ts`
  - Configure default options (staleTime, retry, etc.)
  - Wrap app with QueryClientProvider in `_layout.tsx`
  - Configure AsyncStorage persister for offline support

**Checkpoint**: Foundation ready - feature implementation can now begin

---

## Phase 2: Backend Core - Caching & API Tracking (US5 - P1)

**Purpose**: Implement Pappers caching to respect 250 calls/month limit

**User Story 5**: Cache intelligent des données Pappers

### Database Entities & Migrations

- [X] T012 [P] [US5] Create PappersCache entity
  - File: `apps/api/src/modules/cache/pappers-cache.entity.ts`
  - Fields: id, siren (unique), responseData (json), fetchedAt, expiresAt
  - Calculate expiresAt = fetchedAt + 30 days

- [X] T013 [P] [US5] Create ApiUsageLog entity
  - File: `apps/api/src/modules/cache/api-usage-log.entity.ts`
  - Fields: id, api (enum), endpoint, requestParams, success, errorMessage, timestamp
  - Enum: PAPPERS, OPEN_FOOD_FACTS, OPEN_BEAUTY_FACTS

- [X] T014 [US5] Create migration for cache tables
  - Run `pnpm migration:create add-cache-tables`
  - Add PappersCache and ApiUsageLog tables
  - Test migration: `pnpm migration:up && pnpm migration:down`

### Cache Module Implementation

- [X] T015 [P] [US5] Create CacheModule structure
  - File: `apps/api/src/modules/cache/cache.module.ts`
  - Import MikroORM entities
  - Export CacheService

- [X] T016 [US5] Implement CacheService
  - File: `apps/api/src/modules/cache/cache.service.ts`
  - Method: `async getCachedPappers(siren: string): Promise<any | null>`
  - Method: `async setCachedPappers(siren: string, data: any): Promise<void>`
  - Method: `async isCacheValid(siren: string): Promise<boolean>` (check expiresAt)
  - Method: `async getMonthlyApiUsage(api: ExternalApi): Promise<number>`
  - Method: `async logApiCall(api, endpoint, params, success, error?): Promise<void>`

- [X] T017 [US5] Implement quota monitoring logic
  - File: `apps/api/src/modules/cache/cache.service.ts`
  - Method: `async checkPappersQuota(): Promise<{ used: number, limit: number, remaining: number }>`
  - Count PAPPERS logs for current month
  - Emit warning if usage >= 200

- [X] T018 [US5] Implement email alert service
  - File: `apps/api/src/modules/cache/email.service.ts`
  - Configure Nodemailer with SMTP (Gmail)
  - Method: `async sendQuotaAlert(usage: number): Promise<void>`
  - Environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL
  - Send alert when usage reaches 200 calls

### Tests for Cache Module

- [X] T019 [P] [US5] Write unit tests for CacheService
  - File: `apps/api/src/modules/cache/__tests__/cache.service.spec.ts`
  - Test: getCachedPappers returns null for missing SIREN
  - Test: getCachedPappers returns data for valid cache
  - Test: isCacheValid returns false for expired cache (>30 days)
  - Test: getMonthlyApiUsage counts correctly

- [X] T020 [P] [US5] Write unit tests for quota monitoring
  - File: `apps/api/src/modules/cache/__tests__/quota.spec.ts`
  - Test: checkPappersQuota returns correct usage
  - Test: Email alert sent at 200 calls
  - Mock Nodemailer

**Checkpoint**: Cache infrastructure ready for Pappers integration

---

## Phase 3: Backend Data Layer (US1 - P1)

**Purpose**: Create entities and services for products, brands, companies

**User Story 1**: Scanner un produit et voir l'entreprise propriétaire

### Database Entities & Migrations

- [X] T021 [P] [US1] Create Product entity
  - File: `apps/api/src/modules/product/product.entity.ts`
  - Fields: id, barcode (unique), name, category, imageUrl, source (enum: OFF/OBF), brand (ManyToOne), createdAt, updatedAt

- [X] T022 [P] [US1] Create Brand entity
  - File: `apps/api/src/modules/brand/brand.entity.ts`
  - Fields: id, name (unique), siren (unique), createdAt, updatedAt
  - OneToMany: products

- [X] T023 [P] [US1] Create Company entity
  - File: `apps/api/src/modules/company/company.entity.ts`
  - Fields: id, siren (unique), legalName, logoUrl, rawPappersData (json), lastFetchedAt, createdAt
  - JSON fields: executives (array), shareholders (array), subsidiaries (array)

- [X] T024 [US1] Create migration for core entities
  - Run `pnpm migration:create add-core-entities`
  - Add Product, Brand, Company tables
  - Test migration

### Brand Seed Data

- [X] T025 [US1] Create brands seed file
  - File: `apps/api/src/seeders/brands.seed.ts`
  - Load data from research phase (R004)
  - Insert top 100 French brands with SIREN mappings
  - Test: `pnpm seed`

### Product Module (Open Food Facts Integration)

- [X] T026 [P] [US1] Create ProductModule structure
  - File: `apps/api/src/modules/product/product.module.ts`
  - Import Product entity
  - Export ProductService

- [X] T027 [US1] Implement ProductService
  - File: `apps/api/src/modules/product/product.service.ts`
  - Method: `async fetchFromOpenFoodFacts(barcode: string): Promise<ProductDTO | null>`
  - HTTP client: call `https://world.openfoodfacts.org/api/v2/product/{barcode}`
  - Parse response: extract name, category, imageUrl, brand
  - Method: `async saveProduct(data: ProductDTO, source: 'OFF' | 'OBF'): Promise<Product>`
  - Link product to Brand entity if brand exists in DB

- [X] T028 [P] [US1] Create ProductController
  - File: `apps/api/src/modules/product/product.controller.ts`
  - Endpoint: `GET /api/products/:barcode` (for debugging)
  - Return product info

### Company Module (Pappers Integration)

- [X] T029 [P] [US1] Create CompanyModule structure
  - File: `apps/api/src/modules/company/company.module.ts`
  - Import Company entity, CacheService
  - Export CompanyService, PappersService

- [X] T030 [US1] Implement PappersService (cache-first)
  - File: `apps/api/src/modules/company/pappers.service.ts`
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

- [X] T031 [US1] Implement CompanyService
  - File: `apps/api/src/modules/company/company.service.ts`
  - Method: `async getOrCreateCompany(siren: string): Promise<Company>`
  - Call PappersService.getCompanyBySiren()
  - Save Company entity to database
  - Method: `async getCompanyById(id: number): Promise<Company>`

- [X] T032 [P] [US1] Create CompanyController
  - File: `apps/api/src/modules/company/company.controller.ts`
  - Endpoint: `GET /api/companies/:siren` (OpenAPI: getCompany)
  - Return CompanyDTO with executives and shareholders

### Tests for Data Layer

- [X] T033 [P] [US1] Write integration tests for ProductService
  - File: `apps/api/src/modules/product/__tests__/product.service.spec.ts`
  - Test: fetchFromOpenFoodFacts with real barcode (3017620422003)
  - Test: saveProduct creates entity in DB

- [X] T034 [P] [US1] Write unit tests for PappersService
  - File: `apps/api/src/modules/company/__tests__/pappers.service.spec.ts`
  - Test: getCompanyBySiren returns cached data if valid
  - Test: getCompanyBySiren calls Pappers API if cache expired
  - Test: getCompanyBySiren skips API call if quota exhausted
  - Mock CacheService, mock HTTP client

- [X] T035 [P] [US1] Write integration tests for CompanyController
  - File: `apps/api/src/modules/company/__tests__/company.controller.spec.ts`
  - Test: GET /api/companies/552108011 returns 200 with CompanyDTO
  - Test: GET /api/companies/invalid returns 404

**Checkpoint**: Data layer complete - ready for scan endpoint

---

## Phase 4: Backend Scan Endpoint (US1 - P1)

**Purpose**: Main endpoint that orchestrates product lookup → brand mapping → company data

**User Story 1**: Scanner un produit et voir l'entreprise propriétaire

### Scan Module

- [X] T036 [P] [US1] Create ScanModule structure
  - File: `apps/api/src/modules/scan/scan.module.ts`
  - Import ProductService, CompanyService, BrandService
  - Export ScanService

- [X] T037 [US1] Create BrandService (helper for mapping)
  - File: `apps/api/src/modules/brand/brand.service.ts`
  - Method: `async findBrandByName(name: string): Promise<Brand | null>`
  - Fuzzy matching logic for brand names

- [X] T038 [US1] Implement ScanService (orchestrator)
  - File: `apps/api/src/modules/scan/scan.service.ts`
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

- [X] T039 [P] [US1] Create ScanController
  - File: `apps/api/src/modules/scan/scan.controller.ts`
  - Endpoint: `POST /api/scan` (OpenAPI: scanProduct)
  - Body: `{ barcode: string }`
  - Response: ScanResultDTO or 404

- [X] T040 [US1] Generate OpenAPI schema
  - Run NestJS Swagger plugin
  - Export OpenAPI spec to `apps/api/openapi.json`
  - Verify contracts match `specs/mobile-app-rewrite/contracts/scan.openapi.yaml`

### Tests for Scan Endpoint

- [X] T041 [P] [US1] Write integration tests for ScanService
  - File: `apps/api/src/modules/scan/__tests__/scan.service.spec.ts`
  - Test: scanProduct with valid barcode returns ScanResultDTO
  - Test: scanProduct with unknown barcode returns 404
  - Test: scanProduct with unknown brand returns error

- [X] T042 [P] [US1] Write E2E test for scan flow
  - File: `apps/api/test/scan-flow.e2e-spec.ts`
  - Test: POST /api/scan with Nespresso barcode
  - Assert: Response contains Nestlé company data
  - Assert: Pappers cache is populated

**Checkpoint**: Backend scan endpoint fully functional

---

## Phase 5: Mobile Scanner Screen (US1 - P1)

**Purpose**: Barcode scanner UI in mobile app

**User Story 1**: Scanner un produit et voir l'entreprise propriétaire

### API Client Generation

- [X] T043 [US1] Generate mobile API client from OpenAPI
  - Install @hey-api/openapi-ts in mobile/
  - Configure to generate from `apps/api/openapi.json`
  - Output to `apps/mobile/src/api/`
  - Script: `pnpm generate:types`
  - Files generated: `client.ts`, `types.ts`, `hooks.ts` (TanStack Query)
  - **Note**: Implemented as hand-written types matching backend DTOs (API not running at build time)

### Scanner Feature

- [X] T044 [P] [US1] Create scanner feature structure
  - Directory: `apps/mobile/src/features/scanner/`
  - Subdirs: `components/`, `hooks/`

- [X] T045 [P] [US1] Implement BarcodeScanner component
  - File: `apps/mobile/src/features/scanner/components/BarcodeScanner.tsx`
  - Uses expo-camera CameraView + useCameraPermissions hook (SDK 54)
  - Request camera permissions with useCameraPermissions hook
  - Handle barcode detection event with debounce via local scanned state
  - Emit onScan(barcode: string) callback

- [X] T046 [P] [US1] Implement ScanOverlay component
  - File: `apps/mobile/src/features/scanner/components/ScanOverlay.tsx`
  - Visual guideline frame for centering barcode (corner markers)
  - Loading indicator when API call in progress
  - Error message display

- [X] T047 [US1] Implement useBarcodeScanner hook
  - File: `apps/mobile/src/features/scanner/hooks/useBarcodeScanner.ts`
  - Manage scanner state (idle, loading, success, error)
  - Call useScanProduct hook from API client
  - Handle success: navigate to company detail screen
  - Handle error: display error message in overlay with 3s reset

- [X] T048 [US1] Implement Scanner screen
  - File: `apps/mobile/app/(tabs)/index.tsx`
  - Render BarcodeScanner component
  - Render ScanOverlay component
  - Handle permissions denied: shown inside BarcodeScanner component

**Checkpoint**: Scanner screen functional - ready for company detail

---

## Phase 6: Mobile Company Detail Screen (US2, US3 - P1)

**Purpose**: Display company info, executives, shareholders

**User Stories 2 & 3**: Voir les dirigeants et actionnaires

### Company Feature

- [X] T049 [P] [US2/3] Create company feature structure
  - Directory: `apps/mobile/src/features/company/`
  - Subdirs: `components/`, `hooks/`

- [X] T050 [P] [US2] Implement CompanyHeader component
  - File: `apps/mobile/src/features/company/components/CompanyHeader.tsx`
  - Display: company logo, legal name, SIREN
  - Display: "Données au [DATE]" badge (lastFetchedAt)

- [X] T051 [P] [US2] Implement ExecutivesList component
  - File: `apps/mobile/src/features/company/components/ExecutivesList.tsx`
  - Display: List of executives with name + role
  - CEO at top with "Directeur Général" badge
  - Touchable cards (future: modal with details)

- [X] T052 [P] [US3] Implement ShareholdersList component
  - File: `apps/mobile/src/features/company/components/ShareholdersList.tsx`
  - Display: List of shareholders with name + percentage
  - Distinguish individual vs corporate (icon or badge)
  - Sort by percentage descending

- [X] T053 [US2/3] Implement useCompanyData hook
  - File: `apps/mobile/src/features/company/hooks/useCompanyData.ts`
  - Use generated `useGetCompany` hook from API client
  - Handle loading, error states
  - Return: { company, executives, shareholders, isLoading, error }

- [X] T054 [US2/3] Implement Company Detail screen
  - File: `apps/mobile/app/company/[id].tsx`
  - Get SIREN from route params
  - Call useCompanyData(siren)
  - Render: CompanyHeader, ExecutivesList, ShareholdersList
  - Render: Share button (native share sheet with company URL)
  - Handle loading: skeleton UI
  - Handle error: error message + retry button

### Share Functionality

- [X] T055 [P] [US1] Implement share functionality
  - Use React Native Share API
  - Share text: "Découvrez [Company Name] sur B-Spot"
  - Share URL: deep link to company (future: https://b-spot.app/company/:siren)

**Checkpoint**: Company detail screen complete with executives and shareholders

---

## Phase 7: Mobile Offline Support (Clarified - Cache Limited)

**Purpose**: Display cached data when offline, disable new scans

### Offline Infrastructure

- [X] T056 [P] [Offline] Configure TanStack Query persister
  - File: `apps/mobile/src/lib/queryClient.ts`
  - Install @tanstack/query-async-storage-persister
  - Configure AsyncStorage persister
  - Set cacheTime: 7 days (cached company data available for 7 days offline)
  - **Note**: Implemented at `apps/mobile/src/api/query-client.ts` with networkMode: 'offlineFirst'

- [ ] T057 [P] [Offline] Implement useOfflineStatus hook
  - File: `apps/mobile/src/features/common/hooks/useOfflineStatus.ts`
  - Use NetInfo from @react-native-community/netinfo
  - Return: { isOffline: boolean }

- [ ] T058 [Offline] Update Scanner screen for offline mode
  - File: `apps/mobile/app/(tabs)/index.tsx`
  - If isOffline = true, disable scanner
  - Show message: "Mode hors-ligne : scanner désactivé. Données en cache disponibles."

- [ ] T059 [Offline] Update Company Detail for offline mode
  - File: `apps/mobile/app/company/[id].tsx`
  - If isOffline AND data in cache, display cached data
  - If isOffline AND no cache, show message: "Données non disponibles hors-ligne"

**Checkpoint**: Offline support implemented

---

## Phase 8: Open Beauty Facts Support (US4 - P2)

**Purpose**: Extend product lookup to cosmetics

**User Story 4**: Support cosmétiques via Open Beauty Facts

### Product Service Extension

- [X] T060 [US4] Extend ProductService for Open Beauty Facts
  - File: `apps/api/src/modules/product/product.service.ts`
  - Method: `async fetchFromOpenBeautyFacts(barcode: string): Promise<ProductDTO | null>`
  - HTTP client: call `https://world.openbeautyfacts.org/api/v2/product/{barcode}`
  - Update `fetchProduct()` to try OFF first, then OBF only when OFF is functional "not found" (`status != 1`)

- [X] T061 [US4] Update ScanService to support OBF
  - File: `apps/api/src/modules/scan/scan.service.ts`
  - Update scanProduct() to call new ProductService logic
  - Return source: 'OFF' or 'OBF' in ScanResultDTO

### Mobile UI Updates

- [X] T062 [P] [US4] Add product type badge in Company Detail
  - File: `apps/mobile/src/features/company/components/CompanyHeader.tsx`
  - Display badge: "Produit alimentaire" (OFF) or "Produit cosmétique" (OBF)

**Checkpoint**: Open Beauty Facts support added

---

## Phase 9: Error Handling & Edge Cases (FR-026 to FR-029)

**Purpose**: Handle all error scenarios gracefully

### Backend Error Handling

- [ ] T063 [P] [Errors] Implement custom exceptions
  - File: `apps/api/src/shared/exceptions/`
  - ProductNotFoundException
  - BrandNotMappedException
  - PappersUnavailableException
  - QuotaExhaustedException

- [ ] T064 [Errors] Add global exception filter
  - File: `apps/api/src/shared/filters/http-exception.filter.ts`
  - Map exceptions to HTTP status codes + user-friendly messages
  - Log errors with context

### Mobile Error Handling

- [ ] T065 [P] [Errors] Create error UI components
  - File: `apps/mobile/src/features/common/components/ErrorMessage.tsx`
  - Props: message, onRetry callback
  - Display: icon, message, "Réessayer" button

- [ ] T066 [Errors] Handle "Product not found" error in Scanner
  - File: `apps/mobile/app/(tabs)/index.tsx`
  - Display: "Produit non référencé" with illustration
  - Option: "Contribuer" button (future: community contributions)

- [ ] T067 [Errors] Handle "Company not in Pappers" error
  - File: `apps/mobile/app/company/[id].tsx`
  - Display: "Entreprise non disponible dans Pappers"

- [ ] T068 [Errors] Handle "Quota exhausted" degraded mode
  - File: `apps/api/src/modules/company/pappers.service.ts`
  - If quota >= 250, return cached data even if expired
  - Set flag in response: `quotaExhausted: true`
  - Mobile: display banner "Données en cache uniquement (quota épuisé)"

- [ ] T069 [Errors] Handle camera permission denial
  - File: `apps/mobile/app/(tabs)/index.tsx`
  - If permission denied, show UI: "Permission caméra requise" + "Ouvrir les paramètres" button

**Checkpoint**: All error cases handled

---

## Phase 10: Testing & Validation (Principle 6: Test-Driven Quality)

**Purpose**: Comprehensive testing before deployment

### Backend Tests

- [ ] T070 [P] [Tests] Write integration tests for scan flow
  - File: `apps/api/test/scan-flow.e2e-spec.ts`
  - Test: Full flow from barcode → company data
  - Assert: Pappers called only once per SIREN
  - Assert: Cache hit on second scan

- [ ] T071 [P] [Tests] Write integration tests for cache expiry
  - File: `apps/api/src/modules/cache/__tests__/cache-expiry.spec.ts`
  - Test: Cache expires after 30 days
  - Test: Pappers re-called for expired cache

- [ ] T072 [P] [Tests] Write integration tests for quota limit
  - File: `apps/api/src/modules/cache/__tests__/quota.spec.ts`
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
  - File: `apps/api/Dockerfile`
  - Multi-stage build: builder + runtime
  - Install dependencies, build NestJS app
  - Expose port 3001

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
  - File: `apps/mobile/eas.json`
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

## Phase 12: Web Front-End (Expo Web Mode)

**Purpose**: Expose B-Spot functionality in a web browser using Expo's web mode (Metro bundler + react-native-web). The camera scanner is replaced by a barcode text input form. Existing API hooks and company detail components are reused as-is.

**User story**: En tant qu'utilisateur desktop, je peux saisir un code-barres dans un formulaire et consulter les informations de l'entreprise propriétaire dans un navigateur.

**Independent test**: `cd apps/mobile && pnpm web` → formulaire visible à `/`, saisir `3017620422003` → page `/company/{SIREN}` s'affiche avec dirigeants et actionnaires.

**Prerequisites**: Phase 5 ✅ (scanner natif), Phase 6 (company detail components)

**How Expo web mode works**: Metro bundler automatically resolves `.web.tsx` files over `.tsx` files when targeting web (`pnpm web`). No changes to imports are needed — the bundler selects the right variant. All existing files without a `.web.tsx` variant run unchanged on web via `react-native-web` polyfills.

### Foundation: Toast Web Variant

- [X] T087 [P] [US-Web] Create `apps/mobile/src/components/reacticx/Toast/Toast.web.tsx`
  - **Why**: `Toast.tsx` imports `react-native-worklets` (`scheduleOnRN`) which is incompatible with web. Metro will use this `.web.tsx` variant instead on web builds.
  - Re-implement the `Toast` component using **React Native's built-in `Animated`** (not Reanimated, not Worklets) — guaranteed cross-platform
  - Preserve the exact same `ToastProps` interface as `Toast.tsx`
  - Preserve the same visual output: colored pill, icon, text, action button, expanded content
  - Replace `scheduleOnRN(handleDismiss)` with `setTimeout(handleDismiss, 0)`
  - Remove: `LayoutAnimation`, `UIManager`, `react-native-reanimated`, `react-native-worklets`
  - Use: `Animated.View` + `Animated.timing()` for enter/exit opacity + translateY
  - Keep: `Pressable`, `TouchableOpacity`, `StyleSheet`, `Text`, `View` from `react-native`
  - Note: `ToastViewPort.tsx` does NOT need a web variant — `useSafeAreaInsets()` returns zeros on web ✅

### Web Home Screen

- [X] T088 [US-Web] Create `apps/mobile/app/(tabs)/index.web.tsx`
  - **Why**: `index.tsx` imports `expo-camera` (via `BarcodeScanner.tsx`) which crashes on web. Metro will use `index.web.tsx` on web builds.
  - Reuse `useBarcodeScanner` hook from `src/features/scanner/hooks/useBarcodeScanner.ts` (hook is web-safe — it calls `handleBarcodeScan(barcode: string)`)
  - UI layout:
    - Centered container with `View className="flex-1 bg-zinc-50 items-center justify-center px-6"`
    - Title: "B-Spot — Transparence Corporate"
    - Subtitle: "Entrez un code-barres EAN pour découvrir l'entreprise derrière le produit"
    - `TextInput` (from react-native) with placeholder "Ex: 3017620422003" for barcode input
    - "Rechercher" `Pressable` button that calls `handleBarcodeScan(barcode)`
    - Conditional loading spinner (`ActivityIndicator`) when `state === 'loading'`
    - Conditional error message (`Text`) when `state === 'error'` with `errorMessage`
    - Input validation: trim + length check (8-14 chars) before calling handler
  - Style with NativeWind Tailwind classes (consistent with rest of app)
  - Do NOT import `BarcodeScanner`, `ScanOverlay`, or `expo-camera`

### Web Compatibility Fix

- [X] T089 [US-Web] Fix `Share.share()` in `apps/mobile/app/company/[id].tsx`
  - **Why**: `Share.share()` from react-native is not available on web (no native share sheet)
  - Add `import { Platform } from 'react-native'` (already imported via other RN imports)
  - Replace the `handleShare` function body:

    ```tsx
    async function handleShare() {
      if (!company) return;
      const url = `https://b-spot.app/company/${company.siren}`;
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(url);
        Toast.show('Lien copié dans le presse-papiers !', {
          type: 'success',
          position: 'top',
          duration: 2000,
        });
      } else {
        await Share.share({
          message: `Decouvrez ${company.legalName} sur B-Spot\n${url}`,
        });
      }
    }
    ```

  - Note: `navigator.clipboard` requires HTTPS or localhost — acceptable for production and dev

### Validation

- [X] T090 [US-Web] Run `pnpm web` and validate web front-end end-to-end
  - Run: `cd apps/mobile && pnpm web`
  - Test 1: `http://localhost:8081` → formulaire de saisie visible, pas d'erreur console
  - Test 2: Saisir `3017620422003` (Nutella/Ferrero) → Chargement... → `/company/{SIREN}` → nom entreprise + dirigeants affichés
  - Test 3: Naviguer directement vers `http://localhost:8081/company/552108011` → page Nestlé
  - Test 4: Bouton "Partager" → toast "Lien copié" + contenu clipboard correct
  - Test 5: Saisir un code-barres invalide (ex: "123") → message d'erreur affiché
  - Test 6: `pnpm ios` (ou `pnpm android`) → scanner caméra natif inchangé (non-regression)
  - Report: any console errors or missing UI elements

**Checkpoint**: Web front-end fonctionnel — formulaire → company detail → partage ✅

---

## Phase 13: Web UI — Navigation + Recherche par Marque

**Purpose**: Améliorer l'interface web : supprimer la barre de navigation des onglets (hors-sujet sur desktop), et ajouter la recherche par nom de marque (en complément du code-barres).

**User stories**:
- **US-Web2** : En tant qu'utilisateur web, je ne vois pas de barre de navigation mobile inutile.
- **US-Web3** : En tant qu'utilisateur web, je peux saisir un nom de marque (ex: "nutella") et voir l'entreprise propriétaire, sans avoir à connaître le code-barres.

**Independent test**:
- `pnpm web` → aucune tab bar visible en bas de page
- Onglet "Marque" → saisir "nutella" → navigation vers `/company/{SIREN}` de Ferrero

**Prerequisites**: Phase 12 ✅ (web front-end de base)

### Suppression de la barre de navigation sur web

- [X] T091 [US-Web2] Create `apps/mobile/app/(tabs)/_layout.web.tsx`
  - Metro résout `.web.tsx` avant `.tsx` → ce fichier remplace `_layout.tsx` sur web uniquement
  - Contenu : `import { Slot } from 'expo-router'; export default function WebLayout() { return <Slot />; }`
  - `<Slot />` rend l'écran actif sans aucune tab bar ni header
  - Mobile inchangé : `_layout.tsx` reste intact pour iOS/Android

### Backend : Endpoint `POST /api/scan/brand`

- [X] T092 [P] [US-Web3] Add `BrandScanRequestDto` and `BrandScanResultDto` in `apps/api/src/modules/scan/dto/scan.dto.ts`
  - `BrandScanRequestDto` : `brandName: string` (IsString, MinLength(2), MaxLength(100))
  - `BrandScanResultDto` : `company?: CompanyDto`, `dataFreshness`, `message?`, `brandResolution?`, `brandStatus?`, `discoveryConfidence?`, `userActionRequired?`, `brandSuggestionId?`
  - Note : `product` est absent (pas de barcode pour la recherche par marque)

- [X] T093 [US-Web3] Add `scanByBrandName(brandName: string): Promise<BrandScanResultDto>` in `apps/api/src/modules/scan/scan.service.ts`
  - Réutiliser : `BrandService.findBrandByName()`, `BrandDiscoveryService.discoverAndPersistBrand()`, `CompanyService.getOrCreateCompany()`
  - Flow : `findBrandByName()` → si trouvé : `brandResolution: 'existing'` → `getOrCreateCompany(siren)` → return
  - Si non trouvé : `discoverAndPersistBrand(brandName)` → même logique de résolution que `scanProduct()` (auto_active / auto_pending / needs_user_input)
  - Si brand résolue : `getOrCreateCompany(brand.siren)` → return avec `dataFreshness` du résultat Pappers
  - Si `needs_user_input` : return `{ company: undefined, dataFreshness: 'unavailable', brandResolution: 'needs_user_input', message: 'Marque non trouvée avec certitude.' }`

- [X] T094 [US-Web3] Add `POST /api/scan/brand` endpoint in `apps/api/src/modules/scan/scan.controller.ts`
  - `@Post('brand')` — appelle `this.scanService.scanByBrandName(dto.brandName)`
  - Body : `BrandScanRequestDto` ; Response : `BrandScanResultDto`
  - Swagger `@ApiOperation({ summary: 'Search company by brand name' })`

### Mobile : Couche API

- [X] T095 [P] [US-Web3] Add `BrandScanResultDto` interface in `apps/mobile/src/api/types.ts`
  - Miroir du DTO backend : `company?: CompanyDto`, `dataFreshness`, `message?`, `brandResolution?`, `brandStatus?`, `discoveryConfidence?`, `userActionRequired?`, `brandSuggestionId?`

- [X] T096 [P] [US-Web3] Add `scanByBrand(brandName: string)` in `apps/mobile/src/api/client.ts`
  - `POST /api/scan/brand` avec body `{ brandName }` via `apiFetch<BrandScanResultDto>()`

- [X] T097 [P] [US-Web3] Add `useScanByBrand()` hook in `apps/mobile/src/api/hooks.ts`
  - `useMutation({ mutationFn: (brandName: string) => scanByBrand(brandName) })`

### Mobile : Hook `useBrandSearch`

- [X] T098 [US-Web3] Create `apps/mobile/src/features/scanner/hooks/useBrandSearch.ts`
  - Même pattern que `useBarcodeScanner` (state machine `idle | loading | success | error`)
  - `handleBrandSearch(brandName: string)` : appelle `useScanByBrand()` mutation
  - Sur succès avec `result.company` : navigate vers `/company/[siren]` avec `brandStatus` + `brandResolution`
  - Sur `needs_user_input` : Toast warning "Marque non trouvée avec certitude. Essayez un nom plus précis." + reset idle
  - Sur erreur API : Toast error + `setErrorMessage` + reset idle après 3s

### Mobile : Mise à jour `index.web.tsx`

- [X] T099 [US-Web3] Update `apps/mobile/app/(tabs)/index.web.tsx` — toggle barcode / brand search
  - Ajouter state local `searchMode: 'barcode' | 'brand'` (useState)
  - Toggle UI : deux boutons dans la carte ("Code-barres" | "Marque"), style actif/inactif via NativeWind
  - Mode "Code-barres" : formulaire actuel inchangé → `useBarcodeScanner.handleBarcodeScan()`
  - Mode "Marque" : `TextInput` texte libre, validation min 2 chars → `useBrandSearch.handleBrandSearch()`
  - Le champ input + bouton + loading + erreur s'adaptent au mode actif
  - Helper text : mode barcode "EAN-8, EAN-13 ou UPC" / mode marque "Ex: nutella, danone, l'oréal"

### Validation Phase 13

- [ ] T100 [US-Web3] Manual E2E validation of Phase 13
  - Test 1 : `pnpm web` → aucune tab bar visible en bas ✓
  - Test 2 : Onglet "Code-barres" → saisir `3017620422003` → navigation vers Ferrero ✓
  - Test 3 : Onglet "Marque" → saisir `nutella` → navigation vers Ferrero ✓
  - Test 4 : Onglet "Marque" → saisir `zzz` → message d'erreur clair ✓
  - Test 5 : `pnpm ios` → tab bar toujours présente (non-regression mobile) ✓

**Checkpoint**: UI web améliorée — pas de nav bar, recherche barcode + marque fonctionnelle ✅

---

## Summary

**Total Tasks**: 103 tasks

| Phase | Count | Status |
| --- | --- | --- |
| Research (Phase 0) | 7 | ✅ |
| Setup (Phase 1) | 11 | ✅ |
| Backend Core (Phase 2) | 9 | ✅ |
| Backend Data Layer (Phase 3) | 15 | ✅ |
| Backend Scan (Phase 4) | 7 | ✅ |
| Mobile Scanner (Phase 5) | 6 | ✅ |
| Mobile Company (Phase 6) | 7 | ✅ |
| Offline Support (Phase 7) | 4 | pending |
| Open Beauty Facts (Phase 8) | 3 | pending |
| Error Handling (Phase 9) | 7 | pending |
| Testing (Phase 10) | 6 | pending |
| Deployment (Phase 11) | 7 | pending |
| Post-Implementation | 3 | pending |
| Web Front-End (Phase 12) | 4 | ✅ |
| Web UI Améliorations (Phase 13) | 10 | ← nouveau |

**Critical Path (MVP)**:

Research (R001-R007) → Setup (T001-T011) → Cache (T012-T020) → Data Layer (T021-T035) → Scan API (T036-T042) → Mobile Scanner (T043-T048) → Company Detail (T049-T055) → Testing (T070-T075) → Deploy (T076-T082)

**Estimated MVP Timeline**: 4-6 weeks (with 1 developer)

| Period | Work |
| --- | --- |
| Phase 0-1 | 1 week |
| Phase 2-4 | 2 weeks |
| Phase 5-7 | 1.5 weeks |
| Phase 9-11 | 1.5 weeks |
