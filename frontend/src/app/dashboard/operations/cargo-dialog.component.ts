import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-cargo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>Gestión de Carga</h2>
    <mat-dialog-content>
      <form [formGroup]="cargoForm" class="operation-form">
        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Número de Vuelo</mat-label>
          <input matInput formControlName="flightNumber" placeholder="Ej: AV244">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Zona de Carga</mat-label>
          <input matInput formControlName="cargoZone" placeholder="Ej: North-Terminal-A">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Peso Total (kg)</mat-label>
          <input matInput type="number" formControlName="totalWeight">
          <mat-hint>Máximo permitido: 50,000 kg</mat-hint>
        </mat-form-field>

        <div class="checkbox-container">
          <mat-checkbox formControlName="hazardousMaterial">¿Material Peligroso (HAZMAT)?</mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="warn" class="btn-bordered" [disabled]="cargoForm.invalid" (click)="onConfirm()">
        REGISTRAR CARGA
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .operation-form { display: flex; flex-direction: column; gap: 15px; padding-top: 10px; }
    .checkbox-container { padding: 10px 0; }
  `]
})
export class CargoDialogComponent {
  private fb = inject(FormBuilder);
  private operationService = inject(OperationService);
  private dialogRef = inject(MatDialogRef<CargoDialogComponent>);

  cargoForm = this.fb.group({
    flightNumber: ['', Validators.required],
    cargoZone: ['', Validators.required],
    totalWeight: [0, [Validators.required, Validators.min(0)]],
    hazardousMaterial: [false],
    status: ['PENDING']
  });

  onConfirm() {
    if (this.cargoForm.valid) {
      this.operationService.processCargo(this.cargoForm.value).subscribe({
        next: res => this.dialogRef.close(res),
        error: () => this.dialogRef.close({ success: false, message: 'Error al registrar la carga' })
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
