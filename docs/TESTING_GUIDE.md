# 🧪 Testing Guide

Comprehensive testing guide for the Sokoke Planner frontend project, covering unit tests, integration tests, and testing best practices.

## 🎯 Overview

Our testing strategy ensures:

- **Code reliability** through comprehensive test coverage
- **Regression prevention** with automated testing
- **Documentation** of component behavior
- **Confidence** in deployments and refactoring
- **Quality assurance** through systematic testing

## 📊 Testing Strategy

### Testing Pyramid

```text
    🔺 E2E Tests (10%)
     ├─ User workflows
     └─ Critical paths

   🔺 Integration Tests (20%)
    ├─ Component + Service
    ├─ API communication
    └─ State management

  🔺 Unit Tests (70%)
   ├─ Components
   ├─ Services
   ├─ Pipes
   └─ Utilities
```

### Coverage Targets

| Type | Target | Current | Priority |
|------|--------|---------|----------|
| **Unit Tests** | 90%+ | 89% | High |
| **Integration Tests** | 80%+ | 75% | Medium |
| **E2E Tests** | Key flows | Planned | High |
| **Branch Coverage** | 85%+ | 82% | Medium |

## 🔧 Test Setup

### Testing Framework

We use the **Angular Testing Utilities** with:

- **Jasmine** for test structure and assertions
- **Karma** for test runner in development
- **ChromeHeadless** for CI/CD
- **Angular Testing Library** for component testing

### Configuration

#### karma.conf.js

```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-web-security']
      }
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    }
  });
};
```

#### angular.json (test configuration)

```json
{
  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "main": "src/test.ts",
      "polyfills": "src/polyfills.ts",
      "tsConfig": "tsconfig.spec.json",
      "karmaConfig": "karma.conf.js",
      "codeCoverage": true,
      "sourceMap": false,
      "browsers": "ChromeHeadless"
    }
  }
}
```

## 🧪 Unit Testing

### Component Testing

#### Basic Component Test

```typescript
// user-profile.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { UserService } from '../services/user.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', 
      ['getUser', 'updateUser']);

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should load user data on init', () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
      userService.getUser.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(userService.getUser).toHaveBeenCalled();
      expect(component.user).toEqual(mockUser);
    });

    it('should handle loading state', () => {
      userService.getUser.and.returnValue(of(mockUser).pipe(delay(100)));

      component.ngOnInit();

      expect(component.loading).toBe(true);
      
      tick(100);
      
      expect(component.loading).toBe(false);
    });
  });

  describe('User Interactions', () => {
    it('should update user when form is submitted', () => {
      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      userService.updateUser.and.returnValue(of(updatedUser));

      component.user = mockUser;
      component.onSubmit(updatedUser);

      expect(userService.updateUser).toHaveBeenCalledWith(updatedUser);
      expect(component.user).toEqual(updatedUser);
    });

    it('should handle update errors gracefully', () => {
      const error = new Error('Update failed');
      userService.updateUser.and.returnValue(throwError(error));
      spyOn(component, 'handleError');

      component.onSubmit(mockUser);

      expect(component.handleError).toHaveBeenCalledWith(error);
    });
  });

  describe('DOM Interactions', () => {
    it('should display user name in template', () => {
      component.user = mockUser;
      fixture.detectChanges();

      const nameElement = fixture.debugElement.query(By.css('.user-name'));
      expect(nameElement.nativeElement.textContent).toContain('John Doe');
    });

    it('should emit save event when save button clicked', () => {
      spyOn(component.userSaved, 'emit');
      
      const saveButton = fixture.debugElement.query(By.css('.save-button'));
      saveButton.nativeElement.click();

      expect(component.userSaved.emit).toHaveBeenCalled();
    });
  });
});
```

#### Generic Component Testing

