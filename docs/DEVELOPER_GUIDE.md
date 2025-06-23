# Frontend Developer Guide

## 📋 Overview

This guide provides comprehensive information for developers working with the Sokoke Planner Frontend application. It covers architecture patterns, coding standards, development workflows, and best practices aligned with the backend API development standards.

## 🏗️ Architecture Overview

### Component-Based Architecture

The application follows Angular's component-based architecture with clear separation of concerns:

```text
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                      │
│  Components (UI rendering, user interactions)              │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      State Management                      │
│    NgRx Store (Actions, Reducers, Effects, Selectors)     │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                         │
│  Services (Business logic, HTTP communication)             │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   HTTP Interceptors                        │
│      (Authentication, Error handling, Loading)             │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Lynx Bridge                           │
│        (API Proxy with authentication)                     │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Sokoke API                              │
│        (Backend REST API)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Module Structure

Each feature module follows a consistent structure aligned with the backend:

```text
src/app/
├── {module}/
│   ├── components/              # UI components
│   │   ├── {entity}-list/
│   │   ├── {entity}-detail/
│   │   ├── {entity}-form/
│   │   └── {entity}-card/
│   ├── services/               # Business logic and HTTP services
│   │   ├── {entity}.service.ts
│   │   └── {entity}.service.spec.ts
│   ├── store/                  # NgRx state management
│   │   ├── {entity}.actions.ts
│   │   ├── {entity}.effects.ts
│   │   ├── {entity}.reducer.ts
│   │   └── {entity}.selectors.ts
│   ├── types/                  # Type definitions
│   │   └── {entity}.type.ts
│   ├── guards/                 # Route guards
│   │   └── {entity}.guard.ts
│   ├── {module}.module.ts      # Module configuration
│   └── {module}-routing.module.ts
```

## 🔧 Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Angular CLI** >= 19.0.0
- **Git**
- **VS Code** (recommended)

### Environment Setup

1. **Clone and setup:**

   ```bash
   git clone https://github.com/LynxPardelle/sokoke_planner.git
   cd sokoke_planner
   npm install
   ```

2. **Environment configuration:**

   ```bash
   # Update environment files
   # src/environments/environment.ts
   # src/environments/environment.prod.ts
   ```

3. **Start development server:**

   ```bash
   ng serve
   # or
   npm start
   ```

4. **Start Lynx Bridge (API Proxy):**

   ```bash
   cd ../lynx-bridge
   npm install
   npm start
   ```

### Development Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `ng serve` | Start dev server with hot reload | Development |
| `ng build` | Build for production | Production build |
| `ng test` | Run unit tests | Testing |
| `ng e2e` | Run e2e tests | Integration testing |
| `ng lint` | ESLint code checking | Code quality |
| `ng generate` | Generate components/services | Code scaffolding |

## 📁 File Organization

### Naming Conventions

Following the backend conventions, the frontend uses:

| Type | Convention | Example |
|------|------------|---------|
| **Files** | kebab-case | `project-category.service.ts` |
| **Classes** | PascalCase | `ProjectCategoryService` |
| **Types** | PascalCase with `T` prefix | `TProject` |
| **Constants** | SCREAMING_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| **Variables** | camelCase | `projectData` |
| **Functions** | camelCase | `createProject` |
| **Components** | PascalCase | `ProjectListComponent` |
| **Generic Components** | Generic prefix | `GenericListComponent` |

### Import Organization

Organize imports in the following order:

```typescript
// 1. Angular core imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Angular additional modules
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// 3. Third-party libraries
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

// 4. Internal shared modules
import { SharedModule } from '@shared/shared.module';

// 5. Internal feature modules
import { ProjectService } from '../services/project.service';
import { TProject } from '../types/project.type';

