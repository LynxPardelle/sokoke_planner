import { Routes } from '@angular/router';

import { HomeComponent } from './core/components/home/home.component';
import { ErrorComponent } from './core/components/error/error.component';
import { RegisterComponent } from './auth/components/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '**', component: ErrorComponent }
];
