import { 
  Component, 
  Input, 
  OnInit, 
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewEncapsulation 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseGenericComponent } from '../base-generic/base-generic.component';
import { TLoadingConfig } from '../../types/generic-component.types';

/**
 * GenericLoadingComponent
 * 
 * @description A versatile loading component with multiple styles and NgxAngora integration
 * @example
 * ```html
 * <app-generic-loading 
 *   [config]="loadingConfig"
 *   [loading]="true"
 *   [text]="'Loading data...'">
 * </app-generic-loading>
 * ```
 * 
 * @inputs
 * - config: Loading configuration object
 * - text: Loading text to display
 * - loading: Whether to show loading indicator
 * 
 * @outputs
 * - timeout: Emitted when loading timeout is reached
 */
@Component({
  selector: 'app-generic-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-loading.component.html',
  styleUrls: ['./generic-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GenericLoadingComponent extends BaseGenericComponent implements OnInit, OnChanges {
  @Input() text?: string;
  @Input() override config?: TLoadingConfig;

  // Computed properties
  loadingConfig: TLoadingConfig = {};
  skeletonLines: number[] = [];
  private timeoutHandle?: number;

  override ngOnInit(): void {
    super.ngOnInit();
    this.setupLoadingConfig();
    this.setupTimeout();
    this.generateSkeletonLines();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['text'] || changes['loading']) {
      this.setupLoadingConfig();
      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = undefined;
      }
      this.setupTimeout();
      if (changes['config']) {
        this.generateSkeletonLines();
      }
    }
  }

  protected getComponentName(): string {
    return 'loading';
  }

  /**
   * Setup loading configuration with defaults
   */
  private setupLoadingConfig(): void {
    this.loadingConfig = {
      type: 'spinner',
      size: 'md',
      color: 'primary',
      overlay: false,
      backdrop: false,
      text: this.text || this.config?.text,
      textPosition: 'bottom',
      timeout: 0,
      fullScreen: false,
      transparent: false,
      blur: false,
      cssClasses: [],
      ...this.config
    };

    console.log('Loading component setupLoadingConfig:', this.loadingConfig);

    // Ensure text is always shown if provided
    if (this.text && !this.loadingConfig.text) {
      this.loadingConfig.text = this.text;
    }

    // Apply NgxAngora classes for loading state
    this.applyLoadingAngoraClasses();
  }

  /**
   * Apply NgxAngora classes for loading styling
   */
  private applyLoadingAngoraClasses(): void {
    const baseClasses = [
      'position-relative',
      'loading-container'
    ];

    if (this.loadingConfig.overlay) {
      baseClasses.push('position-absolute', 'inset-0', 'z-index-1000');
    }

    if (this.loadingConfig.backdrop) {
      baseClasses.push('bg-black', 'bg-opacity-50');
    }

    if (this.loadingConfig.fullScreen) {
      baseClasses.push('position-fixed', 'w-100', 'h-100', 'top-0', 'left-0');
    }

    if (this.loadingConfig.transparent) {
      baseClasses.push('bg-transparent');
    }

    if (this.loadingConfig.blur) {
      baseClasses.push('backdrop-blur');
    }

    // Add size-based classes
    baseClasses.push(`loading-${this.loadingConfig.size}`);

    // Add color-based classes
    baseClasses.push(`text-${this.loadingConfig.color}`);

    // Apply responsive classes
    if (this.responsive) {
      baseClasses.push(...this.createResponsiveClasses('loading-responsive'));
    }

    // Merge with custom angora classes
    this.cssClasses = [...baseClasses, ...(this.loadingConfig.cssClasses || [])];
    this.applyAngoraUtilities(this.cssClasses);
  }

  /**
   * Setup loading timeout
   */
  private setupTimeout(): void {
    if (this.loadingConfig.timeout && this.loadingConfig.timeout > 0) {
      this.timeoutHandle = window.setTimeout(() => {
        this.emitAction('timeout', undefined, undefined, { 
          timeoutDuration: this.loadingConfig.timeout 
        });
      }, this.loadingConfig.timeout);
    }
  }

  /**
   * Generate skeleton lines for skeleton type
   */
  private generateSkeletonLines(): void {
    if (this.loadingConfig.type === 'skeleton') {
      this.skeletonLines = Array.from({ length: 3 }, (_, i) => i);
    }
  }

  /**
   * Get loading container classes
   */
  getLoadingClasses(): string[] {
    const classes = ['loading-container', 'd-flex', 'align-items-center', 'justify-content-center'];
    
    if (this.loadingConfig.size) {
      classes.push(`loading-${this.loadingConfig.size}`);
    }

    if (this.loadingConfig.color) {
      classes.push(`loading-${this.loadingConfig.color}`, `text-${this.loadingConfig.color}`);
    }

    if (this.loadingConfig.overlay || this.loadingConfig.fullScreen) {
      classes.push('flex-column');
    }

    return classes;
  }

  /**
   * Get loading container styles
   */
  getLoadingStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    const theme = this.getEffectiveTheme();

    if (this.loadingConfig.overlay || this.loadingConfig.fullScreen) {
      styles['min-height'] = '100px';
    }

    if (this.loadingConfig.backdrop) {
      styles['background-color'] = 'rgba(0, 0, 0, 0.5)';
    }

    if (this.loadingConfig.transparent) {
      styles['background-color'] = 'transparent';
    }

    return { ...styles};
  }

  /**
   * Get spinner specific classes
   */
  getSpinnerClasses(): string[] {
    const classes = ['d-flex', 'align-items-center', 'justify-content-center'];
    
    if (this.loadingConfig.size) {
      classes.push(`spinner-${this.loadingConfig.size}`);
    }

    if (this.loadingConfig.color) {
      classes.push(`text-${this.loadingConfig.color}`);
    }

    return classes;
  }

  /**
   * Get dots specific classes
   */
  getDotClasses(): string[] {
    const classes = ['d-flex', 'gap-2', 'align-items-center', 'justify-content-center'];
    
    if (this.loadingConfig.size) {
      classes.push(`dots-${this.loadingConfig.size}`);
    }

    if (this.loadingConfig.color) {
      classes.push(`text-${this.loadingConfig.color}`);
    }

    return classes;
  }

  /**
   * Get progress specific classes
   */
  getProgressClasses(): string[] {
    const classes = ['w-100'];
    
    if (this.loadingConfig.size) {
      classes.push(`progress-${this.loadingConfig.size}`);
    }

    if (this.loadingConfig.color) {
      classes.push(`text-${this.loadingConfig.color}`);
    }

    return classes;
  }

  /**
   * Get pulse specific classes
   */
  getPulseClasses(): string[] {
    const classes = ['d-flex', 'align-items-center', 'justify-content-center'];
    
    if (this.loadingConfig.size) {
      classes.push(`pulse-${this.loadingConfig.size}`);
    }

    if (this.loadingConfig.color) {
      classes.push(`text-${this.loadingConfig.color}`);
    }

    return classes;
  }

  /**
   * Get wave specific classes
   */
  getWaveClasses(): string[] {
    const classes = ['d-flex', 'align-items-end', 'justify-content-center', 'gap-1'];
    
    if (this.loadingConfig.size) {
      classes.push(`wave-${this.loadingConfig.size}`);
    }

    if (this.loadingConfig.color) {
      classes.push(`text-${this.loadingConfig.color}`);
    }

    return classes;
  }

  /**
   * Get skeleton specific classes
   */
  getSkeletonClasses(): string[] {
    const classes = ['w-100'];
    
    if (this.loadingConfig.size) {
      classes.push(`skeleton-${this.loadingConfig.size}`);
    }

    return classes;
  }

  /**
   * Get text specific classes
   */
  getTextClasses(): string[] {
    const classes = ['loading-text'];
    
    if (this.loadingConfig.textPosition) {
      classes.push(`text-${this.loadingConfig.textPosition}`);
    }

    if (this.loadingConfig.size) {
      classes.push(`fs-${this.loadingConfig.size}`);
    }

    if (this.loadingConfig.color) {
      classes.push(`text-${this.loadingConfig.color}`);
    }

    // Add NgxAngora text classes
    classes.push('text-center', 'mt-2');

    return classes;
  }

  /**
   * Get color value for current loading type
   */
  getColorValue(): string {
    const colorMap: { [key: string]: string } = {
      'primary': '#0d6efd',
      'secondary': '#6c757d',
      'success': '#198754',
      'warning': '#ffc107',
      'danger': '#dc3545',
      'info': '#0dcaf0'
    };
    
    return colorMap[this.loadingConfig.color || 'primary'] || '#0d6efd';
  }

  /**
   * Handle responsive updates
   */
  protected override onResponsiveUpdate(breakpoint: string): void {
    // Adjust loading size based on breakpoint
    if (breakpoint === 'xs' || breakpoint === 'sm') {
      this.loadingConfig.size = 'sm';
    } else if (breakpoint === 'md') {
      this.loadingConfig.size = 'md';
    } else {
      this.loadingConfig.size = 'lg';
    }

    this.applyLoadingAngoraClasses();
  }

  /**
   * Cleanup timeout on destroy
   */
  override ngOnDestroy(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    super.ngOnDestroy();
  }
}
