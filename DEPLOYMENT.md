# B-Spot Deployment Guide

This guide explains how to deploy the B-Spot platform across multiple GitHub repositories.

## 🏗️ Repository Structure

### 1. Private Repository (Complete Platform)
- **URL**: `https://github.com/Bspot-api/b-spot-private.git`
- **Content**: Complete monorepo with frontend, API, and all configurations
- **Access**: Private (team members only)
- **Purpose**: Development, testing, and complete platform management

### 2. Public API Repository
- **URL**: `https://github.com/Bspot-api/b-spot-api.git`
- **Content**: NestJS backend API only
- **Access**: Public (open source)
- **Purpose**: Public API access, community contributions

### 3. Public Frontend Repository
- **URL**: `https://github.com/Bspot-api/b-spot-frontend.git`
- **Content**: React frontend application only
- **Access**: Public (open source)
- **Purpose**: Public frontend access, community contributions

## 🚀 Setup Process

### Step 1: Prepare the Private Repository

1. **Clone and configure the private repository**
   ```bash
   git clone https://github.com/Bspot-api/b-spot-private.git
   cd b-spot-private
   ```

2. **Set up the remote origin**
   ```bash
   git remote set-url origin https://github.com/Bspot-api/b-spot-private.git
   ```

3. **Push your code**
   ```bash
   git add .
   git commit -m "Initial commit: Complete B-Spot platform"
   git push -u origin main
   ```

### Step 2: Create Public Repositories

Use the provided script to automatically create the public repositories:

```bash
./scripts/setup-github-repos.sh
```

Choose option 4 to create both public repositories.

### Step 3: Deploy Public Repositories

#### API Repository
1. **Navigate to the API directory**
   ```bash
   cd ../b-spot-api-public
   ```

2. **Initialize git and push**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: B-Spot API"
   git branch -M main
   git remote add origin https://github.com/Bspot-api/b-spot-api.git
   git push -u origin main
   ```

#### Frontend Repository
1. **Navigate to the frontend directory**
   ```bash
   cd ../b-spot-frontend-public
   ```

2. **Initialize git and push**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: B-Spot Frontend"
   git branch -M main
   git remote add origin https://github.com/Bspot-api/b-spot-frontend.git
   git push -u origin main
   ```

## 🔄 Maintenance Workflow

### Daily Development
- Work in the **private repository**
- All changes, testing, and development happen here
- Use feature branches and pull requests

### Public Repository Updates
When you want to update the public repositories:

1. **Update API repository**
   ```bash
   cd ../b-spot-api-public
   rm -rf *
   cp -r ../b-spot-private/api/* .
   cp ../b-spot-private/package.json .
   cp ../b-spot-private/tsconfig.json .
   cp ../b-spot-private/.gitignore .
   cp ../b-spot-private/docker-compose.yml .
   
   # Update workspace configuration
   echo "packages:" > pnpm-workspace.yaml
   echo "  - '.'" >> pnpm-workspace.yaml
   
   # Update package.json scripts
   sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm start:dev"/' package.json
   sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' package.json
   
   git add .
   git commit -m "Update API from private repository"
   git push
   ```

2. **Update frontend repository**
   ```bash
   cd ../b-spot-frontend-public
   rm -rf *
   cp -r ../b-spot-private/frontend/* .
   cp ../b-spot-private/package.json .
   cp ../b-spot-private/tsconfig.json .
   cp ../b-spot-private/.gitignore .
   
   # Update workspace configuration
   echo "packages:" > pnpm-workspace.yaml
   echo "  - '.'" >> pnpm-workspace.yaml
   
   # Update package.json scripts
   sed -i '' 's/"dev": "pnpm --parallel dev"/"dev": "pnpm dev"/' package.json
   sed -i '' 's/"build": "pnpm --recursive build"/"build": "pnpm build"/' package.json
   
   git add .
   git commit -m "Update frontend from private repository"
   git push
   ```

## 🛡️ Security Considerations

### Private Repository
- Contains all sensitive information
- Environment variables and secrets
- Database configurations
- Internal documentation

### Public Repositories
- **NEVER** contain sensitive information
- **NEVER** contain environment files (.env)
- **NEVER** contain database credentials
- **NEVER** contain internal API keys

### Environment Variables
- Use `.env.example` files in public repos
- Document required environment variables
- Provide clear setup instructions

## 🔧 CI/CD Setup

### Private Repository
- Full CI/CD pipeline
- Database migrations
- End-to-end testing
- Deployment to staging/production

### Public Repositories
- Basic CI/CD (linting, testing, building)
- No deployment (users deploy themselves)
- Automated dependency updates
- Security scanning

## 📚 Documentation

### Private Repository
- Complete technical documentation
- Internal API documentation
- Deployment guides
- Team-specific information

### Public Repositories
- User-focused documentation
- Installation guides
- API documentation
- Contributing guidelines

## 🤝 Community Management

### Public Repositories
- Enable issues and discussions
- Set up contributing guidelines
- Respond to community questions
- Review and merge pull requests

### Private Repository
- Internal team communication
- Feature planning and tracking
- Performance monitoring
- Security updates

## 📋 Checklist Before Public Release

- [ ] Remove all sensitive information
- [ ] Update .gitignore files
- [ ] Remove internal references
- [ ] Update package.json scripts
- [ ] Create comprehensive README files
- [ ] Set up proper licensing
- [ ] Configure CI/CD pipelines
- [ ] Test public repository builds
- [ ] Set up community guidelines

## 🆘 Troubleshooting

### Common Issues

1. **Script permission denied**
   ```bash
   chmod +x scripts/setup-github-repos.sh
   ```

2. **Repository already exists**
   - Remove the existing directory
   - Re-run the setup script

3. **Git remote issues**
   - Check remote URLs: `git remote -v`
   - Update remote: `git remote set-url origin <new-url>`

4. **Build failures in public repos**
   - Ensure all dependencies are properly configured
   - Check that scripts are updated for single-package builds

## 📞 Support

For deployment issues or questions:
- Check the troubleshooting section above
- Review the script output for errors
- Ensure all prerequisites are met
- Contact the development team

---

**Remember**: The private repository is your source of truth. Always develop there and then selectively update the public repositories when ready.
