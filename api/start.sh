#!/bin/sh
set -e

echo "Starting B-Spot API..."

# Force NODE_ENV to production
export NODE_ENV=production
echo "NODE_ENV set to: $NODE_ENV"

# Run database migrations with corrected entity paths
echo "Running database migrations..."
NODE_ENV=cli pnpm exec mikro-orm migration:up

# Start the application
echo "Starting the application..."
exec node dist/src/main.js