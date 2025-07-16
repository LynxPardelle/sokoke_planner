# 🔗 API Integration Guide

This guide explains how to integrate with the Sokoke API through the Lynx Bridge proxy, handle authentication, and implement API services in the frontend.

## 🏗️ Architecture Overview

### Communication Flow

```text
Frontend Component
        ↓ (calls service method)
Angular Service
        ↓ (HTTP request with interceptors)
HTTP Interceptors (auth, error, loading)
        ↓ (proxied request)
Lynx Bridge (localhost:3000)
        ↓ (forwarded with auth headers)
Sokoke API (localhost:3001)
        ↓ (database operations)
MongoDB Database
```

## 🔧 Environment Configuration

### Environment Variables

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
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  }
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.sokoke-planner.com',
  // ... same structure with production URLs
};
```

## 🛠️ Base Service Architecture

### BaseApiService

All entity services extend the BaseApiService for consistent API communication:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { environment } from '@environments/environment';

/**
 * Base API service providing common CRUD operations
 * All entity services should extend this class
 */
@Injectable()
export abstract class BaseApiService<T> {
  protected abstract endpoint: string;
  
  protected readonly baseUrl = environment.apiUrl;
  protected readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(protected http: HttpClient) {}

  /**
   * Get all items with optional search query
   */
  getAll(searchQuery?: TSearchQuery<T>): Observable<TSearchResult<T>> {
    const url = `${this.baseUrl}${this.endpoint}`;
    const params = this.buildSearchParams(searchQuery);
    
    return this.http.get<TApiResponse<TSearchResult<T>>>(url, { params })
      .pipe(
        timeout(environment.api.timeout),
        retry(environment.api.retryAttempts),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Get item by ID
   */
  getById(id: string): Observable<T> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    
    return this.http.get<TApiResponse<T>>(url)
      .pipe(
        timeout(environment.api.timeout),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Create new item
   */
  create(item: Partial<T>): Observable<T> {
    const url = `${this.baseUrl}${this.endpoint}`;
    
    return this.http.post<TApiResponse<T>>(url, item, { headers: this.defaultHeaders })
      .pipe(
        timeout(environment.api.timeout),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Update existing item
   */
  update(id: string, item: Partial<T>): Observable<T> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    
    return this.http.put<TApiResponse<T>>(url, item, { headers: this.defaultHeaders })
      .pipe(
        timeout(environment.api.timeout),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Delete item by ID
   */
  delete(id: string): Observable<boolean> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    
    return this.http.delete<TApiResponse<any>>(url)
      .pipe(
        timeout(environment.api.timeout),
        map(response => response.success),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Build HTTP params from search query
   */
  protected buildSearchParams(searchQuery?: TSearchQuery<T>): HttpParams {
    let params = new HttpParams();
    
    if (searchQuery) {
      if (searchQuery.pagination) {
        params = params.set('page', searchQuery.pagination.page.toString());
        params = params.set('limit', searchQuery.pagination.limit.toString());
      }
      
      if (searchQuery.filters) {
        Object.entries(searchQuery.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params = params.set(`filter[${key}]`, value.toString());
          }
        });
      }
      
      if (searchQuery.search) {
        params = params.set('q', searchQuery.search.query);
        if (searchQuery.search.fields?.length) {
          params = params.set('searchFields', searchQuery.search.fields.join(','));
        }
      }
      
      if (searchQuery.sort?.length) {
        const sortString = searchQuery.sort
          .map(s => `${s.field}:${s.order}`)
          .join(',');
        params = params.set('sort', sortString);
      }
    }
    
    return params;
  }

  /**
   * Handle successful API response
   */
  protected handleResponse<R>(response: TApiResponse<R>): R {
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'API request failed');
    }
  }

  /**
   * Handle API errors
   */
  protected handleError(error: any): Observable<never> {
    console.error(`${this.constructor.name} API Error:`, error);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request - please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - please log in again';
          break;
        case 403:
          errorMessage = 'Forbidden - you don\'t have permission';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error - please try again later';
          break;
        default:
          errorMessage = `HTTP ${error.status}: ${error.statusText}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

