import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseGenericComponent } from '../base-generic/base-generic.component';
import { TButtonConfig } from '../../types/generic-component.types';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedService } from '@app/shared/services/shared.service';

/**
 * GenericButtonComponent
 *
 * @description Standardized button component with consistent styling, behavior and NgxAngora integration
 * @example
 * ```html
 * <generic-button
 *   [config]="buttonConfig"
 *   [loading]="isLoading"
 *   [disabled]="isDisabled"
 *   (click)="handleClick()"
 *   (doubleClick)="handleDoubleClick()">
 *   Save Changes
 * </generic-button>
 * ```
 *
 * @inputs
 * - config: Button configuration object
 * - loading: Loading state
 * - disabled: Disabled state
 * - text: Button text (alternative to content projection)
 *
 * @outputs
 * - click: Emitted on button click (with debouncing)
 * - doubleClick: Emitted on double click
 * - focus: Emitted on focus
 * - blur: Emitted on blur
 */
@Component({
  selector: 'generic-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GenericButtonComponent
  extends BaseGenericComponent
  implements OnInit, OnChanges
{
  public randomId: string = '';
  @Input() override config?: TButtonConfig;
  @Input() text?: string;
  @Input() buttonType: 'button' | 'submit' | 'reset' = 'button';
  @Output() click = new EventEmitter<Event>();
  @Output() doubleClick = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();
  @Output() buttonId = new EventEmitter<any>();

  // Component state
  buttonConfig: TButtonConfig = {};
  isPressed = false;

  // Click handling with debouncing
  private clickSubject = new Subject<Event>();

  get isDisabled(): boolean {
    return (
      this.disabled ||
      this.buttonConfig.disabled ||
      this.loading ||
      this.buttonConfig.loading ||
      false
    );
  }

  constructor(private _sharedService: SharedService) {
    super();
  }

  override ngOnInit(): void {
    this.setUpId();
    super.ngOnInit();
    this.setupButtonConfig();
    this.setupClickHandling();
    this.applyButtonClasses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.setupButtonConfig();
      this.applyButtonClasses();
    }
  }

  protected getComponentName(): string {
    return 'button';
  }

  private setUpId(): void {
    this.randomId = this._sharedService.harshify(9, 'letters');
    this.buttonId.emit(this.randomId);
  }
  /**
   * Setup button configuration with defaults
   */
  private setupButtonConfig(): void {
    this.buttonConfig = {
      type: 'primary',
      size: 'md',
      variant: 'solid',
      loading: false,
      disabled: false,
      iconPosition: 'left',
      debounceTime: 300,
      fullWidth: false,
      rounded: 'md',
      shadow: false,
      pulse: false,
      animate: true,
      cssClasses: [],
      ...this.config,
    };
  }

  /**
   * Setup click handling with debouncing
   */
  private setupClickHandling(): void {
    this.clickSubject
      .pipe(
        debounceTime(this.buttonConfig.debounceTime || 300),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.click.emit(event);
        this.emitAction('click', undefined, event);
      });
  }

  /**
   * Apply CSS classes for button styling
   */
  private applyButtonClasses(): void {
    // Clear any existing classes first to prevent accumulation

    const baseClasses = [
      'generic-button',
      'btn',
      'position-relative',
      'd-inline-flex',
      'align-items-center',
      'justify-content-center',
    ];

    // Type and variant classes
    switch (this.buttonConfig.variant) {
      case 'solid':
        baseClasses.push(`ank-btn-${this.buttonConfig.type}`);
         switch (this.buttonConfig.type) {
          case 'primary':
          case 'secondary':
          case 'success':
          case 'info':
          case 'danger':
          case 'dark':
          case 'accent':
            baseClasses.push(`ank-text-light`);
            break;
          case 'warning':
          case 'light':
          default:
            baseClasses.push(`ank-text-dark`);
            break;
        }
        break;
      case 'outline':
        switch (this.buttonConfig.type) {
          case 'primary':
          case 'secondary':
          case 'success':
          case 'info':
          case 'danger':
          case 'dark':
          case 'accent':
            baseClasses.push(`ank-btnOutline-${this.buttonConfig.type}-light`);
            break;
          case 'warning':
          case 'light':
          default:
            baseClasses.push(`ank-btnOutline-${this.buttonConfig.type}-dark`);
            break;
        }
        break;
      case 'ghost':
        baseClasses.push(`ank-text-${this.buttonConfig.type}`);
        baseClasses.push(`ank-bg-transparent`);
        baseClasses.push(`ank-bc-transparent`);
        baseClasses.push(
          `ank-bgHoverDPSnotSDDPSdisabledED-${this.buttonConfig.type}__OPA__0_1`
        );
        break;
      default:
        break;
    }

    // Size classes - always add size class to ensure proper sizing
    if (this.buttonConfig.size) {
      baseClasses.push(`btn-${this.buttonConfig.size}`);
    }

    // Width classes
    if (this.buttonConfig.fullWidth) {
      baseClasses.push(
        'w-100 ank-wSEL__COM__genericMINbuttonHasSD_wMIN100ED-100per'
      );
    }

    // Rounded classes
    if (this.buttonConfig.rounded) {
      if (typeof this.buttonConfig.rounded === 'boolean') {
        baseClasses.push('btn-rounded-md');
      } else {
        baseClasses.push(`btn-rounded-${this.buttonConfig.rounded}`);
      }
    }
    if(this.buttonConfig.iconPosition === 'only') {
      // If icon only, ensure rounded is applied
      baseClasses.push('btn-rounded-full');
    }

    // Shadow classes
    if (this.buttonConfig.shadow) {
      if (typeof this.buttonConfig.shadow === 'boolean') {
        baseClasses.push('btn-shadow-md');
      } else {
        baseClasses.push(`btn-shadow-${this.buttonConfig.shadow}`);
      }
    }

    // Animation classes
    if (this.buttonConfig.animate) {
      baseClasses.push('btn-animate');
    }

    if (this.buttonConfig.pulse) {
      baseClasses.push('btn-pulse');
    }

    // Merge with custom angora classes
    this.cssClasses = [...baseClasses, ...(this.buttonConfig.cssClasses || [])];
  }

  /**
   * Handle click events
   */
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Prevent double-firing by checking if this is already being handled
    if ((event as any)._genericButtonHandled) {
      return;
    }
    (event as any)._genericButtonHandled = true;

    this.clickSubject.next(event);
    this.addActionAnimation();
  }

  /**
   * Handle double click events
   */
  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: Event): void {
    if (this.isDisabled) {
      return;
    }
    this.doubleClick.emit(event);
  }

  /**
   * Handle focus events
   */
  onFocus(): void {
    this.focus.emit();
    this.applyButtonClasses();
  }

  /**
   * Handle blur events
   */
  onBlur(): void {
    this.blur.emit();
    this.applyButtonClasses();
  }

  /**
   * Handle mouse down events
   */
  onMouseDown(): void {
    this.isPressed = true;
    this.applyButtonClasses();
  }

  /**
   * Handle mouse up events
   */
  onMouseUp(): void {
    this.isPressed = false;
    this.applyButtonClasses();
  }

  /**
   * Add action animation effect
   */
  protected override addActionAnimation(): void {
    if (this.buttonConfig.animate) {
      if (this.cssClasses.includes('btn-click-animation')) {
        this.cssClasses = this.cssClasses.filter(
          (cls) => cls !== 'btn-click-animation'
        );
      }
      this.cssClasses.push('btn-click-animation');
      setTimeout(() => {
        this.cssClasses = this.cssClasses.filter(
          (cls) => cls !== 'btn-click-animation'
        );
      }, 200);
    }
  }
}
