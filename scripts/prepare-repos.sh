#!/bin/bash

# Script to prepare repositories for GitHub deployment
# This script helps set up the private and public repositories

set -e

echo "🚀 Preparing B-Spot repositories for GitHub..."

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

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from the project root."
    exit 1
fi

print_status "Current git remote configuration:"
git remote -v

echo ""
print_status "Repository setup options:"
echo "1. Set up private repository (contains everything)"
echo "2. Prepare API repository for public deployment"
echo "3. Prepare frontend repository for public deployment"
echo "4. Set up all repositories"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        print_status "Setting up private repository..."
        read -p "Enter private repository URL (e.g., https://github.com/Bspot-api/b-spot-private.git): " private_repo
        
        if [ ! -z "$private_repo" ]; then
            git remote set-url origin "$private_repo"
            print_success "Private repository URL set to: $private_repo"
        fi
        ;;
    2)
        print_status "Preparing API repository for public deployment..."
        print_warning "This will create a new directory with only the API code"
        read -p "Continue? (y/N): " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            mkdir -p ../b-spot-api-public
            cp -r api/* ../b-spot-api-public/
            cp package.json ../b-spot-api-public/
            cp pnpm-workspace.yaml ../b-spot-api-public/
            cp tsconfig.json ../b-spot-api-public/
            cp .gitignore ../b-spot-api-public/
            
            # Remove frontend-specific references
            sed -i '' '/frontend/d' ../b-spot-api-public/pnpm-workspace.yaml
            sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm start:dev"/' ../b-spot-api-public/package.json
            sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' ../b-spot-api-public/package.json
            
            print_success "API repository prepared in ../b-spot-api-public"
        fi
        ;;
    3)
        print_status "Preparing frontend repository for public deployment..."
        print_warning "This will create a new directory with only the frontend code"
        read -p "Continue? (y/N): " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            mkdir -p ../b-spot-frontend-public
            cp -r frontend/* ../b-spot-frontend-public/
            cp package.json ../b-spot-frontend-public/
            cp pnpm-workspace.yaml ../b-spot-frontend-public/
            cp tsconfig.json ../b-spot-frontend-public/
            cp .gitignore ../b-spot-frontend-public/
            
            # Remove API-specific references
            sed -i '' '/api/d' ../b-spot-frontend-public/pnpm-workspace.yaml
            sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm dev"/' ../b-spot-frontend-public/package.json
            sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' ../b-spot-frontend-public/package.json
            
            print_success "Frontend repository prepared in ../b-spot-frontend-public"
        fi
        ;;
    4)
        print_status "Setting up all repositories..."
        read -p "Enter private repository URL (e.g., https://github.com/Bspot-api/b-spot-private.git): " private_repo
        
        if [ ! -z "$private_repo" ]; then
            git remote set-url origin "$private_repo"
            print_success "Private repository URL set to: $private_repo"
        fi
        
        # Prepare API repository
        mkdir -p ../b-spot-api-public
        cp -r api/* ../b-spot-api-public/
        cp package.json ../b-spot-api-public/
        cp pnpm-workspace.yaml ../b-spot-api-public/
        cp tsconfig.json ../b-spot-api-public/
        cp .gitignore ../b-spot-api-public/
        sed -i '' '/frontend/d' ../b-spot-api-public/pnpm-workspace.yaml
        sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm start:dev"/' ../b-spot-api-public/package.json
        sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' ../b-spot-api-public/package.json
        
        # Prepare frontend repository
        mkdir -p ../b-spot-frontend-public
        cp -r frontend/* ../b-spot-frontend-public/
        cp package.json ../b-spot-frontend-public/
        cp pnpm-workspace.yaml ../b-spot-frontend-public/
        cp tsconfig.json ../b-spot-frontend-public/
        cp .gitignore ../b-spot-frontend-public/
        sed -i '' '/api/d' ../b-spot-frontend-public/pnpm-workspace.yaml
        sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm dev"/' ../b-spot-frontend-public/package.json
        sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' ../b-spot-frontend-public/package.json
        
        print_success "All repositories prepared!"
        ;;
    *)
        print_error "Invalid option. Please choose 1-4."
        exit 1
        ;;
esac

echo ""
print_success "Repository setup complete!"
echo ""
print_status "Next steps:"
echo "1. Push your current code to the private repository"
echo "2. Create new repositories on GitHub for API and frontend (if option 2-4 was chosen)"
echo "3. Push the prepared code to the respective public repositories"
echo ""
print_status "Remember to update .gitignore files and remove sensitive information before pushing to public repos!"
