import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  SimpleChanges,
  Input,
  EnvironmentInjector,
  inject,
  DestroyRef,
  afterNextRender,
  afterRender,
  isDevMode,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
/* RXJS */
import { of } from 'rxjs';
/* Environment */
import { environment } from '../environments/environment';
/* Components */
import { HeaderComponent } from './core/components/layout/header/header.component';
import { FooterComponent } from './core/components/layout/footer/footer.component';
import { GenericToastContainerComponent } from './shared/components/generic-toast-container/generic-toast-container.component';
/* Types */
import { TUser } from './user/types/user.type';
/* Libraries */
import { NgxAngoraService } from 'ngx-angora-css';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    GenericToastContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent
  implements
    OnInit,
    OnDestroy,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked
{
  @Input() testInput: string = '';
  public colors: { [key: string]: string } = {
    // Standard color palette
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
  };
  public customCssNamesParsed: { [key: string]: string | string[] } = {
    sqr: ['width', 'height'],
    alIte: 'align-items',
    jusCont: 'justify-content',
    flDir: 'flex-direction',
    verAli: 'vertical-align',
    uSel: 'user-select',
    bor: 'border',
    lh: 'line-height',
    trnsf: 'transform',
    trnsion: 'transition',
    cur: 'cursor',
    fw: 'font-weight',
    whtSp: 'white-space',
    out: 'outline',
    pnt: 'pointer-events',
    ani: 'animation',
  };
  public showFooter: boolean = true;
  public identity:
    | (Omit<TUser, 'password' & 'verifyToken'> &
        Partial<Pick<TUser, 'name' & 'lastName' & 'username'>>)
    | undefined;

  // Para demostración de takeUntilDestroyed
  private destroyRef = inject(DestroyRef);
  private envInjector = inject(EnvironmentInjector);

  constructor(private _ank: NgxAngoraService) {
    // Log environment info
    console.log(
      `Application running in ${
        environment.production ? 'production' : 'development'
      } mode`
    );
    console.log(`API endpoint: ${environment.apiUrl}`);

    // Ejemplo de uso de takeUntilDestroyed (Angular 16+)
    of('test')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) =>
        console.log('Observable with automatic cleanup:', val)
      );

    // Usar afterNextRender para código después del primer render (Angular 16+)
    afterNextRender(() => {
      this._ank.checkSheet();
      this._ank.values.importantActive = true;
      this._ank.pushColors(this.colors);
      this._ank.pushCssNamesParsed(this.customCssNamesParsed);
      // this._ank.changeDebugOption();
      // console.log('afterNextRender - Modern way to handle post-render logic');
      this.cssCreate();
    });

    // Usar afterRender para código después de cada render
    afterRender(() => {
      // console.log('afterRender - Runs after each render cycle');
      this.cssCreate();
    });
  }

  ngOnInit() {
    // console.log('AppComponent ngOnInit');
    this.setupAngoraCombos();
  }

  ngOnDestroy() {
    console.log('AppComponent ngOnDestroy');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('AppComponent ngOnChanges', changes);
  }

  ngDoCheck() {
    // console.log('AppComponent ngDoCheck');
  }

  ngAfterContentInit() {
    // console.log('AppComponent ngAfterContentInit');
  }

  ngAfterContentChecked() {
    // console.log('AppComponent ngAfterContentChecked');
  }

  ngAfterViewInit() {
    // console.log('AppComponent ngAfterViewInit');
  }

  ngAfterViewChecked() {
    // console.log('AppComponent ngAfterViewChecked');
  }
  // SSR lifecycle hooks (Angular 17+)
  ngOnRenderHydrated() {
    console.log('AppComponent ngOnRenderHydrated - Called after hydration');
  }

  ngAfterNextRender() {
    console.log(
      'AppComponent ngAfterNextRender - Called after initial rendering'
    );
  }

  // Este método se ejecuta solo en el servidor
  ngOnSSRServerRender() {
    console.log('AppComponent ngOnSSRServerRender - Server-side rendering');
    // Solo se ejecutará en el servidor
    if (typeof window === 'undefined') {
      console.log('Running on server during SSR');
    }
  }

  // Este método se ejecuta sólo en el cliente después de hidratación
  ngOnHydrated() {
    console.log('AppComponent ngOnHydrated - Client has been hydrated');
  }

  // Método para ejecutar código de forma run-once en effect (Angular 17+)
  runEffects() {
    this.envInjector.runInContext(() => {
      // Código que se ejecutará una vez en un contexto de inyección
      console.log('Running in environment injector context');
    });
  }

  /*
   *
   */
  private setupAngoraCombos(): void {
    const defaultCombos: { [key: string]: string[] } = {
      'generic-button': [
        'ank-pos-relative',
        'ank-d-inlineMINflex',
        'ank-alIte-center',
        'ank-jusCont-center',
        'ank-ta-center',
        'ank-verAli-middle',
        'ank-uSel-none',
        'ank-bor-1px__solid__transparent',
        'ank-p-0_375rem__0_75rem',
        'ank-fs-1rem',
        'ank-lh-1_5',
        'ank-r-0_375rem',
        'ank-trnsion-all__0_15s__easeMINinMINout',
        'ank-cur-pointer',
        'ank-tde-none',
        'ank-fw-400',
        'ank-whtSp-nowrap',
        'ank-ov-hidden',
        /* Focus */
        'ank-outFocus-0',
        'ank-bshFocus-0__0__0__0_2rem__accent',
        /* Disabled */
        'ank-oDisabled-0_65',
        'ank-curDisabled-notMINallowed',
        'ank-pntEventsDisabled-none',
        /* Hover Not Disabled */
        'ank-trnsfHoverDPSnotSDDPSdisabledED-translateYSDMIN1pxED',
        'ank-bshHoverDPSnotSDDPSdisabledED-0__4px__8px__dark__OPA__0_1',
        /* Active Not Disabled */
        'ank-trnsfActiveDPSnotSDDPSdisabledED-translateYSD0ED__scaleSD0_98ED',
      ],
      /* Button Animate */
      'btn-animate': [
        'ank-trnson-transform__0_2s__easeMINinMINout',
        'ank-trnsf-translateYSD1ED',
        /* Hover Not Disabled */
        'ank-trnsfHoverDPSnotSDDPSdisabledED-translateYSDMIN2pxED',
        /* Active Not Disabled */
        'ank-trnsfActiveDPSnotSDDPSdisabledED-translateYSD0ED',
      ],
      /* Pulse */
      'btn-pulse': ['ank-animation-btnMINpulse__2s__infinite'],
      'pulse-overlay': [
        'ank-pos-absolute',
        'ank-t-0',
        'ank-b-0',
        'ank-s-0',
        'ank-e-0',
        'ank-r-inherit',
        'ank-bg-light__OPA__0_3',
        'ank-ani-btnMINpulseMINoverlay__1_5s__infinite',
        'ank-pnt-none',
      ],
      /* Click Animation */
      'btn-click-animation': [
        'ank-trnsion-transform__0_1s__easeMINinMINout',
        'ank-trnsf-scaleSD0_95ED',
      ],
    };
    /* ButtonsSizes */
    const valuesSizes: { [key: string]: string[] } = {
      xs: ['0.125rem 0.25rem', '0.75rem', '1.2', '2rem', '1.5rem'],
      sm: ['0.25rem 0.5rem', '0.875rem', '1.3', '2rem', '3rem'],
      md: ['0.375rem 0.75rem', '1rem', '1.5', '2rem', '4rem'],
      lg: ['0.5rem 1rem', '1.125rem', '1.75', '2rem', '5rem'],
      xl: ['0.75rem 1.5rem', '1.25rem', '2', '2rem', '6rem'],
      '2xl': ['1rem 2rem', '1.5rem', '2.5', '2rem', '7rem'],
      '3xl': ['1.5rem 3rem', '1.75rem', '3', '2rem', '8rem'],
      '4xl': ['2rem 4rem', '2rem', '3.5', '2rem', '9rem'],
      '5xl': ['2.5rem 5rem', '2.25rem', '4', '2rem', '10rem'],
    };
    const propertySizesList: string[] = ['p', 'fs', 'lh', 'hmn', 'wmn'];
    Object.keys(valuesSizes).forEach((key) => {
      defaultCombos[`btn-${key}`] = valuesSizes[key].map(
        (value: string, i: number) =>
          `ank-${propertySizesList[i]}-${this._ank.befysize(value)}`
      );
    });
    /* Button Rounded */
    const valuesRounded: { [key: string]: string } = {
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      '5xl': '2.5rem',
      full: '50rem',
    };
    Object.keys(valuesRounded).forEach((key) => {
      defaultCombos[`btn-rounded-${key}`] = [
        `ank-r-${this._ank.befysize(valuesRounded[key])}`,
      ];
    });
    /* Button Shadows */
    const valuesShadows: { [key: string]: string } = {
      sm: '0 1px 2px 0 dark__OPA__0_05',
      md: '0 4px 6px -1px dark__OPA__0_1',
      lg: '0 10px 15px -3px dark__OPA__0_1',
      xl: '0 20px 25px -5px dark__OPA__0_1',
      '2xl': '0 25px 50px -12px dark__OPA__0_1',
      '3xl': '0 35px 60px -15px dark__OPA__0_1',
      '4xl': '0 45px 75px -20px dark__OPA__0_1',
      '5xl': '0 55px 90px -25px dark__OPA__0_1',
    };
    Object.keys(valuesShadows).forEach((key) => {
      defaultCombos[`btn-shadow-${key}`] = [
        `ank-bsh-${this._ank.befysize(valuesShadows[key])}`,
      ];
    });
    /* Spinner */
    const valuesSpinner: { [key: string]: string } = {
      xs: '1rem',
      sm: '1.5rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem',
      '2xl': '5rem',
      '3xl': '6rem',
      '4xl': '7rem',
      '5xl': '8rem',
    };
    Object.keys(valuesSpinner).forEach((key) => {
      defaultCombos[`btn-spinner-${key}`] = [
        `ank-spinner-${this._ank.befysize(valuesSpinner[key])}`,
      ];
    });
    if (!this._ank.getCombos()['generic-button']) {
      this._ank.pushCombos(defaultCombos);
    }
  }

  cssCreate() {
    if (typeof window !== 'undefined') {
      this._ank.cssCreate();
    }
  }
}
