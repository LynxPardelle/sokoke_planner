import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewEncapsulation 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseGenericComponent } from '../base-generic/base-generic.component';
import { TErrorConfig } from '@app/shared/types/generic-component.types';

/**
 * GenericErrorComponent
 * 
 * @description Standardized error display and handling with NgxAngora integration
 * @example
 * ```html
 * <app-generic-error 
 *   [config]="errorConfig"
 *   [error]="errorObject"
 *   (retry)="handleRetry()"
 *   (report)="handleReport($event)">
 * </app-generic-error>
 * ```
 * 
 * @inputs
 * - config: Error configuration object
 * - error: Error object to display
 * - showActions: Whether to show action buttons
 * 
 * @outputs
 * - retry: Emitted when retry button is clicked
 * - home: Emitted when home button is clicked
 * - report: Emitted when report button is clicked
 */
@Component({
  selector: 'app-generic-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-error.component.html',
  styleUrls: ['./generic-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GenericErrorComponent extends BaseGenericComponent implements OnInit, OnChanges {
  @Input() override config?: TErrorConfig;
  @Output() override error = new EventEmitter<Error>();
  @Input() errorData?: Error | any;
  @Input() showActions = true;

  @Output() retry = new EventEmitter<void>();
  @Output() home = new EventEmitter<void>();
  @Output() report = new EventEmitter<any>();

  // Component state
  errorConfig: TErrorConfig = {};
  showDetails = false;
  retryLoading = false;

  override ngOnInit(): void {
    super.ngOnInit();
    this.setupErrorConfig();
    this.applyErrorAngoraClasses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if config or errorData inputs have changed
    if (changes['config'] || changes['errorData']) {
      this.setupErrorConfig();
      this.applyErrorAngoraClasses();
    }
  }

  protected getComponentName(): string {
    return 'error';
  }
  /**
   * Setup error configuration with defaults
   */
  private setupErrorConfig(): void {
    // Use provided config type if available, otherwise determine from error data
    const errorType = this.config?.type || this.determineErrorType();
    
    this.errorConfig = {
      type: errorType,
      title: this.getDefaultTitle(errorType),
      message: this.getDefaultMessage(errorType),
      icon: this.getDefaultIcon(errorType),
      showRetry: true,
      showHome: true,
      showReport: false,
      retryText: 'Retry',
      homeText: 'Go Home',
      reportText: 'Report Issue',
      size: 'md',
      centered: true,
      fullHeight: false,
      cssClasses: [],
      ...this.config
    };

    // Set details from error object if available and not already provided in config
    if (this.errorData && !this.errorConfig.details) {
      this.errorConfig.details = this.formatErrorDetails();
    }
  }

  /**
   * Apply NgxAngora classes for error styling
   */
  private applyErrorAngoraClasses(): void {
    const baseClasses = [
      'error-container',
      'p-4'
    ];

    if (this.errorConfig.centered) {
      baseClasses.push('d-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'text-center');
    }

    if (this.errorConfig.fullHeight) {
      baseClasses.push('min-vh-100');
    }

    // Add size-based classes
    if (this.errorConfig.size) {
      baseClasses.push(`error-${this.errorConfig.size}`);
    }

    // Add type-based classes
    if (this.errorConfig.type) {
      baseClasses.push(`error-type-${this.errorConfig.type}`);
    }

    // Add responsive classes
    if (this.responsive) {
      baseClasses.push(...this.createResponsiveClasses('error-responsive'));
    }

    // Merge with custom angora classes
    this.cssClasses = [...baseClasses, ...(this.errorConfig.cssClasses || [])];
    this.applyAngoraUtilities(this.cssClasses);
  }
  /**
   * Determine error type from error object
   */
  private determineErrorType(): TErrorConfig['type'] {
    if (!this.errorData) return 'custom';

    if (this.errorData.status === 404) return '404';
    if (this.errorData.status >= 500) return '500';
    if (this.errorData.name === 'NetworkError' || this.errorData.type === 'network') return 'network';
    if (this.errorData.name === 'ValidationError' || this.errorData.type === 'validation') return 'validation';
    if (this.errorData.status === 403 || this.errorData.type === 'permission') return 'permission';

    return 'custom';
  }

  /**
   * Get default title based on error type
   */
  private getDefaultTitle(type?: TErrorConfig['type']): string {
    const titles = {
      '404': '404 - Page Not Found',
      '500': '500 - Server Error',
      'network': 'Network Error',
      'validation': 'Validation Error',
      'permission': 'Access Denied',
      'custom': 'An Error Occurred'
    };

    return titles[type || 'custom'];
  }

  /**
   * Get default message based on error type
   */
  private getDefaultMessage(type?: TErrorConfig['type']): string {
    const messages = {
      '404': 'The page you are looking for could not be found.',
      '500': 'An internal server error occurred. Please try again later.',
      'network': 'Unable to connect to the server. Please check your connection.',
      'validation': 'Please check your input and try again.',
      'permission': 'You do not have permission to access this resource.',
      'custom': 'Something went wrong. Please try again.'
    };

    return messages[type || 'custom'];
  }

  /**
   * Get default icon based on error type
   */
  getDefaultIcon(type?: TErrorConfig['type']): string {
    const icons = {
      '404': 'fas fa-search',
      '500': 'fas fa-server',
      'network': 'fas fa-wifi',
      'validation': 'fas fa-exclamation-triangle',
      'permission': 'fas fa-lock',
      'custom': 'fas fa-exclamation-circle'
    };

    return icons[type || 'custom'];
  }
  /**
   * Format error details for display
   */
  private formatErrorDetails(): string {
    if (!this.errorData) return '';

    try {
      if (typeof this.errorData === 'string') {
        return this.errorData;
      }

      if (this.errorData.stack) {
        return this.errorData.stack;
      }

      return JSON.stringify(this.errorData, null, 2);
    } catch {
      return String(this.errorData);
    }
  }

  /**
   * Get error title for display
   */
  getErrorTitle(): string {
    if (this.config?.title) return this.config.title;
    if (this.errorData?.message && this.errorConfig.type === 'custom') return this.errorData.message;
    return this.errorConfig.title || '';
  }

  /**
   * Get error message for display
   */
  getErrorMessage(): string {
    if (this.config?.message) return this.config.message;
    if (this.errorData?.message && this.errorConfig.type !== 'custom') return this.errorData.message;
    return this.errorConfig.message || '';
  }

  /**
   * Toggle error details visibility
   */
  toggleDetails(): void {
    this.showDetails = !this.showDetails;
    this.emitAction('toggleDetails', undefined, undefined, { showDetails: this.showDetails });
  }
  /**
   * Handle retry action
   */
  onRetry(): void {
    this.retryLoading = true;
    this.retry.emit();
    this.emitAction('retry', this.errorData);

    // Reset loading state after delay
    setTimeout(() => {
      this.retryLoading = false;
    }, 1000);
  }

  /**
   * Handle home action
   */
  onHome(): void {
    this.home.emit();
    this.emitAction('home', this.errorData);
  }

  /**
   * Handle report action
   */
  onReport(): void {
    const reportData = {
      error: this.errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.report.emit(reportData);
    this.emitAction('report', reportData);
  }

  // Style helper methods
  getErrorClasses(): string[] {
    const classes = ['error-container'];
    
    if (this.errorConfig.centered) {
      classes.push('error-centered');
    }

    if (this.errorConfig.fullHeight) {
      classes.push('error-full-height');
    }

    if (this.errorConfig.size) {
      classes.push(`error-${this.errorConfig.size}`);
    }

    return classes;
  }

  getIconClass(): string {
    return this.errorConfig.icon || this.getDefaultIcon();
  }

  getIconClasses(): string[] {
    const classes = [`icon-${this.errorConfig.type}`, `icon-${this.errorConfig.size}`];
    return classes;
  }

  getContentClasses(): string[] {
    return ['error-content-container'];
  }

  getTitleClasses(): string[] {
    return [`title-${this.errorConfig.size}`];
  }

  getMessageClasses(): string[] {
    return [`message-${this.errorConfig.size}`];
  }

  getDetailsClasses(): string[] {
    return ['error-details-container'];
  }

  getDetailsContentClasses(): string[] {
    return ['details-content'];
  }

  getToggleClasses(): string[] {
    return ['details-toggle'];
  }

  getActionsClasses(): string[] {
    return ['error-actions-container'];
  }

  getRetryClasses(): string[] {
    const classes = ['retry-btn'];
    if (this.retryLoading) classes.push('loading');
    return classes;
  }

  getHomeClasses(): string[] {
    return ['home-btn'];
  }

  getReportClasses(): string[] {
    return ['report-btn'];
  }

  /**
   * Handle responsive updates
   */
  protected override onResponsiveUpdate(breakpoint: string): void {
    // Adjust error size based on breakpoint
    if (breakpoint === 'xs' || breakpoint === 'sm') {
      this.errorConfig.size = 'sm';
    } else if (breakpoint === 'md') {
      this.errorConfig.size = 'md';
    } else {
      this.errorConfig.size = 'lg';
    }

    this.applyErrorAngoraClasses();
  }
}
