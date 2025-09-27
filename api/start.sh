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

# Fresh database setup for deployment
echo "Setting up fresh database (dropping and recreating)..."
pnpm exec mikro-orm schema:fresh --run --seed

echo "✅ Fresh database with seed data ready!"

# Start the application
echo "Starting the application..."
exec node dist/src/main.js