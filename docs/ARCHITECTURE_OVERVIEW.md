# 🏗️ Sokoke Planner Architecture Overview

This document provides a high-level understanding of how the Sokoke Planner frontend is structured and how it integrates with the backend systems.

## 🎯 System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                   Sokoke Planner Frontend                  │
│                    (Angular 19+ SSR)                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Auth Module   │ │  Generic Comps  │ │ Feature Modules ││
│  │                 │ │                 │ │                 ││
│  │ • Login/Logout  │ │ • Buttons       │ │ • Projects      ││
│  │ • Registration  │ │ • Modals        │ │ • Tasks         ││
│  │ • Guards        │ │ • Forms         │ │ • Users         ││
│  │ • JWT Handling  │ │ • Loading       │ │ • Dashboard     ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                        Lynx Bridge                         │
│                    (API Proxy & Auth)                      │
│  • Request/Response logging                                 │
│  • Authentication token management                          │
│  • CORS handling                                           │
│  • API route proxying                                      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Sokoke API Backend                     │
│                      (NestJS + MongoDB)                    │
│  • REST API endpoints                                      │
│  • Authentication & authorization                          │
│  • Business logic & validation                             │
│  • Database operations                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Frontend Architecture Layers

### 1. Presentation Layer

**Components & Templates**

- **Pages**: Route-level components that orchestrate features
- **Feature Components**: Business-specific UI components
- **Generic Components**: Reusable UI library
- **Layout Components**: Application shell and navigation

### 2. State Management Layer

**NgRx Store Pattern**

```typescript
// State flow example
User Action → Component → Action → Effect → API → Reducer → State → Component
```

**Key Concepts:**

- **Actions**: User interactions and API responses
- **Effects**: Side effects (API calls, navigation)
- **Reducers**: Pure functions that update state
- **Selectors**: Query and derive state data

### 3. Service Layer

**API Integration & Business Logic**

- **HTTP Services**: API communication
- **Authentication Service**: Login/logout, token management
- **Generic Services**: Shared utilities and helpers
- **Feature Services**: Business logic for specific domains

### 4. Core Infrastructure

**Application Foundation**

- **Routing**: Navigation and route guards
- **Interceptors**: HTTP request/response handling
- **Guards**: Route protection and access control
- **Error Handling**: Global error management

## 📁 Module Organization

### Core Module Structure

```text
src/app/
├── app.config.ts              # Application configuration
├── app.routes.ts              # Route definitions
├── auth/                      # Authentication module
│   ├── components/            # Login, register, recover
│   ├── services/              # Auth service
│   ├── guards/                # Route protection
│   └── types/                 # Auth-related types
├── core/                      # Core application features
│   ├── components/            # Layout, home, error pages
│   ├── services/              # Core services
│   └── guards/                # Global guards
├── shared/                    # Reusable components & utilities
│   ├── components/            # Generic component library
│   ├── services/              # Shared services
│   ├── types/                 # Common type definitions
│   └── utils/                 # Utility functions
├── planner/                   # Business domain types
│   └── types/                 # Project, task, feature types
└── user/                      # User-related features
    └── types/                 # User type definitions
```

### Generic Components Architecture

```text
shared/components/
├── index.ts                   # Public API exports
├── base-generic/              # Base component class
├── generic-button/            # Button component
├── generic-modal/             # Modal dialogs
├── generic-loading/           # Loading indicators
├── generic-error/             # Error displays
├── generic-toast/             # Notifications
├── generic-toast-container/   # Toast management
└── generic-components-demo/   # Documentation & examples
```

## 🔄 Data Flow Patterns

### 1. Component Communication

```typescript
// Parent to Child
@Input() data: TProject;

// Child to Parent
@Output() action = new EventEmitter<TProject>();

// Service Communication
@Injectable() SharedService
```

### 2. State Management Flow

```typescript
// Action Creation
const action = ProjectActions.loadProjects();

// Effect Handling
@Injectable()
export class ProjectEffects {
  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      mergeMap(() =>
        this.projectService.getAll().pipe(
          map(projects => ProjectActions.loadProjectsSuccess({ projects })),
          catchError(error => of(ProjectActions.loadProjectsFailure({ error })))
        )
      )
    )
  );
}

// Component Usage
export class ProjectListComponent {
  projects$ = this.store.select(ProjectSelectors.getAllProjects);
  
  loadProjects() {
    this.store.dispatch(ProjectActions.loadProjects());
  }
}
```

