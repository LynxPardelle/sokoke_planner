# Generic Components Plan for Sokoke Planner

## 📋 Overview

This document outlines a comprehensive plan for creating reusable generic components that will be used throughout the Sokoke Planner application. These components follow the naming convention `generic-<name>.component.ts` with class names `Generic<Name>Component`.

## 🏗️ Component Categories

### 1. Data Display Components

#### 1.1 Generic List Component
**File**: `src/app/shared/components/generic-list.component.ts`
**Class**: `GenericListComponent<T>`

**Purpose**: Display any type of data in a list format with common functionality
**Features**:
- Configurable columns/fields display
- Built-in search and filtering
- Pagination support
- Selection (single/multiple)
- Sorting capabilities
- Loading and error states
- Action buttons (edit, delete, view)
- Bulk operations

**Configuration**:
```typescript
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
```

#### 1.2 Generic Card Component
**File**: `src/app/shared/components/generic-card.component.ts`
**Class**: `GenericCardComponent<T>`

**Purpose**: Display data in card format with customizable layouts
**Features**:
- Configurable card layout
- Header, body, footer sections
- Action buttons
- Status indicators
- Hover effects
- Click handling

#### 1.3 Generic Table Component
**File**: `src/app/shared/components/generic-table.component.ts`
**Class**: `GenericTableComponent<T>`

**Purpose**: Advanced table with sorting, filtering, and pagination
**Features**:
- Column sorting
- Inline editing
- Row selection
- Export functionality
- Responsive design
- Virtual scrolling for large datasets

#### 1.4 Generic Detail View Component
**File**: `src/app/shared/components/generic-detail-view.component.ts`
**Class**: `GenericDetailViewComponent<T>`

**Purpose**: Display detailed information about an entity
**Features**:
- Configurable field display
- Tabbed sections
- Related data display
- Action buttons
- Edit mode toggle

### 2. Form Components

#### 2.1 Generic Form Component
**File**: `src/app/shared/components/generic-form.component.ts`
**Class**: `GenericFormComponent<T>`

**Purpose**: Dynamic form generation for any entity type
**Features**:
- Dynamic field generation
- Validation support
- Multiple layouts (vertical, horizontal, grid)
- Conditional field display
- File upload support
- Auto-save functionality

**Configuration**:
```typescript
export type TFormConfig<T> = {
  fields: TFormFieldConfig<T>[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  validation?: TValidationConfig<T>;
  autoSave?: boolean;
  submitText?: string;
  cancelText?: string;
};

export type TFormFieldConfig<T> = {
  key: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'date' | 'datetime' | 'number' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  options?: TSelectOption[];
  placeholder?: string;
  hint?: string;
  validators?: ValidatorFn[];
  conditional?: (value: T) => boolean;
};
```

#### 2.2 Generic Search Component
**File**: `src/app/shared/components/generic-search.component.ts`
**Class**: `GenericSearchComponent<T>`

**Purpose**: Advanced search functionality for any entity type
**Features**:
- Quick search input
- Advanced filter builder
- Saved searches
- Export search results
- Search history
- Real-time search suggestions

**Configuration**:
```typescript
export type TSearchConfig<T> = {
  quickSearch?: {
    enabled: boolean;
    fields: (keyof T)[];
    placeholder?: string;
  };
  advancedFilters?: TFilterConfig<T>[];
  savedSearches?: boolean;
  suggestions?: boolean;
  exportOptions?: TExportOption[];
};

export type TFilterConfig<T> = {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date-range' | 'number-range';
  options?: TSelectOption[];
};
```

#### 2.3 Generic Filter Builder Component
**File**: `src/app/shared/components/generic-filter-builder.component.ts`
**Class**: `GenericFilterBuilderComponent<T>`

**Purpose**: Build complex filter queries dynamically
**Features**:
- Drag-and-drop filter building
- Logical operators (AND, OR, NOT)
- Grouped conditions
- Predefined filter templates
- Filter validation

### 3. UI/UX Components

