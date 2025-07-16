# 🔧 Troubleshooting Guide

Common issues and solutions for Sokoke Planner frontend development.

## 🚨 Development Environment Issues

### Node.js and npm Problems

#### Issue: "node: command not found"

**Solution:**

```bash
# Install Node.js from official website
# https://nodejs.org/en/download/

# Or use Node Version Manager (recommended)
# Windows:
# Download and install nvm-windows from GitHub

# macOS/Linux:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

#### Issue: "npm install" fails with permission errors

**Solution:**

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or reinstall npm without sudo
npm install -g npm@latest --unsafe-perm

# Windows: Run as Administrator
```

#### Issue: Dependencies out of sync

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Verify dependencies
npm audit
npm audit fix
```

### Angular CLI Issues

#### Issue: "ng: command not found"

**Solution:**

```bash
# Install Angular CLI globally
npm install -g @angular/cli@latest

# Verify installation
ng version

# If still not working, check PATH
echo $PATH  # macOS/Linux
echo %PATH% # Windows
```

#### Issue: Angular version mismatch

**Solution:**

```bash
# Check current version
ng version

# Update Angular CLI
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest

# Update project dependencies
ng update @angular/core @angular/cli
```

## 🖥️ Development Server Issues

### Port and Network Problems

#### Issue: "Port 4200 is already in use"

**Solution:**

```bash
# Use different port
ng serve --port 4201

# Or kill existing process
# macOS/Linux:
lsof -ti:4200 | xargs kill -9

# Windows:
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

#### Issue: "Cannot connect to localhost:4200"

**Solutions:**

1. **Check firewall settings**
2. **Try different host:**

```bash
ng serve --host 0.0.0.0 --port 4200
```

3. **Clear browser cache and try incognito mode**
4. **Check for proxy settings**

#### Issue: Hot reload not working

**Solution:**

```bash
# Restart with poll option
ng serve --poll=2000

# Check file system watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Lynx Bridge Connection Issues

#### Issue: API calls fail with CORS errors

**Solution:**

1. **Ensure Lynx Bridge is running:**

```bash
cd ../lynx-bridge
npm start
```

2. **Check proxy configuration in `angular.json`:**

```json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "proxyConfig": "proxy.conf.json"
    }
  }
}
```

3. **Verify proxy.conf.json:**

```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

#### Issue: "503 Service Unavailable" from Lynx Bridge

**Solutions:**

1. **Check if Sokoke API is running**
2. **Verify environment URLs**
3. **Check network connectivity**

```bash
# Test API directly
curl http://localhost:3001/health

# Test Lynx Bridge
curl http://localhost:3000/health
```

## 🎨 Styling and UI Issues

### Generic Components Problems

#### Issue: Generic components not displaying correctly

**Solutions:**

1. **Check imports:**

```typescript
import { GenericButtonComponent } from '@app/shared/components';

@Component({
  imports: [GenericButtonComponent]
})
```

2. **Verify component is exported in index.ts:**

```typescript
// src/app/shared/components/index.ts
export * from './generic-button/generic-button.component';
```

3. **Check for CSS conflicts:**

```scss
// Use component-specific selectors
.my-component {
  generic-button {
    // Custom styles
  }
}
```

#### Issue: NgxAngora styles not applying

**Solutions:**

1. **Check if component extends BaseGenericComponent:**

```typescript
export class MyComponent extends BaseGenericComponent {
  constructor() {
    super();
  }
}
```

2. **Verify afterNextRender is called:**

```typescript
ngOnInit() {
  afterNextRender(() => {
    this.applyComponentAngoraClasses();
  });
}
```

3. **Check browser console for errors**

#### Issue: Responsive design not working

**Solutions:**

1. **Check viewport meta tag in index.html:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

2. **Verify breakpoint variables:**

```scss
@media (max-width: 768px) {
  // Mobile styles
}
```

3. **Test with browser dev tools**

### CSS and SCSS Issues

#### Issue: Styles not applying

**Solutions:**

1. **Check component style encapsulation:**

```typescript
@Component({
  encapsulation: ViewEncapsulation.None // If needed
})
```

2. **Use :host selector for component root:**

```scss
:host {
  display: block;
  // Component styles
}
```

3. **Check for typos in class names**
4. **Verify SCSS syntax**

#### Issue: CSS custom properties not working

**Solution:**

```scss
// Define in global styles or component
:root {
  --color-primary: #CD9965;
}

// Use with fallback
.element {
  color: var(--color-primary, #CD9965);
}
```

## 🧪 Testing Issues

### Jasmine/Karma Problems

#### Issue: Tests failing with "Cannot read property 'X' of undefined"

**Solutions:**

1. **Mock dependencies properly:**

```typescript
beforeEach(() => {
  const mockService = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);
  
  TestBed.configureTestingModule({
    providers: [
      { provide: ServiceName, useValue: mockService }
    ]
  });
});
```

