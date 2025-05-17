import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TUser } from '../../user/types/user.type';
import { environment } from '../../../environments/environment';

// Type for registration data
export type TRegistrationData = {
  name: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient) {
    console.log(`Auth Service initialized in ${environment.production ? 'production' : 'development'} mode`);
    console.log(`API URL: ${this.apiUrl}`);
  }

  /**
   * Registers a new user
   * @param userData User registration data
   * @returns Observable with user data or error
   */
  register(userData: TRegistrationData): Observable<TUser> {
    return this.http.post<TUser>(`${this.apiUrl}/user`, userData)
      .pipe(
        tap(response => console.log('Registration successful:', response)),
        catchError(this.handleError)
      );
  }

  /**
   * Handle API errors
   * @param error HTTP error
   * @returns Observable with error message
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 409) {
        errorMessage = 'Username or email already exists';
      } else if (error.status === 400) {
        errorMessage = 'Invalid registration data';
        
        // Extract validation errors if available
        if (error.error?.message && Array.isArray(error.error.message)) {
          errorMessage = error.error.message.join(', ');
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Registration error:', errorMessage);
    return throwError(() => errorMessage);
  }
}