```typescript
// base-modal.component.spec.ts
import { BaseModalComponent } from './base-modal.component';

describe('BaseModalComponent', () => {
  let component: BaseModalComponent<any>;
  let fixture: ComponentFixture<BaseModalComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseModalComponent],
      imports: [NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseModalComponent);
    component = fixture.componentInstance;
  });

  describe('Modal Behavior', () => {
    it('should open modal when show() is called', () => {
      component.show();
      
      expect(component.isVisible).toBe(true);
      expect(component.opened.emit).toHaveBeenCalled();
    });

    it('should close modal when hide() is called', () => {
      component.isVisible = true;
      component.hide();
      
      expect(component.isVisible).toBe(false);
      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should close modal when backdrop is clicked', () => {
      spyOn(component, 'hide');
      component.isVisible = true;
      fixture.detectChanges();

      const backdrop = fixture.debugElement.query(By.css('.modal-backdrop'));
      backdrop.nativeElement.click();

      expect(component.hide).toHaveBeenCalled();
    });

    it('should not close modal when content is clicked', () => {
      spyOn(component, 'hide');
      component.isVisible = true;
      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.modal-content'));
      content.nativeElement.click();

      expect(component.hide).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should set proper ARIA attributes', () => {
      component.isVisible = true;
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('.modal'));
      expect(modal.nativeElement.getAttribute('role')).toBe('dialog');
      expect(modal.nativeElement.getAttribute('aria-modal')).toBe('true');
    });

    it('should focus first focusable element when opened', () => {
      const focusableElement = fixture.debugElement.query(By.css('button'));
      spyOn(focusableElement.nativeElement, 'focus');

      component.show();
      fixture.detectChanges();

      expect(focusableElement.nativeElement.focus).toHaveBeenCalled();
    });
  });
});
```

### Service Testing

#### HTTP Service Testing

```typescript
// api.service.spec.ts
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GET Requests', () => {
    it('should fetch users successfully', () => {
      const mockUsers = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ];

      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${baseUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle HTTP errors gracefully', () => {
      service.getUsers().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/users`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('POST Requests', () => {
    it('should create user with correct data', () => {
      const newUser = { name: 'New User', email: 'new@example.com' };
      const createdUser = { id: 3, ...newUser };

      service.createUser(newUser).subscribe(user => {
        expect(user).toEqual(createdUser);
      });

      const req = httpMock.expectOne(`${baseUrl}/users`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(createdUser);
    });
  });

  describe('Authentication', () => {
    it('should include auth token in requests', () => {
      spyOn(service, 'getAuthToken').and.returnValue('mock-token');

      service.getUsers().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/users`);
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      req.flush([]);
    });
  });
});
```

#### State Management Testing

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Authentication State', () => {
    it('should start with unauthenticated state', () => {
      expect(service.isAuthenticated()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should update state after successful login', async () => {
      const loginData = { email: 'test@example.com', password: 'password' };
      const mockResponse = {
        user: { id: 1, email: 'test@example.com' },
        token: 'mock-token'
      };

      const loginPromise = service.login(loginData).toPromise();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      const result = await loginPromise;

      expect(result.user).toEqual(mockResponse.user);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.getCurrentUser()).toEqual(mockResponse.user);
    });

    it('should clear state on logout', () => {
      // Set authenticated state
      service['setAuthenticatedUser'](mockUser, 'mock-token');
      
      service.logout();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('Token Management', () => {
    it('should store token securely', () => {
      spyOn(localStorage, 'setItem');
      
      service.login(loginData).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-token');
    });

    it('should remove token on logout', () => {
      spyOn(localStorage, 'removeItem');
      
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });
});
```

### Pipe Testing

```typescript
// currency-format.pipe.spec.ts
describe('CurrencyFormatPipe', () => {
  let pipe: CurrencyFormatPipe;

  beforeEach(() => {
    pipe = new CurrencyFormatPipe();
  });

  it('should create pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number as currency', () => {
    expect(pipe.transform(123.45)).toBe('$123.45');
  });

  it('should handle zero values', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });

  it('should handle null values', () => {
    expect(pipe.transform(null)).toBe('$0.00');
  });

  it('should format large numbers correctly', () => {
    expect(pipe.transform(1234567.89)).toBe('$1,234,567.89');
  });

  it('should support different currencies', () => {
    expect(pipe.transform(123.45, 'EUR')).toBe('€123.45');
  });
});
```

## 🔗 Integration Testing

### Component + Service Integration

```typescript
// user-list.integration.spec.ts
describe('UserList Integration', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [HttpClientTestingModule],
      providers: [UserService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should load and display users from API', () => {
    const mockUsers = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('/api/users');
    req.flush(mockUsers);

    fixture.detectChanges();

    const userElements = fixture.debugElement.queryAll(By.css('.user-item'));
    expect(userElements.length).toBe(2);
    expect(userElements[0].nativeElement.textContent).toContain('John');
    expect(userElements[1].nativeElement.textContent).toContain('Jane');
  });

  it('should handle API errors and show error message', () => {
    component.ngOnInit();

    const req = httpMock.expectOne('/api/users');
    req.error(new ErrorEvent('Network error'));

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeTruthy();
    expect(component.error).toBeTruthy();
  });
});
```

### Router Testing

```typescript
// navigation.integration.spec.ts
describe('Navigation Integration', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, UserListComponent, UserDetailComponent],
      imports: [RouterTestingModule.withRoutes([
        { path: 'users', component: UserListComponent },
        { path: 'users/:id', component: UserDetailComponent },
        { path: '', redirectTo: '/users', pathMatch: 'full' }
      ])]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to users list', fakeAsync(() => {
    router.navigate(['/users']);
    tick();

    expect(location.path()).toBe('/users');
  }));

  it('should navigate to user detail', fakeAsync(() => {
    router.navigate(['/users', 1]);
    tick();

    expect(location.path()).toBe('/users/1');
  }));
});
```

## 🤖 Test Automation

### Running Tests

```bash
# Run all tests
ng test