// 6. Relative imports
import { ProjectFormComponent } from './project-form.component';
```

## 🎯 Coding Standards

### TypeScript Configuration

The project uses strict TypeScript configuration aligned with the backend:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Code Style Guidelines

#### 1. Component Documentation

```typescript
/**
 * Project list component
 * 
 * Displays a list of projects with search, filtering, and pagination.
 * Uses the generic list component for consistent UI and behavior.
 * 
 * @author Developer Name
 * @version 1.0.0
 * @since 2024-01-10
 */
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: true,
  imports: [CommonModule, GenericListComponent]
})
export class ProjectListComponent implements OnInit, OnDestroy {
  /**
   * Configuration for the generic list component
   */
  listConfig: TListConfig<TProject> = {
    // Configuration details
  };
}
```

#### 2. Service Documentation

```typescript
/**
 * Project service
 * 
 * Handles all project-related business logic and HTTP communication
 * with the Sokoke API through the Lynx Bridge proxy.
 * 
 * @author Developer Name
 * @version 1.0.0
 * @since 2024-01-10
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService<TProject> {
  protected override endpoint = '/project';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get projects by category
   * 
   * @param {string} categoryId - Category identifier
   * @returns {Observable<TSearchResult<TProject>>} Projects in category
   */
  getByCategory(categoryId: string): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      filters: { categoryId }
    };
    return this.getAll(searchQuery);
  }
}
```

#### 3. Types vs Interfaces (Following Backend Standards)

**Always use Types instead of Interfaces**

Following the backend convention, the frontend strictly uses types for all data structures:

```typescript
/**
 * Project entity type
 * 
 * Represents a project in the system, matching the backend TProject type
 */
export type TProject = {
  /** Unique identifier */
  _id: string;
  
  /** Project name (required) */
  name: string;
  
  /** Project description (optional) */
  description?: string;
  
  /** Associated category */
  category: TProjectCategory | string;
  
  /** Project status */
  status: TStatus | string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
};

/** Type for creating new projects (excludes _id) */
export type TProjectCreateDTO = Partial<Omit<TProject, '_id'>>;

/** Type for updating projects (requires _id) */
export type TProjectUpdateDTO = TProjectCreateDTO & Required<{ _id: string }>;
```

**Search Query Types**

Matching the backend search functionality:

```typescript
/**
 * Search query type for filtering and pagination
 */
export type TSearchQuery<T> = {
  filters?: Partial<T>;
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: Array<{
    field: keyof T;
    order: 'asc' | 'desc';
  }>;
  search?: {
    query: string;
    fields: (keyof T)[];
    options?: {
      caseSensitive?: boolean;
      useRegex?: boolean;
    };
  };
  advanced?: {
    dateRange?: Array<{
      field: keyof T;
      start: string;
      end: string;
    }>;
    numericRange?: Array<{
      field: keyof T;
      min: number;
      max: number;
    }>;
    select?: (keyof T)[];
    populate?: (keyof T)[];
  };
};

/**
 * Search result type matching backend response
 */
export type TSearchResult<T> = {
  items: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    searchTime?: number;
  };
};
```

**Component Configuration Types**

```typescript
/**
 * Generic list component configuration
 */
export type TListConfig<T> = {
  columns: TColumnConfig<T>[];
  actions?: TActionConfig<T>[];
  selectable?: 'single' | 'multiple' | false;
  searchable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  itemsPerPage?: number;
};

export type TColumnConfig<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'status' | 'badge' | 'custom';
  template?: TemplateRef<any>;
  width?: string;
};

export type TActionConfig<T> = {
  type: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'warn';
  condition?: (item: T) => boolean;
};
```

### Error Handling

#### 1. Service Layer Errors

```typescript
/**
 * Handle HTTP errors with proper typing
 */
private handleError<T>(operation = 'operation') {
  return (error: HttpErrorResponse): Observable<T> => {
    console.error(`${operation} failed:`, error);
    
    // Let the app keep running by returning an empty result
    return of({
      success: false,
      message: `${operation} failed: ${error.message}`,
      error: error.error
    } as T);
  };
}
```

#### 2. Component Error Handling

```typescript
/**
 * Component error handling with user feedback
 */
export class ProjectListComponent implements OnInit {
  error$ = new BehaviorSubject<string | null>(null);
  
  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (result) => {
        if (result.success) {
          this.projects$.next(result.items);
          this.error$.next(null);
        } else {
          this.error$.next(result.message);
        }
      },
      error: (error) => {
        this.error$.next('Failed to load projects');
        console.error('Project loading error:', error);
      }
    });
  }
}
```

### State Management with NgRx

#### 1. Actions

```typescript
/**
 * Project actions following NgRx best practices
 */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TProject, TProjectCreateDTO, TSearchQuery } from '../types/project.type';

