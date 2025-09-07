const config = {
  driver: require('@mikro-orm/postgresql').PostgreSqlDriver,
  host: process.env.DATABASE_HOST || 'localhost',
  port: +(process.env.DATABASE_PORT || 5432),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  dbName: process.env.DATABASE_NAME || 'b-spot',
  entities: [
    './dist/src/modules/**/*.entity.js',
    './dist/src/utils/**/*.embeddable.js',
  ],
  migrations: {
    path: './dist/src/migrations',
    glob: '!(*.d).js',
  },
  seeder: {
    path: './dist/src/seeders',
    glob: '!(*.d).js',
  },
  debug: false,
};

module.exports = config;