#### 3.1 Generic Modal Component
**File**: `src/app/shared/components/generic-modal.component.ts`
**Class**: `GenericModalComponent`

**Purpose**: Reusable modal dialog with various configurations
**Features**:
- Multiple sizes (small, medium, large, full-screen)
- Configurable header, body, footer
- Confirmation dialogs
- Form modals
- Custom content projection
- Keyboard navigation

#### 3.2 Generic Loading Component
**File**: `src/app/shared/components/generic-loading.component.ts`
**Class**: `GenericLoadingComponent`

**Purpose**: Consistent loading states across the application
**Features**:
- Multiple loading styles (spinner, skeleton, progress bar)
- Overlay loading
- Inline loading
- Custom loading messages
- Timeout handling

#### 3.3 Generic Error Component
**File**: `src/app/shared/components/generic-error.component.ts`
**Class**: `GenericErrorComponent`

**Purpose**: Standardized error display and handling
**Features**:
- Different error types (404, 500, network, validation)
- Retry functionality
- Error reporting
- Custom error messages
- Error boundary behavior

#### 3.4 Generic Confirmation Dialog Component
**File**: `src/app/shared/components/generic-confirmation-dialog.component.ts`
**Class**: `GenericConfirmationDialogComponent`

**Purpose**: Standardized confirmation dialogs
**Features**:
- Customizable messages
- Different confirmation types (delete, save, cancel)
- Icon support
- Button customization
- Keyboard shortcuts

#### 3.5 Generic Toast Notification Component
**File**: `src/app/shared/components/generic-toast.component.ts`
**Class**: `GenericToastComponent`

**Purpose**: Consistent notification system
**Features**:
- Multiple notification types (success, error, warning, info)
- Auto-dismiss timer
- Action buttons
- Position configuration
- Queue management

### 4. Navigation Components

#### 4.1 Generic Breadcrumb Component
**File**: `src/app/shared/components/generic-breadcrumb.component.ts`
**Class**: `GenericBreadcrumbComponent`

**Purpose**: Dynamic breadcrumb navigation
**Features**:
- Auto-generated from route data
- Custom breadcrumb items
- Icon support
- Clickable navigation
- Responsive design

#### 4.2 Generic Pagination Component
**File**: `src/app/shared/components/generic-pagination.component.ts`
**Class**: `GenericPaginationComponent`

**Purpose**: Consistent pagination across all lists
**Features**:
- Multiple pagination styles
- Page size selection
- Jump to page
- Total items display
- Keyboard navigation

#### 4.3 Generic Tabs Component
**File**: `src/app/shared/components/generic-tabs.component.ts`
**Class**: `GenericTabsComponent`

**Purpose**: Reusable tabbed interface
**Features**:
- Dynamic tab generation
- Lazy loading of tab content
- Closeable tabs
- Badge support
- Vertical/horizontal orientation

#### 4.4 Generic Menu Component
**File**: `src/app/shared/components/generic-menu.component.ts`
**Class**: `GenericMenuComponent`

**Purpose**: Configurable menu systems
**Features**:
- Hierarchical menu structure
- Icon support
- Badge/notification indicators
- Permission-based visibility
- Mobile-responsive

### 5. Data Visualization Components

#### 5.1 Generic Chart Component
**File**: `src/app/shared/components/generic-chart.component.ts`
**Class**: `GenericChartComponent`

**Purpose**: Reusable chart wrapper for Chart.js
**Features**:
- Multiple chart types (bar, line, pie, doughnut)
- Responsive design
- Export functionality
- Real-time data updates
- Interactive legends

#### 5.2 Generic Progress Component
**File**: `src/app/shared/components/generic-progress.component.ts`
**Class**: `GenericProgressComponent`

**Purpose**: Progress indicators and bars
**Features**:
- Multiple progress styles (bar, circle, step)
- Animated progress
- Custom colors
- Percentage display
- Status indicators

#### 5.3 Generic Status Badge Component
**File**: `src/app/shared/components/generic-status-badge.component.ts`
**Class**: `GenericStatusBadgeComponent`

