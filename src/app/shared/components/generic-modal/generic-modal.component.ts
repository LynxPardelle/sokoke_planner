import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseGenericComponent } from '../base-generic/base-generic.component';
import { TModalConfig } from '../../types/generic-component.types';

/**
 * GenericModalComponent
 * 
 * @description Reusable modal dialog with various configurations and NgxAngora integration
 * @example
 * ```html
 * <app-generic-modal 
 *   [config]="modalConfig"
 *   [visible]="showModal"
 *   [title]="'Confirm Action'"
 *   (close)="onModalClose()"
 *   (confirm)="onModalConfirm()">
 *   <ng-container modal-body>
 *     <p>Are you sure you want to proceed?</p>
 *   </ng-container>
 * </app-generic-modal>
 * ```
 * 
 * @inputs
 * - config: Modal configuration object
 * - visible: Whether modal is visible
 * - title: Modal title
 * - closable: Whether modal can be closed
 * - confirmText: Confirm button text
 * - cancelText: Cancel button text
 * 
 * @outputs
 * - close: Emitted when modal is closed
 * - confirm: Emitted when confirm button is clicked
 * - cancel: Emitted when cancel button is clicked
 */
@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class GenericModalComponent extends BaseGenericComponent implements OnInit, OnChanges {
  private modalCdr = inject(ChangeDetectorRef);
  
  @ViewChild('modalElement', { static: false }) modalElement?: ElementRef;

  @Input() override config?: TModalConfig;
  @Input() visible = false;
  @Input() title?: string;
  @Input() closable = true;
  @Input() confirmText?: string;
  @Input() cancelText?: string;
  @Input() showConfirmButton = false;
  @Input() showCancelButton = false;
  @Input() confirmDisabled = false;
  @Input() confirmLoading = false;
  @Input() bodyTemplate?: TemplateRef<any>;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() backdrop = new EventEmitter<void>();

  // Component state
  modalConfig: TModalConfig = {};
  showDefaultFooter = false;
  hasFooterContent = false;

  override ngOnInit(): void {
    super.ngOnInit();
    console.log('Modal component initialized');
    console.log('Initial visible state:', this.visible);
    console.log('Initial config:', this.config);
    console.log('Initial button states - Confirm:', this.showConfirmButton, 'Cancel:', this.showCancelButton);
    
    this.setupModalConfig();
    this.setupFooterLogic();
    this.applyModalAngoraClasses();
    this.setupKeyboardHandling();
    
    console.log('Modal config after setup:', this.modalConfig);
    console.log('Footer state after setup - showDefaultFooter:', this.showDefaultFooter, 'hasFooterContent:', this.hasFooterContent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      console.log('Modal visibility changed:', changes['visible'].currentValue);
      if (changes['visible'].currentValue) {
        console.log('Modal should be visible now');
      } else {
        console.log('Modal should be hidden now');
      }
    }
    
    if (changes['config']) {
      console.log('Modal config changed:', changes['config'].currentValue);
      this.setupModalConfig();
    }

    // Update footer logic when button visibility changes
    if (changes['showConfirmButton'] || changes['showCancelButton']) {
      console.log('Button visibility changed - Confirm:', this.showConfirmButton, 'Cancel:', this.showCancelButton);
      this.setupFooterLogic();
    }
  }

  protected getComponentName(): string {
    return 'modal';
  }

  /**
   * Setup modal configuration with defaults
   */
  private setupModalConfig(): void {
    this.modalConfig = {
      size: 'md',
      backdrop: true,
      keyboard: true,
      centered: false,
      scrollable: false,
      fade: true,
      fullscreen: false,
      closeButton: true,
      header: true,
      footer: true,
      draggable: false,
      resizable: false,
      zIndex: 1055,
      cssClasses: [],
      ...this.config
    };
  }

  /**
   * Setup footer logic
   */
  private setupFooterLogic(): void {
    this.showDefaultFooter = this.showConfirmButton || this.showCancelButton;
    console.log('Footer logic setup - showConfirmButton:', this.showConfirmButton, 'showCancelButton:', this.showCancelButton, 'showDefaultFooter:', this.showDefaultFooter);
    
    // Check if footer content is projected
    // For now, we'll set hasFooterContent to false as it requires ViewChild checking
    this.hasFooterContent = false;
    
    // Force change detection to update the template
    this.modalCdr.detectChanges();
  }

  /**
   * Apply NgxAngora classes for modal styling
   */
  private applyModalAngoraClasses(): void {
    const baseClasses = [
      'modal-container',
      'd-block'
    ];

    if (this.modalConfig.fade) {
      baseClasses.push('fade-animation');
    }

    // Add responsive classes
    if (this.responsive) {
      baseClasses.push(...this.createResponsiveClasses('modal-responsive'));
    }

    // Merge with custom angora classes
    this.cssClasses = [...baseClasses, ...(this.modalConfig.cssClasses || [])];
    this.applyAngoraUtilities(this.cssClasses);
  }
  /**
   * Setup keyboard event handling
   * Only runs in browser context to avoid SSR issues
   */
  private setupKeyboardHandling(): void {
    if (this.modalConfig.keyboard && typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  /**
   * Handle keyboard events
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.visible && this.closable) {
      this.onClose();
    }
  }

  /**
   * Handle backdrop click
   */
  onBackdropClick(): void {
    if (this.modalConfig.backdrop === true && this.closable) {
      this.onClose();
    }
    this.backdrop.emit();
    this.emitAction('backdrop');
  }

  /**
   * Handle modal close
   */
  onClose(): void {
    if (!this.closable) return;
    
    this.visible = false;
    this.modalCdr.detectChanges();
    this.close.emit();
    this.emitAction('close');
  }

  /**
   * Handle confirm action
   */
  onConfirm(): void {
    this.confirm.emit();
    this.emitAction('confirm');
  }

  /**
   * Handle cancel action
   */
  onCancel(): void {
    this.cancel.emit();
    this.emitAction('cancel');
  }

  // Style helper methods
  getModalClasses(): string[] {
    const classes = [];
    
    if (this.modalConfig.fade) {
      classes.push('fade');
    }

    return classes;
  }

  getModalStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    
    if (this.modalConfig.zIndex) {
      styles['z-index'] = this.modalConfig.zIndex.toString();
    }

    return { ...styles};
  }

  getBackdropClasses(): string[] {
    const classes = [];
    
    if (this.modalConfig.backdrop === 'static') {
      classes.push('backdrop-static');
    }

    return classes;
  }

  getDialogClasses(): string[] {
    const classes = [];
    
    if (this.modalConfig.size) {
      classes.push(`modal-${this.modalConfig.size}`);
    }

    if (this.modalConfig.centered) {
      classes.push('modal-dialog-centered');
    }

    if (this.modalConfig.scrollable) {
      classes.push('modal-dialog-scrollable');
    }

    if (this.modalConfig.fullscreen === true) {
      classes.push('modal-fullscreen');
    } else if (this.modalConfig.fullscreen) {
      classes.push(`modal-fullscreen-${this.modalConfig.fullscreen}`);
    }

    return classes;
  }

  getDialogStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    
    if (this.modalConfig.draggable) {
      styles['cursor'] = 'move';
    }

    return styles;
  }

  getContentClasses(): string[] {
    const classes = [];
    
    if (this.modalConfig.draggable) {
      classes.push('modal-draggable');
    }

    return classes;
  }

  getHeaderClasses(): string[] {
    return [];
  }

  getTitleClasses(): string[] {
    return [];
  }

  getCloseButtonClasses(): string[] {
    return [];
  }

  getBodyClasses(): string[] {
    return [];
  }

  getFooterClasses(): string[] {
    return [];
  }

  getCancelButtonClasses(): string[] {
    return ['modal-cancel-btn'];
  }

  getConfirmButtonClasses(): string[] {
    const classes = ['modal-confirm-btn'];
    
    if (this.confirmLoading) {
      classes.push('loading');
    }

    return classes;
  }

  /**
   * Handle responsive updates
   */
  protected override onResponsiveUpdate(breakpoint: string): void {
    // Adjust modal size based on breakpoint
    if (breakpoint === 'xs' || breakpoint === 'sm') {
      this.modalConfig.size = 'sm';
      this.modalConfig.fullscreen = 'sm';
    } else if (breakpoint === 'md') {
      this.modalConfig.size = 'md';
    } else {
      this.modalConfig.size = 'lg';
    }

    this.applyModalAngoraClasses();
  }
  /**
   * Cleanup keyboard events
   * Only runs in browser context to avoid SSR issues
   */
  override ngOnDestroy(): void {
    // Browser check for SSR safety
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }
    super.ngOnDestroy();
  }
}
