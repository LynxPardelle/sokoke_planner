# Frontend API Reference

## 📋 Overview

This document provides reference information for the Sokoke Planner Frontend API integration, including service interfaces, type definitions, and usage examples. The frontend communicates with the backend through the Lynx Bridge proxy.

## 🔗 API Architecture

### Communication Flow

```text
Frontend App → Lynx Bridge → Sokoke API → Database
     ↑              ↑            ↑           ↑
  Angular 19     Express      NestJS     MongoDB
```

### Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Lynx Bridge URL
  endpoints: {
    auth: '/auth',
    projects: '/project',
    categories: '/project-category',
    subcategories: '/project-subcategory',
    tasks: '/task',
    features: '/feature',
    requirements: '/requirement',
    users: '/user',
    status: '/status'
  }
};
```

## 🎯 Base Service Architecture

### BaseApiService

All entity services extend the BaseApiService for consistent API communication:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

/**
 * Base API service providing common CRUD operations
 * 
 * @template T - Entity type
 */
@Injectable()
export abstract class BaseApiService<T> {
  protected abstract endpoint: string;
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /**
   * Get all entities with optional search query
   * 
   * @param searchQuery - Search parameters
   * @returns Observable of search results
   */
  getAll(searchQuery?: TSearchQuery<T>): Observable<TSearchResult<T>> {
    let params = new HttpParams();
    
    if (searchQuery) {
      params = params.set('search', JSON.stringify(searchQuery));
    }

    return this.http.get<TSearchResult<T>>(`${this.baseUrl}${this.endpoint}`, { params });
  }

  /**
   * Get entity by ID
   * 
   * @param id - Entity identifier
   * @returns Observable of entity
   */
  getById(id: string): Observable<TApiResponse<T>> {
    return this.http.get<TApiResponse<T>>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  /**
   * Create new entity
   * 
   * @param item - Entity data
   * @returns Observable of created entity
   */
  create(item: Partial<T>): Observable<TApiResponse<T>> {
    return this.http.post<TApiResponse<T>>(`${this.baseUrl}${this.endpoint}`, item);
  }

  /**
   * Update existing entity
   * 
   * @param item - Entity data with ID
   * @returns Observable of updated entity
   */
  update(item: Partial<T> & { _id: string }): Observable<TApiResponse<T>> {
    return this.http.put<TApiResponse<T>>(`${this.baseUrl}${this.endpoint}`, item);
  }

  /**
   * Delete entity by ID
   * 
   * @param id - Entity identifier
   * @returns Observable of deletion result
   */
  delete(id: string): Observable<TApiResponse<void>> {
    return this.http.delete<TApiResponse<void>>(`${this.baseUrl}${this.endpoint}/${id}`);
  }
}
```

## 📁 Core Type Definitions

### API Response Types

```typescript
/**
 * Standard API response wrapper
 */
export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

/**
 * Search result wrapper with metadata
 */
export type TSearchResult<T> = {
  success: boolean;
  items: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    searchTime?: number;
  };
  message?: string;
  error?: string;
};

/**
 * Search query parameters
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
```

### Entity Types

#### Project Types

```typescript
/**
 * Project entity type
 */
export type TProject = {
  _id: string;
  name: string;
  description?: string;
  categoryId?: string;
  subcategoryId?: string;
  statusId?: string;
  startDate?: Date;
  endDate?: Date;
  priority?: number;
  completed?: boolean;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TProjectCreateDTO = Partial<Omit<TProject, '_id' | 'createdAt' | 'updatedAt'>>;
export type TProjectUpdateDTO = TProjectCreateDTO & Required<{ _id: string }>;
```

#### Category Types

```typescript
/**
 * Project category entity type
 */
export type TProjectCategory = {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TProjectCategoryCreateDTO = Partial<Omit<TProjectCategory, '_id' | 'createdAt' | 'updatedAt'>>;
export type TProjectCategoryUpdateDTO = TProjectCategoryCreateDTO & Required<{ _id: string }>;
```

#### Task Types

```typescript
/**
 * Task entity type
 */
export type TTask = {
  _id: string;
  name: string;
  description?: string;
  projectId?: string;
  statusId?: string;
  priority?: number;
  completed?: boolean;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TTaskCreateDTO = Partial<Omit<TTask, '_id' | 'createdAt' | 'updatedAt'>>;
export type TTaskUpdateDTO = TTaskCreateDTO & Required<{ _id: string }>;
```

#### Status Types

```typescript
/**
 * Status entity type
 */
export type TStatus = {
  _id: string;
  name: string;
  color?: string;
  type: 'project' | 'task' | 'feature' | 'requirement';
  isDefault?: boolean;
  order?: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TStatusCreateDTO = Partial<Omit<TStatus, '_id' | 'createdAt' | 'updatedAt'>>;
export type TStatusUpdateDTO = TStatusCreateDTO & Required<{ _id: string }>;
```

## 🛠️ Service Implementations

### ProjectService

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { TProject, TProjectCreateDTO, TProjectUpdateDTO } from '../types/project.type';

/**
 * Project service for project-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService<TProject> {
  protected override endpoint = '/project';

  /**
   * Get projects by category
   * 
   * @param categoryId - Category identifier
   * @returns Observable of projects
   */
  getByCategory(categoryId: string): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      filters: { categoryId }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Get projects by user
   * 
   * @param userId - User identifier
   * @returns Observable of projects
   */
  getByUser(userId: string): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      filters: { userId }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Search projects by name
   * 
   * @param query - Search query
   * @returns Observable of projects
   */
  searchByName(query: string): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      search: {
        query,
        fields: ['name', 'description']
      }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Get completed projects
   * 
   * @returns Observable of completed projects
   */
  getCompleted(): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      filters: { completed: true },
      sort: [{ field: 'endDate', order: 'desc' }]
    };
    return this.getAll(searchQuery);
  }
}
```

### CategoryService

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { TProjectCategory } from '../types/category.type';

/**
 * Category service for category-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseApiService<TProjectCategory> {
  protected override endpoint = '/project-category';

  /**
   * Get categories by user
   * 
   * @param userId - User identifier
   * @returns Observable of categories
   */
  getByUser(userId: string): Observable<TSearchResult<TProjectCategory>> {
    const searchQuery: TSearchQuery<TProjectCategory> = {
      filters: { userId }
    };
    return this.getAll(searchQuery);
  }
}
```

