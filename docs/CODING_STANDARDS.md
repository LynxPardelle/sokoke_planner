# 📝 Coding Standards & Conventions

This document outlines the coding standards, naming conventions, and best practices used throughout the Sokoke Planner frontend project.

## 🎯 Core Principles

1. **Consistency**: Code should look like it was written by one person
2. **Readability**: Code should be self-documenting
3. **Maintainability**: Easy to modify and extend
4. **Performance**: Efficient and optimized
5. **Type Safety**: Leverage TypeScript's strong typing

## 📛 Naming Conventions

### Files and Directories

| Type | Convention | Example |
|------|------------|---------|
| **Components** | kebab-case | `project-list.component.ts` |
| **Services** | kebab-case | `auth.service.ts` |
| **Types** | kebab-case | `project.type.ts` |
| **Interfaces** | kebab-case | `component.interface.ts` |
| **Utilities** | kebab-case | `async-error-handler.util.ts` |
| **Constants** | kebab-case | `app.constants.ts` |
| **Directories** | kebab-case | `generic-components/` |

### TypeScript Identifiers

| Type | Convention | Example |
|------|------------|---------|
| **Classes** | PascalCase | `ProjectListComponent` |
| **Interfaces** | PascalCase with `I` prefix | `IGenericComponent` |
| **Types** | PascalCase with `T` prefix | `TProject`, `TUser` |
| **Enums** | PascalCase with `E` prefix | `EStatus`, `EUserRole` |
| **Variables** | camelCase | `projectData`, `isLoading` |
| **Functions** | camelCase | `createProject`, `validateForm` |
| **Constants** | SCREAMING_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `API_ENDPOINTS` |
| **Generic Components** | `Generic` prefix | `GenericButton`, `GenericModal` |

### Component Naming

```typescript
// ✅ Good
@Component({
  selector: 'app-project-list',        // kebab-case selector
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {    // PascalCase class name
  // Component implementation
}

// ✅ Generic Component
@Component({
  selector: 'generic-button',
  templateUrl: './generic-button.component.html',
  styleUrl: './generic-button.component.scss'
})
export class GenericButtonComponent {
  // Generic component implementation
}
```

## 📁 File Organization

### Import Organization

Always organize imports in this order:

```typescript
// 1. Angular core imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// 2. External library imports
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// 3. Internal absolute imports (services, types)
import { AuthService } from '@app/auth/services/auth.service';
import { TProject } from '@app/planner/types/project.type';

// 4. Relative imports
import { ProjectService } from '../services/project.service';
import { IProjectListConfig } from './project-list.interface';
```

### Directory Structure Patterns

```text
feature-module/
├── components/
│   ├── feature-list/
│   │   ├── feature-list.component.ts
│   │   ├── feature-list.component.html
│   │   ├── feature-list.component.scss
│   │   └── feature-list.component.spec.ts
│   └── feature-detail/
├── services/
│   ├── feature.service.ts
│   └── feature.service.spec.ts
├── types/
│   ├── feature.type.ts
│   └── feature-config.interface.ts
├── store/ (if using NgRx)
│   ├── feature.actions.ts
│   ├── feature.effects.ts
│   ├── feature.reducer.ts
│   └── feature.selectors.ts
└── feature.module.ts
```

## 🏗️ Component Standards

### Component Structure

```typescript
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Project list component that displays a paginated list of projects
 * 
 * @example
 * <app-project-list 
 *   [projects]="projects$ | async"
 *   [loading]="loading$ | async"
 *   (projectSelected)="onProjectSelected($event)"
 *   (projectDeleted)="onProjectDeleted($event)">
 * </app-project-list>
 */
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, GenericButtonComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit, OnDestroy {
  // 1. Inputs (data coming in)
  @Input() projects: TProject[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  // 2. Outputs (events going out)
  @Output() projectSelected = new EventEmitter<TProject>();
  @Output() projectDeleted = new EventEmitter<string>();

  // 3. Public properties (used in template)
  selectedProject: TProject | null = null;
  searchQuery: string = '';

  // 4. Private properties
  private readonly destroy$ = new Subject<void>();

  // 5. Constructor with dependency injection
  constructor(
    private readonly projectService: ProjectService,
    private readonly router: Router
  ) {}

  // 6. Lifecycle hooks
  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 7. Public methods (used in template)
  onProjectClick(project: TProject): void {
    this.selectedProject = project;
    this.projectSelected.emit(project);
  }

  onDeleteProject(projectId: string): void {
    this.projectDeleted.emit(projectId);
  }

  // 8. Private methods
  private loadProjects(): void {
    this.projectService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          // Handle success
        },
        error: (error) => {
          // Handle error
        }
      });
  }
}
```

### Template Guidelines

