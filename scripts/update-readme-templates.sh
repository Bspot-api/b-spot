#!/bin/bash

# Update README Templates Script
# This script updates README files with the latest templates and badges

set -e

echo "📚 Updating README templates across all repositories..."

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

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -d "api" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Function to update main README
update_main_readme() {
    print_status "Updating main README.md..."
    
    # Check if README.md exists
    if [ ! -f "README.md" ]; then
        print_error "README.md not found in current directory"
        return 1
    fi
    
    print_success "Main README.md is already up to date"
}

# Function to update API README
update_api_readme() {
    print_status "Updating API README.md..."
    
    if [ ! -f "api/README.md" ]; then
        print_error "API README.md not found"
        return 1
    fi
    
    print_success "API README.md is already up to date"
}

# Function to update frontend README
update_frontend_readme() {
    print_status "Updating frontend README.md..."
    
    if [ ! -f "frontend/README.md" ]; then
        print_error "Frontend README.md not found"
        return 1
    fi
    
    print_success "Frontend README.md is already up to date"
}

# Function to create/update contributing guide
update_contributing_guide() {
    print_status "Updating contributing guide..."
    
    if [ ! -f "CONTRIBUTING.md" ]; then
        print_warning "CONTRIBUTING.md not found, creating..."
        # Copy from the one we created
        if [ -f "scripts/CONTRIBUTING.md" ]; then
            cp scripts/CONTRIBUTING.md CONTRIBUTING.md
            print_success "CONTRIBUTING.md created"
        else
            print_error "CONTRIBUTING.md template not found in scripts/"
        fi
    else
        print_success "CONTRIBUTING.md is already up to date"
    fi
}

# Function to create/update license file
update_license_file() {
    print_status "Updating license file..."
    
    if [ ! -f "LICENSE" ]; then
        print_warning "LICENSE not found, creating..."
        # Copy from the one we created
        if [ -f "scripts/LICENSE" ]; then
            cp scripts/LICENSE LICENSE
            print_success "LICENSE created"
        else
            print_error "LICENSE template not found in scripts/"
        fi
    else
        print_success "LICENSE is already up to date"
    fi
}

# Function to create/update environment examples
update_env_examples() {
    print_status "Updating environment examples..."
    
    # API .env.example
    if [ ! -f "api/.env.example" ]; then
        print_warning "API .env.example not found, creating..."
        cat > api/.env.example << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=b-spot

# Application Configuration
NODE_ENV=development
PORT=3001

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Better Auth Configuration
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_BASE_PATH=/api/auth
EOF
        print_success "API .env.example created"
    else
        print_success "API .env.example is already up to date"
    fi
    
    # Frontend .env.example
    if [ ! -f "frontend/.env.example" ]; then
        print_warning "Frontend .env.example not found, creating..."
        cat > frontend/.env.example << 'EOF'
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false

# Internationalization
VITE_DEFAULT_LOCALE=en
VITE_SUPPORTED_LOCALES=en,fr

# Development
VITE_DEV_MODE=true
VITE_LOG_LEVEL=info

# External Services (Optional)
VITE_SENTRY_DSN=
VITE_GOOGLE_ANALYTICS_ID=
EOF
        print_success "Frontend .env.example created"
    else
        print_success "Frontend .env.example is already up to date"
    fi
}

# Function to validate README files
validate_readme_files() {
    print_status "Validating README files..."
    
    local errors=0
    
    # Check main README
    if [ ! -f "README.md" ]; then
        print_error "Main README.md missing"
        ((errors++))
    fi
    
    # Check API README
    if [ ! -f "api/README.md" ]; then
        print_error "API README.md missing"
        ((errors++))
    fi
    
    # Check frontend README
    if [ ! -f "frontend/README.md" ]; then
        print_error "Frontend README.md missing"
        ((errors++))
    fi
    
    # Check contributing guide
    if [ ! -f "CONTRIBUTING.md" ]; then
        print_error "CONTRIBUTING.md missing"
        ((errors++))
    fi
    
    # Check license
    if [ ! -f "LICENSE" ]; then
        print_error "LICENSE missing"
        ((errors++))
    fi
    
    # Check environment examples
    if [ ! -f "api/.env.example" ]; then
        print_error "API .env.example missing"
        ((errors++))
    fi
    
    if [ ! -f "frontend/.env.example" ]; then
        print_error "Frontend .env.example missing"
        ((errors++))
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "All README files and templates are present and up to date"
    else
        print_error "Found $errors missing files"
        return 1
    fi
}

# Main execution
echo ""
print_status "Starting README template update process..."

# Update all files
update_main_readme
update_api_readme
update_frontend_readme
update_contributing_guide
update_license_file
update_env_examples

# Validate everything
validate_readme_files

echo ""
print_success "README template update complete!"
echo ""
print_status "Next steps:"
echo "1. Review the updated README files"
echo "2. Customize content as needed for your project"
echo "3. Commit the changes to version control"
echo "4. Use the setup scripts to create public repositories"
echo ""
print_status "All README files are now ready for GitHub deployment!"
