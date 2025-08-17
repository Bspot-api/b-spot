# 📚 README Templates for B-Spot Repositories

This file contains templates and metadata for generating consistent README files across all B-Spot repositories.

## 🏷️ Badge Templates

### Technology Badges
```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
```

### Framework Badges
```markdown
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18+-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1+-38B2AC.svg)](https://tailwindcss.com/)
```

### Database & Tools
```markdown
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![MikroORM](https://img.shields.io/badge/MikroORM-6+-orange.svg)](https://mikro-orm.io/)
[![Docker](https://img.shields.io/badge/Docker-20+-blue.svg)](https://www.docker.com/)
```

### Development Tools
```markdown
[![ESLint](https://img.shields.io/badge/ESLint-8+-purple.svg)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3+-orange.svg)](https://prettier.io/)
[![Jest](https://img.shields.io/badge/Jest-29+-green.svg)](https://jestjs.io/)
```

## 🎨 Header Templates

### Main Platform Header
```markdown
# 🎯 B-Spot Platform

<div align="center">

![B-Spot Logo](frontend/src/assets/b-spot-logo.webp)

**A comprehensive platform for referencing companies linked to investment funds and influential networks**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18+-cyan.svg)](https://react.dev/)

</div>
```

### API Header
```markdown
# 🌐 B-Spot API

<div align="center">

![NestJS](https://nestjs.com/img/logo-small.svg)

**A robust NestJS backend API for the B-Spot transparency platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![MikroORM](https://img.shields.io/badge/MikroORM-6+-orange.svg)](https://mikro-orm.io/)

</div>
```

### Frontend Header
```markdown
# 🎨 B-Spot Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18+-cyan.svg?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1+-38B2AC.svg?style=for-the-badge&logo=tailwind-css)

**A modern React frontend for the B-Spot transparency platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-orange.svg)](https://pnpm.io/)
[![React Router](https://img.shields.io/badge/React_Router-7+-red.svg)](https://reactrouter.com/)
[![React Query](https://img.shields.io/badge/React_Query-5+-orange.svg)](https://tanstack.com/query)

</div>
```

## 🏗️ Project Structure Templates

### Main Platform Structure
```markdown
```
b-spot/
├── 📁 api/                    # NestJS backend API
│   ├── 📁 src/
│   │   ├── 📁 modules/       # Feature modules
│   │   │   ├── 🔐 auth/      # Authentication & authorization
│   │   │   ├── 🏢 company/   # Company management
│   │   │   ├── 💰 fund/      # Investment fund management
│   │   │   ├── 👥 personality/ # Personality management
│   │   │   └── 🏭 sector/    # Sector management
│   │   ├── 📁 migrations/    # Database migrations
│   │   └── 📁 seeders/       # Database seeders
│   └── 🐘 mikro-orm.config.ts
├── 🎨 frontend/              # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 features/      # Feature-based architecture
│   │   ├── 🧩 components/    # Reusable components
│   │   ├── 🪝 hooks/         # Custom React hooks
│   │   └── 📝 types/         # TypeScript type definitions
│   └── ⚡ vite.config.ts
├── 🐳 docker-compose.yml     # Database and services
└── 📜 scripts/               # Utility scripts
```
```

### API Structure
```markdown
```
src/
├── 📁 modules/           # Feature modules
│   ├── 🔐 auth/         # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── 🏢 company/      # Company management
│   │   ├── company.controller.ts
│   │   ├── company.service.ts
│   │   ├── company.entity.ts
│   │   ├── company.dto.ts
│   │   └── company.module.ts
│   ├── 💰 fund/         # Investment fund management
│   │   ├── fund.controller.ts
│   │   ├── fund.service.ts
│   │   ├── fund.entity.ts
│   │   ├── fund.dto.ts
│   │   └── fund.module.ts
│   ├── 👥 personality/  # Personality management
│   │   ├── personality.controller.ts
│   │   ├── personality.service.ts
│   │   ├── personality.entity.ts
│   │   ├── personality.dto.ts
│   │   └── personality.module.ts
│   └── 🏭 sector/       # Sector management
│       ├── sector.controller.ts
│       ├── sector.service.ts
│       ├── sector.entity.ts
│       ├── sector.dto.ts
│       └── sector.module.ts
├── 📁 config/           # Configuration files
│   └── better-auth.config.ts
├── 📁 migrations/       # Database migrations
├── 📁 seeders/          # Database seeders
├── 📁 test/             # Test files
├── app.module.ts        # Main application module
├── app.controller.ts     # Main controller
├── app.service.ts        # Main service
└── main.ts              # Application entry point
```
```

