# 🎯 B-Spot Platform

<div align="center">

**Mobile-first transparency platform revealing corporate ownership networks through product barcode scanning**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![Expo](https://img.shields.io/badge/Expo-52+-black.svg)](https://expo.dev/)

</div>

## 🌟 Overview

B-Spot is an open-source mobile application (similar to Yuka) that empowers consumers to understand corporate ownership and influence networks by scanning product barcodes. Scan a Nespresso product → see it's owned by Nestlé → discover key executives and major shareholders.

### 🎯 **Key Features**
- **Barcode Scanning**: Scan any product to reveal its corporate ownership
- **Company Transparency**: See company executives, shareholders, and subsidiaries
- **Offline Support**: Access previously scanned data without internet
- **Open Data**: Leverages Open Food Facts, Open Beauty Facts, and Pappers API
- **Privacy-First**: No authentication required, fully transparent

## 🏗️ Project Status

**⚠️ Currently under complete rebuild** - The project is being refactored from a web platform to a mobile-first application.

- **Old Stack** (archived): React web app + NestJS API for investment fund networks
- **New Stack** (in development): Expo React Native mobile app + NestJS API for product scanning

See [CLAUDE.md](CLAUDE.md) for detailed architecture and [project-management/](project-management/) for tasks and history.

## 🚀 Quick Start (New Architecture)

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** (for PostgreSQL)
- **Physical iOS/Android device** (for barcode scanner testing)

### Installation

**Note**: The new mobile app is not yet implemented. This quick start will be available once development begins.

1. Clone the repository
   ```bash
   git clone https://github.com/Bspot-api/b-spot.git
   cd b-spot
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp api/.env.example api/.env
   cp mobile/.env.example mobile/.env
   # Edit api/.env: add PAPPERS_API_KEY, SMTP credentials
   ```

4. Start PostgreSQL
   ```bash
   pnpm db:up
   ```

5. Run migrations and seed data
   ```bash
   cd api
   pnpm migration:up
   pnpm seed
   cd ..
   ```

6. Start development servers
   ```bash
   pnpm dev        # Start both mobile and API
   pnpm dev:api    # API only
   pnpm dev:mobile # Mobile app only
   ```

## 🧪 End-to-end tests

The critical journeys run against the real app, the real API and a real
database. Only the four external APIs (Open Food Facts, Open Beauty Facts,
recherche-entreprises, Pappers) are replaced by a local fixture server, so
no run calls them or spends Pappers quota. Everything lives in `apps/e2e`.

### Web (Playwright)

One-time setup:

```bash
pnpm install
pnpm --filter @b-spot/e2e exec playwright install chromium
```

Run, with Docker running:

```bash
pnpm e2e:web
```

The command does the following, then exits non-zero on any failure:

1. Starts b-spot's `postgres` and `maildev` containers if they are not
   running. A MailDev it starts listens on SMTP 1125 and web 1180, so it
   does not clash with another stack on 1025/1080. It stops at the end
   only the containers it started.
2. Drops and recreates the `b_spot_e2e` database, then migrates and seeds
   it. It never touches the development database `b_spot`.
3. Builds the API and exports the web app against `http://localhost:3101`.
4. Starts the fixture server (`:4010`), the API (`:3101`) and the web
   build (`:8182`), runs Playwright, then stops them.

Extra arguments go to Playwright, e.g. `pnpm e2e:web --project=web -g login`.
The HTML report is written to `apps/e2e/playwright-report/`.

### iOS (Maestro)

One-time setup, on macOS with Xcode:

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash   # Maestro CLI
xcrun simctl boot "iPhone 17 Pro Max"                # any iOS simulator
cd apps/mobile && APP_VARIANT=development pnpm exec expo run:ios --no-bundler
```

The last command builds and installs the dev build (`com.bspot.mobile.dev`,
scheme `bspot-dev`) on the booted simulator. Redo it only when a native
dependency changes; `apps/mobile/ios/` is generated and git-ignored.

Run, with Docker running and the simulator booted:

```bash
pnpm e2e:mobile
```

It brings up the same environment as the web suite (no web build), plus a
Metro on `:8183` that serves the app's JavaScript with
`EXPO_PUBLIC_API_URL=http://localhost:3101`, and a control server on
`127.0.0.1:4011` that the flows call to reset the database or pre-fill the
app's stored history. Then it runs the flows of `apps/e2e/maestro/flows/`
and exits with Maestro's code. Each flow starts from a reset database and a
wiped app. The simulator has no camera: the scan journey opens the company
page's deep link (`bspot-dev://company/<siren>`), and the brand suggestion
opens its own screen's link. Extra arguments go to `maestro test`. Reports
and screenshots land in `apps/e2e/maestro-results/`.

Your own `apps/mobile/.env*` files do not affect the run, and it never
touches them: the e2e Metro hides them from the bundle (see
`apps/mobile/metro.config.js`). Before any flow, a preflight reads the
bundle the dev build loads, and fails if it carries another
`EXPO_PUBLIC_API_URL` than the e2e one.

The API reads four optional base URLs: `OPEN_FOOD_FACTS_BASE_URL`,
`OPEN_BEAUTY_FACTS_BASE_URL`, `RECHERCHE_ENTREPRISES_BASE_URL` and
`PAPPERS_BASE_URL`. Unset, it uses the production URLs.

### One run at a time, and nothing left behind

The e2e environment exists once per machine: one `b_spot_e2e` database and
the ports 4010, 4011, 3101, 8182 and 8183. So `pnpm e2e:web` and
`pnpm e2e:mobile` take a lock before they start anything. It is one file,
`b-spot-e2e.lock.json`, in the repository's git common directory (`.git/` of
the main checkout), so every git worktree of the repo shares it. It holds
the pid, the command, the worktree and the start time of the run that has
it.

