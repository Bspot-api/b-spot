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

## 🌟 Overview

B-Spot Frontend is a modern, responsive web application that provides an intuitive interface for exploring and analyzing the network of companies linked to investment funds and influential networks. Built with React 18, TypeScript, and Tailwind CSS, it offers a seamless user experience for transparency and research purposes.

### 🎯 **Key Features**
- **Company Explorer**: Search and filter companies with advanced criteria
- **Network Visualization**: Interactive maps of company relationships
- **Data Tables**: Rich, sortable data presentation with pagination
- **Responsive Design**: Mobile-first approach for all devices
- **Multi-language Support**: Internationalization with i18n
- **Authentication System**: Secure user login and account management
- **Real-time Updates**: Live data synchronization with the API

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

## 📁 Project Structure

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
│   │   ├── protected-route.tsx
│   │   └── index.ts
│   ├── 🌍 i18n/           # Internationalization
│   │   └── language-switcher.tsx
│   ├── 🎨 shadcn/         # UI component library
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── index.ts
│   └── 🎯 shared/         # Shared components
│       ├── header.tsx
│       └── index.ts
├── 🎭 contexts/            # React contexts
│   └── auth-context.tsx   # Authentication context
├── 🚀 features/            # Feature-based architecture
│   ├── 📖 about/          # About page features
│   │   └── about-content.tsx
│   ├── 🔐 auth/           # Authentication features
│   │   ├── 📱 account/    # Account management
│   │   │   ├── account-info.tsx
│   │   │   ├── account-navigation.tsx
│   │   │   └── change-password-form.tsx
│   │   ├── account-content.tsx
│   │   └── login-form.tsx
│   ├── 📊 dashboard/      # Dashboard features
│   │   └── dashboard-content.tsx
│   └── 🏠 home/           # Home page features
│       ├── 🧩 components/ # Home-specific components
│       │   ├── companies-data-table.tsx
│       │   └── filters/   # Data filtering components
│       │       ├── data-table-filter.tsx
│       │       ├── filter-funds.tsx
│       │       ├── filter-personalities.tsx
│       │       ├── filter-sectors.tsx
│       │       ├── index.ts
│       │       └── pagination.tsx
│       ├── 📋 table/      # Table components
│       │   ├── columns.tsx
│       │   ├── index.ts
│       │   └── show-number-by-page.tsx
│       └── home-content.tsx
├── 🪝 hooks/               # Custom React hooks
│   ├── use-api-client.ts
│   ├── use-companies.ts
│   ├── use-debounce.ts
│   ├── use-funds.ts
│   ├── use-personalities.ts
│   └── use-sectors.ts
├── 🌍 i18n/                # Internationalization
│   └── index.ts
├── 📚 lib/                 # Utility libraries
│   ├── api-client.ts
│   ├── query-client.ts
│   └── utils.ts
├── 📄 pages/               # Page components
│   ├── about.tsx
│   ├── account.tsx
│   ├── dashboard.tsx
│   ├── home.tsx
│   └── login.tsx
├── 📝 types/               # TypeScript type definitions
│   ├── api/                # API types
│   ├── fund.ts
│   ├── personality.ts
│   ├── sector.ts
│   └── index.ts
├── App.tsx                 # Main application component
├── App.css                 # Application styles
├── index.css               # Global styles
├── main.tsx                # Application entry point
└── vite-env.d.ts          # Vite type definitions
```

## 🛠️ Available Scripts

### Development
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm generate:types` - Generate TypeScript types from API

### Quality Assurance
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier

### Build & Deployment
- `pnpm build` - Create production build
- `pnpm build:analyze` - Analyze bundle size
- `pnpm preview` - Preview production build locally

## 🔧 Technology Stack

