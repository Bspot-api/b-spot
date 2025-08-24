#!/bin/bash

# B-Spot Public Repositories Maintenance Script
# This script helps maintain and update the public API and frontend repositories

set -e

echo "🔧 B-Spot Public Repositories Maintenance"

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

echo ""
print_status "Maintenance options:"
echo "1. Update API repository from private repo"
echo "2. Update frontend repository from private repo"
echo "3. Update both repositories"
echo "4. Check repository status"
echo "5. Exit"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        print_status "Updating API repository..."
        update_api_repo
        ;;
    2)
        print_status "Updating frontend repository..."
        update_frontend_repo
        ;;
    3)
        print_status "Updating both repositories..."
        update_api_repo
        update_frontend_repo
        ;;
    4)
        print_status "Checking repository status..."
        check_repo_status
        ;;
    5)
        print_status "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid option. Please choose 1-5."
        exit 1
        ;;
esac

# Function to update API repository
update_api_repo() {
    print_status "Updating API repository..."
    
    cd "$API_DIR"
    
    # Remove all existing files (except .git)
    find . -mindepth 1 -not -path './.git*' -delete
    
    # Copy API files from private repository
    cp -r ../b-spot/api/* .
    
    # Copy root configuration files
    cp ../b-spot/package.json .
    cp ../b-spot/tsconfig.json .
    cp ../b-spot/.gitignore .
    cp ../b-spot/docker-compose.yml .
    
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
        print_success "API repository updated and committed"
        print_status "Don't forget to push: cd $API_DIR && git push"
    else
        print_status "No changes detected in API repository"
    fi
    
    cd - > /dev/null
}

# Function to update frontend repository
update_frontend_repo() {
    print_status "Updating frontend repository..."
    
    cd "$FRONTEND_DIR"
    
    # Remove all existing files (except .git)
    find . -mindepth 1 -not -path './.git*' -delete
    
    # Copy frontend files from private repository
    cp -r ../b-spot/frontend/* .
    
    # Copy root configuration files
    cp ../b-spot/package.json .
    cp ../b-spot/tsconfig.json .
    cp ../b-spot/.gitignore .
    
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
    sed -i '' '/start:dev/d' package.json
    
    # Check if there are changes
    if [ -n "$(git status --porcelain)" ]; then
        git add .
        git commit -m "Update frontend from private repository - $(date '+%Y-%m-%d %H:%M:%S')"
        print_success "Frontend repository updated and committed"
        print_status "Don't forget to push: cd $FRONTEND_DIR && git push"
    else
        print_status "No changes detected in frontend repository"
    fi
    
    cd - > /dev/null
}

# Function to check repository status
check_repo_status() {
    print_status "API Repository Status:"
    if [ -d "$API_DIR/.git" ]; then
        cd "$API_DIR"
        echo "  Branch: $(git branch --show-current)"
        echo "  Last commit: $(git log -1 --format='%h - %s (%cr)')"
        echo "  Status: $(git status --porcelain | wc -l | tr -d ' ') files modified"
        cd - > /dev/null
    else
        echo "  Not a git repository"
    fi
    
    echo ""
    print_status "Frontend Repository Status:"
    if [ -d "$FRONTEND_DIR/.git" ]; then
        cd "$FRONTEND_DIR"
        echo "  Branch: $(git branch --show-current)"
        echo "  Last commit: $(git log -1 --format='%h - %s (%cr)')"
        echo "  Status: $(git status --porcelain | wc -l | tr -d ' ') files modified"
        cd - > /dev/null
    else
        echo "  Not a git repository"
    fi
}
