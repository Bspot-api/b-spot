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

## 🌟 Overview

B-Spot is a transparency platform that documents and makes accessible the network of companies funded by investment funds and their connections to influential networks. Our mission is to provide citizens, researchers, and journalists with tools to understand the economic and ideological networks shaping society.

### 🎯 **Key Features**
- **Company Database**: Comprehensive information about companies and their funding sources
- **Network Mapping**: Visualize connections between companies, funds, and personalities
- **Public API**: Open access to data for research and analysis
- **Modern Web Interface**: Responsive, accessible frontend built with React
- **Secure Backend**: Robust NestJS API with authentication and data validation

## 🏗️ Repository Structure

This is the **private repository** containing the complete B-Spot platform. For public access, see our separate repositories:

- **🌐 API**: [b-spot-api](https://github.com/Bspot-api/b-spot-api) - Public NestJS backend API
- **🎨 Frontend**: [b-spot-frontend](https://github.com/Bspot-api/b-spot-frontend) - Public React frontend application

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

## 📁 Project Structure

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

## 🛠️ Available Scripts

### Root Level
- `pnpm dev` - Start both frontend and API in development mode
- `pnpm build` - Build both frontend and API
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Run linting for all packages

### Database Management
- `pnpm db:up` - Start PostgreSQL database
- `pnpm db:down` - Stop PostgreSQL database
- `pnpm db:logs` - View database logs

### API Development
- `pnpm dev:api` - Start API in development mode
- `pnpm build:api` - Build API
- `cd api && pnpm migration:create` - Create new migration
- `cd api && pnpm migration:up` - Apply migrations
- `cd api && pnpm migration:down` - Rollback migrations

### Frontend Development
- `pnpm dev:frontend` - Start frontend in development mode
- `pnpm build:frontend` - Build frontend
- `pnpm generate:types` - Generate TypeScript types from API

## 🔧 Technology Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) with TypeScript
- **Database**: PostgreSQL with [MikroORM](https://mikro-orm.io/)
- **Authentication**: [Better-Auth](https://better-auth.com/) integration
- **Architecture**: Clean Architecture principles

### Frontend
- **Framework**: [React 18](https://react.dev/) with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/) for fast development
- **Styling**: [Tailwind CSS v4.1](https://tailwindcss.com/)
- **State Management**: [React Query](https://tanstack.com/query) + Context API
- **Routing**: [React Router v7](https://reactrouter.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

### Development Tools
- **Package Manager**: [pnpm](https://pnpm.io/) for fast, efficient dependency management
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier for consistent code style
- **Testing**: Jest for unit and integration tests

## 📚 API Documentation

- **Swagger/OpenAPI**: Available at `/api` endpoint when running
- **RESTful Design**: Clean, consistent API endpoints
- **Type Safety**: Full TypeScript support with generated types
- **Authentication**: JWT-based authentication system

## 🌍 Internationalization

- **Multi-language Support**: Built-in i18n with react-i18next
- **Language Switcher**: Easy language selection in the UI
- **Localized Content**: All user-facing text is translatable

## 🧪 Testing

- **Unit Tests**: Jest for individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full application workflow testing
- **Coverage Reports**: Track test coverage across the codebase

## 🤝 Contributing

We welcome contributions from the community! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Standards
- **Code Quality**: Follow PSR-12 standards for PHP, TypeScript best practices
- **Testing**: Write tests for new features
- **Documentation**: Update docs when adding new functionality
- **Accessibility**: Ensure UI components are accessible

## 📄 License

This project is proprietary and confidential. See separate public repositories for open-source components.

- **Private Repository**: Contains complete platform (this repo)
- **Public API**: MIT License - [b-spot-api](https://github.com/Bspot-api/b-spot-api)
- **Public Frontend**: MIT License - [b-spot-frontend](https://github.com/Bspot-api/b-spot-frontend)

## 🔐 Security

- **Private Repository**: Contains all sensitive information and internal configurations
- **Public Repositories**: Clean, open-source code with no sensitive data
- **Environment Variables**: Never committed to version control
- **Authentication**: Secure JWT-based system with proper validation

## 📞 Support & Community

- **Issues**: Report bugs and request features in the appropriate public repository
- **Discussions**: Join community discussions on GitHub
- **Documentation**: Comprehensive guides in each repository
- **Contributing**: Guidelines for community contributions

## 🚀 Deployment

For deployment information, see our [Deployment Guide](./DEPLOYMENT.md).

## 📊 Project Status

- **Development**: Active development with regular updates
- **Stability**: Production-ready core features
- **Performance**: Optimized for speed and scalability
- **Security**: Regular security audits and updates

---

<div align="center">

**Built with ❤️ for transparency and open data**

[Website](https://b-spot.org) • [API Docs](https://api.b-spot.org) • [Community](https://github.com/Bspot-api)

</div> 