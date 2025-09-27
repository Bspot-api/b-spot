# API Dockerfile - NestJS
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.15.0

# Set working directory
WORKDIR /app

# Copy root package files for pnpm workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy API package.json
COPY api/package.json ./api/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy API source code
COPY api/ ./api/

# Build the API
WORKDIR /app/api
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Install pnpm, curl for healthcheck, and postgresql-client for migrations
RUN npm install -g pnpm@9.15.0 && apk add --no-cache curl postgresql-client

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY api/package.json ./api/

# Install production dependencies only with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/api/dist ./api/dist
COPY --from=base /app/api/mikro-orm.config.ts ./api/
COPY --from=base /app/api/mikro-orm.config.prod.js ./api/

# Copy startup script
COPY api/start.sh ./api/
RUN chmod +x ./api/start.sh

# Set working directory to API
WORKDIR /app/api

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application with migration and seeding
CMD ["./start.sh"]