**Purpose**: Consistent status display across entities
**Features**:
- Configurable colors and styles
- Icon support
- Tooltip information
- Click handling
- Animation support

#### 5.4 Generic Statistics Card Component
**File**: `src/app/shared/components/generic-stats-card.component.ts`
**Class**: `GenericStatsCardComponent`

**Purpose**: Display key metrics and statistics
**Features**:
- Multiple layout options
- Trend indicators
- Comparison values
- Chart integration
- Click-through actions

### 6. Input Components

#### 6.1 Generic Select Component
**File**: `src/app/shared/components/generic-select.component.ts`
**Class**: `GenericSelectComponent<T>`

**Purpose**: Enhanced select dropdown with search and multiple selection
**Features**:
- Search functionality
- Multiple selection
- Group options
- Custom option templates
- Async data loading
- Virtual scrolling

#### 6.2 Generic Date Picker Component
**File**: `src/app/shared/components/generic-date-picker.component.ts`
**Class**: `GenericDatePickerComponent`

**Purpose**: Consistent date selection across forms
**Features**:
- Date, datetime, date range selection
- Custom date formats
- Min/max date validation
- Timezone support
- Keyboard navigation

#### 6.3 Generic File Upload Component
**File**: `src/app/shared/components/generic-file-upload.component.ts`
**Class**: `GenericFileUploadComponent`

**Purpose**: File upload with progress and validation
**Features**:
- Drag and drop support
- Multiple file selection
- File type validation
- Size validation
- Progress tracking
- Preview functionality

#### 6.4 Generic Tag Input Component
**File**: `src/app/shared/components/generic-tag-input.component.ts`
**Class**: `GenericTagInputComponent`

**Purpose**: Tag/chip input for multiple values
**Features**:
- Auto-completion
- Custom tag validation
- Maximum tag limits
- Custom tag templates
- Keyboard shortcuts

#### 6.5 Generic Button Component
**File**: `src/app/shared/components/generic-button.component.ts`
**Class**: `GenericButtonComponent`

**Purpose**: Standardized button component with consistent styling and behavior
**Features**:
- Multiple button types (primary, secondary, success, warning, danger)
- Size variants (small, medium, large)
- Loading state with spinner
- Disabled state handling
- Icon support (left, right, icon-only)
- Tooltip integration
- Click event handling with debouncing
- Keyboard accessibility

**Configuration**:
```typescript
export type TButtonConfig = {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined' | 'text';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right' | 'only';
  tooltip?: string;
  debounceTime?: number;
  fullWidth?: boolean;
};
```

#### 6.6 Generic Input Component
**File**: `src/app/shared/components/generic-input.component.ts`
**Class**: `GenericInputComponent`

**Purpose**: Standardized input component with validation and consistent styling
**Features**:
- Multiple input types (text, email, password, number, tel, url)
- Built-in validation with error messages
- Placeholder and hint text
- Prefix and suffix support
- Character counter
- Auto-focus capability
- Input masking support
- Debounced value changes
- Accessibility compliance

**Configuration**:
```typescript
export type TInputConfig = {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  prefix?: string;
  suffix?: string;
  maxLength?: number;
  showCounter?: boolean;
  mask?: string;
  debounceTime?: number;
  autoFocus?: boolean;
  readonly?: boolean;
  required?: boolean;
};
```

#### 6.7 Generic Textarea Component
**File**: `src/app/shared/components/generic-textarea.component.ts`
**Class**: `GenericTextareaComponent`

**Purpose**: Standardized textarea component with auto-resize and validation
**Features**:
- Auto-resize functionality
- Character counting
- Minimum and maximum rows
- Rich text support option
- Validation integration
- Placeholder and hint text
- Spell checking toggle
- Keyboard shortcuts

**Configuration**:
```typescript
export type TTextareaConfig = {
  placeholder?: string;
  hint?: string;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  autoResize?: boolean;
  showCounter?: boolean;
  spellCheck?: boolean;
  required?: boolean;
  richText?: boolean;
};
```

