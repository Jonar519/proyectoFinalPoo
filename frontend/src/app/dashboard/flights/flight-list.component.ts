import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { interval, Subscription } from 'rxjs';
import { FlightService, Flight } from '../../core/services/flight.service';
import { FlightWorkflowStatus, WorkflowService } from '../../core/services/workflow.service';
import { FlightDialogComponent } from './flight-dialog.component';
import { FlightWorkflowDialogComponent } from './flight-workflow-dialog.component';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  template: `
    <div class="acp-page">
      <div class="acp-page-header">
        <div>
          <h1 class="acp-page-title">Gestión de Vuelos</h1>
          <p class="acp-page-subtitle">Flujo automático: Carga → Despegue → 10 min en vuelo → Aterrizaje</p>
        </div>
        <button mat-raised-button color="primary" class="btn-bordered" (click)="openFlightDialog()">
          <mat-icon>add</mat-icon> Nuevo Vuelo
        </button>
      </div>

      <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

      <mat-card class="acp-card acp-table-card">
        <table mat-table [dataSource]="flights">
          <ng-container matColumnDef="flightNumber">
            <th mat-header-cell *matHeaderCellDef>No. Vuelo</th>
            <td mat-cell *matCellDef="let row" class="bold-text">{{row.flightNumber}}</td>
          </ng-container>

          <ng-container matColumnDef="airline">
            <th mat-header-cell *matHeaderCellDef>Aerolínea</th>
            <td mat-cell *matCellDef="let row">{{row.airline}}</td>
          </ng-container>

          <ng-container matColumnDef="route">
            <th mat-header-cell *matHeaderCellDef>Ruta</th>
            <td mat-cell *matCellDef="let row">
              {{row.route?.origin}} <mat-icon class="arrow-icon">arrow_forward</mat-icon> {{row.route?.destination}}
            </td>
          </ng-container>

          <ng-container matColumnDef="departure">
            <th mat-header-cell *matHeaderCellDef>Salida programada</th>
            <td mat-cell *matCellDef="let row">{{row.scheduledDeparture | date:'short'}}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado vuelo</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip class="acp-chip" [ngClass]="getStatusClass(row.status)">{{row.status}}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="workflow">
            <th mat-header-cell *matHeaderCellDef>Flujo</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip class="acp-chip workflow-chip">{{ getWorkflowPhase(row.id) }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button class="acp-icon-btn" matTooltip="Editar vuelo" (click)="openFlightDialog(row)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button class="acp-icon-btn" matTooltip="Gestionar flujo" (click)="openWorkflowDialog(row)">
                <mat-icon>timeline</mat-icon>
              </button>
              <button mat-icon-button class="acp-icon-btn" matTooltip="Eliminar" (click)="deleteFlight(row)">
                <mat-icon color="warn">delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell acp-no-data" colspan="7">No se encontraron vuelos registrados.</td>
          </tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .bold-text { font-weight: 700; color: var(--acp-primary); }
    .arrow-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; margin: 0 4px; color: var(--acp-text-muted); }
    .acp-table-card table { width: 100%; }
  `]
})
export class FlightListComponent implements OnInit, OnDestroy {
  private flightService = inject(FlightService);
  private workflowService = inject(WorkflowService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  flights: Flight[] = [];
  workflows = new Map<number, FlightWorkflowStatus>();
  displayedColumns = ['flightNumber', 'airline', 'route', 'departure', 'status', 'workflow', 'actions'];
  loading = false;
  private pollSub?: Subscription;

  ngOnInit() {
    this.loadAll();
    this.pollSub = interval(10000).subscribe(() => this.loadWorkflows());
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  loadAll() {
    this.loading = true;
    this.flightService.getFlights().subscribe({
      next: data => {
        this.flights = data;
        this.loadWorkflows();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('No se pudieron cargar los vuelos', 'Cerrar', { duration: 4000 });
      }
    });
  }

  loadWorkflows() {
    this.workflowService.getAllWorkflows().subscribe({
      next: list => {
        this.workflows = new Map(list.map(w => [w.flightId, w]));
      }
    });
  }

  getWorkflowPhase(flightId?: number): string {
    if (!flightId) return '—';
    const w = this.workflows.get(flightId);
    return w ? this.phaseLabel(w.phase) : '—';
  }

  phaseLabel(phase: string): string {
    const labels: Record<string, string> = {
      WAITING_SCHEDULE: 'Esperando',
      CARGO_IN_PROGRESS: 'Carga',
      TAKEOFF_IN_PROGRESS: 'Despegue',
      IN_FLIGHT: 'En vuelo',
      LANDING_IN_PROGRESS: 'Aterrizaje',
      COMPLETED: 'Completado'
    };
    return labels[phase] || phase;
  }

  deleteFlight(flight: Flight) {
    if (!flight.id) return;
    this.flightService.deleteFlight(flight.id).subscribe({
      next: () => {
        this.snackBar.open('Vuelo eliminado', 'Cerrar', { duration: 3000 });
        this.loadAll();
      },
      error: () => this.snackBar.open('No se pudo eliminar el vuelo', 'Cerrar', { duration: 4000 })
    });
  }

  openFlightDialog(flight?: Flight) {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      width: '480px',
      panelClass: 'acp-dialog',
      data: { flight }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(flight ? 'Vuelo actualizado' : 'Vuelo registrado', 'Cerrar', { duration: 3000 });
        this.loadAll();
      }
    });
  }

  openWorkflowDialog(flight: Flight) {
    this.dialog.open(FlightWorkflowDialogComponent, {
      width: '460px',
      panelClass: 'acp-dialog',
      data: { flight }
    }).afterClosed().subscribe(changed => {
      if (changed) this.loadAll();
    });
  }

  getStatusClass(status: string): string {
    return 'status-' + (status?.toLowerCase() || 'scheduled');
  }
}