### Core Framework
- **[React 18](https://react.dev/)**: Modern React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Vite](https://vitejs.dev/)**: Fast build tool and dev server

### UI & Styling
- **[Tailwind CSS v4.1](https://tailwindcss.com/)**: Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)**: Beautiful, accessible components
- **[Lucide React](https://lucide.dev/)**: Beautiful icons
- **[clsx](https://github.com/lukeed/clsx)**: Conditional CSS classes

### State Management & Data Fetching
- **[React Query (TanStack Query)](https://tanstack.com/query)**: Server state management
- **[React Context](https://react.dev/learn/passing-data-deeply-with-context)**: Client state management
- **[Zustand](https://github.com/pmndrs/zustand)**: Lightweight state management

### Routing & Navigation
- **[React Router v7](https://reactrouter.com/)**: Client-side routing
- **[React Router Server Data Loading](https://reactrouter.com/en/main/route/loader)**: Server data loading

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)**: Performant forms
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)**: Form validation resolvers

### Internationalization
- **[react-i18next](https://react.i18next.com/)**: Internationalization framework
- **[i18next](https://www.i18next.com/)**: Translation framework

### Development Tools
- **[ESLint](https://eslint.org/)**: Code linting
- **[Prettier](https://prettier.io/)**: Code formatting
- **[TypeScript ESLint](https://typescript-eslint.io/)**: TypeScript-specific linting

## 🎨 UI Components

### Component Library
Our UI is built on top of **shadcn/ui**, providing:
- **Accessible**: WCAG compliant components
- **Customizable**: Easy to modify and extend
- **Type-safe**: Full TypeScript support
- **Modern**: Built with modern CSS and React patterns

### Available Components
- **Data Display**: Tables, cards, badges, progress bars
- **Navigation**: Breadcrumbs, pagination, tabs
- **Forms**: Inputs, selects, checkboxes, radio buttons
- **Feedback**: Alerts, toasts, dialogs, modals
- **Layout**: Containers, grids, dividers, spacers

### Custom Components
- **Company Data Table**: Advanced data table with filtering
- **Filter Components**: Dynamic filtering for all data types
- **Authentication Forms**: Login, registration, password management
- **Navigation**: Responsive header and navigation system

## 🌍 Internationalization

### Supported Languages
- **English** (en) - Default language
- **French** (fr) - Secondary language
- **Extensible** - Easy to add new languages

### Features
- **Language Detection**: Automatic language detection
- **Language Switcher**: Easy language selection
- **Localized Content**: All user-facing text is translatable
- **RTL Support**: Right-to-left language support ready

### Adding New Languages
1. Create translation file in `src/i18n/locales/`
2. Add language to language switcher
3. Update language detection logic

## 🔐 Authentication

### Features
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **User Context**: Global user state management
- **Account Management**: Profile, password, preferences

### Security
- **Token Storage**: Secure token handling
- **Route Protection**: Automatic redirect for unauthenticated users
- **Session Management**: Automatic token refresh
- **Logout**: Secure session termination

## 📊 Data Management

### API Integration
- **React Query**: Efficient data fetching and caching
- **Type Safety**: Full TypeScript integration with API
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth loading experiences

### Data Features
- **Real-time Updates**: Live data synchronization
- **Pagination**: Efficient large dataset handling
- **Filtering**: Advanced search and filter capabilities
- **Sorting**: Multi-column sorting support

## 🧪 Testing

### Test Structure
```
test/
├── 📁 unit/              # Unit tests
├── 📁 integration/       # Integration tests
├── 📁 e2e/              # End-to-end tests
└── 📁 __mocks__/        # Test mocks
```

### Testing Tools
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **Playwright**: E2E testing

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## 🚀 Performance

### Optimization Features
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: Optimized image loading
- **Bundle Analysis**: Bundle size monitoring

### Best Practices
- **React.memo**: Component memoization
- **useMemo/useCallback**: Hook optimization
- **Virtual Scrolling**: Large list optimization
- **Debouncing**: Search input optimization

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false

# Internationalization
VITE_DEFAULT_LOCALE=en
VITE_SUPPORTED_LOCALES=en,fr
```

### Build Configuration
- **Vite**: Fast development and optimized builds
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting

## 🚀 Deployment

### Build Process
```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview build
pnpm preview
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: Cloudflare, AWS CloudFront
- **Container**: Docker, Kubernetes
- **Server**: Nginx, Apache

### Environment Setup
- Configure environment variables
- Set up API endpoints
- Configure authentication
- Set up monitoring

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Ensure** all tests pass
6. **Submit** a pull request

### Development Standards
- Follow React best practices
- Write comprehensive tests
- Update documentation
- Follow TypeScript conventions
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/Bspot-api/b-spot-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Bspot-api/b-spot-frontend/discussions)
- **Documentation**: [Frontend Docs](https://frontend.b-spot.org)
- **Contributing**: [Contributing Guide](CONTRIBUTING.md)

## 🔗 Related Projects

- **[B-Spot API](https://github.com/Bspot-api/b-spot-api)**: NestJS backend API
- **[B-Spot Platform](https://github.com/Bspot-api/b-spot-private)**: Complete platform (private)

## 🎯 Roadmap

### Upcoming Features
- **Advanced Analytics**: Data visualization and insights
- **Export Functionality**: Data export in multiple formats
- **Mobile App**: React Native mobile application
- **Real-time Notifications**: Live updates and alerts

### Performance Improvements
- **Service Worker**: Offline functionality
- **Progressive Web App**: PWA capabilities
- **Advanced Caching**: Intelligent data caching
- **Bundle Optimization**: Further size reduction

---

<div align="center">

**Built with ❤️ for transparency and open data**

[Website](https://b-spot.org) • [Frontend Docs](https://frontend.b-spot.org) • [Community](https://github.com/Bspot-api)

</div>
