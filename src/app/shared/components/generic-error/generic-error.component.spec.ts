import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChanges } from '@angular/core';
import { GenericErrorComponent, TErrorConfig } from './generic-error.component';

// Mock the BaseGenericComponent
class MockBaseGenericComponent {
  responsive = true;
  customStyles = {};
  cssClasses: string[] = [];
  
  ngOnInit() {}
  getComponentName() { return 'error'; }
  applyAngoraUtilities(classes: string[]) {}
  createResponsiveClasses(prefix: string) { return []; }
  emitAction(action: string, data?: any, target?: any, meta?: any) {}
  onResponsiveUpdate(breakpoint: string) {}
}

describe('GenericErrorComponent - Input Changes', () => {
  let component: GenericErrorComponent;
  let fixture: ComponentFixture<GenericErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericErrorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericErrorComponent);
    component = fixture.componentInstance;
    
    // Mock the parent class methods
    (component as any).__proto__.__proto__ = MockBaseGenericComponent.prototype;
  });

  it('should update error config when config input changes', () => {
    // Initial setup
    const initialConfig: TErrorConfig = { type: '404' };
    component.config = initialConfig;
    component.ngOnInit();

    expect(component.errorConfig.type).toBe('404');
    expect(component.errorConfig.title).toBe('404 - Page Not Found');

    // Simulate input change
    const newConfig: TErrorConfig = { type: '500' };
    component.config = newConfig;
    
    const changes: SimpleChanges = {
      config: {
        currentValue: newConfig,
        previousValue: initialConfig,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.errorConfig.type).toBe('500');
    expect(component.errorConfig.title).toBe('500 - Server Error');
  });

  it('should update error config when errorData input changes', () => {
    // Initial setup
    const initialError = { status: 404, message: 'Page not found' };
    component.errorData = initialError;
    component.ngOnInit();

    expect(component.errorConfig.type).toBe('404');

    // Simulate errorData change
    const newError = { status: 500, message: 'Server error' };
    component.errorData = newError;
    
    const changes: SimpleChanges = {
      errorData: {
        currentValue: newError,
        previousValue: initialError,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.errorConfig.type).toBe('500');
    expect(component.errorConfig.title).toBe('500 - Server Error');
  });

  it('should prioritize config type over errorData type', () => {
    // Setup with conflicting type information
    component.config = { type: 'network', title: 'Custom Network Error' };
    component.errorData = { status: 404, message: 'Page not found' };
    component.ngOnInit();

    // Should use the config type (network) instead of errorData type (404)
    expect(component.errorConfig.type).toBe('network');
    expect(component.errorConfig.title).toBe('Custom Network Error');
  });

  it('should update both config and errorData when both change', () => {
    // Initial setup
    component.config = { type: '404' };
    component.errorData = { status: 404 };
    component.ngOnInit();

    expect(component.errorConfig.type).toBe('404');

    // Simulate both inputs changing
    const newConfig: TErrorConfig = { type: 'network', title: 'Custom Network Error' };
    const newError = { type: 'network', message: 'Network failed' };
    
    component.config = newConfig;
    component.errorData = newError;
    
    const changes: SimpleChanges = {
      config: {
        currentValue: newConfig,
        previousValue: { type: '404' },
        firstChange: false,
        isFirstChange: () => false
      },
      errorData: {
        currentValue: newError,
        previousValue: { status: 404 },
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.errorConfig.type).toBe('network');
    expect(component.errorConfig.title).toBe('Custom Network Error');
  });
});
