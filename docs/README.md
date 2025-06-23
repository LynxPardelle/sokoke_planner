# Frontend Documentation

This folder contains comprehensive documentation for the Sokoke Planner Frontend application.

## 📚 Documentation Index

### Core Documentation

| Document | Description |
|----------|-------------|
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Complete development guide with architecture, standards, and best practices |
| [API_REFERENCE.md](./API_REFERENCE.md) | API integration reference with service interfaces and examples |

### Development Plans

| Document | Location | Description |
|----------|----------|-------------|
| [FRONTEND_DEVELOPMENT_PLAN.md](../plan/FRONTEND_DEVELOPMENT_PLAN.md) | Main development roadmap and phases |
| [GENERIC_COMPONENTS_PLAN.md](../plan/GENERIC_COMPONENTS_PLAN.md) | Comprehensive plan for reusable components |

## 🏗️ Architecture Overview

The Sokoke Planner Frontend is built with:

- **Framework**: Angular 19.2.10 with SSR support
- **State Management**: NgRx (store, effects, signals)
- **UI Framework**: Angular Material + Bootstrap 5.3.6
- **Type System**: TypeScript with strict mode, using types instead of interfaces
- **API Communication**: HTTP services through Lynx Bridge proxy
- **Authentication**: JWT-based with refresh tokens

## 🔧 Key Development Standards

### Type System
- **Use types** instead of interfaces (following backend standards)
- Prefix all types with `T` (e.g., `TProject`, `TUser`)
- Use utility types for DTOs (`Partial<T>`, `Omit<T>`, `Pick<T>`)

### Naming Conventions
- **Files**: kebab-case (`project-list.component.ts`)
- **Classes**: PascalCase (`ProjectListComponent`)
- **Variables/Functions**: camelCase (`loadProjects()`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_PAGE_SIZE`)
- **Generic Components**: `Generic` prefix (`GenericListComponent`)

### Component Architecture
- Extend `BaseGenericComponent` for reusable components
- Use generic types for configuration (`TListConfig<T>`)
- Implement OnPush change detection strategy
- Follow reactive programming patterns with RxJS

## 📖 Quick Start

1. **Read the Developer Guide**
   ```bash
   # Open the comprehensive developer guide
   ./docs/DEVELOPER_GUIDE.md
   ```

2. **Review API Reference**
   ```bash
   # Understand API integration patterns
   ./docs/API_REFERENCE.md
   ```

3. **Check Development Plans**
   ```bash
   # Review the implementation roadmap
   ./plan/FRONTEND_DEVELOPMENT_PLAN.md
   ./plan/GENERIC_COMPONENTS_PLAN.md
   ```

4. **Set Up Environment**
   ```bash
   # Follow setup instructions in developer guide
   npm install
   ng serve
   ```

## 🎯 Development Workflow

### 1. Phase 0: Generic Components Foundation
Create reusable generic components that will be used throughout the application.

### 2. Phase 1: Authentication & Core
Set up authentication, interceptors, and base layout components.

### 3. Phase 2-8: Feature Development
Implement project management features using the generic component foundation.

## 🧪 Testing Standards

- **Unit Tests**: Component and service testing with Jasmine/Karma
- **Integration Tests**: E2E testing with Cypress
- **Type Safety**: 100% TypeScript strict mode compliance
- **Coverage**: Minimum 90% test coverage for all components and services

## 📊 Success Metrics

- [ ] All 25+ generic components implemented and tested
- [ ] 80% reduction in duplicate code across modules
- [ ] 90% of CRUD operations use generic components
- [ ] 95% test coverage for all components
- [ ] Consistent user experience across all modules

## 🤝 Contributing

Before contributing:

1. Read the [Developer Guide](./DEVELOPER_GUIDE.md)
2. Follow the type system standards (types over interfaces)
3. Use generic components where applicable
4. Write comprehensive tests
5. Update documentation as needed

## 📞 Support

For questions or issues:

1. Check the documentation in this folder
2. Review the development plans in `/plan`
3. Create an issue in the repository
4. Follow the contributing guidelines

---

Last updated: June 20, 2025
