import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { PappersCache } from './src/modules/cache/pappers-cache.entity';
import { ApiUsageLog } from './src/modules/cache/api-usage-log.entity';
import { Product } from './src/modules/product/product.entity';
import { Brand } from './src/modules/brand/brand.entity';
import { BrandSuggestion } from './src/modules/brand-suggestion/brand-suggestion.entity';
import { Company } from './src/modules/company/company.entity';

const entities = [PappersCache, ApiUsageLog, Product, Brand, BrandSuggestion, Company];

export default defineConfig({
  entities,
  entitiesTs: entities,
  dbName: process.env.DATABASE_NAME || 'b_spot',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  discovery: {
    requireEntitiesArray: false,
    warnWhenNoEntities: false,
  },
  migrations: {
    path: './dist/src/migrations',
    pathTs: './src/migrations',
    tableName: 'mikro_orm_migrations',
    transactional: true,
  },
  seeder: {
    path: './dist/src/seeders',
    pathTs: './src/seeders',
    defaultSeeder: 'DatabaseSeeder',
  },
  extensions: [Migrator, SeedManager],
  debug: process.env.NODE_ENV === 'development',
  allowGlobalContext: true,
});