export const ProjectActions = createActionGroup({
  source: 'Project',
  events: {
    // Load actions
    'Load Projects': props<{ searchQuery?: TSearchQuery<TProject> }>(),
    'Load Projects Success': props<{ projects: TProject[]; metadata: any }>(),
    'Load Projects Failure': props<{ error: string }>(),
    
    // CRUD actions
    'Create Project': props<{ project: TProjectCreateDTO }>(),
    'Create Project Success': props<{ project: TProject }>(),
    'Create Project Failure': props<{ error: string }>(),
    
    'Update Project': props<{ project: TProject }>(),
    'Update Project Success': props<{ project: TProject }>(),
    'Update Project Failure': props<{ error: string }>(),
    
    'Delete Project': props<{ id: string }>(),
    'Delete Project Success': props<{ id: string }>(),
    'Delete Project Failure': props<{ error: string }>(),
    
    // UI actions
    'Select Project': props<{ project: TProject }>(),
    'Clear Selection': emptyProps(),
    'Set Search Query': props<{ searchQuery: TSearchQuery<TProject> }>(),
  }
});
```

#### 2. Reducer

```typescript
/**
 * Project reducer with proper state typing
 */
import { createReducer, on } from '@ngrx/store';
import { ProjectActions } from './project.actions';
import { TProject, TSearchQuery } from '../types/project.type';

export type TProjectState = {
  projects: TProject[];
  selectedProject: TProject | null;
  loading: boolean;
  error: string | null;
  searchQuery: TSearchQuery<TProject>;
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export const initialState: TProjectState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  searchQuery: {},
  metadata: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false
  }
};

export const projectReducer = createReducer(
  initialState,
  
  // Load projects
  on(ProjectActions.loadProjects, (state, { searchQuery }) => ({
    ...state,
    loading: true,
    error: null,
    searchQuery: searchQuery || {}
  })),
  
  on(ProjectActions.loadProjectsSuccess, (state, { projects, metadata }) => ({
    ...state,
    projects,
    metadata,
    loading: false,
    error: null
  })),
  
  on(ProjectActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create project
  on(ProjectActions.createProjectSuccess, (state, { project }) => ({
    ...state,
    projects: [...state.projects, project],
    metadata: {
      ...state.metadata,
      total: state.metadata.total + 1
    }
  }))
);
```

#### 3. Effects

```typescript
/**
 * Project effects for side effects
 */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProjectService } from '../services/project.service';
import { ProjectActions } from './project.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ProjectEffects {
  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      switchMap(({ searchQuery }) =>
        this.projectService.getAll(searchQuery).pipe(
          map((result) => {
            if (result.success) {
              return ProjectActions.loadProjectsSuccess({
                projects: result.items,
                metadata: result.metadata
              });
            } else {
              return ProjectActions.loadProjectsFailure({
                error: result.message
              });
            }
          }),
          catchError((error) =>
            of(ProjectActions.loadProjectsFailure({
              error: error.message
            }))
          )
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.createProject),
      switchMap(({ project }) =>
        this.projectService.create(project).pipe(
          map((result) => {
            if (result.success) {
              return ProjectActions.createProjectSuccess({
                project: result.data
              });
            } else {
              return ProjectActions.createProjectFailure({
                error: result.message
              });
            }
          }),
          catchError((error) =>
            of(ProjectActions.createProjectFailure({
              error: error.message
            }))
          )
        )
      )
    )
  );
}
```

#### 4. Selectors

```typescript
/**
 * Project selectors for state access
 */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TProjectState } from './project.reducer';

export const selectProjectState = createFeatureSelector<TProjectState>('projects');

export const selectAllProjects = createSelector(
  selectProjectState,
  (state) => state.projects
);

export const selectProjectsLoading = createSelector(
  selectProjectState,
  (state) => state.loading
);

export const selectProjectsError = createSelector(
  selectProjectState,
  (state) => state.error
);

export const selectSelectedProject = createSelector(
  selectProjectState,
  (state) => state.selectedProject
);

export const selectProjectsMetadata = createSelector(
  selectProjectState,
  (state) => state.metadata
);

export const selectProjectsByStatus = (status: string) => createSelector(
  selectAllProjects,
  (projects) => projects.filter(project => project.status === status)
);
```

## 🧪 Testing Strategies

### Unit Testing

```typescript
/**
 * Component unit tests
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../services/project.service';
import { of } from 'rxjs';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProjectService', ['getAll', 'create', 'update', 'delete']);

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        { provide: ProjectService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    mockProjectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    const mockProjects = [
      { _id: '1', name: 'Test Project 1' },
      { _id: '2', name: 'Test Project 2' }
    ] as TProject[];

    mockProjectService.getAll.and.returnValue(of({
      success: true,
      items: mockProjects,
      metadata: { total: 2, page: 1, limit: 10, totalPages: 1, hasMore: false }
    }));

    component.ngOnInit();

    expect(mockProjectService.getAll).toHaveBeenCalled();
  });
});
```

### Service Testing

```typescript
/**
 * Service unit tests
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { TProject } from '../types/project.type';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });
    
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all projects', () => {
    const mockProjects: TProject[] = [
      { _id: '1', name: 'Test Project' } as TProject
    ];

    service.getAll().subscribe(result => {
      expect(result.success).toBe(true);
      expect(result.items).toEqual(mockProjects);
    });

    const req = httpMock.expectOne('/project');
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      items: mockProjects,
      metadata: { total: 1, page: 1, limit: 10, totalPages: 1, hasMore: false }
    });
  });
});
```

## 🎨 UI/UX Guidelines

### Material Design Integration

```typescript
/**
 * Component using Angular Material
 */