# Run tests in watch mode (default)
ng test --watch

# Run tests once (CI mode)
ng test --watch=false --browsers=ChromeHeadless

# Run tests with coverage
ng test --code-coverage --watch=false

# Run specific test file
ng test --include="**/user.service.spec.ts"

# Run tests matching pattern
ng test --grep="should handle authentication"
```

### Coverage Reports

```bash
# Generate coverage report
ng test --code-coverage --watch=false

# Open coverage report
# Windows
start coverage/index.html

# View coverage summary
ng test --code-coverage --watch=false | grep -A 20 "Coverage summary"
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: ng lint
      
      - name: Run tests
        run: ng test --watch=false --browsers=ChromeHeadless --code-coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: coverage/lcov.info
```

## 📋 Testing Best Practices

### Test Organization

#### Folder Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── user-list/
│   │   │   ├── user-list.component.ts
│   │   │   ├── user-list.component.spec.ts
│   │   │   └── user-list.component.html
│   │   └── shared/
│   │       ├── modal/
│   │       │   ├── modal.component.ts
│   │       │   ├── modal.component.spec.ts
│   │       │   └── modal.integration.spec.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── api.service.spec.ts
│   │   ├── auth.service.ts
│   │   └── auth.service.spec.ts
│   └── testing/
│       ├── mocks/
│       │   ├── user.mock.ts
│       │   └── api-response.mock.ts
│       └── helpers/
│           ├── test-utils.ts
│           └── custom-matchers.ts
```

#### Test File Naming

| Type | Pattern | Example |
|------|---------|---------|
| **Unit Test** | `*.spec.ts` | `user.service.spec.ts` |
| **Integration Test** | `*.integration.spec.ts` | `user-form.integration.spec.ts` |
| **E2E Test** | `*.e2e-spec.ts` | `login-flow.e2e-spec.ts` |

### Test Structure

#### AAA Pattern (Arrange, Act, Assert)

```typescript
it('should calculate total price correctly', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];
  const service = new CalculationService();

  // Act
  const total = service.calculateTotal(items);

  // Assert
  expect(total).toBe(35);
});
```

#### Given-When-Then Pattern

```typescript
describe('User Authentication', () => {
  describe('Given user has valid credentials', () => {
    beforeEach(() => {
      // Setup valid user credentials
    });

    describe('When user submits login form', () => {
      it('Then should authenticate successfully', () => {
        // Test implementation
      });

      it('Then should redirect to dashboard', () => {
        // Test implementation
      });
    });
  });

  describe('Given user has invalid credentials', () => {
    beforeEach(() => {
      // Setup invalid credentials
    });

    describe('When user submits login form', () => {
      it('Then should show error message', () => {
        // Test implementation
      });

      it('Then should not authenticate', () => {
        // Test implementation
      });
    });
  });
});
```

### Mock Strategies

#### Service Mocking

```typescript
// Create mock service
const mockUserService = {
  getUsers: jasmine.createSpy('getUsers').and.returnValue(of(mockUsers)),
  createUser: jasmine.createSpy('createUser').and.returnValue(of(newUser)),
  updateUser: jasmine.createSpy('updateUser').and.returnValue(of(updatedUser)),
  deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of({}))
};

// Use in test setup
TestBed.configureTestingModule({
  providers: [
    { provide: UserService, useValue: mockUserService }
  ]
});
```