### Frontend Structure
```markdown
```
src/
├── 📁 api/                 # API integration
│   ├── 📁 hooks/          # React Query hooks
│   │   ├── @tanstack/     # TanStack Query configuration
│   │   ├── client/        # API client utilities
│   │   └── core/          # Core API functionality
│   ├── 📁 mutator/        # Mutation handlers
│   ├── 📁 services/       # API service layer
│   └── 📁 types/          # Generated API types
├── 🧩 components/          # Reusable components
│   ├── 🔐 auth/           # Authentication components
│   ├── 🌍 i18n/           # Internationalization
│   ├── 🎨 shadcn/         # UI component library
│   └── 🎯 shared/         # Shared components
├── 🎭 contexts/            # React contexts
├── 🚀 features/            # Feature-based architecture
├── 🪝 hooks/               # Custom React hooks
├── 🌍 i18n/                # Internationalization
├── 📚 lib/                 # Utility libraries
├── 📄 pages/               # Page components
├── 📝 types/               # TypeScript type definitions
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```
```

## 🔗 Footer Templates

### Main Platform Footer
```markdown
---

<div align="center">

**Built with ❤️ for transparency and open data**

[Website](https://b-spot.org) • [API Docs](https://api.b-spot.org) • [Community](https://github.com/Bspot-api)

</div>
```

### API Footer
```markdown
---

<div align="center">

**Built with ❤️ for transparency and open data**

[Website](https://b-spot.org) • [API Docs](https://api.b-spot.org) • [Community](https://github.com/Bspot-api)

</div>
```

### Frontend Footer
```markdown
---

<div align="center">

**Built with ❤️ for transparency and open data**

[Website](https://b-spot.org) • [Frontend Docs](https://frontend.b-spot.org) • [Community](https://github.com/Bspot-api)

</div>
```

## 📋 Quick Start Templates

### Main Platform Quick Start
```markdown
## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** and **Docker Compose**
- **PostgreSQL** (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bspot-api/b-spot-private.git
   cd b-spot-private
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp api/env.example api/.env
   # Edit api/.env with your configuration
   ```

4. **Start the database**
   ```bash
   pnpm db:up
   ```

5. **Run database migrations**
   ```bash
   cd api
   pnpm migration:up
   cd ..
   ```

6. **Start development servers**
   ```bash
   # Start both frontend and API
   pnpm dev
   
   # Or start individually
   pnpm dev:frontend  # Frontend only
   pnpm dev:api       # API only
   ```
```

### API Quick Start
```markdown
## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** and **Docker Compose** (recommended)
- **PostgreSQL** 15+ (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bspot-api/b-spot-api.git
   cd b-spot-api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d postgres
   ```

5. **Run database migrations**
   ```bash
   pnpm migration:up
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3000`
```

### Frontend Quick Start
```markdown
## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **B-Spot API** running (for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bspot-api/b-spot-frontend.git
   cd b-spot-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   ```

The application will be available at `http://localhost:5173`
```

## 🎯 Usage

These templates can be used in the setup scripts to generate consistent README files across all repositories. The templates include:

- **Badges**: Technology and framework badges
- **Headers**: Repository-specific headers with logos
- **Structure**: Project structure diagrams with emojis
- **Footers**: Consistent branding and links
- **Quick Start**: Installation and setup instructions

To use these templates, copy the relevant sections into the setup scripts and customize as needed.
