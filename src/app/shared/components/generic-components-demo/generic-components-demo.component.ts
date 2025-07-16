import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  GenericLoadingComponent,
  GenericErrorComponent,
  GenericModalComponent,
  TLoadingConfig,
  TButtonConfig,
  TModalConfig
} from '..';
import { GenericComponentsService } from '../../services/generic-components.service';
import { GenericButtonComponent } from '../generic-button/generic-button.component';
import { AsyncErrorHandler } from '../../utils/async-error-handler.util';

/**
 * GenericComponentsDemoComponent
 * 
 * Demonstration component showcasing all the generic components
 * with NgxAngora integration and Sokoke theme
 */
@Component({
  selector: 'app-generic-components-demo',
  standalone: true,
  imports: [
    CommonModule,
    GenericLoadingComponent,
    GenericErrorComponent,
    GenericModalComponent,
    GenericButtonComponent
  ],
  templateUrl: './generic-components-demo.component.html',
  styleUrls: ['./generic-components-demo.component.scss']
})
export class GenericComponentsDemoComponent implements OnInit, OnDestroy {
  private genericService = inject(GenericComponentsService);
  private themeChangeCleanup?: () => void;
  private buttonClickCleanup?: () => void;
  private loadingChangeCleanup?: () => void;
  private errorChangeCleanup?: () => void;
  private lastButtonClick?: string;
  private lastThemeChange?: string;
  private lastLoadingChange?: string;
  private lastErrorChange?: string;

  // Button configurations with distinct sizes
  primaryButtonConfig: TButtonConfig = {
    type: 'primary',
    variant: 'solid',
    size: 'sm',
    animate: true
  };

  secondaryButtonConfig: TButtonConfig = {
    type: 'secondary',
    variant: 'solid',
    size: 'md',
    animate: true
  };

  successButtonConfig: TButtonConfig = {
    type: 'success',
    variant: 'solid',
    size: 'lg',
    animate: true
  };

  resetButtonConfig: TButtonConfig = {
    type: 'warning',
    variant: 'outline',
    size: 'md',
    animate: true
  };

  // Component states
  buttonLoading = false;
  showLoading = false;
  showError = false;
  showModalDemo = false;

  // Loading configuration
  currentLoadingConfig: TLoadingConfig = {
    type: 'spinner',
    size: 'md',
    color: 'primary'
  };
  loadingText = 'Loading...';

  // Error configuration
  currentErrorConfig: any = {};
  currentError: any = {};

  // Modal configuration
  modalTitle = '';
  modalContent = '';
  currentModalConfig: TModalConfig = {};
  showConfirmButton = false;
  showCancelButton = false;

