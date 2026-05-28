import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TakeoffDialogComponent } from './takeoff-dialog.component';
import { OperationsListComponent } from './operations-list.component';

@Component({
  selector: 'app-takeoff-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule, OperationsListComponent],
  template: `
    <div class="acp-page">
      <header class="acp-page-header">
        <div>
          <h1 class="acp-page-title">Despegues</h1>
          <p class="acp-page-subtitle">Autorización y validación de salida de aeronaves</p>
        </div>
      </header>

      <mat-card class="acp-card acp-action-card">
        <mat-card-header>
          <mat-icon mat-card-avatar class="card-avatar primary">flight_takeoff</mat-icon>
          <mat-card-title>Solicitar despegue</mat-card-title>
          <mat-card-subtitle>Validación de condiciones de pista y meteorología</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Inicia el proceso de validación para la salida de una aeronave.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" class="btn-bordered" (click)="openDialog()">INICIAR PROCESO</button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="acp-card">
        <mat-card-header>
          <mat-card-title>Despegues registrados</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-operations-list filterType="TAKEOFF"></app-operations-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .card-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      font-size: 22px;
    }
    .card-avatar.primary { background: #e3f2fd; color: #1565c0; }
    mat-card-content p { color: var(--acp-text-muted); margin: 0 0 8px; }
  `]
})
export class TakeoffPageComponent {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  openDialog() {
    this.dialog.open(TakeoffDialogComponent, { width: '420px', panelClass: 'acp-dialog' })
      .afterClosed()
      .subscribe(result => this.showResult(result));
  }

  private showResult(result: any) {
    if (!result) return;
    this.snackBar.open(result.message, 'Cerrar', {
      duration: 5000,
      panelClass: [result.success ? 'success-snackbar' : 'error-snackbar']
    });
  }
}
