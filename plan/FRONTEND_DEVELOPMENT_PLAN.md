# Sokoke Planner Frontend Development Plan

## 📋 Overview

This document outlines a comprehensive plan for developing the frontend application for the Sokoke Planner, based on the existing API documentation and current Angular structure.

## 🏗️ Architecture Overview

### Current Structure Analysis
- **Framework**: Angular 19.2.10 with SSR support
- **State Management**: NgRx (store, effects, signals)
- **UI Framework**: Angular Material + Bootstrap 5.3.6
- **Styling**: SCSS + Angora CSS library
- **API Integration**: Lynx-Bridge proxy for API communication
- **Authentication**: JWT-based with refresh tokens
- **Type System**: Uses types instead of interfaces (following backend standards)
- **Documentation**: Comprehensive developer guide in `/docs` folder

### Existing Components
- ✅ Auth module (login, register, recover)
- ✅ Core module (home, error, layout)
- ✅ Type definitions for all entities
- ✅ Basic auth service structure

## 🎯 Development Phases

### Phase 0: Generic Components Foundation (Week 0-1)

Before starting the main development phases, we need to establish a solid foundation of reusable generic components that will be used throughout the application.

**📋 Detailed Plan**: See [GENERIC_COMPONENTS_PLAN.md](./GENERIC_COMPONENTS_PLAN.md) for comprehensive generic components architecture.

**Priority Components for Immediate Development:**
- [ ] Generic Loading Component
- [ ] Generic Error Component  
- [ ] Generic Modal Component
- [ ] Generic List Component
- [ ] Generic Form Component
- [ ] Generic Search Component

**Benefits:**
- 80% reduction in duplicate code across modules
- Consistent UX across all features
- Faster development of subsequent phases
- Type-safe, reusable components with standardized API

**Files to Create:**
```
src/app/shared/components/
├── generic-loading.component.ts
├── generic-error.component.ts
├── generic-modal.component.ts
├── generic-list.component.ts
├── generic-form.component.ts
├── generic-search.component.ts
├── generic-pagination.component.ts
├── generic-confirmation-dialog.component.ts
├── generic-toast.component.ts
└── ...additional components per plan
```

### Phase 1: Foundation & Authentication (Week 1-2)

#### 1.1 Environment & API Setup
- [ ] Configure environment variables for API endpoints
- [ ] Set up HTTP interceptors for authentication
- [ ] Configure proxy settings for development
- [ ] Set up error handling and loading states

**Files to Create/Update:**
```
src/environments/
├── environment.ts (update API URLs)
├── environment.prod.ts (update API URLs)
src/app/core/
├── interceptors/
│   ├── auth.interceptor.ts
│   ├── error.interceptor.ts
│   └── loading.interceptor.ts
├── guards/
│   ├── auth.guard.ts
│   └── role.guard.ts
└── services/
    ├── api.service.ts
    └── loading.service.ts
```

#### 1.2 Authentication Enhancement
- [ ] Complete auth service implementation
- [ ] Add login/logout functionality
- [ ] Implement JWT token management
- [ ] Add protected route guards
- [ ] Create authentication state management

**Files to Create/Update:**
```
src/app/auth/
├── services/
│   ├── auth.service.ts (enhance existing)
│   └── token.service.ts
├── store/
│   ├── auth.actions.ts
│   ├── auth.effects.ts
│   ├── auth.reducer.ts
│   └── auth.selectors.ts
├── components/
│   ├── login/ (enhance existing)
│   ├── logout/
│   └── profile/
└── types/
    └── auth.types.ts
```

#### 1.3 Core Layout & Navigation
- [ ] Create main application layout
- [ ] Implement responsive navigation
- [ ] Add sidebar with module links
- [ ] Create header with user info and notifications

**Files to Create:**
```
src/app/core/components/
├── layout/
│   ├── layout.component.ts
│   ├── layout.component.html
│   ├── layout.component.scss
│   ├── header/
│   ├── sidebar/
│   └── footer/
└── navigation/
    ├── nav-menu.component.ts
    └── breadcrumb.component.ts
```

