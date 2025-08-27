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

## 🎯 Overview

B-Spot API is a comprehensive backend service that provides access to a database of companies linked to investment funds and influential networks. Built with NestJS and TypeScript, it offers a secure, scalable, and well-documented REST API for transparency and research purposes.

> **Note**: This README is specific to the API component. For the complete monorepo documentation, see the [main README](../README.md).

### 🌟 **Key Features**
- **Company Management**: CRUD operations for company data
- **Fund Tracking**: Investment fund information and relationships
- **Personality Database**: Key figures and their connections
- **Sector Classification**: Industry categorization system
- **Authentication System**: Secure JWT-based access control
- **Data Validation**: Comprehensive input validation and sanitization
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** and **Docker Compose** (recommended)
- **PostgreSQL** 15+ (or use Docker)

### Installation

1. **Clone the monorepo**
   ```bash
   git clone https://github.com/Bspot-api/b-spot.git
   cd b-spot
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
   cd api && pnpm migration:up && cd ..
   ```

6. **Start development server**
   ```bash
   pnpm dev:api
   # Or start both frontend and API:
   pnpm dev
   ```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

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

## 🛠️ Available Scripts

### Development
- `pnpm dev` - Start development server with hot reload
- `pnpm start` - Start production server
- `pnpm start:dev` - Start development server
- `pnpm start:debug` - Start debug mode
- `pnpm start:prod` - Start production mode

### Building & Testing
- `pnpm build` - Build the application
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:cov` - Run tests with coverage
- `pnpm test:debug` - Run tests in debug mode

### Database Management
- `pnpm migration:create` - Create new migration
- `pnpm migration:up` - Apply pending migrations
- `pnpm migration:down` - Rollback last migration
- `pnpm migration:list` - List all migrations
- `pnpm schema:create` - Create database schema
- `pnpm schema:drop` - Drop database schema
- `pnpm schema:update` - Update database schema

### Utilities
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm seed` - Run database seeders

## 🔧 Technology Stack

### Core Framework
- **[NestJS](https://nestjs.com/)**: Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Node.js](https://nodejs.org/)**: JavaScript runtime

### Database & ORM
- **[PostgreSQL](https://www.postgresql.org/)**: Robust relational database
- **[MikroORM](https://mikro-orm.io/)**: Type-safe ORM with migrations
- **[Redis](https://redis.io/)**: Caching and session storage

### Authentication & Security
- **[Better-Auth](https://better-auth.com/)**: Modern authentication system
- **[JWT](https://jwt.io/)**: JSON Web Tokens for stateless auth
- **[bcrypt](https://github.com/dcodeIO/bcrypt.js/)**: Password hashing

### Validation & Serialization
- **[class-validator](https://github.com/typestack/class-validator)**: Decorator-based validation
- **[class-transformer](https://github.com/typestack/class-transformer)**: Object transformation
- **[class-serializer](https://github.com/typestack/class-serializer)**: Object serialization

### Testing
- **[Jest](https://jestjs.io/)**: Testing framework
- **[Supertest](https://github.com/visionmedia/supertest)**: HTTP testing
- **[@nestjs/testing](https://docs.nestjs.com/fundamentals/testing)**: NestJS testing utilities

## 📚 API Documentation

### Swagger/OpenAPI
When running the application, visit `/api` to access the interactive API documentation.

### Available Endpoints

#### 🔐 Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

#### 🏢 Companies
- `GET /companies` - List companies with pagination and filters
- `GET /companies/:id` - Get company details
- `POST /companies` - Create new company
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

#### 💰 Funds
- `GET /funds` - List investment funds
- `GET /funds/:id` - Get fund details
- `POST /funds` - Create new fund
- `PUT /funds/:id` - Update fund
- `DELETE /funds/:id` - Delete fund

#### 👥 Personalities
- `GET /personalities` - List personalities
- `GET /personalities/:id` - Get personality details
- `POST /personalities` - Create new personality
- `PUT /personalities/:id` - Update personality
- `DELETE /personalities/:id` - Delete personality

#### 🏭 Sectors
- `GET /sectors` - List sectors
- `GET /sectors/:id` - Get sector details
- `POST /sectors` - Create new sector
- `PUT /sectors/:id` - Update sector
- `DELETE /sectors/:id` - Delete sector

### Data Models

#### Company Entity
```typescript
interface Company {
  id: string;
  name: string;
  description?: string;
  source: string;
  fund?: Fund;
  personalities?: Personality[];
  sector?: Sector;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Fund Entity
```typescript
interface Fund {
  id: string;
  name: string;
  description?: string;
  website?: string;
  companies?: Company[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🗄️ Database Schema

### Core Tables
- **companies**: Company information and metadata
- **funds**: Investment fund details
- **personalities**: Key figures and their information
- **sectors**: Industry classification
- **users**: User accounts and authentication
- **sessions**: User session management

### Relationships
- Companies can belong to one fund
- Companies can have multiple personalities
- Companies belong to one sector
- Funds can have multiple companies
- Personalities can be associated with multiple companies

## 🔐 Authentication & Authorization

### JWT-Based Authentication
- Secure token-based authentication
- Configurable token expiration
- Refresh token support
- Stateless session management

### Role-Based Access Control
- **User**: Basic access to public data
- **Editor**: Can create and edit content
- **Admin**: Full system access
- **Moderator**: Content moderation capabilities

### Security Features
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection protection

## 🧪 Testing

### Test Structure
```
test/
├── 📁 e2e/              # End-to-end tests
├── 📁 unit/             # Unit tests
├── 📁 integration/      # Integration tests
└── jest-e2e.json        # E2E test configuration
```

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: Module interaction testing
- **E2E Tests**: Full API workflow testing
- **Coverage Target**: Minimum 80% code coverage

## 🚀 Deployment

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bspot
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production
```

### Docker Deployment
```bash
# Build image
docker build -t bspot-api .

# Run container
docker run -p 3000:3000 bspot-api
```

### Production Considerations
- Use environment-specific configurations
- Enable logging and monitoring
- Set up health checks
- Configure reverse proxy (nginx)
- Enable HTTPS with SSL certificates
- Set up database backups

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Ensure** all tests pass
6. **Submit** a pull request

### Development Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow NestJS conventions
- Use proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/Bspot-api/b-spot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Bspot-api/b-spot/discussions)
- **Contributing**: [Contributing Guide](../CONTRIBUTING.md)

---

<div align="center">

**Built with ❤️ for transparency and open data**

[GitHub Repository](https://github.com/Bspot-api/b-spot) • [Issues](https://github.com/Bspot-api/b-spot/issues) • [Discussions](https://github.com/Bspot-api/b-spot/discussions)

</div>
