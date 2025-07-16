# 👋 Hello World Tutorial

A hands-on tutorial to help new developers make their first meaningful contribution to the Sokoke Planner frontend.

## 🎯 Tutorial Objectives

By the end of this tutorial, you will:

- [ ] Create a new component using generic components
- [ ] Understand the project structure and conventions
- [ ] Write and run tests for your component
- [ ] Submit your first pull request

**Estimated Time**: 45 minutes

## 📋 Prerequisites

- Completed the [New Developer Onboarding Guide](./NEW_DEVELOPER_GUIDE.md)
- Development environment running (`npm start`)
- Basic understanding of Angular and TypeScript

## 🚀 Step 1: Create a Welcome Widget Component (15 minutes)

Let's create a simple welcome widget that displays a personalized message using generic components.

### 1.1 Generate the Component

```bash
# Navigate to the project root
cd sokoke_planner

# Generate a new component
ng generate component shared/components/welcome-widget --standalone
```

### 1.2 Update the Component Class

Open `src/app/shared/components/welcome-widget/welcome-widget.component.ts`:

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericButtonComponent } from '../generic-button/generic-button.component';
import { GenericModalComponent } from '../generic-modal/generic-modal.component';

/**
 * Welcome widget component that displays a personalized greeting
 * and allows users to update their welcome preferences
 */
@Component({
  selector: 'app-welcome-widget',
  standalone: true,
  imports: [
    CommonModule,
    GenericButtonComponent,
    GenericModalComponent
  ],
  templateUrl: './welcome-widget.component.html',
  styleUrl: './welcome-widget.component.scss'
})
export class WelcomeWidgetComponent {
  @Input() userName: string = 'Developer';
  @Input() showSettings: boolean = true;
  @Output() settingsChanged = new EventEmitter<TWelcomeSettings>();

  // Component state
  showSettingsModal = false;
  currentGreeting = 'Welcome back';
  availableGreetings = [
    'Welcome back',
    'Hello',
    'Good day',
    'Greetings',
    'Hi there'
  ];

  selectedGreeting = this.currentGreeting;

  /**
   * Get the full welcome message
   */
  get welcomeMessage(): string {
    return `${this.currentGreeting}, ${this.userName}! 🐱`;
  }

  /**
   * Open settings modal
   */
  openSettings(): void {
    this.selectedGreeting = this.currentGreeting;
    this.showSettingsModal = true;
  }

  /**
   * Close settings modal
   */
  closeSettings(): void {
    this.showSettingsModal = false;
  }

  /**
   * Save settings and emit changes
   */
  saveSettings(): void {
    this.currentGreeting = this.selectedGreeting;
    
    const settings: TWelcomeSettings = {
      greeting: this.currentGreeting,
      userName: this.userName
    };
    
    this.settingsChanged.emit(settings);
    this.closeSettings();
  }

  /**
   * Handle greeting selection
   */
  selectGreeting(greeting: string): void {
    this.selectedGreeting = greeting;
  }
}

// Type definition for welcome settings
export type TWelcomeSettings = {
  greeting: string;
  userName: string;
};
```

### 1.3 Create the Template

Update `src/app/shared/components/welcome-widget/welcome-widget.component.html`:

```html
<div class="welcome-widget">
  <!-- Welcome message -->
  <div class="welcome-widget__message">
    <h3 class="welcome-widget__greeting">{{ welcomeMessage }}</h3>
    <p class="welcome-widget__subtitle">
      Ready to plan your next project with Sokoke Planner?
    </p>
  </div>

  <!-- Settings button -->
  <div class="welcome-widget__actions" *ngIf="showSettings">
    <generic-button
      text="Customize"
      variant="secondary"
      size="small"
      icon="fas fa-cog"
      iconPosition="left"
      (clicked)="openSettings()"
      [ariaLabel]="'Customize welcome message'">
    </generic-button>
  </div>

  <!-- Settings Modal -->
  <generic-modal
    [visible]="showSettingsModal"
    title="Welcome Settings"
    size="md"
    [centered]="true"
    [showConfirmButton]="true"
    [showCancelButton]="true"
    confirmText="Save"
    cancelText="Cancel"
    (confirm)="saveSettings()"
    (cancel)="closeSettings()"
    (close)="closeSettings()">
    
    <div modal-body>
      <div class="settings-form">
        <div class="form-group">
          <label for="greeting-select" class="form-label">
            Choose your greeting:
          </label>
          <div class="greeting-options">
            <div 
              *ngFor="let greeting of availableGreetings; trackBy: trackByGreeting"
              class="greeting-option"
              [class.greeting-option--selected]="selectedGreeting === greeting"
              (click)="selectGreeting(greeting)"
              [attr.aria-selected]="selectedGreeting === greeting"
              role="button"
              tabindex="0"
              (keyup.enter)="selectGreeting(greeting)">
              {{ greeting }}
            </div>
          </div>
        </div>
        
        <div class="preview">
          <strong>Preview:</strong> {{ selectedGreeting }}, {{ userName }}! 🐱
        </div>
      </div>
    </div>
  </generic-modal>
