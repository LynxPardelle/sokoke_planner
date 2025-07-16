# 📦 Generic Components Guide

This guide explains how to use and contribute to the Sokoke Planner generic component library.

## 🎯 What Are Generic Components?

Generic components are reusable UI building blocks that provide consistent design, behavior, and API across the entire application. They eliminate code duplication and ensure a unified user experience.

## 🏗️ Architecture Overview

### Component Hierarchy

```text
BaseGenericComponent (abstract)
├── GenericButton
├── GenericModal
├── GenericLoading
├── GenericError
├── GenericToast
├── GenericList (planned)
├── GenericForm (planned)
└── ... more components
```

### Key Features

- **NgxAngora Integration**: Enhanced styling with Sokoke color palette
- **Type Safety**: Full TypeScript support with generic types
- **Responsive Design**: Automatic adaptation to screen sizes
- **SSR Compatible**: Works with server-side rendering
- **Accessibility**: ARIA attributes and keyboard navigation
- **Consistent API**: Uniform configuration patterns

## 🚀 Getting Started

### Installation

Generic components are already integrated into the project. Import them as needed:

```typescript
import { 
  GenericButtonComponent,
  GenericModalComponent,
  GenericLoadingComponent,
  GenericErrorComponent 
} from '@app/shared/components';

@Component({
  standalone: true,
  imports: [
    GenericButtonComponent,
    GenericModalComponent,
    // ... other components
  ],
  // ...
})
export class MyComponent {}
```

### Basic Usage

```html
<!-- Simple button -->
<generic-button 
  text="Save" 
  (clicked)="save()">
</generic-button>

<!-- Loading indicator -->
<generic-loading 
  *ngIf="isLoading" 
  message="Saving...">
</generic-loading>

<!-- Error display -->
<generic-error 
  *ngIf="error" 
  [message]="error" 
  (retry)="tryAgain()">
</generic-error>
```

## 📚 Available Components

### 1. GenericButtonComponent

A comprehensive button component with multiple variants and features.

#### Basic Usage

```html
<generic-button
  text="Click Me"
  variant="primary"
  size="medium"
  (clicked)="handleClick()">
</generic-button>
```

#### Configuration Options

```typescript
interface TButtonConfig {
  // Appearance
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
  type?: 'solid' | 'outline' | 'ghost' | 'link' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Icon support
  icon?: string;              // Font Awesome class
  iconPosition?: 'left' | 'right';
  
  // States
  loading?: boolean;          // Shows spinner
  disabled?: boolean;         // Disables interaction
  fullWidth?: boolean;        // Takes full container width
  
  // Styling
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  
  // Behavior
  animate?: boolean;          // Hover animations
  pulse?: boolean;           // Pulsing effect
  debounceTime?: number;     // Click debouncing (ms)
}
```

#### Advanced Examples

```html
<!-- Loading button -->
<generic-button
  text="Saving..."
  variant="primary"
  [loading]="isSaving"
  [disabled]="isSaving"
  icon="fas fa-save"
  iconPosition="left"
  (clicked)="save()">
</generic-button>

<!-- Icon-only button -->
<generic-button
  variant="secondary"
  icon="fas fa-edit"
  size="sm"
  [ariaLabel]="'Edit item'"
  (clicked)="edit()">
</generic-button>

<!-- Full-width button -->
<generic-button
  text="Sign Up"
  variant="primary"
  size="lg"
  [fullWidth]="true"
  rounded="lg"
  animate="true"
  (clicked)="signup()">
</generic-button>
```

### 2. GenericModalComponent

Feature-rich modal component with customizable content and actions.

#### Basic Usage

```html
<generic-modal
  [visible]="showModal"
  title="Confirmation"
  (close)="closeModal()">
  
  <div modal-body>
    <p>Are you sure you want to delete this item?</p>
  </div>
  
  <div modal-footer>
    <generic-button 
      text="Cancel" 
      variant="secondary"
      (clicked)="closeModal()">
    </generic-button>
    <generic-button 
      text="Delete" 
      variant="danger"
      (clicked)="confirmDelete()">
    </generic-button>
  </div>
</generic-modal>
```

#### Configuration Options

```typescript
interface TModalConfig {
  // Size and positioning
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  
  // Behavior
  backdrop?: boolean;         // Click outside to close
  keyboard?: boolean;         // ESC key to close
  fade?: boolean;            // Fade animation
  
  // Built-in actions
  showCloseButton?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  
  // Button customization
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: TButtonVariant;
  cancelVariant?: TButtonVariant;
}
```

#### Advanced Examples

