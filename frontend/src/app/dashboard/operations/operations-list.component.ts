import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-operations-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSelectModule, MatFormFieldModule, MatSnackBarModule],
  template: `
    <div class="ops-wrapper" *ngIf="operations.length">
      <table mat-table [dataSource]="operations" class="ops-table">
        <ng-container matColumnDef="flightNumber">
          <th mat-header-cell *matHeaderCellDef>Vuelo</th>
          <td mat-cell *matCellDef="let row"><strong>{{ row.flightNumber }}</strong></td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Tipo</th>
          <td mat-cell *matCellDef="let row">
            <span class="type-badge">{{ row.operationType || typeFromRow(row) }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Hora</th>
          <td mat-cell *matCellDef="let row">{{ row.operationTime | date:'short' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let row">
            <mat-form-field appearance="outline" class="acp-field acp-status-select">
              <mat-select [value]="row.status" panelClass="acp-select-panel" (selectionChange)="onStatusChange(row.id, $event.value)">
                <mat-option value="PENDING">PENDING</mat-option>
                <mat-option value="IN_PROGRESS">IN_PROGRESS</mat-option>
                <mat-option value="COMPLETED">COMPLETED</mat-option>
                <mat-option value="FAILED">FAILED</mat-option>
              </mat-select>
            </mat-form-field>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </div>
    <p *ngIf="!operations.length" class="acp-no-data">No hay operaciones registradas.</p>
  `,
  styles: [`
    .ops-wrapper {
      border: 1px solid var(--acp-border);
      border-radius: var(--acp-radius-sm);
      overflow: hidden;
    }
    .ops-table { width: 100%; }
    .type-badge {
      display: inline-block;
      padding: 4px 10px;
      background: #eef2f7;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--acp-text-muted);
    }
  `]
})
export class OperationsListComponent implements OnInit, OnChanges {
  @Input() filterType?: 'TAKEOFF' | 'LANDING' | 'CARGO';

  private operationService = inject(OperationService);
  private snackBar = inject(MatSnackBar);

  operations: any[] = [];
  columns = ['flightNumber', 'type', 'time', 'status'];

  ngOnInit() {
    this.load();
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.load();
  }

  load() {
    this.operationService.getOperations().subscribe({
      next: data => {
        this.operations = (data || []).filter(op => {
          const t = op.operationType || this.typeFromRow(op);
          return !this.filterType || t === this.filterType;
        });
      }
    });
  }

  typeFromRow(row: any): string {
    if (row.runwayId != null) return 'TAKEOFF';
    if (row.approachPath != null) return 'LANDING';
    if (row.totalWeight != null) return 'CARGO';
    return '—';
  }

  onStatusChange(id: number, status: string) {
    this.operationService.updateOperationStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2500, panelClass: ['success-snackbar'] });
        this.load();
      },
      error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] })
    });
  }
}
