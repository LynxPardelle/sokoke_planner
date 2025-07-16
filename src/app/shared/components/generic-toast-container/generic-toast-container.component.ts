import { 
  Component, 
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GenericComponentsService } from '../../services/generic-components.service';
import { GenericToastComponent } from '../generic-toast/generic-toast.component';
import { TToastConfig } from '../../types/generic-component.types';

/**
 * GenericToastContainerComponent
 * 
 * @description Container component that displays all active toast notifications
 * @example
 * ```html
 * <app-generic-toast-container></app-generic-toast-container>
 * ```
 */
@Component({
  selector: 'app-generic-toast-container',
  standalone: true,
  imports: [CommonModule, GenericToastComponent],
  templateUrl: './generic-toast-container.component.html',
  styleUrls: ['./generic-toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GenericToastContainerComponent implements OnInit, OnDestroy {
  private genericService = inject(GenericComponentsService);
  private cdr = inject(ChangeDetectorRef);
  private subscription?: Subscription;

  toasts: (TToastConfig & { id: string })[] = [];

  ngOnInit(): void {
    // Subscribe to toast notifications
    this.subscription = this.genericService.toasts$.subscribe(toasts => {
      this.toasts = toasts as (TToastConfig & { id: string })[];
      console.log('Toast container updated with toasts:', this.toasts);
      this.cdr.markForCheck(); // Trigger change detection
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Handle toast dismissal
   */
  onToastDismiss(id: string): void {
    console.log('Dismissing toast:', id);
    this.genericService.removeToast(id);
  }

  /**
   * Track by function for toast list
   */
  trackByToastId(index: number, toast: TToastConfig & { id: string }): string {
    return toast.id;
  }

  /**
   * Get position classes for the container
   */
  getContainerClasses(): string[] {
    const classes = [
      'toast-container',
      'position-fixed',
      'p-3'
    ];

    // Default to top-right if no specific position
    classes.push('top-0', 'end-0');

    return classes;
  }
}
