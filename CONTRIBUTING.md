# 🤝 Contributing to B-Spot

Thank you for your interest in contributing to B-Spot! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

We welcome contributions from the community! There are many ways to contribute:

- **🐛 Bug Reports**: Report bugs and issues
- **💡 Feature Requests**: Suggest new features and improvements
- **📝 Documentation**: Improve or add documentation
- **🧪 Testing**: Help with testing and quality assurance
- **🔧 Code Contributions**: Submit pull requests with code changes
- **🌍 Translations**: Help with internationalization
- **📢 Community**: Help spread the word and support other users

## 🚀 Getting Started

### Prerequisites

- **Git**: Version control system
- **Node.js**: JavaScript runtime (version 18+)
- **pnpm**: Package manager (version 8+)
- **Code Editor**: VS Code, WebStorm, or your preferred editor

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your forked repository locally

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/b-spot-api.git
   cd b-spot-api
   ```

3. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/Bspot-api/b-spot-api.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

## 📋 Development Workflow

### 1. Create a Feature Branch

Always work on a feature branch, never directly on `main`:

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/refactoring-description` - Code refactoring
- `test/test-description` - Test additions or improvements

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new company search functionality"
git commit -m "fix: resolve authentication token issue"
git commit -m "docs: update API endpoint documentation"
git commit -m "test: add unit tests for company service"
```

**Commit message format:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 4. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Reference to related issues
- Screenshots for UI changes
- Test results

## 🧪 Testing

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Writing Tests

- Write tests for all new functionality
- Aim for good test coverage
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Test Structure

```
test/
├── 📁 unit/              # Unit tests
├── 📁 integration/       # Integration tests
├── 📁 e2e/              # End-to-end tests
└── 📁 __mocks__/        # Test mocks
```

## 📝 Code Style and Standards

### General Guidelines

- **Readability**: Write code that's easy to understand
- **Consistency**: Follow existing patterns in the codebase
- **Simplicity**: Keep solutions simple and straightforward
- **Documentation**: Document complex logic and APIs

### TypeScript Standards

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper typing for all functions and variables
- Avoid `any` type - use proper typing instead

### NestJS Conventions

- Follow NestJS architectural patterns
- Use dependency injection properly
- Implement proper error handling
- Use DTOs for data validation
- Follow module organization patterns

### React Standards (Frontend)

- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript for type safety
- Follow component composition patterns

## 🔍 Code Review Process

### Before Submitting

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] Code is properly formatted
- [ ] No sensitive information is included

### Review Checklist

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code clean and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is documentation updated?
- **Security**: Are there any security concerns?
- **Performance**: Are there performance implications?

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, browser, Node.js version)
5. **Screenshots or logs** if applicable
6. **Minimal reproduction** if possible

### Feature Requests

For feature requests, please describe:

1. **What** you want to achieve
2. **Why** this feature is needed
3. **How** you envision it working
4. **Use cases** and examples

## 📚 Documentation

### Contributing to Documentation

- Keep documentation up to date
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Follow the existing documentation style

### Documentation Types

- **README**: Project overview and quick start
- **API Docs**: Endpoint documentation
- **Code Comments**: Inline code documentation
- **Architecture Docs**: System design and patterns
- **Deployment Guides**: Setup and deployment instructions

## 🌍 Internationalization

### Adding New Languages

1. Create translation files in the appropriate locale directory
2. Update language detection logic
3. Add language to the language switcher
4. Test with native speakers if possible

### Translation Guidelines

- Use clear, natural language
- Maintain consistent terminology
- Consider cultural context
- Test with native speakers
- Keep translations up to date

## 🔒 Security

### Security Guidelines

- Never commit sensitive information
- Report security vulnerabilities privately
- Follow secure coding practices
- Validate all user inputs
- Use proper authentication and authorization

### Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. **Email** security@b-spot.org
3. **Include** detailed description and steps to reproduce
4. **Wait** for response before public disclosure

## 🎉 Recognition

### Contributors

All contributors are recognized in:
- GitHub contributors list
- Project documentation
- Release notes
- Community acknowledgments

### Types of Contributions

- **Code**: Direct code contributions
- **Documentation**: Documentation improvements
- **Testing**: Bug reports and testing
- **Community**: Support and advocacy
- **Design**: UI/UX improvements

## 📞 Getting Help

### Community Resources

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and discussions
- **Documentation**: Project documentation and guides
- **Code Examples**: Sample code and tutorials

### Contact Information

- **General Questions**: Create a GitHub issue
- **Security Issues**: security@b-spot.org
- **Community Support**: GitHub Discussions
- **Project Updates**: Watch the repository

## 📋 Contributor License Agreement

By contributing to B-Spot, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to B-Spot! Your contributions help make this platform better for everyone in the transparency and open data community.

---

**Remember**: Every contribution, no matter how small, makes a difference! 🚀