```html
<!-- Confirmation dialog -->
<generic-modal
  [visible]="showConfirmDialog"
  title="Delete Project"
  size="md"
  [centered]="true"
  [showConfirmButton]="true"
  [showCancelButton]="true"
  confirmText="Delete"
  confirmVariant="danger"
  (confirm)="deleteProject()"
  (cancel)="closeConfirmDialog()">
  
  <div modal-body>
    <p>This action cannot be undone. Are you sure?</p>
  </div>
</generic-modal>

<!-- Full-screen form -->
<generic-modal
  [visible]="showFormModal"
  title="Edit Project"
  size="full"
  [backdrop]="false"
  [keyboard]="false"
  (close)="closeForm()">
  
  <div modal-body>
    <app-project-form 
      [project]="selectedProject"
      (save)="saveProject($event)"
      (cancel)="closeForm()">
    </app-project-form>
  </div>
</generic-modal>
```

### 3. GenericLoadingComponent

Versatile loading component with multiple animation types.

#### Basic Usage

```html
<generic-loading
  *ngIf="isLoading"
  message="Loading data...">
</generic-loading>
```

#### Configuration Options

```typescript
interface TLoadingConfig {
  // Animation type
  type?: 'spinner' | 'dots' | 'progress' | 'pulse' | 'wave' | 'skeleton';
  
  // Appearance
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: TComponentVariant;
  
  // Overlay
  overlay?: boolean;          // Full-screen overlay
  backdrop?: boolean;         // Semi-transparent backdrop
  
  // Timeout
  timeout?: number;           // Auto-hide after ms
}
```

#### Examples

```html
<!-- Simple spinner -->
<generic-loading
  type="spinner"
  size="md"
  color="primary"
  message="Please wait...">
</generic-loading>

<!-- Full-screen overlay -->
<generic-loading
  *ngIf="isSubmitting"
  type="dots"
  size="lg"
  [overlay]="true"
  [backdrop]="true"
  message="Submitting form..."
  [timeout]="30000">
</generic-loading>

<!-- Skeleton loading -->
<generic-loading
  type="skeleton"
  *ngIf="loadingProjects">
</generic-loading>
```

### 4. GenericErrorComponent

Comprehensive error display with customizable actions.

#### Basic Usage

```html
<generic-error
  *ngIf="error"
  [message]="error"
  (retry)="retryOperation()">
</generic-error>
```

#### Configuration Options

```typescript
interface TErrorConfig {
  // Error type (affects icon and styling)
  type?: '404' | '500' | 'network' | 'validation' | 'permission' | 'custom';
  
  // Appearance
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  
  // Actions
  showRetry?: boolean;
  showHome?: boolean;
  showDetails?: boolean;
  
  // Button customization
  retryText?: string;
  homeText?: string;
}
```

#### Examples

```html
<!-- Network error -->
<generic-error
  type="network"
  message="Unable to connect to server"
  [showRetry]="true"
  [showHome]="true"
  (retry)="reconnect()"
  (home)="goHome()">
</generic-error>

<!-- Validation errors -->
<generic-error
  type="validation"
  size="sm"
  [centered]="false"
  [errorDetails]="validationErrors"
  [showDetails]="true">
</generic-error>

<!-- 404 page -->
<generic-error
  type="404"
  size="lg"
  [centered]="true"
  message="Page not found"
  [showHome]="true"
  homeText="Go to Dashboard"
  (home)="gotoDashboard()">
</generic-error>
```

## 🎨 Theming and Customization

### Sokoke Color Palette

The components use the Sokoke brand colors:

```scss
:root {
  --color-primary: #CD9965;    // bgkoke
  --color-secondary: #A17246;  // seckoke
  --color-accent: #19363F;     // acckoke
  --color-background: #F2EDE1; // blank
  --color-text: #462F14;       // textkoke
  --color-tertiary: #59767F;   // trikoke
}
```

### Custom CSS Classes

Add custom styling with CSS classes:

```html
<generic-button
  text="Special Button"
  [cssClasses]="['my-custom-button', 'special-effect']"
  (clicked)="handleClick()">
</generic-button>
```

```scss
.my-custom-button {
  border: 2px solid var(--color-accent);
  
  &:hover {
    background: var(--color-accent);
    color: white;
  }
}
```

### Theme Service

Use the GenericComponentsService to manage themes:

```typescript
import { GenericComponentsService } from '@app/shared/services';

@Component({...})
export class MyComponent {
  constructor(private genericService: GenericComponentsService) {}

  switchToDarkTheme(): void {
    this.genericService.updateTheme({
      colors: {
        primary: '#444444',
        secondary: '#666666',
        background: '#222222',
        text: '#ffffff'
      }
    });
  }

  resetTheme(): void {
    this.genericService.resetTheme();
  }
}
```

## 🧪 Testing Generic Components

### Component Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericButtonComponent } from './generic-button.component';

describe('GenericButtonComponent', () => {
  let component: GenericButtonComponent;
  let fixture: ComponentFixture<GenericButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericButtonComponent);
    component = fixture.componentInstance;
  });

  it('should emit clicked event when button is clicked', () => {
    spyOn(component.clicked, 'emit');
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should show loading spinner when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });
});
```

### Integration Testing

```typescript
// Test generic components in feature components
describe('ProjectListComponent', () => {
  it('should show loading state using generic-loading', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingComponent = fixture.debugElement.query(By.css('generic-loading'));
    expect(loadingComponent).toBeTruthy();
  });

  it('should display error using generic-error', () => {
    component.error = 'Failed to load projects';
    fixture.detectChanges();
    
    const errorComponent = fixture.debugElement.query(By.css('generic-error'));
    expect(errorComponent).toBeTruthy();
    expect(errorComponent.componentInstance.message).toBe('Failed to load projects');
  });
});
```

## 🔧 Creating New Generic Components

### Step 1: Extend BaseGenericComponent

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseGenericComponent } from '../base-generic/base-generic.component';

export interface TNewComponentConfig {
  // Define your component's configuration
  variant?: TComponentVariant;
  size?: TComponentSize;
  // ... other properties
}

@Component({
  selector: 'generic-new-component',
  templateUrl: './generic-new-component.component.html',
  styleUrl: './generic-new-component.component.scss'
})
export class GenericNewComponentComponent extends BaseGenericComponent {
  @Input() config: TNewComponentConfig = {};
  @Output() action = new EventEmitter<any>();

  // Implement required methods
  protected override applyComponentAngoraClasses(): void {
    // Apply NgxAngora classes based on configuration
  }

  protected override onResponsiveUpdate(breakpoint: string): void {
    // Handle responsive changes
  }
}
```

### Step 2: Create the Template

```html
<div class="generic-new-component" [ngClass]="getComponentClasses()">
  <!-- Your component markup -->
  <ng-content></ng-content>
</div>
```

### Step 3: Add Styles

```scss
.generic-new-component {
  // Base styles
  
  // Size variants
  &--xs { /* extra small styles */ }
  &--sm { /* small styles */ }
  &--md { /* medium styles */ }
  &--lg { /* large styles */ }
  &--xl { /* extra large styles */ }
  
  // Variant styles
  &--primary { /* primary variant */ }
  &--secondary { /* secondary variant */ }
  // ... other variants
  
  // Responsive styles
  @media (max-width: 768px) {
    // Mobile styles
  }
}
```

### Step 4: Export and Document

```typescript
// In shared/components/index.ts
export * from './generic-new-component/generic-new-component.component';

// Add to documentation and demo component
```

## 📖 Best Practices

### Do's

- ✅ Use generic components for all UI elements
- ✅ Follow the established configuration patterns
- ✅ Include proper TypeScript types
- ✅ Add ARIA attributes for accessibility
- ✅ Test components thoroughly
- ✅ Document usage examples

### Don'ts

- ❌ Create custom buttons instead of using GenericButton
- ❌ Bypass the configuration system
- ❌ Ignore responsive design requirements
- ❌ Skip accessibility considerations
- ❌ Hardcode styles in templates
- ❌ Forget to clean up subscriptions

### Performance Tips

1. **Use OnPush change detection** for better performance
2. **Implement trackBy functions** for lists
3. **Lazy load heavy components** when possible
4. **Minimize DOM manipulations** in component logic
5. **Use async pipe** instead of manual subscriptions

## 🚀 Demo and Examples

### Live Demo

Explore all components interactively:

```bash
# Navigate to the demo page
ng serve
# Open http://localhost:4200/demo
```

The demo includes:

- **Interactive examples** of all components
- **Configuration playground** to test different options
- **Code snippets** for copy-paste usage
- **Responsive testing** at different screen sizes
- **Accessibility testing** with screen readers

### Example Projects

See real-world usage in:

- `src/app/auth/` - Authentication forms using generic components
- `src/app/core/` - Layout and navigation examples
- Future feature modules as they're implemented

---

**Need Help?** Check the [troubleshooting guide](./TROUBLESHOOTING.md) or ask the team in our chat channel!