#### HTTP Mocking

```typescript
// Mock HTTP responses
const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

beforeEach(() => {
  mockHttpClient.get.and.returnValue(of(mockData));
  mockHttpClient.post.and.returnValue(of(createdData));
});
```

#### Component Mocking

```typescript
// Mock child component
@Component({
  selector: 'app-user-detail',
  template: '<div>Mock User Detail</div>'
})
class MockUserDetailComponent {
  @Input() user: User;
  @Output() userUpdated = new EventEmitter<User>();
}

// Use in test module
TestBed.configureTestingModule({
  declarations: [ParentComponent, MockUserDetailComponent]
});
```

### Data Management

#### Test Data Factories

```typescript
// user-mock-factory.ts
export class UserMockFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: new Date('2023-01-01'),
      ...overrides
    };
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, index) => 
      this.create({ 
        id: index + 1, 
        name: `User ${index + 1}`,
        ...overrides 
      })
    );
  }

  static createAdmin(overrides: Partial<User> = {}): User {
    return this.create({ 
      role: 'admin', 
      ...overrides 
    });
  }
}
```

#### Test Fixtures

```typescript
// test-fixtures.ts
export const TEST_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

export const TEST_API_RESPONSES = {
  users: {
    success: { data: TEST_USERS, status: 'success' },
    error: { error: 'Not found', status: 'error' }
  }
};
```

### Async Testing

#### Observable Testing

```typescript
// Test observable streams
it('should handle observable data', fakeAsync(() => {
  let result: User[];
  
  service.getUsers().subscribe(users => {
    result = users;
  });

  tick(); // Advance time

  expect(result).toEqual(mockUsers);
}));

// Test with marble testing
it('should combine observables correctly', () => {
  const source1$ = cold('a-b-c|', { a: 1, b: 2, c: 3 });
  const source2$ = cold('x-y-z|', { x: 'a', y: 'b', z: 'c' });
  const expected$ = cold('(ax)-(by)-(cz)|');

  const result$ = combineLatest([source1$, source2$]);

  expect(result$).toBeObservable(expected$);
});
```

#### Promise Testing

```typescript
// Test promises
it('should handle async operations', async () => {
  spyOn(service, 'saveUser').and.returnValue(Promise.resolve(savedUser));

  const result = await component.saveUser(userData);

  expect(result).toEqual(savedUser);
  expect(service.saveUser).toHaveBeenCalledWith(userData);
});
```

## 🚀 Advanced Testing

### Custom Test Utilities

```typescript
// test-utils.ts
export class TestUtils {
  static createComponent<T>(
    componentType: Type<T>,
    options: {
      declarations?: any[];
      imports?: any[];
      providers?: any[];
    } = {}
  ): Promise<ComponentFixture<T>> {
    return TestBed.configureTestingModule({
      declarations: [componentType, ...(options.declarations || [])],
      imports: options.imports || [],
      providers: options.providers || []
    })
    .compileComponents()
    .then(() => TestBed.createComponent(componentType));
  }

  static expectElementToContainText(
    fixture: ComponentFixture<any>,
    selector: string,
    expectedText: string
  ): void {
    const element = fixture.debugElement.query(By.css(selector));
    expect(element?.nativeElement.textContent.trim()).toContain(expectedText);
  }

  static clickElement(
    fixture: ComponentFixture<any>,
    selector: string
  ): void {
    const element = fixture.debugElement.query(By.css(selector));
    element.nativeElement.click();
    fixture.detectChanges();
  }
}
```

### Custom Matchers

```typescript
// custom-matchers.ts
beforeEach(() => {
  jasmine.addMatchers({
    toHaveClass: () => ({
      compare: (actual: HTMLElement, expected: string) => {
        const pass = actual.classList.contains(expected);
        return {
          pass,
          message: `Expected element to ${pass ? 'not ' : ''}have class "${expected}"`
        };
      }
    }),

    toBeVisible: () => ({
      compare: (actual: HTMLElement) => {
        const style = window.getComputedStyle(actual);
        const pass = style.display !== 'none' && style.visibility !== 'hidden';
        return {
          pass,
          message: `Expected element to ${pass ? 'not ' : ''}be visible`
        };
      }
    })
  });
});

// Usage in tests
expect(buttonElement).toHaveClass('btn-primary');
expect(modalElement).toBeVisible();
```