```html
<!-- Use semantic HTML -->
<section class="project-list">
  <header class="project-list__header">
    <h2 class="project-list__title">Projects</h2>
    
    <!-- Use generic components for consistency -->
    <generic-button
      variant="primary"
      size="medium"
      [loading]="loading"
      (clicked)="onCreateProject()">
      Create Project
    </generic-button>
  </header>

  <!-- Handle loading states -->
  <generic-loading *ngIf="loading" message="Loading projects..."></generic-loading>

  <!-- Handle error states -->
  <generic-error *ngIf="error" [message]="error"></generic-error>

  <!-- Main content with proper accessibility -->
  <main class="project-list__content" *ngIf="!loading && !error">
    <article 
      *ngFor="let project of projects; trackBy: trackByProjectId"
      class="project-card"
      [attr.aria-label]="'Project: ' + project.name"
      tabindex="0"
      (click)="onProjectClick(project)"
      (keyup.enter)="onProjectClick(project)">
      
      <h3 class="project-card__title">{{ project.name }}</h3>
      <p class="project-card__description">{{ project.description }}</p>
      
      <!-- Actions with proper accessibility -->
      <div class="project-card__actions">
        <generic-button
          variant="secondary"
          size="small"
          [attr.aria-label]="'Edit project: ' + project.name"
          (clicked)="onEditProject(project)">
          Edit
        </generic-button>
        
        <generic-button
          variant="danger"
          size="small"
          [attr.aria-label]="'Delete project: ' + project.name"
          (clicked)="onDeleteProject(project._id)">
          Delete
        </generic-button>
      </div>
    </article>
  </main>
</section>
```

### Component Lifecycle Best Practices

```typescript
export class ExampleComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Initialize component
    this.setupSubscriptions();
    this.loadData();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    // Use takeUntil pattern for automatic subscription cleanup
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }
}
```

## 🔧 Service Standards

### Service Structure

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { TProject } from '@app/planner/types/project.type';
import { TApiResponse } from '@app/shared/types/api.type';
import { environment } from '@env/environment';

/**
 * Service for managing project data and operations
 * 
 * Provides CRUD operations for projects and caches data locally
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // 1. Private properties
  private readonly apiUrl = `${environment.apiUrl}/projects`;
  private readonly projectsSubject = new BehaviorSubject<TProject[]>([]);

  // 2. Public observables
  public readonly projects$ = this.projectsSubject.asObservable();

  // 3. Constructor
  constructor(private readonly http: HttpClient) {}

  // 4. Public methods
  /**
   * Get all projects from the API
   * @returns Observable of project array
   */
  getAll(): Observable<TProject[]> {
    return this.http.get<TApiResponse<TProject[]>>(this.apiUrl)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new project
   * @param project Project data to create
   * @returns Observable of created project
   */
  create(project: Partial<TProject>): Observable<TProject> {
    return this.http.post<TApiResponse<TProject>>(this.apiUrl, project)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // 5. Private methods
  private handleError(error: any): Observable<never> {
    console.error('ProjectService error:', error);
    throw error;
  }
}
```

## 📝 Type System Standards

### Type Definitions

```typescript
// Use type aliases for complex types
export type TProject = {
  readonly _id: string;
  name: string;
  description: string;
  status: EProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  tasks: TTask[];
};

// Use interfaces for object shapes that might be extended
export interface IGenericComponent {
  readonly variant: TComponentVariant;
  readonly size: TComponentSize;
  disabled?: boolean;
  loading?: boolean;
}

// Use enums for fixed sets of values
export enum EProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Use union types for specific sets of values
export type TComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type TComponentSize = 'small' | 'medium' | 'large';
```

### Generic Component Types

```typescript
// Base interface for all generic components
export interface IGenericComponent {
  variant?: TComponentVariant;
  size?: TComponentSize;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

// Specific component interfaces extend the base
export interface IGenericButtonConfig extends IGenericComponent {
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  fullWidth?: boolean;
}

export interface IGenericModalConfig extends IGenericComponent {
  title: string;
  closable?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
}
```

## 🎨 Styling Standards

### SCSS Structure

```scss
// Component styles should be scoped and well-organized
.project-list {
  // 1. Component root styles
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  // 2. Element styles (BEM methodology)
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    margin: 0;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  // 3. Modifier styles
  &--loading {
    opacity: 0.6;
    pointer-events: none;
  }

  &--empty {
    .project-list__content {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }
  }

  // 4. Responsive design
  @media (max-width: 768px) {
    padding: 0.5rem;
    
    &__content {
      grid-template-columns: 1fr;
    }
  }
}

// Nested component styles
.project-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  &__description {
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
```

### CSS Custom Properties

```scss
// Use CSS custom properties for theming
:root {
  // Colors
  --primary-color: #A17246;
  --secondary-color: #F5E6D3;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --background-color: #f8f9fa;

  // Spacing
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  // Typography
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;

  // Border radius
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;

  // Transitions
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

## ✅ Code Review Checklist

### Before Submitting PR

- [ ] Code follows naming conventions
- [ ] Components are properly structured
- [ ] TypeScript types are correctly defined
- [ ] Unit tests are written and passing
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Accessibility attributes are included
- [ ] Generic components are used where appropriate
- [ ] Code is properly documented
- [ ] No unused imports or variables

### During Code Review

- [ ] Logic is clear and efficient
- [ ] Edge cases are handled
- [ ] Performance considerations addressed
- [ ] Security implications considered
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

---

**Next Reading**: [Generic Components Guide](./GENERIC_COMPONENTS_GUIDE.md) to learn how to use and create reusable components.