### Phase 2: Project Management Core (Week 3-4)

#### 2.1 Project Categories Management
- [ ] Create project category CRUD operations
- [ ] Implement category list with color coding
- [ ] Add category selection components
- [ ] Create category management dashboard

**API Endpoints Used:**
- `GET /project-category` - List categories
- `POST /project-category` - Create category
- `PUT /project-category` - Update category
- `DELETE /project-category/{id}` - Delete category

**Files to Create:**
```
src/app/planner/
├── modules/
│   └── categories/
│       ├── categories.module.ts
│       ├── categories-routing.module.ts
│       ├── components/
│       │   ├── category-list/
│       │   ├── category-form/
│       │   ├── category-card/
│       │   └── category-selector/
│       ├── services/
│       │   └── category.service.ts
│       └── store/
│           ├── category.actions.ts
│           ├── category.effects.ts
│           ├── category.reducer.ts
│           └── category.selectors.ts
```

#### 2.2 Project Subcategories Management
- [ ] Create subcategory CRUD operations
- [ ] Link subcategories to parent categories
- [ ] Implement hierarchical selection
- [ ] Add subcategory filtering

**API Endpoints Used:**
- `GET /project-subcategory` - List subcategories
- `GET /project-subcategory/category/{categoryId}` - List by category
- `POST /project-subcategory` - Create subcategory
- `PUT /project-subcategory` - Update subcategory
- `DELETE /project-subcategory/{id}` - Delete subcategory

**Files to Create:**
```
src/app/planner/modules/subcategories/
├── subcategories.module.ts
├── components/
│   ├── subcategory-list/
│   ├── subcategory-form/
│   └── subcategory-selector/
├── services/
│   └── subcategory.service.ts
└── store/
    ├── subcategory.actions.ts
    ├── subcategory.effects.ts
    ├── subcategory.reducer.ts
    └── subcategory.selectors.ts
```

#### 2.3 Status Management
- [ ] Create status management system
- [ ] Implement status workflows
- [ ] Add status visualization
- [ ] Create status configuration

**API Endpoints Used:**
- `GET /status/projects` - Project statuses
- `GET /status/tasks` - Task statuses
- `GET /status/features` - Feature statuses
- `POST /status` - Create status
- `PUT /status` - Update status

**Files to Create:**
```
src/app/planner/modules/status/
├── status.module.ts
├── components/
│   ├── status-list/
│   ├── status-form/
│   ├── status-badge/
│   └── status-workflow/
├── services/
│   └── status.service.ts
└── store/
    ├── status.actions.ts
    ├── status.effects.ts
    ├── status.reducer.ts
    └── status.selectors.ts
```

### Phase 3: Core Project Features (Week 5-6)

#### 3.1 Project Management
- [ ] Create project CRUD operations
- [ ] Implement project dashboard
- [ ] Add project search and filtering
- [ ] Create project timeline view
- [ ] Add project statistics

**API Endpoints Used:**
- `GET /project` - List projects with search
- `GET /project/{id}` - Get project details
- `POST /project` - Create project
- `PUT /project` - Update project
- `DELETE /project/{id}` - Delete project

**Advanced Search Features:**
- Filters by category, status, date range
- Text search in name/description
- Priority and impact filtering
- Sorting by multiple fields
- Pagination with metadata

**Files to Create:**
```
src/app/planner/modules/projects/
├── projects.module.ts
├── projects-routing.module.ts
├── components/
│   ├── project-list/
│   ├── project-detail/
│   ├── project-form/
│   ├── project-card/
│   ├── project-search/
│   ├── project-timeline/
│   └── project-dashboard/
├── services/
│   └── project.service.ts
└── store/
    ├── project.actions.ts
    ├── project.effects.ts
    ├── project.reducer.ts
    └── project.selectors.ts
```

