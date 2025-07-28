# API Types & Services

This directory contains types and services automatically generated from your NestJS API via OpenAPI/Swagger.

## 🚀 Automatic Generation

### Regenerate types
```bash
pnpm run generate:types
```

### Automatic regeneration (watch mode)
```bash
pnpm run generate:types:watch
```

## 📁 Structure

```
src/api/
├── generated/           # Generated types and services (DO NOT MODIFY)
│   ├── models/         # TypeScript types
│   ├── services/       # API services
│   └── core/           # OpenAPI configuration
└── index.ts            # Public exports
```

## 🎯 Usage

### Import types
```typescript
import type { Company } from '@/api';
```

### Import services
```typescript
import { CompaniesService } from '@/api';

// Get all companies
const companies = await CompaniesService.companyControllerFindAll();

// Get company by ID
const company = await CompaniesService.companyControllerFindOne('id');

// Create company
const newCompany = await CompaniesService.companyControllerCreate();
```

## ✅ Benefits

1. **Synchronized types** - Always up to date with backend
2. **Auto-completion** - Full IntelliSense in IDE
3. **Type safety** - Errors detected at compilation
4. **Reduced maintenance** - No need to maintain types manually

## 🔄 Workflow

1. Modify your NestJS API
2. Swagger types update automatically
3. Regenerate frontend types: `pnpm run generate:types`
4. New types available immediately

## ⚠️ Important

- **Never modify** files in `generated/`
- **Always regenerate** after API changes
- **Commit** generated files to Git 