import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-takeoff-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Autorizar Despegue</h2>
    <mat-dialog-content>
      <form [formGroup]="takeoffForm" class="operation-form">
        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Número de Vuelo</mat-label>
          <input matInput formControlName="flightNumber" placeholder="Ej: AV244">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>ID de Pista</mat-label>
          <input matInput formControlName="runwayId" placeholder="Ej: RWY-01L">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Velocidad del Viento (km/h)</mat-label>
          <input matInput type="number" formControlName="windSpeed">
          <mat-hint>Máximo permitido: 50 km/h</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Visibilidad (metros)</mat-label>
          <input matInput type="number" formControlName="visibility">
          <mat-hint>Mínimo permitido: 500 metros</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" class="btn-bordered" [disabled]="takeoffForm.invalid" (click)="onConfirm()">
        AUTORIZAR SALIDA
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .operation-form { display: flex; flex-direction: column; gap: 10px; padding-top: 10px; }
  `]
})
export class TakeoffDialogComponent {
  private fb = inject(FormBuilder);
  private operationService = inject(OperationService);
  private dialogRef = inject(MatDialogRef<TakeoffDialogComponent>);

  takeoffForm = this.fb.group({
    flightNumber: ['', Validators.required],
    runwayId: ['', Validators.required],
    windSpeed: [0, [Validators.required, Validators.min(0)]],
    visibility: [0, [Validators.required, Validators.min(0)]],
    status: ['PENDING']
  });

  onConfirm() {
    if (this.takeoffForm.valid) {
      this.operationService.processTakeoff(this.takeoffForm.value).subscribe({
        next: res => this.dialogRef.close(res),
        error: () => this.dialogRef.close({ success: false, message: 'Error al procesar el despegue' })
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
