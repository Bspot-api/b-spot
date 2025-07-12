# Boycotteur

A platform for referencing companies related to mass media.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- Modern and responsive user interface
- Advanced search and filtering
- Visualization of relationships between companies and media
- Consistent design system

### Backend (NestJS + TypeScript)
- High-performance RESTful API
- PostgreSQL relational database
- Authentication and authorization
- Complex data management

## 🚀 Installation

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- pnpm 8+

### 1. Clone and install dependencies
```bash
# Install all dependencies
pnpm install
```

### 2. Start the database
```bash
# Start PostgreSQL with Docker
pnpm db:up

# Optional: Start pgAdmin for database management
docker-compose up -d
```

### 3. Environment variables configuration
```bash
# Copy the example file
cp backend/env.example backend/.env

# Modify variables if needed
# Default values match Docker configuration
```

### 4. Start the application
```bash
# Start development (frontend + backend)
pnpm dev

# Or start separately
pnpm dev:frontend  # Frontend on http://localhost:3000
pnpm dev:backend   # Backend on http://localhost:3001
```

## 📁 Project Structure

```
boycotteur/
├── frontend/          # React application
├── backend/           # NestJS API
├── docker-compose.yml # Docker configuration
├── package.json       # Monorepo configuration
├── pnpm-workspace.yaml # pnpm workspace config
└── README.md
```

## 🛠️ Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Swagger/OpenAPI

### Database
- PostgreSQL 15 (Docker)
- pgAdmin (web interface)

### Package Manager
- pnpm (monorepo with workspaces)

## 🐳 Docker

### Available Services
- **PostgreSQL** : Port 5432
- **pgAdmin** : Port 5050 (admin@boycotteur.com / admin)

### Useful Commands
```bash
# Start all services
docker-compose up -d

# View logs
pnpm db:logs

# Stop services
pnpm db:down

# Remove volumes (warning: deletes data)
docker-compose down -v
```

## 📊 Data Model

### Main Entities (to be implemented)
- **Companies** : Company information
- **Media** : Mass media references
- **Relations** : Links between companies and media
- **Categories** : Classification of companies and media

## 🔧 Development

### Environment Variables
Create the `.env` file in `backend/` according to the `env.example` template.

### Database
PostgreSQL database is automatically created and configured via Docker.

### API Documentation
Once the backend is started, Swagger documentation is available at:
http://localhost:3001/api

### Available Scripts
```bash
# Development
pnpm dev              # Start both frontend and backend
pnpm dev:frontend     # Start frontend only
pnpm dev:backend      # Start backend only

# Build
pnpm build            # Build all packages
pnpm build:frontend   # Build frontend only
pnpm build:backend    # Build backend only

# Database
pnpm db:up            # Start PostgreSQL
pnpm db:down          # Stop PostgreSQL
pnpm db:logs          # View database logs

# Utilities
pnpm lint             # Lint all packages
pnpm test             # Test all packages
pnpm clean            # Clean all packages
```

## 📝 TODO

- [x] Initial frontend React setup
- [x] Initial backend NestJS setup
- [x] Docker PostgreSQL configuration
- [x] pnpm monorepo setup
- [ ] Database configuration
- [ ] Basic API for companies and media
- [ ] Search and filtering interface
- [ ] Authentication system
- [ ] Admin interface
- [ ] Unit and integration tests 