#### 6.8 Generic Checkbox Component
**File**: `src/app/shared/components/generic-checkbox.component.ts`
**Class**: `GenericCheckboxComponent`

**Purpose**: Standardized checkbox component with consistent styling
**Features**:
- Indeterminate state support
- Custom labels and descriptions
- Group checkbox functionality
- Validation integration
- Color theming
- Accessibility compliance

**Configuration**:
```typescript
export type TCheckboxConfig = {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  labelPosition?: 'before' | 'after';
  required?: boolean;
};
```
### 7. Layout Components

#### 7.1 Generic Container Component
**File**: `src/app/shared/components/generic-container.component.ts`
**Class**: `GenericContainerComponent`

**Purpose**: Consistent page layout container
**Features**:
- Multiple layout types
- Responsive breakpoints
- Padding/margin options
- Background options
- Loading states

#### 7.2 Generic Sidebar Component
**File**: `src/app/shared/components/generic-sidebar.component.ts`
**Class**: `GenericSidebarComponent`

**Purpose**: Configurable sidebar for different contexts
**Features**:
- Collapsible/expandable
- Multiple positions (left, right)
- Overlay/push modes
- Custom content projection
- Responsive behavior

#### 7.3 Generic Header Component
**File**: `src/app/shared/components/generic-header.component.ts`
**Class**: `GenericHeaderComponent`

**Purpose**: Consistent page headers with actions
**Features**:
- Title and subtitle
- Action buttons
- Breadcrumb integration
- Search integration
- Responsive design

## 🔧 Implementation Strategy

### Phase 1: Core Components (Week 1-2)
**Priority: High**
- [x] Generic Loading Component
- [x] Generic Error Component  
- [x] Generic Modal Component
- [x] Generic Confirmation Dialog Component
- [x] Generic Toast Notification Component

### Phase 2: Data Display (Week 3-4)
**Priority: High**
- [x] Generic List Component
- [x] Generic Card Component
- [x] Generic Table Component
- [x] Generic Detail View Component

### Phase 3: Form Components (Week 5-6)
**Priority: High**
- [x] Generic Form Component
- [x] Generic Search Component
- [x] Generic Filter Builder Component

### Phase 4: Navigation & Input (Week 7-8)
**Priority: Medium**
- [x] Generic Pagination Component
- [x] Generic Breadcrumb Component
- [x] Generic Select Component
- [x] Generic Date Picker Component
- [x] Generic Button Component
- [x] Generic Input Component
- [x] Generic Textarea Component
- [x] Generic Checkbox Component

### Phase 5: Visualization & Advanced (Week 9-10)
**Priority: Medium**
- [x] Generic Chart Component
- [x] Generic Progress Component
- [x] Generic Status Badge Component
- [x] Generic File Upload Component

### Phase 6: Layout & Polish (Week 11-12)
**Priority: Low**
- [x] Generic Container Component
- [x] Generic Sidebar Component
- [x] Generic Header Component
- [x] Generic Menu Component
- [x] Generic Tabs Component

## 📦 Component Architecture

