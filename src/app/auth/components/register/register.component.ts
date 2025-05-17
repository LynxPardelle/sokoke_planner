import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, TRegistrationData } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  formError = '';
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      const confirmPasswordErrors = formGroup.get('confirmPassword')?.errors;
      if (confirmPasswordErrors) {
        const { passwordMismatch, ...otherErrors } = confirmPasswordErrors;
        formGroup.get('confirmPassword')?.setErrors(
          Object.keys(otherErrors).length ? otherErrors : null
        );
      }
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.formError = 'Please correct the errors in the form';
      return;
    }
    
    this.isSubmitting = true;
    this.formError = '';
    
    // Extract registration data (omit confirmPassword)
    const { confirmPassword, ...registrationData } = this.registerForm.value as TRegistrationData & { confirmPassword: string };
    
    // Call the auth service to register the user
    this.authService.register(registrationData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Show success message or redirect to login
          this.router.navigate(['/auth/login'], { 
            queryParams: { registered: 'true' } 
          });
        },
        error: (error) => {
          this.formError = error;
        }
      });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
