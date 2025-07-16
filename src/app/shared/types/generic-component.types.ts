import { TemplateRef } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

// Base configuration types
export type TComponentConfig<T = any> = {
  id?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  theme?: TGenericTheme;
  responsive?: boolean;
  cssClasses?: string[];
  customStyles?: { [key: string]: string };
};

export type TComponentAction<T = any> = {
  type: string;
  data?: T;
  event?: Event;
  meta?: { [key: string]: any };
};

export type TSelectOption = {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: string;
  description?: string;
};

// Theme configuration for generic components with NgxAngora integration
export type TGenericTheme = {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
    accent: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
};

// Button configuration with NgxAngora support
export type TButtonConfig = {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  variant?: 'solid' | 'outline' | 'ghost' | 'gradient';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right' | 'only';
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  debounceTime?: number;
  fullWidth?: boolean;
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  pulse?: boolean;
  animate?: boolean;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  cssClasses?: string[];
};

// Input configuration with NgxAngora support
export type TInputConfig = {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  successMessage?: string;
  prefix?: string;
  suffix?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  maxLength?: number;
  showCounter?: boolean;
  mask?: string;
  debounceTime?: number;
  autoFocus?: boolean;
  readonly?: boolean;
  required?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'outlined' | 'filled' | 'underlined' | 'borderless';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  floatingLabel?: boolean;
  clearable?: boolean;
  cssClasses?: string[];
};

// List configuration with NgxAngora support
export type TListConfig<T> = {
  columns: TColumnConfig<T>[];
  actions?: TActionConfig<T>[];
  selectable?: 'single' | 'multiple' | false;
  searchable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  itemsPerPage?: number;
  showHeader?: boolean;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  condensed?: boolean;
  responsive?: boolean;
  stickyHeader?: boolean;
  virtualScroll?: boolean;
  groupBy?: keyof T;
  expandable?: boolean;
  checkboxSelection?: boolean;
  bulkActions?: TBulkActionConfig<T>[];
  emptyStateMessage?: string;
  emptyStateIcon?: string;
  loadingRows?: number;
  cssClasses?: string[];
};

export type TColumnConfig<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  type?: 'text' | 'date' | 'datetime' | 'number' | 'currency' | 'percentage' | 'status' | 'badge' | 'custom' | 'actions';
  template?: TemplateRef<any>;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  resizable?: boolean;
  formatter?: (value: any, row: T) => string;
  cellClass?: string | ((value: any, row: T) => string);
  headerClass?: string;
  cssClasses?: string[];
};

export type TActionConfig<T> = {
  type: string;
  label: string;
  icon?: string;
  tooltip?: string;
  visible?: (item: T) => boolean;
  disabled?: (item: T) => boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  confirm?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
  cssClasses?: string[];
};

export type TBulkActionConfig<T> = {
  type: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  disabled?: (items: T[]) => boolean;
  confirm?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
};

// Form configuration with NgxAngora support
export type TFormConfig<T> = {
  fields: TFormFieldConfig<T>[];
  layout?: 'vertical' | 'horizontal' | 'grid' | 'inline';
  columns?: number;
  validation?: TValidationConfig<T>;
  autoSave?: boolean;
  autoSaveDelay?: number;
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showRequired?: boolean;
  showOptional?: boolean;
  collapsible?: boolean;
  sections?: TFormSectionConfig<T>[];
  responsive?: boolean;
  cssClasses?: string[];
};

export type TFormFieldConfig<T> = {
  key: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'date' | 'datetime' | 'time' | 'number' | 'checkbox' | 'radio' | 'file' | 'color' | 'range' | 'switch' | 'tags';
  required?: boolean;
  options?: TSelectOption[];
  placeholder?: string;
  hint?: string;
  validators?: ValidatorFn[];
  conditional?: (value: Partial<T>) => boolean;
  readonly?: boolean;
  hidden?: boolean;
  colSpan?: number;
  rowSpan?: number;
  section?: string;
  group?: string;
  dependsOn?: (keyof T)[];
  defaultValue?: any;
  cssClasses?: string[];
};

export type TFormSectionConfig<T> = {
  title: string;
  description?: string;
  icon?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  fields: (keyof T)[];
  cssClasses?: string[];
};

