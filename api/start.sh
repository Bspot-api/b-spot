#!/bin/sh
set -e

echo "Starting B-Spot API..."

# Force NODE_ENV to production
export NODE_ENV=production
echo "NODE_ENV set to: $NODE_ENV"

# Skip all database operations for now to isolate startup issues
echo "⚠️  Skipping database operations for troubleshooting"

# Start the application
echo "Starting the application..."
exec node dist/src/main.js