### Performance Testing

```typescript
// performance.spec.ts
describe('Component Performance', () => {
  it('should render large lists efficiently', () => {
    const largeDataSet = UserMockFactory.createMany(1000);
    
    const startTime = performance.now();
    
    component.users = largeDataSet;
    fixture.detectChanges();
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
  });

  it('should not cause memory leaks', () => {
    const initialHeapSize = (performance as any).memory?.usedJSHeapSize;
    
    // Perform operations that might cause leaks
    for (let i = 0; i < 100; i++) {
      component.ngOnInit();
      component.ngOnDestroy();
    }
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    const finalHeapSize = (performance as any).memory?.usedJSHeapSize;
    const heapGrowth = finalHeapSize - initialHeapSize;
    
    expect(heapGrowth).toBeLessThan(1024 * 1024); // Less than 1MB growth
  });
});
```

## 📊 Coverage Analysis

### Understanding Coverage Reports

#### Coverage Types

| Type | Description | Target |
|------|-------------|--------|
| **Statement Coverage** | % of statements executed | 90%+ |
| **Branch Coverage** | % of branches taken | 85%+ |
| **Function Coverage** | % of functions called | 95%+ |
| **Line Coverage** | % of lines executed | 90%+ |

#### Coverage Report Interpretation

```text
Coverage Summary:
  Statements   : 89.5% (179/200)
  Branches     : 82.3% (42/51)
  Functions    : 94.1% (32/34)
  Lines        : 88.9% (160/180)
```

#### Improving Coverage

1. **Identify uncovered code:**

   ```bash
   ng test --code-coverage --watch=false
   open coverage/index.html
   ```

1. **Focus on critical paths** first
1. **Write tests for error scenarios**
1. **Test edge cases and boundary conditions**
1. **Avoid testing trivial getters/setters**

### Coverage Exclusions

```typescript
// Exclude from coverage
/* istanbul ignore next */
private debugMethod(): void {
  console.log('Debug information');
}

// Exclude entire block
/* istanbul ignore if */
if (environment.production) {
  // Production-only code
}
```

## 🔍 Debugging Tests

### Common Issues

#### Test Setup Problems

```typescript
// Problem: Component dependencies not provided
// Solution: Provide all required dependencies

TestBed.configureTestingModule({
  declarations: [ComponentUnderTest],
  providers: [
    UserService,
    { provide: Router, useValue: mockRouter },
    { provide: ActivatedRoute, useValue: mockActivatedRoute }
  ]
});
```

#### Async Issues

```typescript
// Problem: Test finishes before async operation
// Solution: Use fakeAsync/tick or async/await

// Using fakeAsync
it('should handle async operation', fakeAsync(() => {
  component.loadData();
  tick(); // Advance time
  expect(component.data).toBeDefined();
}));

// Using async/await
it('should handle async operation', async () => {
  await component.loadData();
  expect(component.data).toBeDefined();
});
```

#### Change Detection Issues

```typescript
// Problem: DOM not updated after property changes
// Solution: Call detectChanges()

component.userName = 'New Name';
fixture.detectChanges(); // Trigger change detection

const nameElement = fixture.debugElement.query(By.css('.user-name'));
expect(nameElement.nativeElement.textContent).toContain('New Name');
```

### Debugging Techniques

#### Console Debugging

```typescript
it('should debug test data', () => {
  console.log('Component state:', component);
  console.log('Fixture debug element:', fixture.debugElement);
  console.log('Native element:', fixture.nativeElement.innerHTML);
  
  // Add breakpoint for inspection
  debugger;
  
  expect(component.isValid).toBe(true);
});
```

#### Test Isolation

```typescript
// Run single test
it.only('should run only this test', () => {
  // Test implementation
});

// Skip test temporarily
xit('should skip this test', () => {
  // Test implementation
});

// Focus on test suite
describe.only('Focused test suite', () => {
  // Tests
});
```

## 📚 Testing Resources

### Internal Resources

- [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md)
- [Generic Components Guide](./GENERIC_COMPONENTS_GUIDE.md)

### External Resources

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)

### Tools and Extensions

- **VS Code Extensions:**
  - Angular Language Service
  - Jest Test Explorer
  - Coverage Gutters

- **Testing Libraries:**
  - `@angular/testing`
  - `jasmine`
  - `karma`
  - `@testing-library/angular`

---

**Questions?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) or ask in team chat!