  ngOnInit(): void {
    // Initialize the service with Sokoke theme
    this.genericService.applySokokeEnhancements();
    console.log('Generic Components Demo initialized');
    
    // Register component-specific error handler for Chrome extension errors
    AsyncErrorHandler.getInstance().registerErrorHandler(
      'generic-components-demo',
      (error: any) => {
        // Additional component-level error handling if needed
        console.warn('Component-level error handled:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Unregister error handler
    AsyncErrorHandler.getInstance().unregisterErrorHandler('generic-components-demo');
    
    // Clean up all timeouts to prevent memory leaks
    if (this.themeChangeCleanup) {
      this.themeChangeCleanup();
      this.themeChangeCleanup = undefined;
    }
    if (this.buttonClickCleanup) {
      this.buttonClickCleanup();
      this.buttonClickCleanup = undefined;
    }
    if (this.loadingChangeCleanup) {
      this.loadingChangeCleanup();
      this.loadingChangeCleanup = undefined;
    }
    if (this.errorChangeCleanup) {
      this.errorChangeCleanup();
      this.errorChangeCleanup = undefined;
    }
    if (this.toastDebounceCleanup) {
      this.toastDebounceCleanup();
      this.toastDebounceCleanup = undefined;
    }
    
    // Clear any component state that might cause async issues
    this.lastButtonClick = undefined;
    this.lastThemeChange = undefined;
    this.lastLoadingChange = undefined;
    this.lastErrorChange = undefined;
    this.lastToastType = undefined;
    this.showLoading = false;
    this.showError = false;
    this.showModalDemo = false;
    this.buttonLoading = false;
  }

  /**
   * Debounced theme application to prevent multiple triggers
   */
  private applyThemeDebounced(themeConfig: any, message: string, themeType: string): void {
    // Prevent rapid successive calls of the same theme type
    if (this.lastThemeChange === themeType && this.themeChangeCleanup) {
      console.log('Theme change prevented - same type already pending:', themeType);
      return;
    }

    this.lastThemeChange = themeType;
    
    // Clear any pending theme change
    if (this.themeChangeCleanup) {
      this.themeChangeCleanup();
      this.themeChangeCleanup = undefined;
    }

    // Apply theme immediately since updateTheme already has debouncing
    try {
      this.genericService.updateTheme(themeConfig);
      this.genericService.showSuccess(message, 'Theme Updated');
    } catch (error) {
      console.error('Error applying theme:', error);
      this.genericService.showError('Failed to apply theme', 'Theme Error');
    }

    // Reset the debounce after a delay
    this.themeChangeCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.lastThemeChange = undefined;
      this.themeChangeCleanup = undefined;
    }, 1000);
  }

  // Theme methods
  applyPrimaryTheme(): void {
    this.applyThemeDebounced({
      colors: {
        primary: '#CD9965',
        secondary: '#A17246',
        accent: '#19363F',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        background: '#F2EDE1',
        surface: '#ffffff',
        text: '#462F14'
      }
    }, 'Primary theme applied!', 'primary');
  }

  applyDarkTheme(): void {
    this.applyThemeDebounced({
      colors: {
        primary: '#343a40',
        secondary: '#495057',
        background: '#212529',
        surface: '#343a40',
        text: '#ffffff',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        accent: '#6f42c1'
      }
    }, 'Dark theme applied!', 'dark');
  }

  applySuccessTheme(): void {
    this.applyThemeDebounced({
      colors: {
        primary: '#28a745',
        secondary: '#20c997',
        accent: '#17a2b8',
        success: '#155724',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#0c5460',
        background: '#f8f9fa',
        surface: '#ffffff',
        text: '#212529'
      }
    }, 'Success theme applied!', 'success');
  }

  resetTheme(): void {
    // Prevent rapid successive calls
    if (this.lastThemeChange === 'reset' && this.themeChangeCleanup) {
      console.log('Theme reset prevented - already pending');
      return;
    }

    this.lastThemeChange = 'reset';
    
    // Clear any pending theme change
    if (this.themeChangeCleanup) {
      this.themeChangeCleanup();
      this.themeChangeCleanup = undefined;
    }
    
    try {
      this.genericService.resetTheme();
      this.genericService.showInfo('Theme reset to default Sokoke colors', 'Theme Reset');
    } catch (error) {
      console.error('Error resetting theme:', error);
      this.genericService.showError('Failed to reset theme', 'Theme Error');
    }

    // Reset the debounce after a delay
    this.themeChangeCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.lastThemeChange = undefined;
      this.themeChangeCleanup = undefined;
    }, 1000);
  }

  // Button methods
  onButtonClick(buttonType: string): void {
    // Prevent rapid-fire clicks on the same button
    if (this.lastButtonClick === buttonType && this.buttonClickCleanup) {
      return;
    }

    this.lastButtonClick = buttonType;
    
    // Clear existing timeout
    if (this.buttonClickCleanup) {
      this.buttonClickCleanup();
      this.buttonClickCleanup = undefined;
    }

    try {
      console.log('Button clicked:', buttonType);
      this.genericService.showInfo(`${buttonType} button clicked!`, 'Button Action');
    } catch (error) {
      console.error('Error handling button click:', error);
    }

    // Reset the debounce after a short delay
    this.buttonClickCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.lastButtonClick = undefined;
      this.buttonClickCleanup = undefined;
    }, 500);
  }

  toggleLoading(): void {
    this.buttonLoading = !this.buttonLoading;
    if (this.buttonLoading) {
      setTimeout(() => {
        this.buttonLoading = false;
      }, 3000);
    }
  }

  // Loading methods
  showLoadingType(type: string): void {
    // Prevent rapid successive calls of the same loading type
    if (this.lastLoadingChange === type && this.loadingChangeCleanup) {
      console.log('Loading change prevented - same type already pending:', type);
      return;
    }

    this.lastLoadingChange = type;
    console.log('Showing loading type:', type);
    
    // Clear existing timeout
    if (this.loadingChangeCleanup) {
      this.loadingChangeCleanup();
      this.loadingChangeCleanup = undefined;
    }
    
    // First hide loading to reset state
    this.showLoading = false;
    
    // Use setTimeout to ensure DOM updates properly
    setTimeout(() => {
      this.currentLoadingConfig = {
        type: type as any,
        size: 'md',
        color: 'primary',
        text: `Loading with ${type}...`
      };
      this.loadingText = `Loading with ${type}...`;
      this.showLoading = true;
      console.log('Current loading config:', this.currentLoadingConfig);
    }, 50);

    // Reset the debounce after a delay
    this.loadingChangeCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.lastLoadingChange = undefined;
      this.loadingChangeCleanup = undefined;
    }, 1000);
  }

  hideLoading(): void {
    this.showLoading = false;
  }

  // Error methods
  showErrorType(type: string): void {
    // Prevent rapid successive calls of the same error type
    if (this.lastErrorChange === type && this.errorChangeCleanup) {
      console.log('Error change prevented - same type already pending:', type);
      return;
    }

    this.lastErrorChange = type;
    console.log('Showing error type:', type);
    
    // Clear existing timeout
    if (this.errorChangeCleanup) {
      this.errorChangeCleanup();
      this.errorChangeCleanup = undefined;
    }
    
    // Always hide current error first to ensure proper state reset
    this.showError = false;
    
    // Use setTimeout to ensure DOM updates before showing new error
    setTimeout(() => {
      this.currentErrorConfig = {
        type: type as any,
        size: 'md',
        centered: true,
        showRetry: true,
        showHome: true,
        showReport: true
      };

      // Create mock error object based on type
      switch (type) {
        case '404':
          this.currentError = { status: 404, message: 'Page not found' };
          break;
        case '500':
          this.currentError = { status: 500, message: 'Internal server error' };
          break;
        case 'network':
          this.currentError = { type: 'network', message: 'Network connection failed' };
          break;
        case 'validation':
          this.currentError = { type: 'validation', message: 'Validation failed' };
          break;
        case 'permission':
          this.currentError = { status: 403, type: 'permission', message: 'Access denied' };
          break;
      }

      this.showError = true;
    }, 50);

    // Reset the debounce after a delay
    this.errorChangeCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.lastErrorChange = undefined;
      this.errorChangeCleanup = undefined;
    }, 1000);
  }

  hideError(): void {
    this.showError = false;
  }

  onErrorRetry(): void {
    this.genericService.showInfo('Retry action triggered', 'Error Action');
    this.hideError();
  }

  onErrorHome(): void {
    this.genericService.showInfo('Home action triggered', 'Error Action');
    this.hideError();
  }

  onErrorReport(data: any): void {
    console.log('Error report data:', data);
    this.genericService.showInfo('Error report sent', 'Error Action');
  }

  // Modal methods
  showModal(type: string): void {
    console.log('Showing modal type:', type);
    
    switch (type) {
      case 'simple':
        this.modalTitle = 'Simple Modal';
        this.modalContent = 'This is a simple modal example.';
        this.currentModalConfig = { size: 'md' };
        this.showConfirmButton = false;
        this.showCancelButton = false;
        break;
      case 'confirmation':
        this.modalTitle = 'Confirmation Required';
        this.modalContent = 'Are you sure you want to proceed with this action?';
        this.currentModalConfig = { size: 'md', centered: true };
        this.showConfirmButton = true;
        this.showCancelButton = true;
        break;
      case 'large':
        this.modalTitle = 'Large Modal';
        this.modalContent = 'This is a large modal with more content space.';
        this.currentModalConfig = { size: 'lg' };
        this.showConfirmButton = false;
        this.showCancelButton = false;
        break;
      case 'fullscreen':
        this.modalTitle = 'Fullscreen Modal';
        this.modalContent = 'This modal takes up the entire screen on smaller devices.';
        this.currentModalConfig = { size: 'xl', fullscreen: 'md' };
        this.showConfirmButton = false;
        this.showCancelButton = false;
        break;
    }
    
    console.log('Modal config:', this.currentModalConfig);
    console.log('Show confirm button:', this.showConfirmButton);
    console.log('Show cancel button:', this.showCancelButton);
    
    this.showModalDemo = true;
    console.log('Modal demo visibility set to:', this.showModalDemo);
  }

  hideModal(): void {
    console.log('Hiding modal');
    this.showModalDemo = false;
  }

  onModalConfirm(): void {
    console.log('Modal confirmed');
    this.genericService.showSuccess('Action confirmed!', 'Modal Action');
    this.hideModal();
  }

  onModalCancel(): void {
    console.log('Modal cancelled');
    this.genericService.showInfo('Action cancelled', 'Modal Action');
    this.hideModal();
  }

  // Toast methods
  private lastToastType?: string;
  private toastDebounceCleanup?: () => void;

  private showToastDebounced(type: string, method: () => void): void {
    // Prevent rapid successive calls of the same toast type
    if (this.lastToastType === type && this.toastDebounceCleanup) {
      return;
    }

    this.lastToastType = type;
    
    // Clear existing timeout
    if (this.toastDebounceCleanup) {
      this.toastDebounceCleanup();
      this.toastDebounceCleanup = undefined;
    }

    try {
      method();
    } catch (error) {
      console.error('Error showing toast:', error);
    }

    // Reset the debounce after a delay
    this.toastDebounceCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.lastToastType = undefined;
      this.toastDebounceCleanup = undefined;
    }, 1000);
  }

  showSuccessToast(): void {
    this.showToastDebounced('success', () => {
      this.genericService.showSuccess('This is a success message!', 'Success');
    });
  }

  showErrorToast(): void {
    this.showToastDebounced('error', () => {
      this.genericService.showError('This is an error message!', 'Error');
    });
  }

  showWarningToast(): void {
    this.showToastDebounced('warning', () => {
      this.genericService.showWarning('This is a warning message!', 'Warning');
    });
  }

  showInfoToast(): void {
    this.showToastDebounced('info', () => {
      this.genericService.showInfo('This is an info message!', 'Information');
    });
  }
}