@Component({
  selector: 'app-project-card',
  template: `
    <mat-card class="project-card">
      <mat-card-header>
        <mat-card-title>{{ project.name }}</mat-card-title>
        <mat-card-subtitle>{{ project.category?.name }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <p>{{ project.description }}</p>
        <app-generic-status-badge [status]="project.status"></app-generic-status-badge>
      </mat-card-content>
      
      <mat-card-actions>
        <button mat-button (click)="onEdit()">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
        <button mat-button color="warn" (click)="onDelete()">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project!: TProject;
  @Output() edit = new EventEmitter<TProject>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.project);
  }

  onDelete(): void {
    this.delete.emit(this.project._id);
  }
}
```

### Responsive Design

```scss
/* Component responsive styles */
.project-card {
  margin: 16px;
  
  @media (max-width: 768px) {
    margin: 8px;
    
    .mat-card-actions {
      flex-direction: column;
      align-items: stretch;
      
      button {
        margin: 4px 0;
      }
    }
  }
  
  @media (min-width: 1200px) {
    max-width: 400px;
  }
}
```

## 🚀 Build and Deployment

### Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Lynx Bridge URL
  apiKey: 'development-key',
  features: {
    enableLogging: true,
    enableAnalytics: false,
  },
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.sokoke-planner.com',
  apiKey: process.env['API_KEY'],
  features: {
    enableLogging: false,
    enableAnalytics: true,
  },
};
```

### Build Configuration

```json
// angular.json build configuration
{
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      "outputPath": "dist/sokoke_planner",
      "index": "src/index.html",
      "main": "src/main.ts",
      "polyfills": "src/polyfills.ts",
      "tsConfig": "tsconfig.app.json",
      "assets": [
        "src/favicon.ico",
        "src/assets"
      ],
      "styles": [
        "@angular/material/prebuilt-themes/indigo-pink.css",
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "src/styles.scss"
      ],
      "scripts": [],
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
        }
      ]
    }
  }
}
```

## 📚 Additional Resources

### Useful Commands

```bash
# Generate components
ng generate component features/projects/components/project-list
ng generate service features/projects/services/project

# Generate NgRx store
ng generate @ngrx/schematics:feature features/projects/store/project --module features/projects/projects.module.ts

# Run tests
ng test
ng e2e

# Build for production
ng build --configuration production

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/sokoke_planner/stats.json
```

### VS Code Extensions

Recommended extensions for Angular development:

- **Angular Language Service** - Angular IntelliSense
- **Angular Snippets** - Code snippets
- **NgRx Snippets** - NgRx code snippets
- **TypeScript Importer** - Auto import modules
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Material Icon Theme** - File icons
- **Auto Rename Tag** - HTML tag renaming

### Debugging Setup

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

## 🤝 Contributing

### Git Workflow

Following the backend conventions:

1. **Branch naming:**
   - `feature/feature-name` - New features
   - `fix/bug-description` - Bug fixes
   - `docs/update-description` - Documentation updates
   - `refactor/component-name` - Code refactoring

2. **Commit messages:**
   ```
   type(scope): description
   
   feat(projects): add project list component
   fix(auth): resolve login redirect issue
   docs(readme): update setup instructions
   refactor(generic): extract common list logic
   ```

### Code Review Checklist

- [ ] Code follows Angular style guidelines
- [ ] All tests pass
- [ ] Components are properly typed
- [ ] Uses types instead of interfaces
- [ ] Generic components used where applicable
- [ ] Documentation is updated
- [ ] Responsive design implemented
- [ ] Accessibility considerations addressed
- [ ] Performance optimized (OnPush strategy, trackBy functions)

---

For additional support, please refer to the main [Frontend Documentation](../README.md) or create an issue in the repository.
