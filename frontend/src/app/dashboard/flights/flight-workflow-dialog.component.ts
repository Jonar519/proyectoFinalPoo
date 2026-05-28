import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Flight } from '../../core/services/flight.service';
import { FlightWorkflowStatus, WorkflowService } from '../../core/services/workflow.service';
import { OperationService } from '../../core/services/operation.service';

const PHASES = [
  'WAITING_SCHEDULE',
  'CARGO_IN_PROGRESS',
  'TAKEOFF_IN_PROGRESS',
  'IN_FLIGHT',
  'LANDING_IN_PROGRESS',
  'COMPLETED'
];

const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'];

@Component({
  selector: 'app-flight-workflow-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Flujo operativo — {{ data.flight.flightNumber }}</h2>
    <mat-dialog-content class="dialog-body" *ngIf="workflow">
      <div class="info-box">
        <p><span class="label">Estado del vuelo</span> <strong>{{ workflow.flightStatus }}</strong></p>
        <p *ngIf="workflow.nextActionAt">
          <span class="label">Próxima acción</span> {{ workflow.nextActionAt | date:'short' }}
        </p>
      </div>

      <mat-form-field appearance="outline" class="acp-field full-width">
        <mat-label>Fase del flujo</mat-label>
        <mat-select [value]="workflow.phase" panelClass="acp-select-panel" (selectionChange)="onPhaseChange($event.value)">
          <mat-option *ngFor="let p of phases" [value]="p">{{ phaseLabel(p) }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-divider></mat-divider>
      <p class="steps-title">Estados de operaciones</p>

      <div class="acp-workflow-step" *ngIf="workflow.cargo">
        <span class="acp-workflow-step-label">Carga</span>
        <mat-form-field appearance="outline" class="acp-field acp-status-select">
          <mat-select [value]="workflow.cargo.status" panelClass="acp-select-panel" (selectionChange)="updateOpStatus(workflow.cargo!.operationId!, $event.value)">
            <mat-option *ngFor="let s of statuses" [value]="s">{{ s }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="acp-workflow-step" *ngIf="workflow.takeoff">
        <span class="acp-workflow-step-label">Despegue</span>
        <mat-form-field appearance="outline" class="acp-field acp-status-select">
          <mat-select [value]="workflow.takeoff.status" panelClass="acp-select-panel" (selectionChange)="updateOpStatus(workflow.takeoff!.operationId!, $event.value)">
            <mat-option *ngFor="let s of statuses" [value]="s">{{ s }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="acp-workflow-step" *ngIf="workflow.landing">
        <span class="acp-workflow-step-label">Aterrizaje</span>
        <mat-form-field appearance="outline" class="acp-field acp-status-select">
          <mat-select [value]="workflow.landing.status" panelClass="acp-select-panel" (selectionChange)="updateOpStatus(workflow.landing!.operationId!, $event.value)">
            <mat-option *ngFor="let s of statuses" [value]="s">{{ s }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <p class="hint" *ngIf="!workflow.cargo && !workflow.takeoff && !workflow.landing">
        Las operaciones se crean automáticamente al avanzar el flujo.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cerrar</button>
      <button mat-raised-button color="primary" class="btn-bordered" (click)="advance()" [disabled]="workflow?.phase === 'COMPLETED'">
        Avanzar paso
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-body { min-width: 400px; display: flex; flex-direction: column; gap: 12px; }
    .full-width { width: 100%; }
    .info-box {
      background: #f0f6ff;
      border: 1px solid #bbdefb;
      border-radius: var(--acp-radius-sm);
      padding: 12px 16px;
    }
    .info-box p { margin: 4px 0; }
    .label { color: var(--acp-text-muted); font-size: 0.8rem; margin-right: 8px; }
    .steps-title { margin: 8px 0 0; font-weight: 600; font-size: 0.9rem; }
    .hint { color: var(--acp-text-muted); font-size: 0.85rem; margin: 0; }
  `]
})
export class FlightWorkflowDialogComponent implements OnInit {
  data = inject<{ flight: Flight }>(MAT_DIALOG_DATA);
  private workflowService = inject(WorkflowService);
  private operationService = inject(OperationService);
  private dialogRef = inject(MatDialogRef<FlightWorkflowDialogComponent>);
  private snackBar = inject(MatSnackBar);

  workflow: FlightWorkflowStatus | null = null;
  phases = PHASES;
  statuses = STATUSES;

  ngOnInit() {
    this.reload();
  }

  reload() {
    if (!this.data.flight.id) return;
    this.workflowService.getWorkflow(this.data.flight.id).subscribe({
      next: w => this.workflow = w,
      error: () => this.snackBar.open('No se pudo cargar el flujo', 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] })
    });
  }

  onPhaseChange(phase: string) {
    if (!this.data.flight.id) return;
    this.workflowService.updatePhase(this.data.flight.id, phase).subscribe({
      next: w => {
        this.workflow = w;
        this.snackBar.open('Fase actualizada', 'Cerrar', { duration: 2500, panelClass: ['success-snackbar'] });
      },
      error: () => this.snackBar.open('Error al actualizar fase', 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] })
    });
  }

  updateOpStatus(operationId: number, status: string) {
    this.operationService.updateOperationStatus(operationId, status).subscribe({
      next: () => {
        this.snackBar.open('Estado de operación actualizado', 'Cerrar', { duration: 2500, panelClass: ['success-snackbar'] });
        this.reload();
      },
      error: () => this.snackBar.open('Error al actualizar operación', 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] })
    });
  }

  advance() {
    if (!this.data.flight.id) return;
    this.workflowService.advance(this.data.flight.id).subscribe({
      next: w => {
        this.workflow = w;
        this.snackBar.open('Flujo avanzado', 'Cerrar', { duration: 2500, panelClass: ['success-snackbar'] });
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('No se pudo avanzar el flujo', 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] })
    });
  }

  phaseLabel(phase: string): string {
    const labels: Record<string, string> = {
      WAITING_SCHEDULE: 'Esperando horario',
      CARGO_IN_PROGRESS: 'Carga en proceso',
      TAKEOFF_IN_PROGRESS: 'Despegue en proceso',
      IN_FLIGHT: 'En vuelo (simulación 10 min)',
      LANDING_IN_PROGRESS: 'Aterrizaje en proceso',
      COMPLETED: 'Completado'
    };
    return labels[phase] || phase;
  }

  close() {
    this.dialogRef.close();
  }
}
