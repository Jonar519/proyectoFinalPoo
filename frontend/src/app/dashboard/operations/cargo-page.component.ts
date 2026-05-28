import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CargoDialogComponent } from './cargo-dialog.component';
import { OperationsListComponent } from './operations-list.component';

@Component({
  selector: 'app-cargo-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule, OperationsListComponent],
  template: `
    <div class="acp-page">
      <header class="acp-page-header">
        <div>
          <h1 class="acp-page-title">Gestión de carga</h1>
          <p class="acp-page-subtitle">Validación de peso y balance de mercancía</p>
        </div>
      </header>

      <mat-card class="acp-card acp-action-card">
        <mat-card-header>
          <mat-icon mat-card-avatar class="card-avatar warn">inventory_2</mat-icon>
          <mat-card-title>Registro de carga</mat-card-title>
          <mat-card-subtitle>Control de peso máximo y materiales peligrosos</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Validación de peso y balance para carga de mercancía.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="warn" class="btn-bordered" (click)="openDialog()">REGISTRAR CARGA</button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="acp-card">
        <mat-card-header>
          <mat-card-title>Cargas registradas</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-operations-list filterType="CARGO"></app-operations-list>
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
    .card-avatar.warn { background: #fff3e0; color: #e65100; }
    mat-card-content p { color: var(--acp-text-muted); margin: 0 0 8px; }
  `]
})
export class CargoPageComponent {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  openDialog() {
    this.dialog.open(CargoDialogComponent, { width: '420px', panelClass: 'acp-dialog' })
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
