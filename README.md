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

See [CLAUDE.md](CLAUDE.md) for detailed architecture and [specs/mobile-app-rewrite/](specs/mobile-app-rewrite/) for implementation plan.

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
├── 📝 specs/                 # Feature specifications
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
- **[specs/mobile-app-rewrite/spec.md](specs/mobile-app-rewrite/spec.md)** - Feature specification
- **[specs/mobile-app-rewrite/plan.md](specs/mobile-app-rewrite/plan.md)** - Technical implementation plan
- **[.specify/memory/constitution.md](.specify/memory/constitution.md)** - Project constitution and principles

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
- **[specs/mobile-app-rewrite/](specs/mobile-app-rewrite/)** - Implementation specifications
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