### Base Component Pattern
```typescript
// Base class for all generic components
export abstract class BaseGenericComponent<T = any> implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  
  @Input() loading = false;
  @Input() disabled = false;
  @Input() config?: TComponentConfig<T>;
  
  @Output() action = new EventEmitter<TComponentAction<T>>();
  @Output() selectionChange = new EventEmitter<T | T[]>();
  @Output() error = new EventEmitter<Error>();
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Configuration Types
```typescript
// Common configuration types
export type TComponentConfig<T> = {
  id?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export type TComponentAction<T> = {
  type: string;
  data?: T;
  event?: Event;
};

export type TSelectOption = {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
};
```

### Service Integration
```typescript
// Generic service type for components
export type TGenericService<T> = {
  getAll(query?: TSearchQuery): Observable<TSearchResult<T>>;
  getById(id: string): Observable<T>;
  create(item: Partial<T>): Observable<T>;
  update(item: Partial<T> & { id: string }): Observable<T>;
  delete(id: string): Observable<void>;
};
```

## 🎨 Design System Integration

### Theme Configuration
```typescript
// Theme configuration for generic components
export type TGenericTheme = {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
};
```

### CSS Classes Convention
```scss
// Generic component CSS naming convention
.generic-{component-name} {
  &__container { }
  &__header { }
  &__body { }
  &__footer { }
  &__item { }
  &__action { }
  
  &--loading { }
  &--disabled { }
  &--error { }
  &--small { }
  &--medium { }
  &--large { }
}
```

## 🧪 Testing Strategy

### Component Testing Template
```typescript
describe('Generic{Name}Component', () => {
  let component: Generic{Name}Component<any>;
  let fixture: ComponentFixture<Generic{Name}Component<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Generic{Name}Component],
      imports: [CommonModule, MaterialModule],
    });
    
    fixture = TestBed.createComponent(Generic{Name}Component);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle configuration changes', () => {
    // Test configuration handling
  });

  it('should emit events correctly', () => {
    // Test event emission
  });

  it('should handle error states', () => {
    // Test error handling
  });
});
```

## 📚 Documentation Standards

### Component Documentation Template
```typescript
/**
 * Generic{Name}Component
 * 
 * @description Brief description of the component's purpose
 * @example
 * ```html
 * <app-generic-{name} 
 *   [config]="config"
 *   [data]="data"
 *   (action)="handleAction($event)">
 * </app-generic-{name}>
 * ```
 * 
 * @inputs
 * - config: Component configuration object
 * - data: Data to display/manipulate
 * - loading: Loading state indicator
 * 
 * @outputs
 * - action: Emitted when user performs an action
 * - selectionChange: Emitted when selection changes
 * - error: Emitted when an error occurs
 */
```

## 🚀 Integration with Existing Modules

### Usage in Feature Modules
```typescript
// Example usage in project module
@Component({
  template: `
    <app-generic-list
      [config]="listConfig"
      [data]="projects$ | async"
      [loading]="loading$ | async"
      (action)="handleProjectAction($event)"
      (selectionChange)="onSelectionChange($event)">
    </app-generic-list>
  `
})
export class ProjectListComponent {
  listConfig: TListConfig<TProject> = {
    columns: [
      { key: 'name', label: 'Project Name', sortable: true },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' }
    ],
    actions: [
      { type: 'edit', label: 'Edit', icon: 'edit' },
      { type: 'delete', label: 'Delete', icon: 'delete' }
    ],
    selectable: 'multiple',
    searchable: true,
    sortable: true,
    paginated: true
  };
}
```

## 📈 Benefits

### Development Efficiency
- **Reduced Development Time**: Reusable components eliminate repetitive coding
- **Consistent UX**: Standardized behavior across all modules
- **Easier Maintenance**: Single point of updates for common functionality
- **Type Safety**: Generic implementation ensures type safety

### Code Quality
- **DRY Principle**: Don't Repeat Yourself
- **Single Responsibility**: Each component has a clear purpose
- **Testability**: Isolated, well-defined components are easier to test
- **Documentation**: Comprehensive documentation for each component

### Scalability
- **Easy Extension**: New features can leverage existing components
- **Performance**: Optimized components with best practices
- **Accessibility**: Built-in accessibility features
- **Internationalization**: Support for multiple languages

## 🎯 Success Metrics

### Quantitative Metrics
- [ ] 80% reduction in duplicate code across modules
- [ ] 90% of CRUD operations use generic components
- [ ] 95% test coverage for all generic components
- [ ] 100% TypeScript strict mode compliance

### Qualitative Metrics
- [ ] Consistent user experience across all modules
- [ ] Faster development of new features
- [ ] Improved code maintainability
- [ ] Enhanced developer experience

This comprehensive plan for generic components will significantly improve the development efficiency and consistency of the Sokoke Planner application while maintaining high code quality and user experience standards.
