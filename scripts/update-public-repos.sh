#!/bin/bash

# Update Public Repositories Script
# This script updates the public API and frontend repositories from the private repository

set -e

echo "🔄 Updating public repositories from private repository..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the private repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from the private repository root."
    exit 1
fi

# Check if public repositories exist
API_DIR="../b-spot-api-public"
FRONTEND_DIR="../b-spot-frontend-public"

if [ ! -d "$API_DIR" ] || [ ! -d "$FRONTEND_DIR" ]; then
    print_error "Public repositories not found. Please run setup-github-repos.sh first."
    exit 1
fi

# Function to update API repository
update_api_repo() {
    print_status "Updating API repository..."
    
    cd "$API_DIR"
    
    # Remove all existing files
    rm -rf *
    
    # Copy API files from private repository
    cp -r ../b-spot-private/api/* .
    
    # Copy root configuration files
    cp ../b-spot-private/package.json .
    cp ../b-spot-private/tsconfig.json .
    cp ../b-spot-private/.gitignore .
    cp ../b-spot-private/docker-compose.yml .
    
    # Create API-specific pnpm-workspace.yaml
    cat > pnpm-workspace.yaml << EOF
packages:
  - '.'
EOF
    
    # Update package.json for API-only
    sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm start:dev"/' package.json
    sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' package.json
    sed -i '' 's/"test": "pnpm --recursive test"/"test": "pnpm test"/' package.json
    sed -i '' 's/"lint": "pnpm --recursive lint"/"lint": "pnpm lint"/' package.json
    
    # Remove frontend-specific scripts
    sed -i '' '/dev:frontend/d' package.json
    sed -i '' '/build:frontend/d' package.json
    sed -i '' '/generate:types/d' package.json
    
    # Check if there are changes
    if [ -n "$(git status --porcelain)" ]; then
        git add .
        git commit -m "Update API from private repository - $(date '+%Y-%m-%d %H:%M:%S')"
        git push
        print_success "API repository updated and pushed"
    else
        print_status "No changes detected in API repository"
    fi
    
    cd - > /dev/null
}

# Function to update frontend repository
update_frontend_repo() {
    print_status "Updating frontend repository..."
    
    cd "$FRONTEND_DIR"
    
    # Remove all existing files
    rm -rf *
    
    # Copy frontend files from private repository
    cp -r ../b-spot-private/frontend/* .
    
    # Copy root configuration files
    cp ../b-spot-private/package.json .
    cp ../b-spot-private/tsconfig.json .
    cp ../b-spot-private/.gitignore .
    
    # Create frontend-specific pnpm-workspace.yaml
    cat > pnpm-workspace.yaml << EOF
packages:
  - '.'
EOF
    
    # Update package.json for frontend-only
    sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm dev"/' package.json
    sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' package.json
    sed -i '' 's/"test": "pnpm --recursive test"/"test": "pnpm test"/' package.json
    sed -i '' 's/"lint": "pnpm --recursive lint"/"lint": "pnpm lint"/' package.json
    
    # Remove API-specific scripts
    sed -i '' '/dev:api/d' package.json
    sed -i '' '/build:api/d' package.json
    sed -i '' '/db:up/d' package.json
    sed -i '' '/db:down/d' package.json
    sed -i '' '/db:logs/d' package.json
    
    # Check if there are changes
    if [ -n "$(git status --porcelain)" ]; then
        git add .
        git commit -m "Update frontend from private repository - $(date '+%Y-%m-%d %H:%M:%S')"
        git push
        print_success "Frontend repository updated and pushed"
    else
        print_status "No changes detected in frontend repository"
    fi
    
    cd - > /dev/null
}

# Main menu
echo ""
print_status "Update options:"
echo "1. Update API repository only"
echo "2. Update frontend repository only"
echo "3. Update both repositories"
echo "4. Exit"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        update_api_repo
        ;;
    2)
        update_frontend_repo
        ;;
    3)
        update_api_repo
        update_frontend_repo
        ;;
    4)
        print_status "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid option. Please choose 1-4."
        exit 1
        ;;
esac

echo ""
print_success "Repository update complete!"
echo ""
print_status "Next steps:"
echo "1. Check the public repositories for any merge conflicts"
echo "2. Verify that builds are successful in the public repos"
echo "3. Update any deployment configurations if necessary"
