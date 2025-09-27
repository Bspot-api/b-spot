# Frontend Dockerfile - React + Vite
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.15.0

# Set working directory
WORKDIR /app

# Copy root package files for pnpm workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy frontend package.json
COPY frontend/package.json ./frontend/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy frontend source code
COPY frontend/ ./frontend/

# Build the frontend
WORKDIR /app/frontend
RUN pnpm build --mode production

# Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=base /app/frontend/dist /usr/share/nginx/html

# Add healthcheck
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
