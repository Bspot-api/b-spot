import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  dbName: process.env.DB_NAME || 'b-spot',
  entities: [
    'dist/modules/**/entities/*.entity.js',
    'dist/modules/**/*.entity.js',
    'dist/utils/**/*.embeddable.js',
  ],
  entitiesTs: [
    'src/modules/**/entities/*.entity.ts',
    'src/modules/**/*.entity.ts',
    'src/utils/**/*.embeddable.ts',
  ],
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  seeder: {
    path: './src/seeders',
    pathTs: './src/seeders',
    glob: '!(*.d).{js,ts}',
  },
  debug: process.env.NODE_ENV !== 'production',
};

export default config;
