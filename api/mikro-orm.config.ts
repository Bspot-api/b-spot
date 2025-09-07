import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST || 'localhost',
  port: +(process.env.DATABASE_PORT || 5432),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  dbName: process.env.DATABASE_NAME || 'b-spot',
  entities: [
    'src/modules/**/entities/*.entity.ts',
    'src/modules/**/*.entity.ts', 
    'src/utils/**/*.embeddable.ts',
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