export type TValidationConfig<T> = {
  rules: { [K in keyof T]?: ValidatorFn[] };
  messages?: { [K in keyof T]?: { [key: string]: string } };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showErrorsOnSubmit?: boolean;
};

// Search configuration with NgxAngora support
export type TSearchConfig<T> = {
  quickSearch?: {
    enabled: boolean;
    fields: (keyof T)[];
    placeholder?: string;
    debounceTime?: number;
    minLength?: number;
    caseSensitive?: boolean;
  };
  advancedFilters?: TFilterConfig<T>[];
  savedSearches?: boolean;
  suggestions?: boolean;
  exportOptions?: TExportOption[];
  searchHistory?: boolean;
  globalSearch?: boolean;
  highlightResults?: boolean;
  cssClasses?: string[];
};

export type TFilterConfig<T> = {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date-range' | 'number-range' | 'boolean' | 'autocomplete';
  options?: TSelectOption[];
  defaultValue?: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn';
  multiple?: boolean;
  clearable?: boolean;
  cssClasses?: string[];
};

export type TExportOption = {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  label: string;
  icon?: string;
  fields?: string[];
};

// Modal configuration with NgxAngora support
export type TModalConfig = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  fade?: boolean;
  fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
  header?: boolean;
  footer?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  zIndex?: number;
  cssClasses?: string[];
};

// Loading configuration with NgxAngora support
export type TLoadingConfig = {
  type?: 'spinner' | 'skeleton' | 'progress' | 'dots' | 'pulse' | 'wave';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  overlay?: boolean;
  backdrop?: boolean;
  text?: string;
  textPosition?: 'bottom' | 'right' | 'left' | 'top';
  timeout?: number;
  fullScreen?: boolean;
  transparent?: boolean;
  blur?: boolean;
  cssClasses?: string[];
};

// Toast configuration with NgxAngora support
export type TToastConfig = {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  closable?: boolean;
  icon?: string;
  actions?: TToastAction[];
  persistent?: boolean;
  animation?: 'fade' | 'slide' | 'bounce' | 'zoom';
  progressBar?: boolean;
  cssClasses?: string[];
};

export type TToastAction = {
  label: string;
  action: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
};

// Generic service interface
export type TGenericService<T> = {
  getAll(query?: TSearchQuery): Observable<TSearchResult<T>>;
  getById(id: string): Observable<T>;
  create(item: Partial<T>): Observable<T>;
  update(id: string, item: Partial<T>): Observable<T>;
  delete(id: string): Observable<void>;
  search?(query: string): Observable<T[]>;
  export?(query?: TSearchQuery, format?: string): Observable<Blob>;
};

export type TSearchQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: { [key: string]: any };
};

export type TSearchResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// Pagination configuration
export type TPaginationConfig = {
  page: number;
  limit: number;
  total: number;
  showSizeSelector?: boolean;
  sizeOptions?: number[];
  showInfo?: boolean;
  showFirst?: boolean;
  showLast?: boolean;
  maxPages?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  cssClasses?: string[];
};

// Chart configuration
export type TChartConfig = {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
  data: any;
  options?: any;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  height?: number;
  width?: number;
  plugins?: any[];
  cssClasses?: string[];
};

// Progress configuration
export type TProgressConfig = {
  type?: 'bar' | 'circle' | 'step';
  value: number;
  max?: number;
  showValue?: boolean;
  showPercentage?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  striped?: boolean;
  animated?: boolean;
  variant?: 'solid' | 'gradient';
  steps?: TProgressStep[];
  cssClasses?: string[];
};

export type TProgressStep = {
  label: string;
  value: number;
  completed?: boolean;
  icon?: string;
  description?: string;
};

// Card configuration
export type TCardConfig = {
  header?: boolean;
  footer?: boolean;
  bordered?: boolean;
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  cssClasses?: string[];
};

export type TErrorConfig = {
  type?: '404' | '500' | 'network' | 'validation' | 'permission' | 'custom';
  title?: string;
  message?: string;
  details?: string;
  icon?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showReport?: boolean;
  retryText?: string;
  homeText?: string;
  reportText?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  fullHeight?: boolean;
  cssClasses?: string[];
};