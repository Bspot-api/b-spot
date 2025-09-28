#!/bin/sh
set -e

echo "Starting B-Spot API..."

# Force NODE_ENV to production
export NODE_ENV=production
echo "NODE_ENV set to: $NODE_ENV"

# Test basic database connectivity
echo "Testing database connection..."
if ! NODE_ENV=cli pnpm exec mikro-orm database:create > /dev/null 2>&1; then
  echo "Warning: Could not ensure database exists"
fi

# Run database migrations
echo "Running database migrations..."
NODE_ENV=cli pnpm exec mikro-orm migration:up

# Try to seed the database (will fail if data already exists, which is fine)
echo "Running database seeding (will skip if data exists)..."
if NODE_ENV=cli pnpm exec mikro-orm seeder:run 2>/dev/null; then
  echo "✅ Database seeded successfully!"
else
  echo "✅ Database seeding skipped (likely already has data)"
fi

echo "✅ Database ready!"

# Start the application
echo "Starting the application..."
exec node dist/src/main.js