- A second run waits, saying who holds the environment, then logs
  `lock acquired after waiting …`. It gives up after 20 minutes
  (`E2E_LOCK_WAIT_MINUTES` changes that), naming the holder.
- A lock whose holder is no longer running is taken over, with a message.
- Before starting its services, a run checks that no e2e port is taken. If
  one is, it fails and names the process holding it. It never kills
  anything.
- Ctrl-C or `kill` (SIGINT or SIGTERM) stops everything the run started:
  the API, the fixture and web servers, Metro, Playwright or Maestro, and
  the containers it started itself (never ones that were already running).
  Then it frees the lock and exits non-zero. Nothing is left behind.
  Only `kill -9` escapes this; the next run then takes over the lock and
  reports the ports still taken.

## 📁 Project Structure (New Architecture)

```
b-spot/
├── 📁 api/                    # NestJS backend API
│   ├── 📁 src/
│   │   ├── 📁 modules/       # Feature modules
│   │   │   ├── 📱 scan/      # Barcode scanning & product lookup
│   │   │   ├── 📦 product/   # Product & Open Food Facts integration
│   │   │   ├── 🏷️  brand/     # Brand → Company mapping
│   │   │   ├── 🏢 company/   # Company data & Pappers integration
│   │   │   └── 💾 cache/     # API usage tracking & quota management
│   │   ├── 📁 migrations/    # Database migrations
│   │   └── 📁 seeders/       # Brand → SIREN seed data
│   └── 🐘 mikro-orm.config.ts
├── 📱 mobile/                # Expo React Native app
│   ├── 📁 app/               # Expo Router (file-based routing)
│   │   ├── (tabs)/index.tsx  # Home/Scanner screen
│   │   └── company/[id].tsx  # Company detail screen
│   ├── 📁 src/
│   │   ├── 📁 features/      # Feature-based architecture
│   │   │   ├── scanner/      # Barcode scanner
│   │   │   ├── company/      # Company detail
│   │   │   └── common/       # Shared components
│   │   └── 📁 api/           # Generated API client (from OpenAPI)
│   └── app.json              # Expo configuration
├── 📝 project-management/    # Tasks, specs and journal (chisel)
│   └── mobile-app-rewrite/
│       ├── spec.md           # Feature specification
│       ├── plan.md           # Technical implementation plan
│       └── CHANGELOG.md      # Specification changelog
├── 🐳 docker-compose.yml     # PostgreSQL database
└── 📜 CLAUDE.md              # Developer guide
```

