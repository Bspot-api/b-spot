# API Dockerfile - NestJS (monorepo)
FROM node:22-alpine AS base

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy API package.json
COPY apps/api/package.json ./apps/api/

# Install all dependencies (needed for build)
RUN pnpm install --frozen-lockfile

# Copy API source code
COPY apps/api/ ./apps/api/

# Build the API
WORKDIR /app/apps/api
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate \
    && apk add --no-cache curl

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application (includes compiled mikro-orm.config.js and migrations)
COPY --from=base /app/apps/api/dist ./apps/api/dist

# Copy startup script
COPY apps/api/start.sh ./apps/api/
RUN chmod +x ./apps/api/start.sh

WORKDIR /app/apps/api

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api || exit 1

CMD ["./start.sh"]
