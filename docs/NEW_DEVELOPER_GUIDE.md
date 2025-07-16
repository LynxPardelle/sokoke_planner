# 🎯 New Developer Onboarding Guide

Welcome to the Sokoke Planner Frontend team! This guide will get you productive in your first week.

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] **Node.js** >= 18.0.0 installed
- [ ] **npm** >= 8.0.0 installed
- [ ] **Angular CLI** >= 19.0.0 installed (`npm install -g @angular/cli`)
- [ ] **Git** configured with your credentials
- [ ] **VS Code** with recommended extensions (see below)
- [ ] Access to the project repositories

## 🚀 30-Minute Quick Start

### Step 1: Environment Setup (10 minutes)

```bash
# Clone all required repositories
git clone https://github.com/LynxPardelle/sokoke_planner.git
git clone https://github.com/LynxPardelle/lynx-bridge.git
git clone https://github.com/LynxPardelle/sokoke_planner_api.git

# Setup frontend
cd sokoke_planner
npm install

# Setup API proxy
cd ../lynx-bridge
npm install

# Setup backend (optional for frontend development)
cd ../sokoke_planner_api
npm install
```

### Step 2: Start Development Environment (5 minutes)

```bash
# Terminal 1: Start frontend
cd sokoke_planner
npm start
# Frontend runs on http://localhost:4200

# Terminal 2: Start API proxy
cd lynx-bridge
npm start
# Proxy runs on http://localhost:3000

# Terminal 3: Start backend (if needed)
cd sokoke_planner_api
npm run start:dev
# Backend runs on http://localhost:3001
```

### Step 3: Verify Setup (5 minutes)

1. Open http://localhost:4200 in your browser
2. You should see the Sokoke Planner application
3. Try the login/register functionality
4. Explore the Generic Components Demo page

### Step 4: Your First Code Change (10 minutes)

1. Open `src/app/core/components/home/home.component.html`
2. Add your name to the welcome message
3. Save and see the change hot-reload in the browser
4. Commit your change: `git add . && git commit -m "feat(home): add my name to welcome"`

## 🏗️ Understanding the Codebase

### Project Structure Overview

```
src/
├── app/
│   ├── auth/                 # Authentication module
│   ├── core/                 # Core components (layout, home, error)
│   ├── planner/              # Business logic types
│   ├── shared/               # Generic reusable components
│   │   ├── components/       # Generic component library
│   │   ├── services/         # Shared services
│   │   ├── types/            # Shared type definitions
│   │   └── utils/            # Utility functions
│   └── user/                 # User-related types and components
├── assets/                   # Static assets (images, CSS)
└── environments/             # Environment configurations
```

### Key Concepts to Understand

#### 1. Generic Components System

The project uses a library of reusable generic components:

- **GenericButton**: Consistent button styling and behavior
- **GenericModal**: Standardized modal dialogs
- **GenericToast**: Notification system
- **GenericLoading**: Loading indicators
- **GenericError**: Error display components

**Example Usage:**

```typescript
// In your component template
<generic-button 
  [variant]="'primary'" 
  [size]="'medium'"
  [loading]="isLoading"
  (clicked)="handleClick()">
  Save Project
</generic-button>
```

#### 2. Type System

The project follows strict typing conventions:

- **Types**: Use `T` prefix (e.g., `TProject`, `TUser`)
- **Interfaces**: Use `I` prefix (e.g., `IComponent`)
- **Enums**: Use `E` prefix (e.g., `EStatus`)

#### 3. State Management

The project uses NgRx for complex state management:

- **Actions**: Define what can happen
- **Reducers**: Handle state changes
- **Effects**: Handle side effects (API calls)
- **Selectors**: Query state data

## 🎯 Your First Week Tasks

### Day 1: Environment & Exploration

- [ ] Complete the 30-minute quick start
- [ ] Explore the Generic Components Demo
- [ ] Read the [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- [ ] Join the team chat/communication channels

### Day 2: Code Familiarity

- [ ] Examine the auth module structure
- [ ] Look at how generic components are implemented
- [ ] Try modifying an existing component's styling
- [ ] Read the [Coding Standards](./CODING_STANDARDS.md)

### Day 3: Small Feature Implementation

- [ ] Pick a simple task from the backlog
- [ ] Implement using existing generic components
- [ ] Write basic unit tests
- [ ] Submit your first PR for review

### Day 4: Testing & Documentation

- [ ] Learn the testing patterns used in the project
- [ ] Write comprehensive tests for your feature
- [ ] Update relevant documentation
- [ ] Review the [Testing Guide](./TESTING_GUIDE.md)

### Day 5: Integration & Learning

- [ ] Address PR feedback
- [ ] Merge your first feature
- [ ] Help another new developer
- [ ] Plan your next feature with the team

## 🛠️ Development Tools Setup

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "angular.ng-template"
  ]
}
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Git Configuration

```bash
# Configure commit message template
git config commit.template .gitmessage

# Set up useful aliases
git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.st status
```

## 🎨 Understanding the Design System

### Color Palette

The project uses a consistent color scheme based on Sokoke cat colors:

- **Primary**: Brown tones (#A17246)
- **Secondary**: Cream/beige (#F5E6D3)
- **Success**: Green (#28a745)
- **Warning**: Orange (#ffc107)
- **Danger**: Red (#dc3545)

### Component Variants

Generic components support consistent variants:

- **Sizes**: `small`, `medium`, `large`
- **Variants**: `primary`, `secondary`, `success`, `warning`, `danger`
- **States**: `loading`, `disabled`, `active`

## 📚 Learning Resources

### Essential Reading Order

1. [Architecture Overview](./ARCHITECTURE_OVERVIEW.md) - 20 minutes
2. [Coding Standards](./CODING_STANDARDS.md) - 25 minutes
3. [Generic Components Guide](./GENERIC_COMPONENTS_GUIDE.md) - 30 minutes
4. [API Integration Guide](./API_INTEGRATION_GUIDE.md) - 20 minutes
5. [Testing Guide](./TESTING_GUIDE.md) - 30 minutes

### External Resources

- **Angular**: [Official Angular Docs](https://angular.io/docs)
- **NgRx**: [NgRx Official Guide](https://ngrx.io/guide/store)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Bootstrap**: [Bootstrap Documentation](https://getbootstrap.com/docs/)

## 🤝 Team Communication

### Daily Development Flow

1. **Morning**: Check team chat for updates
2. **Development**: Work on assigned tasks
3. **Questions**: Don't hesitate to ask for help
4. **End of Day**: Share progress and blockers

### Getting Help

- **Code Questions**: Ask in team chat or create an issue
- **Technical Issues**: Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- **Feature Planning**: Discuss in team meetings
- **Documentation**: Help improve it as you learn

## 🎯 Success Metrics

By the end of your first week, you should be able to:

- [ ] Navigate the codebase confidently
- [ ] Use generic components to build UI
- [ ] Follow the coding standards
- [ ] Write basic unit tests
- [ ] Submit PRs that pass code review
- [ ] Help other new developers

## 🚀 Next Steps

After completing this guide:

1. Choose your first larger feature from the [Development Plan](../plan/FRONTEND_DEVELOPMENT_PLAN.md)
2. Deep dive into the specific modules you'll be working with
3. Consider contributing to the generic component library
4. Help improve documentation based on your onboarding experience

---

**Need Help?** Don't hesitate to ask questions! Every expert was once a beginner, and we're here to help you succeed. 🌟
