# Contributing to MFK Management Loan System (MFKLMS)

Thank you for your interest in contributing to MFKLMS! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Node.js version, browser, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**
- **List some other applications where this enhancement exists**

### 🔧 Contributing Code

#### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/mfklms.git
   cd mfklms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

#### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or modifications
- `chore/description` - Maintenance tasks

#### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that do not affect the meaning of the code
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `test` - Adding missing tests or correcting existing tests
- `chore` - Changes to the build process or auxiliary tools

**Examples:**
```
feat(loans): add loan approval workflow
fix(auth): resolve session timeout issue
docs(readme): update installation instructions
test(users): add user creation unit tests
```

#### Pull Request Process

1. **Create a feature branch from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise code
   - Follow the existing code style
   - Add or update tests as necessary
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test:ci
   npm run build
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

5. **Push to your fork and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out the Pull Request template**
   - Provide a clear description of the changes
   - Link to any related issues
   - Include screenshots for UI changes
   - List any breaking changes

## 🧪 Testing Guidelines

### Writing Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions and API endpoints
- **E2E Tests**: Test complete user workflows (when applicable)

### Test Structure
```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expectedOutput);
    });
  });
});
```

### Test Coverage

- Maintain minimum 70% test coverage
- Focus on critical business logic
- Test error conditions and edge cases
- Mock external dependencies appropriately

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- ComponentName.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## 📏 Code Style Guide

### TypeScript Guidelines

- Use TypeScript for all new code
- Define interfaces for all data structures
- Use proper typing, avoid `any` when possible
- Use meaningful variable and function names

### React Guidelines

- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop types and interfaces
- Implement proper error boundaries

### Database Guidelines

- Use Prisma schema for all database changes
- Create migrations for schema changes
- Write database seeds for test data
- Follow proper naming conventions

### API Guidelines

- Use RESTful conventions
- Implement proper error handling
- Add input validation
- Document API endpoints
- Use appropriate HTTP status codes

## 🏗️ Project Structure

```
mfklms/
├── app/                    # Next.js app router
│   ├── (authenticated)/   # Protected routes
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # React components
│   └── __tests__/         # Component tests
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── react-query/          # API hooks and queries
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── __tests__/            # Test utilities and setup
```

## 🔄 Development Workflow

### Issue Lifecycle

1. **Triage**: New issues are reviewed and labeled
2. **Planning**: Issues are prioritized and assigned to milestones
3. **Development**: Developers pick up issues and create branches
4. **Review**: Pull requests are reviewed by maintainers
5. **Testing**: Changes are tested thoroughly
6. **Merge**: Approved changes are merged to develop
7. **Release**: Features are included in the next release

### Release Process

1. **Feature Development**: New features developed in feature branches
2. **Integration**: Features merged to `develop` branch
3. **Release Preparation**: `develop` merged to `main` for release
4. **Deployment**: Releases deployed to production
5. **Hotfixes**: Critical fixes applied directly to `main`

## 🤝 Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussions
- **Pull Request Reviews**: Code review discussions

### Getting Help

- Check existing issues and documentation first
- Use GitHub Discussions for questions
- Be patient and respectful when asking for help
- Provide context and details when reporting problems

## 🎉 Recognition

Contributors who make significant contributions will be:
- Added to the contributors list in the README
- Mentioned in release notes
- Given credit in relevant documentation

## 📞 Contact

If you have questions about contributing, please:
- Open a GitHub Discussion
- Create an issue with the "question" label
- Contact the maintainers directly if needed

Thank you for contributing to MFKLMS! 🙏
