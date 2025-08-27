# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Project Setup

- `pnpm install` - Install all dependencies for monorepo
- `cp api/env.example api/.env` - Set up environment variables
- `pnpm db:up` - Start PostgreSQL database with Docker
- `cd api && pnpm migration:up` - Run database migrations

### Development

- `pnpm dev` - Start both frontend and API in development mode
- `pnpm dev:frontend` - Start only React frontend (port usually 5173)
- `pnpm dev:api` - Start only NestJS API (port defined in .env)
- `pnpm generate:types` - Generate TypeScript types from OpenAPI schema

### Database Management

- `pnpm db:up` - Start PostgreSQL container
- `pnpm db:down` - Stop PostgreSQL container
- `pnpm db:logs` - View PostgreSQL logs
- `cd api && pnpm migration:create` - Create new database migration
- `cd api && pnpm migration:up` - Apply pending migrations
- `cd api && pnpm migration:down` - Rollback last migration
- `cd api && pnpm seed` - Fresh database with seed data
- `cd api && pnpm seed:clear` - Clear database and reseed

### Build & Test

- `pnpm build` - Build both frontend and API
- `pnpm build:frontend` - Build React app for production
- `pnpm build:api` - Build NestJS API
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Run ESLint for all packages
- `cd api && pnpm test:watch` - Run API tests in watch mode
- `cd api && pnpm test:e2e` - Run API end-to-end tests
- `cd api && pnpm test:cov` - Run API tests with coverage

### Frontend Specific

- `cd frontend && pnpm generate:hooks` - Generate API client hooks from OpenAPI


## Architecture Overview

### Monorepo Structure

This is a public pnpm workspace monorepo with two main packages:
- **api/**: NestJS backend with PostgreSQL and MikroORM
- **frontend/**: React + Vite frontend with TypeScript

### Backend (NestJS API)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with MikroORM as ORM
- **Authentication**: Better-Auth integration
- **Architecture**: Feature-based modules in `src/modules/`
  - `auth/` - Authentication and authorization
  - `company/` - Company management and data
  - `fund/` - Investment fund management
  - `personality/` - Personality/person management
  - `sector/` - Business sector categorization
  - `user/` - User management

### Frontend (React)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and building
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Architecture**: Feature-based structure in `src/features/`
- **API Integration**: Generated hooks from OpenAPI schema using @hey-api/openapi-ts

### Key Configuration Files

- `mikro-orm.config.ts` - Database ORM configuration
- `pnpm-workspace.yaml` - Monorepo workspace definition
- Frontend uses Vite config with React plugin and Tailwind CSS
- API uses standard NestJS configuration with Swagger/OpenAPI

### Database

- PostgreSQL database running in Docker
- MikroORM handles migrations in `api/src/migrations/`
- Database seeders in `api/src/seeders/`
- Entities follow the pattern: `*.entity.ts` files in module folders

### Authentication Flow

- Better-Auth handles authentication logic
- Frontend uses generated hooks for auth state management
- JWT-based authentication system
- Protected routes implemented in frontend

## Development Workflow

When working with this codebase:

1. Always start the database first with `pnpm db:up`
2. Run migrations after database changes: `cd api && pnpm migration:up`
3. Generate frontend types after API changes: `pnpm generate:types`
4. Both frontend and API have hot reload enabled in development
5. The frontend makes requests to the API which should be running on the configured port

## Code Quality Standards

From `.cursor/rules` configuration:
- **No comments policy** - Code should be self-documenting with clear variable/function names
- **Strict typing** - All values must be typed, no `any` or untyped values allowed
- **Function limits** - Max 30 lines per function, max 5 parameters
- **File limits** - Max 300 lines per file, max 10 sub-files per folder
- **Feature-based architecture** - Organize code by business feature in `src/features/`
- **Clean code principles** - One responsibility per file, fail fast, use explicit constants

## API Type Generation Workflow

Frontend types are auto-generated from the API's OpenAPI schema:
1. API changes trigger OpenAPI schema updates
2. Run `pnpm generate:types` to regenerate frontend client hooks
3. Frontend uses type-safe API client with React Query integration
4. Generated files are in `frontend/src/api/hooks/`

## Important Notes

- This is the public monorepo containing the complete B-Spot platform
- Environment variables are required in `api/.env` - copy from `api/env.example`
- Database must be running before starting the API
- Frontend generates API client hooks from the backend's OpenAPI schema
- All packages use TypeScript with strict type checking enabled
- Node.js >=18.0.0 and pnpm >=8.0.0 required