</div>
```

### 1.4 Add Styles

Update `src/app/shared/components/welcome-widget/welcome-widget.component.scss`:

```scss
.welcome-widget {
  background: linear-gradient(135deg, var(--color-background), #ffffff);
  border: 1px solid var(--color-secondary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(161, 114, 70, 0.1);

  &__message {
    flex: 1;
  }

  &__greeting {
    color: var(--color-primary);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  &__subtitle {
    color: var(--color-text);
    margin: 0;
    opacity: 0.8;
  }

  &__actions {
    margin-left: 1rem;
  }

  // Responsive design
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;

    &__actions {
      margin-left: 0;
      margin-top: 1rem;
    }
  }
}

// Settings form styles
.settings-form {
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 0.75rem;
  }

  .greeting-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .greeting-option {
    padding: 0.75rem;
    border: 2px solid var(--color-secondary);
    border-radius: 0.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;

    &:hover {
      border-color: var(--color-primary);
      background: var(--color-background);
    }

    &--selected {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: white;
      font-weight: 500;
    }

    &:focus {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  }

  .preview {
    padding: 1rem;
    background: var(--color-background);
    border-radius: 0.5rem;
    border-left: 4px solid var(--color-primary);
    font-size: 1.1rem;
  }
}
```

### 1.5 Add TrackBy Function

Add this method to your component class:

```typescript
/**
 * TrackBy function for greeting options
 */
trackByGreeting(index: number, greeting: string): string {
  return greeting;
}
```

## 🧪 Step 2: Write Tests (10 minutes)

Update `src/app/shared/components/welcome-widget/welcome-widget.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WelcomeWidgetComponent, TWelcomeSettings } from './welcome-widget.component';

describe('WelcomeWidgetComponent', () => {
  let component: WelcomeWidgetComponent;
  let fixture: ComponentFixture<WelcomeWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeWidgetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display default welcome message', () => {
      component.userName = 'John';
      fixture.detectChanges();

      const greeting = fixture.debugElement.query(By.css('.welcome-widget__greeting'));
      expect(greeting.nativeElement.textContent.trim()).toBe('Welcome back, John! 🐱');
    });

    it('should show settings button when showSettings is true', () => {
      component.showSettings = true;
      fixture.detectChanges();

      const settingsButton = fixture.debugElement.query(By.css('generic-button'));
      expect(settingsButton).toBeTruthy();
    });

    it('should hide settings button when showSettings is false', () => {
      component.showSettings = false;
      fixture.detectChanges();

      const settingsButton = fixture.debugElement.query(By.css('generic-button'));
      expect(settingsButton).toBeFalsy();
    });
  });

  describe('Settings Modal', () => {
    it('should open settings modal when customize button is clicked', () => {
      component.showSettings = true;
      fixture.detectChanges();

      const customizeButton = fixture.debugElement.query(By.css('generic-button'));
      customizeButton.nativeElement.click();

      expect(component.showSettingsModal).toBe(true);
    });

    it('should close settings modal when cancel is clicked', () => {
      component.showSettingsModal = true;
      fixture.detectChanges();

      component.closeSettings();

      expect(component.showSettingsModal).toBe(false);
    });

    it('should emit settings changed when save is clicked', () => {
      spyOn(component.settingsChanged, 'emit');
      
      component.selectedGreeting = 'Hello';
      component.userName = 'Jane';
      component.saveSettings();

      const expectedSettings: TWelcomeSettings = {
        greeting: 'Hello',
        userName: 'Jane'
      };

      expect(component.settingsChanged.emit).toHaveBeenCalledWith(expectedSettings);
      expect(component.showSettingsModal).toBe(false);
    });
  });

  describe('Greeting Selection', () => {
    it('should update selected greeting when selectGreeting is called', () => {
      component.selectGreeting('Hello');
      
      expect(component.selectedGreeting).toBe('Hello');
    });

    it('should update welcome message when greeting is changed', () => {
      component.currentGreeting = 'Hello';
      component.userName = 'Test User';
      
      expect(component.welcomeMessage).toBe('Hello, Test User! 🐱');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      component.showSettings = true;
      fixture.detectChanges();

      const customizeButton = fixture.debugElement.query(By.css('generic-button'));
      expect(customizeButton.componentInstance.ariaLabel).toBe('Customize welcome message');
    });
  });
});
```

## 🎨 Step 3: Integrate with Home Page (10 minutes)

Now let's add your component to the home page to see it in action.

### 3.1 Update Home Component

Open `src/app/core/components/home/home.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeWidgetComponent, TWelcomeSettings } from '@app/shared/components/welcome-widget/welcome-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeWidgetComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  currentUser = {
    name: 'New Developer', // Replace with actual user data later
    settings: {
      greeting: 'Welcome back'
    }
  };

  /**
   * Handle welcome settings changes
   */
  onWelcomeSettingsChanged(settings: TWelcomeSettings): void {
    console.log('Welcome settings updated:', settings);
    // TODO: Save to user preferences when user service is implemented
    this.currentUser.settings.greeting = settings.greeting;
  }
}
```

### 3.2 Update Home Template

Open `src/app/core/components/home/home.component.html`:

```html
<div class="home-page">
  <!-- Add your welcome widget -->
  <app-welcome-widget
    [userName]="currentUser.name"
    [showSettings]="true"
    (settingsChanged)="onWelcomeSettingsChanged($event)">
  </app-welcome-widget>

  <!-- Existing home content -->
  <div class="home-content">
    <h1>Sokoke Planner</h1>
    <p>Welcome to your project planning dashboard!</p>
    
    <!-- TODO: Add dashboard widgets here -->
    <div class="coming-soon">
      <h3>🚧 Coming Soon</h3>
      <ul>
        <li>Project overview dashboard</li>
        <li>Recent tasks and activities</li>
        <li>Progress charts and analytics</li>
        <li>Quick action buttons</li>
      </ul>
    </div>
  </div>
