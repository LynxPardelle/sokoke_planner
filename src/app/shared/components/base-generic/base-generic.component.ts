import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
  AfterViewInit,
  afterNextRender,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { NgxAngoraService } from 'ngx-angora-css';
import {
  TComponentConfig,
  TComponentAction,
  TGenericTheme,
} from '../../types/generic-component.types';
import { AsyncErrorHandler } from '../../utils/async-error-handler.util';

/**
 * Base class for all generic components with NgxAngora integration
 * Provides common functionality like theming, responsive utilities, and lifecycle management
 */
@Component({
  template: '',
  standalone: true,
})
export abstract class BaseGenericComponent<T = any>
  implements OnInit, OnDestroy, AfterViewInit
{
  protected destroyRef = inject(DestroyRef);
  protected cdr = inject(ChangeDetectorRef);
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);
  protected _ank = inject(NgxAngoraService);

  // Base inputs
  @Input() loading = false;
  @Input() disabled = false;
  @Input() config?: TComponentConfig<T>;
  @Input() theme?: TGenericTheme;
  @Input() data?: T | T[];
  @Input() responsive = true;
  @Input() cssClasses: string[] = [];
  @Input() debugMode = false;

  // Base outputs
  @Output() action = new EventEmitter<TComponentAction<T>>();
  @Output() selectionChange = new EventEmitter<T | T[]>();
  @Output() error = new EventEmitter<Error>();
  @Output() loading$ = new EventEmitter<boolean>();
  @Output() ready = new EventEmitter<void>();

  // Internal subjects for reactive programming
  protected destroy$ = new Subject<void>();
  protected loadingSubject = new BehaviorSubject<boolean>(false);
  protected errorSubject = new Subject<Error>();
  protected configSubject = new BehaviorSubject<
    TComponentConfig<T> | undefined
  >(undefined);

  // Component state
  protected componentId: string;
  protected initialized = false;
  protected angoraInitialized = false;

  // Default theme matching Sokoke colors
  protected defaultTheme: TGenericTheme = {
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
  constructor() {
    this.componentId = this.generateComponentId();
    this.setupReactiveProperties();

    // Use afterNextRender to ensure NgxAngora operations run only in browser
    afterNextRender(() => {
      this.initializeAngora();
      this.applyComponentStyles();
      this.setupResponsiveHandling();
      if (this.debugMode) {
        console.log(
          `[${this.componentId}] Browser-specific initialization completed`
        );
      }
      this.initialized = true;
      this.ready.emit();
    });
  }

  ngOnInit(): void {
    this.initializeComponent();
  }
  ngAfterViewInit(): void {
    // Basic initialization that doesn't require browser APIs
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupAngoraResources();

    // Clean up any pending timeouts or async operations
    this.cleanupAsyncOperations();
  }

  /**
   * Clean up async operations to prevent memory leaks
   */
  protected cleanupAsyncOperations(): void {
    // Override in derived components to clean up specific async operations
    if (this.debugMode) {
      console.log(`[${this.componentId}] Cleaning up async operations`);
    }
  }

  /**
   * Initialize component with configuration and theme
   */
  protected initializeComponent(): void {
    // Merge default theme with provided theme
    const mergedTheme = this.mergeThemes(this.defaultTheme, this.theme);

    // Setup reactive configuration
    this.configSubject.next(this.config);

    // Setup loading state
    this.loadingSubject.next(this.loading);
    this.loadingSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => {
        this.loading$.emit(loading);
        this.updateAngoraClasses();
      });

    // Setup error handling
    this.errorSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        this.error.emit(error);
        this.handleError(error);
      });

    if (this.debugMode) {
      console.log(
        `[${this.componentId}] Component initialized with theme:`,
        mergedTheme
      );
    }
  }
  /**
   * Initialize NgxAngora service integration
   * Only runs in browser context to avoid SSR issues
   */
  protected initializeAngora(): void {
    // Additional safety check for browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      if (this.debugMode) {
        console.log(
          `[${this.componentId}] Skipping NgxAngora initialization - not in browser`
        );
      }
      return;
    }

    try {
      this._ank.pushColors(this.getEffectiveTheme().colors);
      this._ank.values.importantActive = true;

      // Enable responsive utilities
      if (this.responsive) {
        this.enableAngoraResponsive();
      }

      this.angoraInitialized = true;

      if (this.debugMode) {
        console.log(
          `[${this.componentId}] NgxAngora initialized with colors:`,
          this.getEffectiveTheme().colors
        );
      }
    } catch (error) {
      console.error(
        `[${this.componentId}] Failed to initialize NgxAngora:`,
        error
      );
      this.errorSubject.next(error as Error);
    }
  }
  /**
   * Apply component-specific styles using NgxAngora
   * Only runs in browser context to avoid SSR issues
   */
  protected applyComponentStyles(): void {
    // Browser check for SSR safety
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      if (this.debugMode) {
        console.log(
          `[${this.componentId}] Skipping style application - not in browser`
        );
      }
      return;
    }
  }
  /**
   * Setup responsive behavior using NgxAngora
   * Only runs in browser context to avoid SSR issues
   */
  protected setupResponsiveHandling(): void {
    if (!this.responsive) return;

    // Setup window resize handling for responsive behavior
    if (typeof window !== 'undefined') {
      let resizeObserver: ResizeObserver | undefined;

      try {
        resizeObserver = new ResizeObserver(() => {
          // Use requestAnimationFrame to prevent rapid-fire calls
          requestAnimationFrame(() => {
            this.handleBreakpointChange(this.getCurrentBreakpoint());
          });
        });

        resizeObserver.observe(this.elementRef.nativeElement);

        // Cleanup on destroy
        this.destroy$.subscribe(() => {
          if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = undefined;
          }
        });
      } catch (error) {
        console.error(
          `[${this.componentId}] Error setting up responsive handling:`,
          error
        );
      }
    } else if (this.debugMode) {
      console.log(
        `[${this.componentId}] Skipping responsive setup - not in browser`
      );
    }
  }

  /**
   * Get current breakpoint based on window width
   */
  protected getCurrentBreakpoint(): string {
    if (typeof window === 'undefined') return 'md';

    const width = window.innerWidth;
    const theme = this.getEffectiveTheme();

    if (width < parseInt(theme.breakpoints.sm)) return 'xs';
    if (width < parseInt(theme.breakpoints.md)) return 'sm';
    if (width < parseInt(theme.breakpoints.lg)) return 'md';
    if (width < parseInt(theme.breakpoints.xl)) return 'lg';
    if (width < parseInt(theme.breakpoints.xxl)) return 'xl';
    return 'xxl';
  }

  /**
   * Handle breakpoint changes for responsive behavior
   */
  protected handleBreakpointChange(breakpoint: string): void {
    // Remove old breakpoint classes
    const theme = this.getEffectiveTheme();
    Object.keys(theme.breakpoints).forEach((bp) => {
      this.cssClasses = this.cssClasses.filter(
        (cls) => !cls.startsWith(`breakpoint-${bp}`)
      );
    });

    // Add current breakpoint class
    this.cssClasses.push(`breakpoint-${breakpoint}`);

    // Trigger responsive update
    this.onResponsiveUpdate(breakpoint);
    this.cdr.detectChanges();
  }

  /**
   * Override this method in child components for responsive behavior
   */
  protected onResponsiveUpdate(breakpoint: string): void {
    // Child components can override this
  }
  /**
   * Enable NgxAngora responsive utilities
   * Only runs in browser context to avoid SSR issues
   */
  protected enableAngoraResponsive(): void {
    // Browser check for SSR safety
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      if (this.debugMode) {
        console.log(
          `[${this.componentId}] Skipping NgxAngora responsive - not in browser`
        );
      }
      return;
    }

    // Enable NgxAngora's responsive features by setting up CSS classes
    this._ank.cssCreate();
  }

  /**
   * Update NgxAngora classes based on component state
   */
  protected updateAngoraClasses(): void {
    if (!this.angoraInitialized) return;

    // Update loading state classes
    if (this.loading) {
      this.cssClasses.push('loading-state', 'loading-pulse');
    } else {
      this.cssClasses = this.cssClasses.filter(
        (cls) => cls !== 'loading-state' && cls !== 'loading-pulse'
      );
    }

    // Update disabled state classes
    if (this.disabled) {
      this.cssClasses.push(
        'disabled-state',
        'opacity-50',
        'pointer-events-none'
      );
    } else {
      this.cssClasses = this.cssClasses.filter(
        (cls) =>
          cls !== 'disabled-state' &&
          cls !== 'opacity-50' &&
          cls !== 'pointer-events-none'
      );
    }
  }

  /**
   * Setup reactive properties and subscriptions
   */
  protected setupReactiveProperties(): void {
    // Watch for config changes
    this.configSubject
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((config) => {
        if (config && this.initialized) {
          this.onConfigChange(config);
        }
      });
  }

  /**
   * Handle configuration changes
   */
  protected onConfigChange(config: TComponentConfig<T>): void {
    if (config.cssClasses) {
      this.cssClasses = [...config.cssClasses];
    }

    this.applyComponentStyles();
    this.cdr.detectChanges();
  }

  /**
   * Emit an action event with NgxAngora animation support
   */
  protected emitAction(
    type: string,
    data?: T,
    event?: Event,
    meta?: any
  ): void {
    const actionEvent: TComponentAction<T> = {
      type,
      data,
      event,
      meta: {
        ...meta,
        componentId: this.componentId,
        timestamp: new Date().toISOString(),
      },
    };

    // Add action animation using NgxAngora
    this.addActionAnimation();

    this.action.emit(actionEvent);

    if (this.debugMode) {
      console.log(`[${this.componentId}] Action emitted:`, actionEvent);
    }
  }

  /**
   * Add action animation using NgxAngora utilities
   */
  protected addActionAnimation(): void {
    // Add pulse animation
    this.cssClasses.push('action-pulse');

    // Remove animation class after animation completes
    const animationCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.cssClasses = this.cssClasses.filter((cls) => cls !== 'action-pulse');
    }, 300);

    // Store cleanup for component destruction
    this.destroy$.subscribe(() => {
      animationCleanup();
    });
  }

  /**
   * Handle errors with NgxAngora styling
   */
  protected handleError(error: Error): void {
    // Add error state styling
    this.cssClasses.push('error-state', 'border-error', 'text-error');

    // Remove error styling after delay
    const errorCleanup = AsyncErrorHandler.safeTimeout(() => {
      this.cssClasses = this.cssClasses.filter(
        (cls) =>
          cls !== 'error-state' &&
          cls !== 'border-error' &&
          cls !== 'text-error'
      );
    }, 3000);

    // Store cleanup for component destruction
    this.destroy$.subscribe(() => {
      errorCleanup();
    });

    if (this.debugMode) {
      console.error(`[${this.componentId}] Error handled:`, error);
    }
  }

  /**
   * Set loading state with NgxAngora effects
   */
  protected setLoading(loading: boolean): void {
    this.loading = loading;
    this.loadingSubject.next(loading);
    this.updateAngoraClasses();
  }

  /**
   * Get effective theme (merged default + provided)
   */
  protected getEffectiveTheme(): TGenericTheme {
    return this.mergeThemes(this.defaultTheme, this.theme);
  }

  /**
   * Merge themes deeply
   */
  protected mergeThemes(
    defaultTheme: TGenericTheme,
    customTheme?: TGenericTheme
  ): TGenericTheme {
    if (!customTheme) return defaultTheme;

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
   * Generate unique component ID
   */
  protected generateComponentId(): string {
    return `${this.getComponentName()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  /**
   * Get component name for styling and debugging
   */
  protected abstract getComponentName(): string;

  /**
   * Cleanup NgxAngora resources
   */
  protected cleanupAngoraResources(): void {
    // Clean up any NgxAngora specific resources
    if (this.angoraInitialized) {
      // Remove custom colors if needed
      // this._ank.removeColors?.();
    }
  }

  /**
   * Utility method to apply NgxAngora utility classes
   */
  protected applyAngoraUtilities(classes: string[]): void {
    classes.forEach((className) => {
      this.cssClasses.push(className);
    });
  }

  /**
   * Utility method to remove NgxAngora utility classes
   */
  protected removeAngoraUtilities(classes: string[]): void {
    classes.forEach((className) => {
      this.cssClasses = this.cssClasses.filter((cls) => cls !== className);
    });
  }

  /**
   * Create NgxAngora responsive class names
   */
  protected createResponsiveClasses(
    baseClass: string,
    breakpoints?: string[]
  ): string[] {
    const theme = this.getEffectiveTheme();
    const bps = breakpoints || Object.keys(theme.breakpoints);

    return bps.map((bp) => `${bp}:${baseClass}`);
  }

  /**
   * Apply conditional NgxAngora classes
   */
  protected applyConditionalClasses(conditions: {
    [className: string]: boolean;
  }): void {
    Object.entries(conditions).forEach(([className, condition]) => {
      if (condition) {
        this.cssClasses.push(className);
      } else {
        this.cssClasses = this.cssClasses.filter((cls) => cls !== className);
      }
    });
  }
}
