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

# Run database migrations
echo "Running database migrations..."
pnpm exec mikro-orm migration:up

# Check if we need to seed by looking for the Company table
echo "Checking if database needs seeding..."
if ! psql "${DATABASE_URL:-postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}}" -c "SELECT 1 FROM company LIMIT 1;" >/dev/null 2>&1; then
  echo "Database appears empty or Company table missing, running seeds..."
  pnpm exec mikro-orm seeder:run
  echo "✅ Database seeded successfully!"
else
  echo "✅ Database already contains data, skipping seeding"
fi

echo "✅ Database ready!"

# Start the application
echo "Starting the application..."
exec node dist/src/main.js