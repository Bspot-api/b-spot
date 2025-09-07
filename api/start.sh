#!/bin/sh
set -e

echo "Starting B-Spot API..."

# Force NODE_ENV to production
export NODE_ENV=production
echo "NODE_ENV set to: $NODE_ENV"

# Test basic database connectivity
echo "Testing database connection..."
if ! pnpm exec mikro-orm database:create --if-not-exists > /dev/null 2>&1; then
  echo "Warning: Could not ensure database exists"
fi

# Run migrations first (this will create schema if needed)
echo "Running database migrations..."
pnpm exec mikro-orm migration:up --config ./mikro-orm.config.prod.js || echo "⚠️ Some migrations already applied, continuing..."

# Validate schema after migrations
echo "Validating database schema..."
pnpm exec mikro-orm schema:validate --no-cache --config ./mikro-orm.config.prod.js || echo "Schema validation warning (continuing anyway)"

# Run seeding if needed
echo "Running database seeding..."
pnpm exec mikro-orm seeder:run --config ./mikro-orm.config.prod.js || echo "Seeding failed or already completed"

# Start the application
echo "Starting the application..."
exec node dist/src/main.js