### 3. API Communication

```typescript
// Service Layer
@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<TProject[]> {
    return this.http.get<TProject[]>('/api/projects');
  }
}

// HTTP Interceptor (handled automatically)
// Adds authentication headers, handles errors, manages loading states
```

## 🎨 UI/UX Architecture

### Design System Hierarchy

```text
1. Theme Variables (colors, fonts, spacing)
   ↓
2. Bootstrap Base Styles
   ↓
3. Generic Component Styles
   ↓
4. Feature-Specific Styles
   ↓
5. Component-Level Overrides
```

### Responsive Design Strategy

```scss
// Mobile-first approach
.component {
  // Mobile styles (default)
  
  @media (min-width: 768px) {
    // Tablet styles
  }
  
  @media (min-width: 1024px) {
    // Desktop styles
  }
}
```

## 🔐 Security Architecture

### Authentication Flow

```text
1. User Login → Frontend
2. Frontend → Lynx Bridge → Sokoke API
3. API validates credentials
4. Returns JWT token
5. Frontend stores token securely
6. All subsequent requests include token
7. Guards protect routes requiring authentication
```

### Route Protection

```typescript
// Auth Guard
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true;
  }
  this.router.navigate(['/login']);
  return false;
}
```

## 🧪 Testing Architecture

### Testing Pyramid

```text
┌─────────────────┐
│   E2E Tests     │  ← Few, expensive, full user flows
├─────────────────┤
│Integration Tests│  ← Some, component + service integration
├─────────────────┤
│   Unit Tests    │  ← Many, fast, isolated functions/components
└─────────────────┘
```

### Test Structure

```typescript
// Component Test
describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;

  beforeEach(() => {
    // Setup test bed with mocked dependencies
    // Create component instance
    // Configure test scenarios
  });

  it('should display projects when loaded', () => {
    // Test component behavior
    // Verify UI updates
    // Assert expected outcomes
  });
});
```

## 🚀 Build & Deployment Architecture

### Development Environment

```text
Source Code → TypeScript Compilation → Angular CLI → Dev Server
                                                    ↓
                                            Hot Reload & HMR
```

### Production Build

```text
Source Code → TypeScript → Angular Build → Optimization → Docker Image
                                         ↓
                                   • Tree shaking
                                   • Minification
                                   • Code splitting
                                   • SSR compilation
```

### Server-Side Rendering (SSR)

```text
Client Request → Express Server → Angular Universal → Rendered HTML → Client
                                        ↓
                                 • SEO optimization
                                 • Faster initial load
                                 • Progressive enhancement
```

## 📈 Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Feature modules loaded on demand
2. **OnPush Strategy**: Optimized change detection
3. **TrackBy Functions**: Efficient list rendering
4. **Generic Components**: Reduced bundle duplication
5. **Tree Shaking**: Remove unused code
6. **Code Splitting**: Separate chunks for routes

### Bundle Analysis

```bash
# Analyze bundle size
ng build --prod --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🔧 Development Tools Integration

### IDE Support

- **TypeScript**: Strong typing and IntelliSense
- **Angular Language Service**: Template support
- **ESLint**: Code quality and standards
- **Prettier**: Code formatting
- **Debugger**: Source map debugging

### Development Workflow

```text
Code Change → Hot Reload → Browser Update → Dev Tools → Debug
                ↓
           Unit Tests → Integration Tests → Manual Testing
```

## 🤝 Integration Points

### External Systems

- **Sokoke API**: Primary data source
- **Lynx Bridge**: Authentication proxy
- **Email Service**: User notifications (via API)
- **File Storage**: Document management (future)

### Third-Party Libraries

- **Angular Material**: UI components (planned)
- **Bootstrap**: Base styling framework
- **NgRx**: State management
- **RxJS**: Reactive programming
- **Class Validator**: Form validation

---

**Next Reading**: [Coding Standards](./CODING_STANDARDS.md) to understand how code is organized and written in this architecture.
