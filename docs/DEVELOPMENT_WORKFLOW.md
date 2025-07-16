# 🔄 Development Workflow

This guide outlines the development workflow, Git practices, and collaboration processes for the Sokoke Planner frontend project.

## 🎯 Overview

Our development workflow is designed to:

- Ensure code quality and consistency
- Enable efficient collaboration
- Facilitate quick feedback and iteration
- Maintain a stable main branch
- Support continuous integration and deployment

## 🌿 Git Workflow

### Branch Strategy

We use a **feature branch workflow** with the following conventions:

```text
main
├── feature/user-authentication
├── feature/project-management
├── fix/button-loading-state
├── docs/api-integration-guide
└── refactor/generic-components
```

### Branch Naming

| Type | Prefix | Example |
|------|--------|---------|
| **New Feature** | `feature/` | `feature/project-dashboard` |
| **Bug Fix** | `fix/` | `fix/login-redirect-issue` |
| **Documentation** | `docs/` | `docs/deployment-guide` |
| **Refactoring** | `refactor/` | `refactor/auth-service` |
| **Performance** | `perf/` | `perf/bundle-optimization` |
| **Testing** | `test/` | `test/component-coverage` |

### Creating a New Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Push branch to remote
git push -u origin feature/your-feature-name
```

## 📝 Commit Guidelines

### Commit Message Format

We follow the **Conventional Commits** specification:

```text
<type>(<scope>): <description>

<body>

<footer>
```

#### Types

| Type | Description | Example |
|------|-------------|---------|
| **feat** | New feature | `feat(auth): add password reset functionality` |
| **fix** | Bug fix | `fix(button): resolve loading state not clearing` |
| **docs** | Documentation | `docs(api): add authentication guide` |
| **style** | Code style changes | `style(header): fix linting errors` |
| **refactor** | Code refactoring | `refactor(service): extract common API logic` |
| **test** | Add/update tests | `test(component): add unit tests for modal` |
| **chore** | Maintenance tasks | `chore(deps): update Angular to v19.3.0` |
| **perf** | Performance improvements | `perf(list): optimize rendering with trackBy` |

#### Scopes

| Scope | Description | Example |
|-------|-------------|---------|
| **auth** | Authentication module | `feat(auth): add login form validation` |
| **shared** | Shared components | `fix(shared): resolve modal backdrop issue` |
| **core** | Core functionality | `refactor(core): update error handling` |
| **docs** | Documentation | `docs(readme): update quick start guide` |
| **build** | Build system | `chore(build): configure webpack optimization` |

#### Examples

```bash
# Simple feature
git commit -m "feat(auth): add user registration form"

# Bug fix with details
git commit -m "fix(button): resolve loading spinner not hiding

The loading spinner was not clearing after API calls completed.
Added proper cleanup in the component's ngOnDestroy method.

Fixes #123"

# Breaking change
git commit -m "feat(api): update authentication service

BREAKING CHANGE: AuthService.login() now returns Observable<AuthResult>
instead of Observable<User>. Update components to handle new response format."
```

### Commit Best Practices

#### Do's ✅

- Write clear, descriptive commit messages
- Keep commits small and focused
- Test your changes before committing
- Use present tense ("add feature" not "added feature")
- Reference issue numbers when applicable

#### Don'ts ❌

- Don't commit broken code
- Don't include unrelated changes in one commit
- Don't use vague messages like "fix stuff" or "update"
- Don't commit sensitive information
- Don't commit generated files or dependencies

## 🔄 Development Process

### 1. Planning Phase

Before starting development:

1. **Review the task/issue** in detail
2. **Check the [Development Plan](../plan/FRONTEND_DEVELOPMENT_PLAN.md)** for context
3. **Discuss approach** with team if needed
4. **Break down large features** into smaller tasks

### 2. Development Phase

#### Environment Setup

```bash
# Start development environment
npm start

# In separate terminals:
cd ../lynx-bridge && npm start
cd ../sokoke_planner_api && npm run start:dev
```

#### Code Development

1. **Follow coding standards** from [Coding Standards](./CODING_STANDARDS.md)
2. **Use generic components** where applicable
3. **Write tests** as you develop (TDD preferred)
4. **Commit frequently** with meaningful messages

#### Quality Checks

```bash
# Run linting
ng lint

# Run tests
ng test --watch=false --browsers=ChromeHeadless

# Check test coverage
ng test --code-coverage --watch=false