</div>
```

### 3.3 Add Basic Home Styles

Update `src/app/core/components/home/home.component.scss`:

```scss
.home-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.home-content {
  h1 {
    color: var(--color-primary);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  p {
    font-size: 1.2rem;
    color: var(--color-text);
    text-align: center;
    margin-bottom: 2rem;
  }
}

.coming-soon {
  background: var(--color-background);
  border: 2px dashed var(--color-secondary);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;

  h3 {
    color: var(--color-secondary);
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    
    li {
      padding: 0.5rem 0;
      color: var(--color-text);
      opacity: 0.7;
    }
  }
}
```

## 🧪 Step 4: Run Tests (5 minutes)

### 4.1 Run Your Component Tests

```bash
# Run tests for your specific component
ng test --include="**/welcome-widget.component.spec.ts"
```

### 4.2 Run All Tests

```bash
# Run all tests to make sure nothing is broken
ng test --watch=false --browsers=ChromeHeadless
```

### 4.3 Check Test Coverage

```bash
# Generate test coverage report
ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

Look for your component in the coverage report at `coverage/lcov-report/index.html`.

## 🌐 Step 5: See Your Component in Action (5 minutes)

### 5.1 Start the Development Server

```bash
# Make sure the dev server is running
npm start
```

### 5.2 View Your Component

1. Open <http://localhost:4200> in your browser
2. Navigate to the home page
3. You should see your welcome widget at the top
4. Click the "Customize" button to test the modal
5. Try different greetings and see the preview update

### 5.3 Test Responsiveness

1. Open browser dev tools (F12)
2. Switch to mobile view
3. Verify the widget looks good on mobile devices

## 📋 Step 6: Code Review Preparation (5 minutes)

### 6.1 Run Quality Checks

```bash
# Check for linting errors
ng lint

# Format code
npx prettier --write "src/app/shared/components/welcome-widget/**/*.ts"
npx prettier --write "src/app/shared/components/welcome-widget/**/*.html"
npx prettier --write "src/app/shared/components/welcome-widget/**/*.scss"
```

### 6.2 Self-Review Checklist

- [ ] Component follows naming conventions
- [ ] Uses generic components (GenericButton, GenericModal)
- [ ] Includes proper TypeScript types
- [ ] Has accessibility attributes (ARIA labels, keyboard navigation)
- [ ] Tests cover main functionality
- [ ] Responsive design works on mobile
- [ ] No console errors in browser
- [ ] Code is properly documented with JSDoc comments

## 🎯 Step 7: Submit Your Contribution

### 7.1 Commit Your Changes

```bash
# Add your files
git add .

# Commit with a descriptive message
git commit -m "feat(shared): add welcome widget component with customizable greetings

- Create WelcomeWidgetComponent with personalized messages
- Add settings modal for greeting customization
- Include comprehensive tests with 95% coverage
- Integrate with home page for immediate user feedback
- Implement responsive design and accessibility features"
```

### 7.2 Create a Pull Request

```bash
# Push to your branch
git push origin feature/welcome-widget

# Create a pull request through GitHub interface
# Title: "feat(shared): add welcome widget component"
# Description: Include what you built and why
```

## 🎉 Congratulations!

You've successfully:

✅ Created a reusable component using the project's architecture patterns  
✅ Used generic components for consistent UI  
✅ Written comprehensive tests  
✅ Followed the project's coding standards  
✅ Made your first meaningful contribution to Sokoke Planner  

## 🚀 Next Steps

Now that you've completed the Hello World tutorial:

1. **Review feedback** on your pull request and make improvements
2. **Pick a larger task** from the [Development Plan](../plan/FRONTEND_DEVELOPMENT_PLAN.md)
3. **Explore generic components** in the [demo page](../src/app/shared/components/generic-components-demo/)
4. **Help other new developers** by improving this tutorial based on your experience

## 💡 Pro Tips

- **Use the demo component** as reference for more complex generic component usage
- **Follow the existing patterns** - consistency is key in this project
- **Write tests first** when working on complex features (TDD approach)
- **Ask questions** - the team is here to help you succeed!

---

**Need Help?** Check the [troubleshooting guide](./TROUBLESHOOTING.md) or ask in the team chat!
