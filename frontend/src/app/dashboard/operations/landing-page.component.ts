import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LandingDialogComponent } from './landing-dialog.component';
import { OperationsListComponent } from './operations-list.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule, OperationsListComponent],
  template: `
    <div class="acp-page">
      <header class="acp-page-header">
        <div>
          <h1 class="acp-page-title">Aterrizajes</h1>
          <p class="acp-page-subtitle">Control y autorización de aproximación a pista</p>
        </div>
      </header>

      <mat-card class="acp-card acp-action-card">
        <mat-card-header>
          <mat-icon mat-card-avatar class="card-avatar accent">flight_land</mat-icon>
          <mat-card-title>Control de aterrizaje</mat-card-title>
          <mat-card-subtitle>Monitoreo de senda de aproximación y combustible</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Monitoreo y autorización de aproximación a pista.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="accent" class="btn-bordered" (click)="openDialog()">AUTORIZAR ATERRIZAJE</button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="acp-card">
        <mat-card-header>
          <mat-card-title>Aterrizajes registrados</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-operations-list filterType="LANDING"></app-operations-list>
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
    .card-avatar.accent { background: #e0f2f1; color: #00695c; }
    mat-card-content p { color: var(--acp-text-muted); margin: 0 0 8px; }
  `]
})
export class LandingPageComponent {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  openDialog() {
    this.dialog.open(LandingDialogComponent, { width: '420px', panelClass: 'acp-dialog' })
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