# Build check
ng build --configuration development
```

### 3. Code Review Process

#### Pre-Review Checklist

Before requesting review:

- [ ] All tests pass
- [ ] Linting errors resolved
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] Self-review completed
- [ ] Feature tested manually

#### Creating a Pull Request

1. **Push your branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

1. **Create PR through GitHub:**
   - Use descriptive title following commit conventions
   - Fill out PR template completely
   - Add relevant labels
   - Request specific reviewers

#### PR Template

```markdown
## Description
Brief description of the changes and their purpose.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Generic components used where applicable
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #123
```

#### Code Review Guidelines

**For Reviewers:**

- Review within 24 hours
- Be constructive and specific
- Check functionality, not just syntax
- Verify tests cover edge cases
- Ensure accessibility compliance

**Review Checklist:**

- [ ] Code quality and readability
- [ ] Proper error handling
- [ ] Performance considerations
- [ ] Security implications
- [ ] Test coverage adequacy
- [ ] Documentation accuracy

### 4. Merge Process

#### Merge Requirements

Before merging, ensure:

- [ ] All CI checks pass
- [ ] At least one approval from code owner
- [ ] No merge conflicts
- [ ] Branch is up to date with main

#### Merge Strategy

We use **"Squash and Merge"** for feature branches:

```bash
# This creates a single commit on main with all changes
# Branch history is preserved but not cluttered
```

#### Post-Merge Cleanup

```bash
# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/your-feature-name

# Update main branch
git checkout main
git pull origin main
```

## 🧪 Testing Workflow

### Testing Strategy

| Level | Type | Coverage | Tools |
|-------|------|----------|-------|
| **Unit** | Component/Service testing | 90%+ | Jasmine, Karma |
| **Integration** | Component + Service | 80%+ | Angular Testing |
| **E2E** | User workflows | Key paths | Cypress (planned) |

### Running Tests

```bash
# Run all tests
ng test

# Run specific test file
ng test --include="**/auth.service.spec.ts"

# Run tests with coverage
ng test --code-coverage --watch=false

# Run tests in CI mode
ng test --watch=false --browsers=ChromeHeadless
```

### Test-Driven Development (TDD)

Recommended approach for complex features:

1. **Write failing test** that describes desired behavior
2. **Write minimal code** to make test pass
3. **Refactor** while keeping tests green
4. **Repeat** for next requirement

### Test Organization

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Test configuration
  });

  describe('Initialization', () => {
    // Component creation and initial state tests
  });

  describe('User Interactions', () => {
    // User action tests
  });

  describe('API Integration', () => {
    // Service interaction tests
  });

  describe('Error Handling', () => {
    // Error scenario tests
  });
});
```

## 🚀 Deployment Workflow

### Development Environment

- **Auto-deploy** on push to feature branches
- **Manual testing** environment
- **Hot reload** for rapid development

### Staging Environment

- **Auto-deploy** on merge to main
- **Full feature testing**
- **Performance monitoring**
- **Pre-production validation**

### Production Environment

- **Manual deployment** after staging approval
- **Blue-green deployment** strategy
- **Rollback capability**
- **Monitoring and alerting**

## 🤝 Collaboration Guidelines

### Communication

#### Daily Standups

Share progress on:

- What you completed yesterday
- What you're working on today
- Any blockers or help needed

#### Feature Discussions

Before implementing large features:

1. **Create issue** with detailed requirements
2. **Discuss approach** in team meeting
3. **Document decisions** in issue comments
4. **Break down** into smaller tasks

#### Code Reviews

- **Be respectful** and constructive
- **Explain reasoning** behind suggestions
- **Ask questions** to understand context
- **Appreciate good work** with positive comments

### Knowledge Sharing

#### Documentation

- **Update docs** as you learn
- **Create guides** for complex setups
- **Share solutions** to common problems
- **Maintain troubleshooting** guides

#### Code Sharing

- **Pair programming** for complex features
- **Code walkthroughs** for major changes
- **Knowledge transfer** sessions
- **Technical discussions** in team meetings

## 📊 Workflow Metrics

### Development Velocity

| Metric | Target | Current |
|--------|--------|---------|
| **PR Review Time** | < 24 hours | 4 hours |
| **Feature Completion** | 2 weeks | 1.5 weeks |
| **Bug Fix Time** | < 2 days | 1 day |
| **Test Coverage** | > 90% | 89% |

### Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Build Success Rate** | > 95% | 98% |
| **Code Review Approval** | First review | 85% |
| **Post-Release Bugs** | < 1 per release | 0.5 |
| **Documentation Coverage** | 100% | 95% |

## 🔧 Tools and Automation

### Development Tools

- **VS Code** with recommended extensions
- **Angular CLI** for scaffolding and building
- **Git** with conventional commits
- **npm** for dependency management

### CI/CD Pipeline (Planned)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: ng lint
      - run: ng test --watch=false --browsers=ChromeHeadless
      - run: ng build --configuration production
```

### Code Quality Tools

- **ESLint** for code quality
- **Prettier** for code formatting
- **Husky** for git hooks (planned)
- **Conventional Commits** linting

## 📚 Resources

### Internal Documentation

- [Coding Standards](./CODING_STANDARDS.md)
- [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

### External Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)

---

**Questions?** Ask in team chat or create an issue for workflow improvements!