### TaskService

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { TTask } from '../types/task.type';

/**
 * Task service for task-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseApiService<TTask> {
  protected override endpoint = '/task';

  /**
   * Get tasks by project
   * 
   * @param projectId - Project identifier
   * @returns Observable of tasks
   */
  getByProject(projectId: string): Observable<TSearchResult<TTask>> {
    const searchQuery: TSearchQuery<TTask> = {
      filters: { projectId }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Get tasks assigned to user
   * 
   * @param userId - User identifier
   * @returns Observable of tasks
   */
  getAssignedTo(userId: string): Observable<TSearchResult<TTask>> {
    const searchQuery: TSearchQuery<TTask> = {
      filters: { assignedToId: userId }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Get pending tasks
   * 
   * @returns Observable of pending tasks
   */
  getPending(): Observable<TSearchResult<TTask>> {
    const searchQuery: TSearchQuery<TTask> = {
      filters: { completed: false },
      sort: [{ field: 'priority', order: 'desc' }, { field: 'endDate', order: 'asc' }]
    };
    return this.getAll(searchQuery);
  }
}
```

## 🔒 Authentication Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

export type TAuthCredentials = {
  email: string;
  password: string;
};

export type TAuthResponse = {
  success: boolean;
  data?: {
    user: TUser;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  error?: string;
};

export type TUser = {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Authentication service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<TUser | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Login user
   * 
   * @param credentials - User credentials
   * @returns Observable of auth response
   */
  login(credentials: TAuthCredentials): Observable<TAuthResponse> {
    return this.http.post<TAuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setCurrentUser(response.data.user);
            this.storeTokens(response.data.accessToken, response.data.refreshToken);
          }
        })
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  }

  /**
   * Get current user
   * 
   * @returns Current user or null
   */
  getCurrentUser(): TUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   * 
   * @returns True if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getAccessToken();
  }

  /**
   * Get access token
   * 
   * @returns Access token or null
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Set current user
   * 
   * @param user - User object
   */
  private setCurrentUser(user: TUser): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Store authentication tokens
   * 
   * @param accessToken - Access token
   * @param refreshToken - Refresh token
   */
  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Load user from local storage
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }
}
```

## 🔧 HTTP Interceptors

### Auth Interceptor

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

/**
 * HTTP interceptor for adding authentication headers
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.authService.getAccessToken();
    
    if (accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

### Error Interceptor

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * HTTP interceptor for handling errors
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - logout user
          this.authService.logout();
        }
        
        return throwError(error);
      })
    );
  }
}
```

## 📊 Usage Examples

### Component Integration

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { TProject, TSearchQuery } from '../types/project.type';

@Component({
  selector: 'app-project-list',
  template: `
    <app-generic-list
      [config]="listConfig"
      [data]="projects$ | async"
      [loading]="loading"
      (action)="handleAction($event)"
      (search)="handleSearch($event)">
    </app-generic-list>
  `
})
export class ProjectListComponent implements OnInit {
  projects$!: Observable<TProject[]>;
  loading = false;
  
  listConfig: TListConfig<TProject> = {
    columns: [
      { key: 'name', label: 'Project Name', sortable: true },
      { key: 'category', label: 'Category', type: 'custom' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'startDate', label: 'Start Date', type: 'date' }
    ],
    actions: [
      { type: 'edit', label: 'Edit', icon: 'edit' },
      { type: 'delete', label: 'Delete', icon: 'delete' }
    ],
    searchable: true,
    sortable: true,
    paginated: true
  };

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.loading = true;
    this.projectService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.projects$ = of(response.items);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  handleAction(action: TComponentAction<TProject>): void {
    switch (action.type) {
      case 'edit':
        this.editProject(action.data!);
        break;
      case 'delete':
        this.deleteProject(action.data!._id);
        break;
    }
  }

  handleSearch(searchQuery: TSearchQuery<TProject>): void {
    this.loading = true;
    this.projectService.getAll(searchQuery).subscribe({
      next: (response) => {
        if (response.success) {
          this.projects$ = of(response.items);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching projects:', error);
        this.loading = false;
      }
    });
  }

  private editProject(project: TProject): void {
    // Navigate to edit form or open modal
  }

  private deleteProject(id: string): void {
    this.projectService.delete(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadProjects(); // Reload list
        }
      },
      error: (error) => {
        console.error('Error deleting project:', error);
      }
    });
  }
}
```

## 🧪 Testing

### Service Testing

```typescript
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

  it('should get all projects', () => {
    const mockProjects: TProject[] = [
      { _id: '1', name: 'Test Project' } as TProject
    ];

    service.getAll().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.items).toEqual(mockProjects);
    });

    const req = httpMock.expectOne('http://localhost:3000/project');
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      items: mockProjects,
      metadata: { total: 1, page: 1, limit: 10, totalPages: 1, hasMore: false }
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

This API reference provides comprehensive documentation for integrating with the Sokoke Planner backend through the frontend services. For additional details, refer to the [Backend API Documentation](../../sokoke_planner_api/docs/API_REFERENCE.md).