## 🔧 Technology Stack (New Architecture)

### Mobile App
- **Framework**: [Expo SDK ~52.0](https://expo.dev/) (React Native)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind for React Native)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query](https://tanstack.com/query)
- **Barcode Scanner**: expo-barcode-scanner
- **Offline Storage**: AsyncStorage with TanStack Query persistence

### Backend API
- **Framework**: [NestJS 10+](https://nestjs.com/) with TypeScript
- **Database**: PostgreSQL 15+ with [MikroORM 6+](https://mikro-orm.io/)
- **External APIs**:
  - [Pappers API](https://www.pappers.fr/) (250 calls/month free tier)
  - [Open Food Facts](https://world.openfoodfacts.org/)
  - [Open Beauty Facts](https://world.openbeautyfacts.org/)
- **Email**: Nodemailer (SMTP for admin alerts)
- **Testing**: Jest + Supertest

### Development Tools
- **Package Manager**: [pnpm](https://pnpm.io/) monorepo
- **Type Generation**: OpenAPI → TypeScript client for mobile
- **Deployment**: Docker + [Dokploy](https://dokploy.com/)

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Complete developer guide with commands and architecture
- **[project-management/archive/speckit-mobile-app-rewrite/spec.md](project-management/archive/speckit-mobile-app-rewrite/spec.md)** - Original rewrite specification (archived)
- **[project-management/archive/speckit-mobile-app-rewrite/plan.md](project-management/archive/speckit-mobile-app-rewrite/plan.md)** - Original implementation plan (archived)
- **[docs/constitution.md](docs/constitution.md)** - Project constitution and principles

## 🎯 Development Roadmap

### Phase 0: Research (In Progress)
- [ ] Test Pappers API response structure
- [ ] Validate Open Food Facts coverage for French products
- [ ] Source Brand → SIREN mappings (top 100-500 brands)
- [ ] Prototype barcode scanner on physical devices

### Phase 1: MVP Implementation
- [ ] Backend: API endpoints (scan, company)
- [ ] Backend: Pappers caching with 30-day TTL
- [ ] Backend: Database schema + migrations + seed data
- [ ] Mobile: Barcode scanner screen
- [ ] Mobile: Company detail screen with executives + shareholders
- [ ] Mobile: Offline support (cache persistence)

### Phase 2: Enhancement
- [ ] Open Beauty Facts support (cosmetics)
- [ ] Improved error handling
- [ ] Load testing (verify >90% cache hit rate)
- [ ] Production deployment (Dokploy + EAS Build)

### Future Features (Post-MVP)
- [ ] User authentication
- [ ] Scan history
- [ ] AI-powered brand discovery
- [ ] Community contributions for unknown products
- [ ] Network visualization graphs

## 🤝 Contributing

We welcome contributions! The project is currently in rebuild phase. Once the new mobile app is functional, we'll provide detailed contributing guidelines.

For now, check out:
- **[project-management/](project-management/)** - Tasks, specs and journal
- **[CLAUDE.md](CLAUDE.md)** - Development guide

## 📄 License

This project is licensed under the MIT License.

## 🔐 Security & Privacy

- **No Tracking**: No analytics, no user tracking
- **No Authentication (MVP)**: Fully anonymous usage
- **Open Data**: All data sources are public APIs
- **Local Cache**: Offline data stored locally on device only
- **API Limits**: Pappers free tier (250 calls/month) enforced with local caching

## 📞 Support

- **Issues**: Report bugs in [GitHub Issues](https://github.com/Bspot-api/b-spot/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/Bspot-api/b-spot/discussions)

---

<div align="center">

**Built with ❤️ for transparency and consumer awareness**

[GitHub Repository](https://github.com/Bspot-api/b-spot)

</div>