2. **Initialize component properties:**

```typescript
beforeEach(() => {
  fixture = TestBed.createComponent(ComponentName);
  component = fixture.componentInstance;
  
  // Set required inputs
  component.requiredInput = 'test value';
  
  fixture.detectChanges();
});
```

#### Issue: "No provider for HttpClient"

**Solution:**

```typescript
import { HttpClientTestingModule } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  });
});
```

#### Issue: Generic component tests failing

**Solution:**

```typescript
import { NO_ERRORS_SCHEMA } from '@angular/core';

beforeEach(() => {
  TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA] // For unknown elements
  });
});
```

### Test Coverage Issues

#### Issue: Coverage reports not generating

**Solution:**

```bash
# Generate coverage report
ng test --code-coverage --watch=false --browsers=ChromeHeadless

# Check coverage directory
ls coverage/lcov-report/
```

#### Issue: Low test coverage warnings

**Solutions:**

1. **Add tests for uncovered lines**
2. **Update karma.conf.js thresholds:**

```javascript
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

## 🔐 Authentication Issues

### JWT Token Problems

#### Issue: "Token expired" errors

**Solutions:**

1. **Check token refresh logic:**

```typescript
// Verify refresh token interceptor
private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
  return this.authService.refreshToken().pipe(
    switchMap(() => next.handle(this.addToken(req)))
  );
}
```

2. **Clear invalid tokens:**

```bash
# Clear browser localStorage
localStorage.clear();
```

#### Issue: Authentication state not persisting

**Solution:**

```typescript
// Check token initialization
constructor() {
  const token = localStorage.getItem('auth_token');
  if (token && !this.isTokenExpired(token)) {
    this.setAuthenticatedState(true);
  }
}
```

#### Issue: Route guards not working

**Solution:**

```typescript
// Verify guard implementation
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true;
  }
  this.router.navigate(['/login']);
  return false;
}
```

## 📱 SSR and Production Issues

### Server-Side Rendering Problems

#### Issue: "document is not defined" errors

**Solution:**

```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

someMethod() {
  if (isPlatformBrowser(this.platformId)) {
    // Browser-only code
    document.getElementById('element');
  }
}
```

#### Issue: "window is not defined" errors

**Solution:**

```typescript
// Use afterNextRender for DOM operations
import { afterNextRender } from '@angular/core';

ngOnInit() {
  afterNextRender(() => {
    // Browser-only operations
    window.scrollTo(0, 0);
  });
}
```

### Build and Production Issues

#### Issue: Build fails with "out of memory" error

**Solution:**

```bash
# Increase Node.js memory limit
node --max-old-space-size=8192 node_modules/@angular/cli/bin/ng build

# Or add to package.json
"build": "node --max-old-space-size=8192 node_modules/@angular/cli/bin/ng build"
```

#### Issue: Production build has large bundle size

**Solutions:**

1. **Analyze bundle:**

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

2. **Enable lazy loading:**

```typescript
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
  }
];
```

3. **Tree shake unused code:**

```typescript
// Import only what you need
import { map } from 'rxjs/operators';
// Instead of: import * as rxjs from 'rxjs';
```

## 🔍 Debugging Tips

### Browser DevTools

1. **Use Angular DevTools extension**
2. **Check Network tab for API calls**
3. **Use Console for error messages**
4. **Inspect Elements for CSS issues**

### VS Code Debugging

1. **Set up launch.json:**

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome",
  "url": "http://localhost:4200",
  "webRoot": "${workspaceFolder}",
  "sourceMaps": true
}
```

2. **Use breakpoints in TypeScript files**
3. **Debug tests in VS Code**

### Common Console Commands

```javascript
// Check Angular version
ng.version

// Get component instance
ng.getComponent($0)

// Check injected services
ng.getInjector($0)

// Trigger change detection
ng.applyChanges($0)
```

## 📞 Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing issues in GitHub**
3. **Read error messages carefully**
4. **Try to reproduce the issue**
5. **Check browser console for errors**

### When Asking for Help

Include:

- **Exact error message**
- **Steps to reproduce**
- **Environment details (OS, Node.js version, Angular version)**
- **Screenshots if relevant**
- **Code snippets (minimal reproduction)**

### Team Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **Team Chat**: For quick questions and discussions
- **Code Reviews**: For feedback on implementations
- **Documentation**: Update this guide with new solutions

## 📚 Additional Resources

### Official Documentation

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

### Community Resources

- [Angular Stack Overflow](https://stackoverflow.com/questions/tagged/angular)
- [Angular Reddit](https://www.reddit.com/r/Angular2/)
- [Angular GitHub Discussions](https://github.com/angular/angular/discussions)

---

**Found a solution not listed here?** Please update this guide to help future developers!
