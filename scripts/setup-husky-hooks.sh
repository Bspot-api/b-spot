#!/bin/bash

# Setup Husky Hooks for All B-Spot Repositories
# This script configures Husky hooks in the private and public repositories

set -e

echo "🔧 Setting up Husky hooks for all B-Spot repositories..."

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

# Function to setup Husky in a repository
setup_husky_in_repo() {
    local repo_path="$1"
    local repo_name="$2"
    
    if [ ! -d "$repo_path" ]; then
        print_warning "Repository $repo_name not found at $repo_path"
        return 1
    fi
    
    if [ ! -d "$repo_path/.git" ]; then
        print_warning "$repo_path is not a git repository"
        return 1
    fi
    
    print_status "Setting up Husky in $repo_name..."
    
    cd "$repo_path"
    
    # Check if Husky is already installed
    if [ ! -d "node_modules/.bin/husky" ] && [ ! -f "package.json" ]; then
        print_warning "No package.json found in $repo_name, skipping Husky setup"
        cd - > /dev/null
        return 1
    fi
    
    # Install Husky if not present
    if [ ! -d "node_modules/.bin/husky" ]; then
        print_status "Installing Husky in $repo_name..."
        pnpm add -D husky
    fi
    
    # Initialize Husky if not already done
    if [ ! -d ".husky" ]; then
        print_status "Initializing Husky in $repo_name..."
        npx husky init
    fi
    
    # Create pre-commit hook
    if [ ! -f ".husky/pre-commit" ] || ! grep -q "auto-switch-identity" ".husky/pre-commit"; then
        print_status "Creating pre-commit hook in $repo_name..."
        cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Auto-switch Git identity before commit
echo "🔑 Auto-switching Git identity..."
if [ -f "../b-spot/scripts/auto-switch-identity.sh" ]; then
    ../b-spot/scripts/auto-switch-identity.sh
else
    echo "⚠️  Auto-switch script not found, using default identity"
fi

# Continue with commit
echo "✅ Identity switched, proceeding with commit..."
EOF
        chmod +x .husky/pre-commit
    fi
    
    # Create pre-push hook
    if [ ! -f ".husky/pre-push" ] || ! grep -q "auto-switch-identity" ".husky/pre-push"; then
        print_status "Creating pre-push hook in $repo_name..."
        cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Auto-switch Git identity before push
echo "🔑 Auto-switching Git identity before push..."
if [ -f "../b-spot/scripts/auto-switch-identity.sh" ]; then
    ../b-spot/scripts/auto-switch-identity.sh
else
    echo "⚠️  Auto-switch script not found, using default identity"
fi

# Continue with push
echo "✅ Identity switched, proceeding with push..."
EOF
        chmod +x .husky/pre-push
    fi
    
    print_success "Husky hooks configured in $repo_name"
    cd - > /dev/null
}

# Main execution
main() {
    print_status "Setting up Husky hooks in all repositories..."
    
    # Setup in private repository (current)
    setup_husky_in_repo "." "b-spot-private"
    
    # Setup in API public repository
    setup_husky_in_repo "../b-spot-api-public" "b-spot-api-public"
    
    # Setup in Frontend public repository
    setup_husky_in_repo "../b-spot-frontend-public" "b-spot-frontend-public"
    
    echo ""
    print_success "Husky hooks setup complete!"
    echo ""
    print_status "Now your Git identity will automatically switch based on the repository:"
    echo "  🔑 B-Spot repositories → bspot.api@gmail.com"
    echo "  🔑 Personal repositories → tatiana@lonestone.studio"
    echo ""
    print_status "Hooks are active in:"
    echo "  ✅ b-spot-private (pre-commit, pre-push)"
    echo "  ✅ b-spot-api-public (pre-commit, pre-push)"
    echo "  ✅ b-spot-frontend-public (pre-commit, pre-push)"
}

# Run main function
main "$@"
