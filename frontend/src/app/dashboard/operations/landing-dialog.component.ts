import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-landing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Control de Aterrizaje</h2>
    <mat-dialog-content>
      <form [formGroup]="landingForm" class="operation-form">
        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Número de Vuelo</mat-label>
          <input matInput formControlName="flightNumber" placeholder="Ej: AV244">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Senda de Aproximación</mat-label>
          <input matInput formControlName="approachPath" placeholder="Ej: ILS-Z-31">
        </mat-form-field>

        <div class="checkbox-container">
          <mat-checkbox formControlName="fuelEmergency">¿Emergencia de Combustible?</mat-checkbox>
          <mat-hint class="warn-hint" *ngIf="landingForm.get('fuelEmergency')?.value">
            <mat-icon>warning</mat-icon> El sistema activará protocolos de emergencia.
          </mat-hint>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="accent" class="btn-bordered" [disabled]="landingForm.invalid" (click)="onConfirm()">
        AUTORIZAR ATERRIZAJE
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .operation-form { display: flex; flex-direction: column; gap: 15px; padding-top: 10px; }
    .checkbox-container { display: flex; flex-direction: column; gap: 5px; }
    .warn-hint { color: #f44336; font-size: 0.8rem; display: flex; align-items: center; gap: 5px; }
    .warn-hint mat-icon { font-size: 16px; width: 16px; height: 16px; }
  `]
})
export class LandingDialogComponent {
  private fb = inject(FormBuilder);
  private operationService = inject(OperationService);
  private dialogRef = inject(MatDialogRef<LandingDialogComponent>);

  landingForm = this.fb.group({
    flightNumber: ['', Validators.required],
    approachPath: ['', Validators.required],
    fuelEmergency: [false],
    status: ['PENDING']
  });

  onConfirm() {
    if (this.landingForm.valid) {
      this.operationService.processLanding(this.landingForm.value).subscribe({
        next: res => this.dialogRef.close(res),
        error: () => this.dialogRef.close({ success: false, message: 'Error al procesar el aterrizaje' })
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
