import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST || 'localhost',
  port: +(process.env.DATABASE_PORT || 5432),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  dbName: process.env.DATABASE_NAME || 'b-spot',
  // Include entities for CLI commands (migrations, seeders)
  ...(process.env.NODE_ENV === 'cli' && {
    entities: ['./dist/src/modules/**/*.entity.js'],  // Use compiled JS files
  }),
  migrations: {
    path: './dist/src/migrations',  // Use compiled migrations
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  seeder: {
    path: './src/seeders',
    pathTs: './src/seeders',
    glob: '!(*.d).{js,ts}',
  },
  debug: process.env.NODE_ENV !== 'production',
  dynamicImportProvider: (id) => import(id),
};

export default config;
