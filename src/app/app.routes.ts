import { Routes } from '@angular/router';

import { HomeComponent } from './core/components/home/home.component';
import { ErrorComponent } from './core/components/error/error.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', component: ErrorComponent }
];