#### 3.2 Advanced Search Implementation
- [ ] Create reusable search component
- [ ] Implement filter builders
- [ ] Add saved search functionality
- [ ] Create search results pagination

**Search Features to Implement:**
```typescript
// Search Query Structure
type TSearchQuery = {
  filters?: Record<string, any>;
  pagination?: { page: number; limit: number };
  sort?: Array<{ field: string; order: 'asc' | 'desc' }>;
  search?: {
    query: string;
    fields: string[];
    options?: { caseSensitive?: boolean; useRegex?: boolean };
  };
  advanced?: {
    dateRange?: Array<{ field: string; start: string; end: string }>;
    numericRange?: Array<{ field: string; min: number; max: number }>;
    select?: string[];
    populate?: string[];
  };
};
```

**Files to Create:**
```
src/app/shared/components/search/
├── search.module.ts
├── advanced-search/
├── filter-builder/
├── search-results/
├── pagination/
└── saved-searches/
```

### Phase 4: Task Management (Week 7-8)

#### 4.1 Task Management System
- [ ] Create task CRUD operations
- [ ] Implement task assignment
- [ ] Add task progress tracking
- [ ] Create task timeline and calendar views
- [ ] Add task dependencies

**API Endpoints Used:**
- `GET /task` - List tasks with search
- `GET /task/project/{projectId}` - Tasks by project
- `POST /task` - Create task
- `PUT /task` - Update task
- `DELETE /task/{id}` - Delete task

**Files to Create:**
```
src/app/planner/modules/tasks/
├── tasks.module.ts
├── tasks-routing.module.ts
├── components/
│   ├── task-list/
│   ├── task-detail/
│   ├── task-form/
│   ├── task-card/
│   ├── task-board/ (Kanban style)
│   ├── task-calendar/
│   └── task-assignment/
├── services/
│   └── task.service.ts
└── store/
    ├── task.actions.ts
    ├── task.effects.ts
    ├── task.reducer.ts
    └── task.selectors.ts
```

#### 4.2 Task Visualization
- [ ] Create Kanban board view
- [ ] Implement Gantt chart
- [ ] Add calendar integration
- [ ] Create progress charts

### Phase 5: Feature & Requirements Management (Week 9-10)

#### 5.1 Feature Management
- [ ] Create feature CRUD operations
- [ ] Link features to projects
- [ ] Add feature prioritization
- [ ] Create feature roadmap view

**API Endpoints Used:**
- `GET /feature` - List features
- `GET /feature/project/{projectId}` - Features by project
- `POST /feature` - Create feature
- `PUT /feature` - Update feature

**Files to Create:**
```
src/app/planner/modules/features/
├── features.module.ts
├── components/
│   ├── feature-list/
│   ├── feature-detail/
│   ├── feature-form/
│   ├── feature-roadmap/
│   └── feature-prioritization/
├── services/
│   └── feature.service.ts
└── store/
    ├── feature.actions.ts
    ├── feature.effects.ts
    ├── feature.reducer.ts
    └── feature.selectors.ts
```

#### 5.2 Requirements Management
- [ ] Create requirements CRUD operations
- [ ] Link requirements to features
- [ ] Add requirement traceability
- [ ] Create requirements matrix

**API Endpoints Used:**
- `GET /requirement` - List requirements
- `GET /requirement/feature/{featureId}` - Requirements by feature
- `POST /requirement` - Create requirement
- `PUT /requirement` - Update requirement

### Phase 6: Dashboard & Analytics (Week 11-12)

#### 6.1 Main Dashboard
- [ ] Create comprehensive dashboard
- [ ] Add project overview widgets
- [ ] Implement real-time updates
- [ ] Add customizable widgets

**Files to Create:**
```
src/app/planner/modules/dashboard/
├── dashboard.module.ts
├── components/
│   ├── main-dashboard/
│   ├── project-overview/
│   ├── task-summary/
│   ├── progress-charts/
│   ├── recent-activity/
│   └── widgets/
│       ├── project-status-widget/
│       ├── task-progress-widget/
│       ├── deadline-widget/
│       └── team-workload-widget/
└── services/
    └── dashboard.service.ts
```

