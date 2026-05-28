import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="acp-login-page">
      <div class="acp-login-card">
        <mat-card>
          <div class="acp-login-brand">
            <mat-icon>flight_takeoff</mat-icon>
            <h1>AIRCONTROL PRO</h1>
            <p>Sistema de gestión aeroportuaria</p>
          </div>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="acp-field">
                <mat-label>Usuario</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput formControlName="username" placeholder="admin" autocomplete="username">
              </mat-form-field>

              <mat-form-field appearance="outline" class="acp-field">
                <mat-label>Contraseña</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password">
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" class="btn-bordered login-submit" [disabled]="loginForm.invalid">
                Ingresar al sistema
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 24px 28px;
    }
    .login-submit {
      margin-top: 8px;
      height: 48px;
      font-size: 0.95rem;
    }
    mat-icon[matPrefix] {
      margin-right: 8px;
      color: var(--acp-text-muted);
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.snackBar.open('Credenciales inválidas. Use admin / admin123', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        })
      });
    }
  }
}
