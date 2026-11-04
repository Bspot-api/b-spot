#!/bin/sh
set -e

echo "Starting B-Spot API..."

export NODE_ENV=production
echo "NODE_ENV set to: $NODE_ENV"

# Run pending migrations using compiled MikroORM config
echo "Running database migrations..."
node -e "
const config = require('./dist/mikro-orm.config.js').default;
const { MikroORM } = require('@mikro-orm/postgresql');
(async () => {
  const orm = await MikroORM.init(config);
  const migrator = orm.getMigrator();
  const pending = await migrator.getPendingMigrations();
  if (pending.length) {
    console.log('Applying ' + pending.length + ' pending migration(s)...');
    await migrator.up();
    console.log('Migrations applied successfully.');
  } else {
    console.log('No pending migrations.');
  }
  await orm.close();
})().catch(e => { console.error('Migration warning:', e.message); });
" || echo "Warning: Migration step encountered an issue"

# Start the application
echo "Starting the application..."
exec node dist/src/main.js