#### 6.2 Reports & Analytics
- [ ] Create project reports
- [ ] Add time tracking analytics
- [ ] Implement performance metrics
- [ ] Create exportable reports

### Phase 7: User Management & Collaboration (Week 13-14)

#### 7.1 User Management
- [ ] Create user profile management
- [ ] Add team management
- [ ] Implement role-based access
- [ ] Create user directory

**Files to Create:**
```
src/app/user/
├── user.module.ts
├── components/
│   ├── user-profile/
│   ├── user-list/
│   ├── team-management/
│   └── role-assignment/
├── services/
│   └── user.service.ts
└── store/
    ├── user.actions.ts
    ├── user.effects.ts
    ├── user.reducer.ts
    └── user.selectors.ts
```

#### 7.2 Collaboration Features
- [ ] Add real-time notifications
- [ ] Create activity feeds
- [ ] Implement commenting system
- [ ] Add file sharing

### Phase 8: Advanced Features & Polish (Week 15-16)

#### 8.1 Advanced Features
- [ ] Add drag-and-drop functionality
- [ ] Implement bulk operations
- [ ] Create import/export features
- [ ] Add keyboard shortcuts

#### 8.2 Performance & UX
- [ ] Optimize performance
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Create comprehensive testing

#### 8.3 Mobile Responsiveness
- [ ] Optimize for mobile devices
- [ ] Create touch-friendly interfaces
- [ ] Add offline capabilities
- [ ] Implement PWA features

## 🔧 Technical Implementation Details

### Type System Standards

Following the backend conventions, the frontend strictly uses **types** instead of **interfaces**:

**Correct Usage:**
```typescript
// Types for data structures
export type TProject = {
  _id: string;
  name: string;
  description?: string;
  category: TProjectCategory | string;
  status: TStatus | string;
  createdAt: Date;
  updatedAt: Date;
};

// DTO types using utility types
export type TProjectCreateDTO = Partial<Omit<TProject, '_id'>>;
export type TProjectUpdateDTO = TProjectCreateDTO & Required<{ _id: string }>;

// Component configuration types
export type TListConfig<T> = {
  columns: TColumnConfig<T>[];
  actions?: TActionConfig<T>[];
  selectable?: 'single' | 'multiple' | false;
};
```

**Avoid interfaces except for extreme cases:**
- Declaration merging requirements
- Class implementation contracts
- External API contracts

For detailed guidelines, see `/docs/DEVELOPER_GUIDE.md`.

### State Management Architecture

```typescript
// Root State Structure
interface AppState {
  auth: AuthState;
  projects: ProjectState;
  tasks: TaskState;
  features: FeatureState;
  requirements: RequirementState;
  categories: CategoryState;
  status: StatusState;
  users: UserState;
  ui: UIState;
}
```

### Service Architecture

