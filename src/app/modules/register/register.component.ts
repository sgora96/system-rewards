import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.result) {
            // Guardar el token si es necesario
            if (response.token) {
              localStorage.setItem('token', response.token);
            }
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage =
              response.errors?.join(', ') || 'Error en el registro';
          }
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          this.errorMessage =
            'Error en el servidor. Por favor, intente más tarde.';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `El campo ${controlName} es requerido`;
      }
      if (control.errors['email']) {
        return 'Debe ingresar un email válido';
      }
      if (control.errors['minlength']) {
        return `El campo debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
