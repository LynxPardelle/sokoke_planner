import {
    Component, OnInit, OnDestroy, OnChanges, DoCheck,
    AfterContentInit, AfterContentChecked, AfterViewInit,
    AfterViewChecked, SimpleChanges, Input, EnvironmentInjector,
    inject, DestroyRef, afterNextRender, afterRender
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
/* RXJS */
import { of } from 'rxjs';
/* Components */
import { HeaderComponent } from './core/components/layout/header/header.component';
import { FooterComponent } from './core/components/layout/footer/footer.component';
/* Libraries */
import { NgxAngoraService } from 'ngx-angora-css';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy, OnChanges, DoCheck,
    AfterContentInit, AfterContentChecked,
    AfterViewInit, AfterViewChecked {
    @Input() testInput: string = '';
    public colors: { [key: string]: string } = {
        bgkoke: '#CD9965',
        textkoke: '#462F14',
        seckoke: '#A17246',
        acckoke: "#19363F",
        trikoke: "#59767F",
    };
    public showFooter: boolean = true;

    // Para demostración de takeUntilDestroyed
    private destroyRef = inject(DestroyRef);
    private envInjector = inject(EnvironmentInjector);

    constructor(
        private _ank: NgxAngoraService,
    ) {
        // console.log('AppComponent constructor');

        // Ejemplo de uso de takeUntilDestroyed (Angular 16+)
        of('test').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
            val => console.log('Observable with automatic cleanup:', val)
        );

        // Usar afterNextRender para código después del primer render (Angular 16+)
        afterNextRender(() => {
            this._ank.checkSheet();
            this._ank.values.importantActive = true;
            this._ank.pushColors(this.colors);
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
        console.log('AppComponent ngAfterNextRender - Called after initial rendering');
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

    cssCreate() {
        if (typeof window !== 'undefined') {
            this._ank.cssCreate();
        }
    }
}
