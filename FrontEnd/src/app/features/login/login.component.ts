import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/toast/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    isLoading = false;
    showPassword = false;

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    isFieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const credentials = this.loginForm.value;

            this.authService.login(credentials).subscribe({
                next: () => {
                    this.notificationService.success('Inicio de sesión correcto', 'Bienvenido');
                    this.router.navigate(['/sales']);
                },
                error: (err) => {
                    console.error(err);
                    this.notificationService.error(err.error?.msg || 'Credenciales inválidas', 'Error');
                    this.isLoading = false;
                }
            });
        }
    }
}
