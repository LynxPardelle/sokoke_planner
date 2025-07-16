# 🐱 Sokoke Planner Frontend Documentation

Welcome to the Sokoke Planner Frontend documentation! This guide will help you get started quickly whether you're a new developer joining the team or contributing to the project.

## � Quick Start for New Developers

### 1. First Time Setup (15 minutes)
```bash
# Clone the repository
git clone https://github.com/LynxPardelle/sokoke_planner.git
cd sokoke_planner

# Install dependencies
npm install

# Start development server
npm start

# In another terminal, start the API proxy
cd ../lynx-bridge
npm install && npm start
```

### 2. What You Need to Know
- **Framework**: Angular 19+ with SSR
- **Language**: TypeScript (strict mode)
- **Styling**: Bootstrap + Custom SCSS + NgxAngora
- **State**: NgRx for complex state management
- **Testing**: Jasmine + Karma
- **Architecture**: Component-based with generic reusable components

### 3. Your First Task
1. Read the [New Developer Onboarding Guide](./NEW_DEVELOPER_GUIDE.md)
2. Try the [Hello World Tutorial](./HELLO_WORLD_TUTORIAL.md)
3. Explore the [Generic Components Demo](../src/app/shared/components/generic-components-demo/)

## 📚 Documentation Index

### 🎯 Essential Reading (Start Here)
| Priority | Document | Time | Description |
|----------|----------|------|-------------|
| **🔴 High** | [New Developer Guide](./NEW_DEVELOPER_GUIDE.md) | 30 min | Essential onboarding for new team members |
| **🔴 High** | [Architecture Overview](./ARCHITECTURE_OVERVIEW.md) | 20 min | System design and component relationships |
| **🟡 Medium** | [Development Workflow](./DEVELOPMENT_WORKFLOW.md) | 15 min | Git workflow, code review, deployment |
| **🟡 Medium** | [Coding Standards](./CODING_STANDARDS.md) | 25 min | TypeScript, Angular, and project conventions |

### 🛠️ Development References
| Document | Purpose | When to Use |
|----------|---------|-------------|
| [API Integration Guide](./API_INTEGRATION_GUIDE.md) | HTTP services, authentication, error handling | Building new features |
| [Generic Components Guide](./GENERIC_COMPONENTS_GUIDE.md) | Reusable UI components library | Creating consistent UI |
| [Testing Guide](./TESTING_GUIDE.md) | Unit, integration, and e2e testing | Writing tests |
| [Deployment Guide](./DEPLOYMENT_GUIDE.md) | Build, Docker, CI/CD processes | Production deployment |

### 📋 Feature Development
| Document | Description |
|----------|-------------|
| [Frontend Development Plan](../plan/FRONTEND_DEVELOPMENT_PLAN.md) | Complete roadmap and phases |
| [Generic Components Plan](../plan/GENERIC_COMPONENTS_PLAN.md) | Component library implementation plan |

### 📊 Project Status
| Document | Purpose |
|----------|---------|
| [Implementation Status](./IMPLEMENTATION_STATUS.md) | Current progress and completed features |
| [Known Issues](./KNOWN_ISSUES.md) | Bug tracking and workarounds |

## 🏗️ Project Architecture Quick Reference

```text
Frontend (Angular 19+)
├── Authentication & Guards
├── Generic Component Library
├── Feature Modules (Projects, Tasks, Users)
├── State Management (NgRx)
└── API Integration Layer
                ↓
        Lynx Bridge (Proxy)
                ↓
    Sokoke API (NestJS Backend)
```

## 🎯 Common Development Tasks

### Adding a New Feature
1. Check the [Development Plan](../plan/FRONTEND_DEVELOPMENT_PLAN.md) for planned implementation
2. Follow the [Feature Development Workflow](./DEVELOPMENT_WORKFLOW.md#feature-development)
3. Use [Generic Components](./GENERIC_COMPONENTS_GUIDE.md) for consistency
4. Write tests following the [Testing Guide](./TESTING_GUIDE.md)

### Working with Generic Components
1. Review [Generic Components Demo](../src/app/shared/components/generic-components-demo/)
2. Check [Available Components](./GENERIC_COMPONENTS_GUIDE.md#available-components)
3. Follow [Component Creation Guidelines](./GENERIC_COMPONENTS_GUIDE.md#creating-new-components)

### Debugging Issues
1. Check [Known Issues](./KNOWN_ISSUES.md) first
2. Use the [Debugging Setup](./DEVELOPMENT_WORKFLOW.md#debugging)
3. Review [Common Problems](./TROUBLESHOOTING.md)

## 🤝 Contributing

### Quick Contribution Checklist
- [ ] Branch named correctly (`feature/`, `fix/`, `docs/`)
- [ ] Code follows [Coding Standards](./CODING_STANDARDS.md)
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] PR template completed

### Getting Help
- **Code Questions**: Check existing documentation first
- **Feature Planning**: Review [Development Plan](../plan/FRONTEND_DEVELOPMENT_PLAN.md)
- **Component Usage**: See [Generic Components Guide](./GENERIC_COMPONENTS_GUIDE.md)
- **API Integration**: Check [API Integration Guide](./API_INTEGRATION_GUIDE.md)

## 📈 Learning Path for New Developers

### Week 1: Foundation
- [ ] Complete [New Developer Onboarding](./NEW_DEVELOPER_GUIDE.md)
- [ ] Understand [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- [ ] Try [Hello World Tutorial](./HELLO_WORLD_TUTORIAL.md)
- [ ] Explore existing generic components

### Week 2: Development
- [ ] Implement a small feature using generic components
- [ ] Write unit tests for your feature
- [ ] Submit your first PR
- [ ] Review [Coding Standards](./CODING_STANDARDS.md) in detail

### Week 3+: Advanced
- [ ] Work on larger features from the development plan
- [ ] Contribute to generic component library
- [ ] Help improve documentation
- [ ] Mentor other new developers

---

**Next Steps**: Start with the [New Developer Onboarding Guide](./NEW_DEVELOPER_GUIDE.md) 🚀