```typescript
// Base API Service
@Injectable()
export abstract class BaseApiService<T> {
  protected abstract endpoint: string;
  
  constructor(protected http: HttpClient) {}
  
  getAll(searchQuery?: TSearchQuery): Observable<SearchResult<T>> {
    const params = searchQuery ? { search: JSON.stringify(searchQuery) } : {};
    return this.http.get<SearchResult<T>>(this.endpoint, { params });
  }
  
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }
  
  create(item: Partial<T>): Observable<T> {
    return this.http.post<T>(this.endpoint, item);
  }
  
  update(item: Partial<T> & { id: string }): Observable<T> {
    return this.http.put<T>(this.endpoint, item);
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

### Component Architecture

```typescript
// Base Component with common functionality
@Component({ template: '' })
export abstract class BaseListComponent<T> implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  
  // Common properties
  items$ = new BehaviorSubject<T[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  
  // Search functionality
  searchQuery$ = new BehaviorSubject<TSearchQuery>({});
  
  // Pagination
  currentPage$ = new BehaviorSubject<number>(1);
  totalItems$ = new BehaviorSubject<number>(0);
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## 📦 Dependencies & Libraries

### Core Dependencies (Already Included)
- Angular 19.2.10
- Angular Material 19.2.16
- NgRx 19.2.0
- Bootstrap 5.3.6
- RxJS 7.8.2

### Additional Dependencies to Add
```json
{
  "dependencies": {
    "@angular/cdk": "^19.2.16",
    "date-fns": "^3.0.0",
    "chart.js": "^4.4.0",
    "ng2-charts": "^5.0.4",
    "ngx-infinite-scroll": "^17.0.0",
    "ngx-skeleton-loader": "^9.0.0",
    "primeicons": "^7.0.0",
    "primeng": "^17.0.0"
  },
  "devDependencies": {
    "@types/chart.js": "^2.9.41",
    "cypress": "^13.0.0",
    "@cypress/angular": "^2.0.0"
  }
}
```

## 🧪 Testing Strategy

### Unit Testing
- Component testing with Angular Testing Utilities
- Service testing with HttpClientTestingModule
- Store testing with NgRx testing utilities

### Integration Testing
- Feature testing with Cypress
- API integration testing
- End-to-end user workflows

### Performance Testing
- Bundle size optimization
- Runtime performance monitoring
- Memory leak detection

## 🚀 Deployment Strategy

### Development Environment
- Local development with proxy configuration
- Hot reload and debugging setup
- Mock data for offline development

### Production Environment
- Build optimization with Angular CLI
- Environment-specific configurations
- CDN integration for static assets

## 📋 Project Structure

```
src/app/
├── core/
│   ├── components/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   └── utils/
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   ├── services/
│   └── types/
├── auth/
│   ├── components/
│   ├── services/
│   ├── store/
│   └── types/
├── user/
│   ├── components/
│   ├── services/
│   ├── store/
│   └── types/
└── planner/
    ├── modules/
    │   ├── dashboard/
    │   ├── projects/
    │   ├── tasks/
    │   ├── features/
    │   ├── requirements/
    │   ├── categories/
    │   ├── subcategories/
    │   └── status/
    └── types/
```

## 📈 Success Metrics

### Generic Components Metrics
- [ ] All 25+ generic components implemented and tested
- [ ] 80% reduction in duplicate code across modules
- [ ] 90% of CRUD operations use generic components
- [ ] 95% test coverage for all generic components
- [ ] 100% TypeScript strict mode compliance for generic components

### Functionality Metrics
- [ ] All CRUD operations working for all entities
- [ ] Advanced search functionality implemented
- [ ] Real-time updates working
- [ ] Mobile responsiveness achieved

### Performance Metrics
- [ ] Initial load time < 3 seconds
- [ ] Search response time < 1 second
- [ ] Bundle size < 2MB
- [ ] Lighthouse score > 90

### User Experience Metrics
- [ ] Intuitive navigation
- [ ] Consistent design system
- [ ] Accessibility compliance (WCAG 2.1)
- [ ] Cross-browser compatibility

## 🎯 Next Steps

1. **Immediate Actions:**
   - Review the [Frontend Developer Guide](./docs/DEVELOPER_GUIDE.md)
   - Set up development environment following the guide
   - Configure API proxy and authentication
   - Create base services and components using the type system standards

2. **Short-term Goals (Next 2 weeks):**
   - Complete authentication flow
   - Implement project categories and status management
   - Create basic project CRUD operations

3. **Medium-term Goals (Next 1-2 months):**
   - Complete all core modules
   - Implement advanced search and filtering
   - Add dashboard and analytics

4. **Long-term Goals (Next 3 months):**
   - Add collaboration features
   - Implement advanced analytics
   - Optimize for production deployment

This comprehensive plan provides a structured approach to developing a full-featured project management frontend that leverages all the capabilities of the Sokoke Planner API.
