#!/bin/bash

# GitHub Repository Setup Script for B-Spot
# This script helps set up the private and public repositories

set -e

echo "🚀 Setting up B-Spot GitHub repositories..."

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

# Function to create API repository
create_api_repo() {
    local api_dir="../b-spot-api-public"
    
    print_status "Creating API repository in $api_dir..."
    
    if [ -d "$api_dir" ]; then
        print_warning "Directory $api_dir already exists. Removing..."
        rm -rf "$api_dir"
    fi
    
    mkdir -p "$api_dir"
    
    # Copy API files
    cp -r api/* "$api_dir/"
    
    # Copy root configuration files
    cp package.json "$api_dir/"
    cp tsconfig.json "$api_dir/"
    cp .gitignore "$api_dir/"
    cp docker-compose.yml "$api_dir/"
    
    # Create API-specific pnpm-workspace.yaml
    cat > "$api_dir/pnpm-workspace.yaml" << EOF
packages:
  - '.'
EOF
    
    # Update package.json for API-only
    sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm start:dev"/' "$api_dir/package.json"
    sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' "$api_dir/package.json"
    sed -i '' 's/"test": "pnpm --recursive test"/"test": "pnpm test"/' "$api_dir/package.json"
    sed -i '' 's/"lint": "pnpm --recursive lint"/"lint": "pnpm lint"/' "$api_dir/package.json"
    
    # Remove frontend-specific scripts
    sed -i '' '/dev:frontend/d' "$api_dir/package.json"
    sed -i '' '/build:frontend/d' "$api_dir/package.json"
    sed -i '' '/generate:types/d' "$api_dir/package.json"
    
    # Create API-specific README
    cat > "$api_dir/README.md" << 'EOF'
# B-Spot API

Public NestJS backend API for the B-Spot platform - a comprehensive database of companies linked to investment funds and influential networks.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bspot-api/b-spot-api.git
   cd b-spot-api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d postgres
   ```

5. **Run database migrations**
   ```bash
   pnpm migration:up
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication
│   ├── company/      # Company management
│   ├── fund/         # Investment fund management
│   ├── personality/  # Personality management
│   └── sector/       # Sector management
├── migrations/       # Database migrations
└── seeders/          # Database seeders
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build the application
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm migration:create` - Create new migration
- `pnpm migration:up` - Apply migrations
- `pnpm migration:down` - Rollback migrations

## 🔧 Development

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with MikroORM
- **Authentication**: Better-Auth integration
- **Architecture**: Clean Architecture principles

## 📚 API Documentation

- Swagger/OpenAPI documentation available at `/api` endpoint
- RESTful API design
- Comprehensive entity management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Note**: This is the public API repository. For the complete platform, see the private repository.
EOF
    
    print_success "API repository created in $api_dir"
}

# Function to create frontend repository
create_frontend_repo() {
    local frontend_dir="../b-spot-frontend-public"
    
    print_status "Creating frontend repository in $frontend_dir..."
    
    if [ -d "$frontend_dir" ]; then
        print_warning "Directory $frontend_dir already exists. Removing..."
        rm -rf "$frontend_dir"
    fi
    
    mkdir -p "$frontend_dir"
    
    # Copy frontend files
    cp -r frontend/* "$frontend_dir/"
    
    # Copy root configuration files
    cp package.json "$frontend_dir/"
    cp tsconfig.json "$frontend_dir/"
    cp .gitignore "$frontend_dir/"
    
    # Create frontend-specific pnpm-workspace.yaml
    cat > "$frontend_dir/pnpm-workspace.yaml" << EOF
packages:
  - '.'
EOF
    
    # Update package.json for frontend-only
    sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm dev"/' "$frontend_dir/package.json"
    sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' "$frontend_dir/package.json"
    sed -i '' 's/"test": "pnpm --recursive test"/"test": "pnpm test"/' "$frontend_dir/package.json"
    sed -i '' 's/"lint": "pnpm --recursive lint"/"lint": "pnpm lint"/' "$frontend_dir/package.json"
    
    # Remove API-specific scripts
    sed -i '' '/dev:api/d' "$frontend_dir/package.json"
    sed -i '' '/build:api/d' "$frontend_dir/package.json"
    sed -i '' '/db:up/d' "$frontend_dir/package.json"
    sed -i '' '/db:down/d' "$frontend_dir/package.json"
    sed -i '' '/db:logs/d' "$frontend_dir/package.json"
    
    # Create frontend-specific README
    cat > "$frontend_dir/README.md" << 'EOF'
# B-Spot Frontend

Public React frontend application for the B-Spot platform - a modern web interface for exploring companies linked to investment funds and influential networks.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bspot-api/b-spot-frontend.git
   cd b-spot-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   ```

## 📁 Project Structure

```
src/
├── features/          # Feature-based architecture
│   ├── auth/         # Authentication features
│   ├── dashboard/    # Dashboard features
│   └── home/         # Home page features
├── components/        # Reusable components
│   ├── auth/         # Authentication components
│   ├── shadcn/       # UI component library
│   └── shared/       # Shared components
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── lib/              # Utility libraries
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm preview` - Preview production build

## 🔧 Development

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4.1
- **State Management**: React Query + Context API
- **Routing**: React Router v7
- **Architecture**: Feature-based organization

## 🎨 UI Components

- Built with shadcn/ui components
- Responsive design
- Dark/light theme support
- Internationalization (i18n)

## 📱 Features

- Company search and filtering
- Investment fund information
- Personality and sector data
- Responsive data tables
- Authentication system
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Note**: This is the public frontend repository. For the complete platform, see the private repository.
EOF
    
    print_success "Frontend repository created in $frontend_dir"
}

# Main menu
echo ""
print_status "Repository setup options:"
echo "1. Set up private repository (current repo)"
echo "2. Create API repository for public deployment"
echo "3. Create frontend repository for public deployment"
echo "4. Create both public repositories"
echo "5. Exit"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        print_status "Setting up private repository..."
        read -p "Enter private repository URL (e.g., https://github.com/Bspot-api/b-spot-private.git): " private_repo
        
        if [ ! -z "$private_repo" ]; then
            git remote set-url origin "$private_repo"
            print_success "Private repository URL set to: $private_repo"
            
            echo ""
            print_status "Next steps:"
            echo "1. Push your code to the private repository:"
            echo "   git add ."
            echo "   git commit -m 'Initial commit'"
            echo "   git push -u origin main"
        fi
        ;;
    2)
        create_api_repo
        ;;
    3)
        create_frontend_repo
        ;;
    4)
        create_api_repo
        create_frontend_repo
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

echo ""
print_success "Repository setup complete!"
echo ""
print_status "Next steps:"
echo "1. Push your current code to the private repository"
echo "2. Create new repositories on GitHub for API and frontend (if created)"
echo "3. Push the prepared code to the respective public repositories"
echo ""
print_status "Remember to:"
echo "- Update .gitignore files in public repositories"
echo "- Remove sensitive information before pushing to public repos"
echo "- Set up proper CI/CD pipelines"
echo "- Configure environment variables in deployment platforms"