## 🔐 Authentication Integration

### AuthService Implementation

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = `${environment.apiUrl}${environment.endpoints.auth}`;
  private readonly tokenKey = 'sokoke_auth_token';
  private readonly refreshTokenKey = 'sokoke_refresh_token';
  
  private currentUserSubject = new BehaviorSubject<TUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from stored tokens
   */
  private initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      this.loadCurrentUser();
    } else {
      this.clearTokens();
    }
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<TAuthResponse> {
    const loginData = { email, password };
    
    return this.http.post<TApiResponse<TAuthResponse>>(`${this.authUrl}/login`, loginData)
      .pipe(
        map(response => this.handleAuthResponse(response)),
        tap(authData => this.setAuthData(authData)),
        catchError(error => this.handleAuthError(error))
      );
  }

  /**
   * Register new user
   */
  register(userData: TUserRegistration): Observable<TAuthResponse> {
    return this.http.post<TApiResponse<TAuthResponse>>(`${this.authUrl}/register`, userData)
      .pipe(
        map(response => this.handleAuthResponse(response)),
        tap(authData => this.setAuthData(authData)),
        catchError(error => this.handleAuthError(error))
      );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<TAuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<TApiResponse<TAuthResponse>>(`${this.authUrl}/refresh`, {
      refreshToken
    }).pipe(
      map(response => this.handleAuthResponse(response)),
      tap(authData => this.setAuthData(authData)),
      catchError(error => {
        this.logout();
        return this.handleAuthError(error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    const refreshToken = this.getRefreshToken();
    
    // Call logout endpoint to invalidate tokens on server
    if (refreshToken) {
      this.http.post(`${this.authUrl}/logout`, { refreshToken })
        .subscribe({
          error: (error) => console.warn('Logout API call failed:', error)
        });
    }
    
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiry;
    } catch {
      return true; // If we can't parse the token, consider it expired
    }
  }

  /**
   * Set authentication data
   */
  private setAuthData(authData: TAuthResponse): void {
    localStorage.setItem(this.tokenKey, authData.accessToken);
    localStorage.setItem(this.refreshTokenKey, authData.refreshToken);
    
    this.currentUserSubject.next(authData.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  /**
   * Load current user data
   */
  private loadCurrentUser(): void {
    this.http.get<TApiResponse<TUser>>(`${this.authUrl}/me`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUserSubject.next(response.data);
          }
        },
        error: () => {
          this.logout();
        }
      });
  }

  /**
   * Handle authentication response
   */
  private handleAuthResponse(response: TApiResponse<TAuthResponse>): TAuthResponse {
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Authentication failed');
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): Observable<never> {
    let errorMessage = 'Authentication failed';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (error.status === 422) {
      errorMessage = 'Validation failed - please check your input';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

## 🔄 HTTP Interceptors

### Authentication Interceptor

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '@app/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login/register requests
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req);
    }

    // Add auth token to request
    const authReq = this.addAuthToken(req);
    
    return next.handle(authReq).pipe(
      catchError(error => {
        // Handle 401 errors by attempting token refresh
        if (error.status === 401 && this.authService.getRefreshToken()) {
          return this.handle401Error(req, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private addAuthToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return req;
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Retry original request with new token
        const authReq = this.addAuthToken(req);
        return next.handle(authReq);
      }),
      catchError(error => {
        // Refresh failed, logout user
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') || 
           url.includes('/auth/register') || 
           url.includes('/auth/refresh');
  }
}
```

### Error Interceptor

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GenericComponentsService } from '@app/shared/services/generic-components.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private genericService: GenericComponentsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let message = 'An unexpected error occurred';
    
    switch (error.status) {
      case 0:
        message = 'Network error - please check your connection';
        break;
      case 400:
        message = error.error?.message || 'Bad request';
        break;
      case 401:
        message = 'You are not authorized - please log in';
        break;
      case 403:
        message = 'Access forbidden';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 500:
        message = 'Server error - please try again later';
        break;
      default:
        message = error.error?.message || `HTTP ${error.status}: ${error.statusText}`;
    }
    
    // Show error toast for user feedback
    this.genericService.showError(message, 'Error');
  }
}
```

## 📝 Entity Service Examples

### ProjectService

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@app/core/services/base-api.service';
import { TProject, TProjectCreateDTO, TProjectUpdateDTO } from '@app/planner/types/project.type';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService<TProject> {
  protected override endpoint = '/project';

  /**
   * Get projects by category
   */
  getByCategory(categoryId: string): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      filters: { category: categoryId }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Get projects by status
   */
  getByStatus(status: string): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      filters: { status }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Search projects by name or description
   */
  search(query: string): Observable<TSearchResult<TProject>> {
    const searchQuery: TSearchQuery<TProject> = {
      search: {
        query,
        fields: ['name', 'description'],
        options: { caseSensitive: false }
      }
    };
    return this.getAll(searchQuery);
  }

  /**
   * Get project with populated relationships
   */
  getWithDetails(id: string): Observable<TProject> {
    const url = `${this.baseUrl}${this.endpoint}/${id}?populate=category,tasks,features`;
    
    return this.http.get<TApiResponse<TProject>>(url)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }
}
```

### UserService

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@app/core/services/base-api.service';
import { TUser } from '@app/user/types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService<TUser> {
  protected override endpoint = '/user';

  /**
   * Update user profile
   */
  updateProfile(userId: string, profileData: Partial<TUser>): Observable<TUser> {
    const url = `${this.baseUrl}${this.endpoint}/${userId}/profile`;
    
    return this.http.put<TApiResponse<TUser>>(url, profileData)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Change user password
   */
  changePassword(userId: string, passwordData: TPasswordChange): Observable<boolean> {
    const url = `${this.baseUrl}${this.endpoint}/${userId}/password`;
    
    return this.http.put<TApiResponse<any>>(url, passwordData)
      .pipe(
        map(response => response.success),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Upload user avatar
   */
  uploadAvatar(userId: string, file: File): Observable<TUser> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const url = `${this.baseUrl}${this.endpoint}/${userId}/avatar`;
    
    return this.http.post<TApiResponse<TUser>>(url, formData)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }
}
```

## 🔍 Type Definitions

### API Response Types

```typescript
// Base API response structure
export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  metadata?: any;
};

// Search query structure
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

// Search result structure
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

// Authentication types
export type TAuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: TUser;
  expiresIn: number;
};

export type TUserRegistration = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

export type TPasswordChange = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
```

## 🧪 Testing API Services

### Service Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { environment } from '@environments/environment';

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

  it('should get all projects', () => {
    const mockProjects = { items: [], metadata: {} } as TSearchResult<TProject>;

    service.getAll().subscribe(result => {
      expect(result).toEqual(mockProjects);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/project`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockProjects, message: 'Success' });
  });

  it('should create a project', () => {
    const newProject = { name: 'Test Project' } as Partial<TProject>;
    const createdProject = { _id: '123', ...newProject } as TProject;

    service.create(newProject).subscribe(result => {
      expect(result).toEqual(createdProject);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/project`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProject);
    req.flush({ success: true, data: createdProject, message: 'Created' });
  });
});
```

## 🚀 Best Practices

### Do's

- ✅ Use the BaseApiService for all entity services
- ✅ Handle errors consistently across services
- ✅ Implement proper TypeScript types for all API calls
- ✅ Use HTTP interceptors for cross-cutting concerns
- ✅ Cache frequently accessed data when appropriate
- ✅ Implement retry logic for network failures

### Don'ts

- ❌ Make direct HTTP calls without the base service
- ❌ Ignore error handling in API services
- ❌ Store sensitive data in local storage
- ❌ Bypass the authentication system
- ❌ Make API calls without proper loading states
- ❌ Forget to unsubscribe from API observables

### Performance Tips

1. **Use HTTP caching** for read-only data
2. **Implement pagination** for large datasets
3. **Debounce search queries** to reduce API calls
4. **Use optimistic updates** for better UX
5. **Implement offline support** where appropriate

---

**Related Guides**: 
- [Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [Error Handling Guide](./ERROR_HANDLING_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)
