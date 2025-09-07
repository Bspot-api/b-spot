#!/bin/bash

# Build and push Docker images to Scaleway Container Registry
# Usage: ./scripts/build-and-push.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY_URL="${REGISTRY_URL:-rg.fr-par.scw.cloud/your-registry}"
API_IMAGE="$REGISTRY_URL/b-spot-api"
FRONTEND_IMAGE="$REGISTRY_URL/b-spot-frontend"

# Get version from package.json or use latest
VERSION=${1:-latest}

echo -e "${YELLOW}🚀 Building and pushing B-Spot images to Scaleway...${NC}"

# Check if logged into Scaleway registry
echo -e "${YELLOW}📝 Checking Scaleway registry login...${NC}"
if ! grep -q "rg.fr-par.scw.cloud" ~/.docker/config.json 2>/dev/null; then
    echo -e "${RED}❌ Please login to Scaleway registry first:${NC}"
    echo "docker login rg.fr-par.scw.cloud"
    exit 1
fi

# Build API image (force AMD64 architecture for Scaleway)
echo -e "${YELLOW}🏗️ Building API image (AMD64)...${NC}"
docker build --platform=linux/amd64 -f api/Dockerfile -t "$API_IMAGE:$VERSION" -t "$API_IMAGE:latest" .

# Build Frontend image (force AMD64 architecture for Scaleway)
echo -e "${YELLOW}🏗️ Building Frontend image (AMD64)...${NC}"
docker build --platform=linux/amd64 -f frontend/Dockerfile -t "$FRONTEND_IMAGE:$VERSION" -t "$FRONTEND_IMAGE:latest" .

# Push API image
echo -e "${YELLOW}📤 Pushing API image...${NC}"
docker push "$API_IMAGE:$VERSION"
docker push "$API_IMAGE:latest"

# Push Frontend image
echo -e "${YELLOW}📤 Pushing Frontend image...${NC}"
docker push "$FRONTEND_IMAGE:$VERSION"  
docker push "$FRONTEND_IMAGE:latest"

echo -e "${GREEN}✅ Successfully built and pushed images:${NC}"
echo -e "${GREEN}   API: $API_IMAGE:$VERSION${NC}"
echo -e "${GREEN}   Frontend: $FRONTEND_IMAGE:$VERSION${NC}"

echo -e "${YELLOW}🔗 Next steps:${NC}"
echo -e "${YELLOW}   1. Create PostgreSQL database${NC}"
echo -e "${YELLOW}   2. Deploy API to Serverless Containers${NC}"
echo -e "${YELLOW}   3. Deploy Frontend to Object Storage${NC}"
