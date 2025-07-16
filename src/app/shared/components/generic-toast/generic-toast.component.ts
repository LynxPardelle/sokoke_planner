import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseGenericComponent } from '../base-generic/base-generic.component';
import { TToastConfig } from '../../types/generic-component.types';

/**
 * GenericToastComponent
 * 
 * @description Individual toast notification component with NgxAngora integration
 * @example
 * ```html
 * <app-generic-toast 
 *   [toast]="toastData"
 *   (dismiss)="onToastDismiss($event)">
 * </app-generic-toast>
 * ```
 */
@Component({
  selector: 'app-generic-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-toast.component.html',
  styleUrls: ['./generic-toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GenericToastComponent extends BaseGenericComponent implements OnInit {
  @Input() toast!: TToastConfig & { id: string };
  @Output() dismiss = new EventEmitter<string>();

  override ngOnInit(): void {
    super.ngOnInit();
    this.applyToastAngoraClasses();
  }

  protected getComponentName(): string {
    return 'toast';
  }

  /**
   * Apply NgxAngora classes for toast styling
   */
  private applyToastAngoraClasses(): void {
    const baseClasses = [
      'toast-notification',
      'd-flex',
      'align-items-center',
      'animate__animated',
      'animate__slideInRight'
    ];

    // Add type-specific classes
    if (this.toast.type) {
      baseClasses.push(`toast-${this.toast.type}`);
    }

    // Add responsive classes
    if (this.responsive) {
      baseClasses.push(...this.createResponsiveClasses('toast-responsive'));
    }

    this.cssClasses = baseClasses;
    this.applyAngoraUtilities(this.cssClasses);
  }

  /**
   * Handle toast dismissal
   */
  onDismiss(): void {
    this.dismiss.emit(this.toast.id);
  }

  /**
   * Handle action click
   */
  onActionClick(action: any): void {
    if (action.action) {
      action.action();
    }
    this.onDismiss();
  }

  /**
   * Get toast icon classes
   */
  getIconClasses(): string[] {
    const classes = ['toast-icon'];
    
    if (this.toast.icon) {
      classes.push(this.toast.icon);
    }

    return classes;
  }

  /**
   * Get toast classes
   */
  getToastClasses(): string[] {
    const classes = [
      'toast',
      'show',
      'd-flex'
    ];

    if (this.toast.type) {
      classes.push(`toast-${this.toast.type}`);
    }

    return classes;
  }
}
