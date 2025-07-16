import { Injectable, inject, afterNextRender } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgxAngoraService } from 'ngx-angora-css';
import { TGenericTheme, TToastConfig } from '../types/generic-component.types';
import { AsyncErrorHandler } from '../utils/async-error-handler.util';

export interface IGenericComponentsConfig {
  theme: TGenericTheme;
  enableResponsive: boolean;
  enableAnimations: boolean;
  enableDebugMode: boolean;
  defaultSizes: {
    button: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    input: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    modal: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };
}

/**
 * GenericComponentsService
 *
 * Service to manage global configuration and state for all generic components
 * Integrates deeply with NgxAngoraService for enhanced styling capabilities
 */
@Injectable({
  providedIn: 'root',
})
export class GenericComponentsService {
  private angoraService = inject(NgxAngoraService);

  // Default Sokoke theme configuration
  private defaultTheme: TGenericTheme = {
    colors: {
      primary: '#A17246',
      secondary: '#59767F',
      tertiary: '#CD9965',
      success: '#199F96',
      warning: '#fFf619',
      danger: '#F36391',
      info: '#6391F3',
      light: '#F2EDE1',
      dark: '#462F14',
      accent: '#19363F',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        xxl: '1.5rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    breakpoints: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
  };

  // Default configuration
  private defaultConfig: IGenericComponentsConfig = {
    theme: this.defaultTheme,
    enableResponsive: true,
    enableAnimations: true,
    enableDebugMode: false,
    defaultSizes: {
      button: 'md',
      input: 'md',
      modal: 'md',
    },
  };

  // Observable configuration state
  private configSubject = new BehaviorSubject<IGenericComponentsConfig>(
    this.defaultConfig
  );
  public config$ = this.configSubject.asObservable();

  // Theme state
  private themeSubject = new BehaviorSubject<TGenericTheme>(this.defaultTheme);
  public theme$ = this.themeSubject.asObservable();

  // Toast notifications state
  private toastsSubject = new BehaviorSubject<TToastConfig[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  // Service state
  private initialized = false;
  private themeUpdateCleanup?: () => void;
  private ngxAngoraOperationPending = false;

  constructor() {
    // Use afterNextRender to ensure NgxAngora operations run only in browser
    afterNextRender(() => {
      this.initializeService();
    });
  }
  /**
   * Initialize the service with NgxAngora integration
   * Only runs in browser context to avoid SSR issues
   */
  private async initializeService(): Promise<void> {
    if (this.initialized) return;

    // Browser check for SSR safety
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.log(
        'GenericComponentsService: Skipping NgxAngora initialization - not in browser'
      );
      return;
    }

    try {
      this.ngxAngoraOperationPending = true;

      // Initialize NgxAngora with Sokoke colors
      this.angoraService.pushColors(this.defaultTheme.colors);
      this.angoraService.values.importantActive = true;

      // Use requestAnimationFrame to ensure DOM is ready and wrap in AsyncErrorHandler
      await AsyncErrorHandler.wrapAsync(async () => {
        return new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            try {
              this.angoraService.cssCreate();
              resolve();
            } catch (error) {
              console.error('Error creating NgxAngora CSS:', error);
              resolve(); // Continue even if CSS creation fails
            }
          });
        });
      });

      this.initialized = true;
      console.log(
        'GenericComponentsService initialized with NgxAngora integration'
      );
    } catch (error) {
      console.error('Failed to initialize GenericComponentsService:', error);
    } finally {
      this.ngxAngoraOperationPending = false;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): IGenericComponentsConfig {
    return this.configSubject.value;
  }

  /**
   * Update global configuration
   */
  updateConfig(config: Partial<IGenericComponentsConfig>): void {
    const currentConfig = this.configSubject.value;
    const newConfig = { ...currentConfig, ...config };

    this.configSubject.next(newConfig);

    // Update theme if it changed
    if (config.theme) {
      this.updateTheme(config.theme);
    }

    // Update NgxAngora settings
    this.updateAngoraSettings(newConfig);
  }

  /**
   * Get current theme
   */
  getTheme(): TGenericTheme {
    return this.themeSubject.value;
  }

  /**
   * Update global theme with debouncing to prevent flickering
   */
  updateTheme(theme: Partial<TGenericTheme>): void {
    // Clear existing timeout to prevent rapid updates
    if (this.themeUpdateCleanup) {
      this.themeUpdateCleanup();
      this.themeUpdateCleanup = undefined;
    }

    // Skip if NgxAngora operation is pending
    if (this.ngxAngoraOperationPending) {
      console.warn(
        'GenericComponentsService: Skipping theme update - NgxAngora operation pending'
      );
      return;
    }

    // Debounce theme updates to prevent flickering
    this.themeUpdateCleanup = AsyncErrorHandler.safeTimeout(() => {
      try {
        const currentTheme = this.themeSubject.value;
        const newTheme = this.mergeThemes(currentTheme, theme);

        this.themeSubject.next(newTheme);
        this.applyThemeToNgxAngora(newTheme);
        this.applyThemeToCSSVariables(newTheme);
      } catch (error) {
        console.error('Error updating theme:', error);
      } finally {
        this.themeUpdateCleanup = undefined;
      }
    }, 100);
  }

  /**
   * Reset theme to default Sokoke theme
   */
  resetTheme(): void {
    this.updateTheme(this.defaultTheme);
  }
  /**
   * Apply theme to NgxAngora
   * Only runs in browser context to avoid SSR issues
   */
  private applyThemeToNgxAngora(theme: TGenericTheme): void {
    // Browser check for SSR safety
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.log(
        'GenericComponentsService: Skipping NgxAngora theme update - not in browser'
      );
      return;
    }

    // Skip if operation is pending or not initialized
    if (this.ngxAngoraOperationPending || !this.initialized) {
      console.warn(
        'GenericComponentsService: Skipping NgxAngora theme update - operation pending or not initialized'
      );
      return;
    }

    try {
      this.ngxAngoraOperationPending = true;
      this.angoraService.pushColors(theme.colors);

      // Use requestAnimationFrame to ensure smooth operation
      requestAnimationFrame(() => {
        try {
          this.angoraService.cssCreate();
        } catch (error) {
          console.error(
            'Error creating NgxAngora CSS during theme update:',
            error
          );
        } finally {
          this.ngxAngoraOperationPending = false;
        }
      });
    } catch (error) {
      console.error('Error applying theme to NgxAngora:', error);
      this.ngxAngoraOperationPending = false;
    }
  }

  /**
   * Apply theme to CSS custom properties
   */
  private applyThemeToCSSVariables(theme: TGenericTheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply typography variables
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString());
    });

    root.style.setProperty('--font-family', theme.typography.fontFamily);

    // Apply border radius variables
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });

    // Apply shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply breakpoint variables
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--breakpoint-${key}`, value);
    });
  }
  /**
   * Update NgxAngora settings based on configuration
   * Only runs in browser context to avoid SSR issues
   */
  private updateAngoraSettings(config: IGenericComponentsConfig): void {
    // Browser check for SSR safety
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.log(
        'GenericComponentsService: Skipping NgxAngora settings update - not in browser'
      );
      return;
    }

    // Skip if operation is pending or not initialized
    if (this.ngxAngoraOperationPending || !this.initialized) {
      console.warn(
        'GenericComponentsService: Skipping NgxAngora settings update - operation pending or not initialized'
      );
      return;
    }

    try {
      this.ngxAngoraOperationPending = true;

      // Enable/disable animations in NgxAngora if supported
      if (config.enableAnimations) {
        // Enable animations
        this.angoraService.values.importantActive = true;
      }

      // Update responsive settings if supported
      if (config.enableResponsive) {
        // Enable responsive features
      }

      // Use requestAnimationFrame to ensure smooth operation
      requestAnimationFrame(() => {
        try {
          this.angoraService.cssCreate();
        } catch (error) {
          console.error(
            'Error creating NgxAngora CSS during settings update:',
            error
          );
        } finally {
          this.ngxAngoraOperationPending = false;
        }
      });
    } catch (error) {
      console.error('Error updating NgxAngora settings:', error);
      this.ngxAngoraOperationPending = false;
    }
  }

  /**
   * Merge themes deeply
   */
  private mergeThemes(
    defaultTheme: TGenericTheme,
    customTheme: Partial<TGenericTheme>
  ): TGenericTheme {
    return {
      colors: { ...defaultTheme.colors, ...customTheme.colors },
      spacing: { ...defaultTheme.spacing, ...customTheme.spacing },
      typography: {
        fontFamily:
          customTheme.typography?.fontFamily ||
          defaultTheme.typography.fontFamily,
        fontSize: {
          ...defaultTheme.typography.fontSize,
          ...customTheme.typography?.fontSize,
        },
        fontWeight: {
          ...defaultTheme.typography.fontWeight,
          ...customTheme.typography?.fontWeight,
        },
      },
      borderRadius: {
        ...defaultTheme.borderRadius,
        ...customTheme.borderRadius,
      },
      shadows: { ...defaultTheme.shadows, ...customTheme.shadows },
      breakpoints: { ...defaultTheme.breakpoints, ...customTheme.breakpoints },
    };
  }

  /**
   * Generate NgxAngora utility classes for a given configuration
   */
  generateAngoraClasses(config: any): string[] {
    const classes: string[] = [];

    // Generate color classes
    if (config.color) {
      classes.push(`text-${config.color}`, `bg-${config.color}`);
    }

    // Generate size classes
    if (config.size) {
      classes.push(`size-${config.size}`);
    }

    // Generate spacing classes
    if (config.margin) {
      classes.push(`m-${config.margin}`);
    }

    if (config.padding) {
      classes.push(`p-${config.padding}`);
    }

    // Generate border classes
    if (config.border) {
      classes.push('border');
    }

    if (config.borderRadius) {
      classes.push(`rounded-${config.borderRadius}`);
    }

    // Generate shadow classes
    if (config.shadow) {
      classes.push(`shadow-${config.shadow}`);
    }

    // Generate responsive classes
    if (config.responsive) {
      Object.keys(this.getTheme().breakpoints).forEach((bp) => {
        classes.push(`${bp}:responsive`);
      });
    }

    return classes;
  }

  /**
   * Toast notification management
   */
  showToast(config: TToastConfig): void {
    const toasts = this.toastsSubject.value;
    const id = Date.now().toString();

    const toast: TToastConfig = {
      ...config,
      message: config.message,
      duration: config.duration || 5000,
      position: config.position || 'top-right',
      type: config.type || 'info',
    };

    this.toastsSubject.next([...toasts, { ...toast, id } as any]); // Auto remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, toast.duration);
    }
  }

  /**
   * Remove toast notification
   */
  removeToast(id: string): void {
    const toasts = this.toastsSubject.value;
    const updatedToasts = toasts.filter((toast: any) => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  /**
   * Show success toast
   */
  showSuccess(message: string, title?: string): void {
    this.showToast({
      type: 'success',
      title,
      message,
      icon: 'fas fa-check-circle',
    });
  }

  /**
   * Show error toast
   */
  showError(message: string, title?: string): void {
    this.showToast({
      type: 'error',
      title,
      message,
      icon: 'fas fa-exclamation-circle',
      duration: 0, // Don't auto-dismiss errors
    });
  }

  /**
   * Show warning toast
   */
  showWarning(message: string, title?: string): void {
    this.showToast({
      type: 'warning',
      title,
      message,
      icon: 'fas fa-exclamation-triangle',
    });
  }

  /**
   * Show info toast
   */
  showInfo(message: string, title?: string): void {
    this.showToast({
      type: 'info',
      title,
      message,
      icon: 'fas fa-info-circle',
    });
  }

  /**
   * Get current breakpoint based on window width
   */
  getCurrentBreakpoint(): string {
    if (typeof window === 'undefined') return 'md';

    const width = window.innerWidth;
    const theme = this.getTheme();

    if (width < parseInt(theme.breakpoints.sm)) return 'xs';
    if (width < parseInt(theme.breakpoints.md)) return 'sm';
    if (width < parseInt(theme.breakpoints.lg)) return 'md';
    if (width < parseInt(theme.breakpoints.xl)) return 'lg';
    if (width < parseInt(theme.breakpoints.xxl)) return 'xl';
    return 'xxl';
  }

  /**
   * Check if current viewport matches breakpoint
   */
  matchesBreakpoint(breakpoint: string): boolean {
    return this.getCurrentBreakpoint() === breakpoint;
  }

  /**
   * Get NgxAngora service instance for direct access
   */
  getAngoraService(): NgxAngoraService {
    return this.angoraService;
  }

  /**
   * Enable debug mode for all components
   */
  enableDebugMode(): void {
    this.updateConfig({ enableDebugMode: true });
  }

  /**
   * Disable debug mode for all components
   */
  disableDebugMode(): void {
    this.updateConfig({ enableDebugMode: false });
  }

  /**
   * Generate component-specific NgxAngora classes
   */
  getComponentClasses(componentType: string, config: any): string[] {
    const baseClasses = [`generic-${componentType}`, 'component-base'];
    const utilityClasses = this.generateAngoraClasses(config);

    return [...baseClasses, ...utilityClasses];
  }
  /**
   * Apply Sokoke-specific styling enhancements
   * Only runs in browser context to avoid SSR issues
   */
  applySokokeEnhancements(): void {
    // Browser check for SSR safety
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.log(
        'GenericComponentsService: Skipping Sokoke enhancements - not in browser'
      );
      return;
    }

    // Skip if operation is pending or not initialized
    if (this.ngxAngoraOperationPending || !this.initialized) {
      console.warn(
        'GenericComponentsService: Skipping Sokoke enhancements - operation pending or not initialized'
      );
      return;
    }

    try {
      this.ngxAngoraOperationPending = true;

      // Push enhanced colors to NgxAngora
      this.angoraService.pushColors(this.defaultTheme.colors);

      // Use requestAnimationFrame to ensure smooth operation
      requestAnimationFrame(() => {
        try {
          this.angoraService.cssCreate();
        } catch (error) {
          console.error(
            'Error creating NgxAngora CSS during Sokoke enhancements:',
            error
          );
        } finally {
          this.ngxAngoraOperationPending = false;
        }
      });
    } catch (error) {
      console.error('Error applying Sokoke enhancements:', error);
      this.ngxAngoraOperationPending = false;
    }
  }
}
