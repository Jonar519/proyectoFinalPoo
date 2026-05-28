import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouteService } from '../../core/services/route.service';
import { Flight, FlightService } from '../../core/services/flight.service';

@Component({
  selector: 'app-flight-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar Vuelo' : 'Registrar Nuevo Vuelo' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="flightForm" class="flight-form">
        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Número de Vuelo</mat-label>
          <input matInput formControlName="flightNumber" placeholder="Ej: AV244">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Aerolínea</mat-label>
          <input matInput formControlName="airline" placeholder="Ej: Avianca">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Tipo de Aeronave</mat-label>
          <input matInput formControlName="aircraftType" placeholder="Ej: Airbus A320">
        </mat-form-field>

        <mat-form-field appearance="outline" class="acp-field">
          <mat-label>Ruta</mat-label>
          <mat-select formControlName="route" panelClass="acp-select-panel">
            <mat-option *ngFor="let route of routes" [value]="route">
              {{route.origin}} - {{route.destination}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="datetime-row">
          <mat-form-field appearance="outline" class="acp-field">
            <mat-label>Fecha de salida</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="departureDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="acp-field">
            <mat-label>Hora de salida</mat-label>
            <input matInput type="time" formControlName="departureTime">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="acp-field" *ngIf="isEdit">
          <mat-label>Estado del vuelo</mat-label>
          <mat-select formControlName="status" panelClass="acp-select-panel">
            <mat-option value="SCHEDULED">Programado</mat-option>
            <mat-option value="BOARDING">Embarque / Carga</mat-option>
            <mat-option value="DEPARTED">Despegado</mat-option>
            <mat-option value="IN_FLIGHT">En vuelo</mat-option>
            <mat-option value="LANDED">Aterrizado</mat-option>
            <mat-option value="DELAYED">Retrasado</mat-option>
            <mat-option value="CANCELLED">Cancelado</mat-option>
          </mat-select>
        </mat-form-field>

        <p class="hint" *ngIf="!isEdit">
          El vuelo quedará programado. Al llegar la fecha/hora, el sistema iniciará automáticamente carga, despegue y aterrizaje (10 min en ruta).
        </p>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" class="btn-bordered" [disabled]="flightForm.invalid" (click)="onSave()">
        {{ isEdit ? 'Guardar cambios' : 'Guardar Vuelo' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .flight-form { display: flex; flex-direction: column; gap: 10px; padding-top: 10px; min-width: 360px; }
    .datetime-row { display: flex; gap: 12px; }
    .datetime-row mat-form-field { flex: 1; }
    .hint { font-size: 0.85rem; color: #666; margin: 0; }
  `]
})
export class FlightDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);
  private flightService = inject(FlightService);
  private dialogRef = inject(MatDialogRef<FlightDialogComponent>);
  data = inject<{ flight?: Flight }>(MAT_DIALOG_DATA, { optional: true });

  routes: any[] = [];
  isEdit = false;

  flightForm = this.fb.group({
    flightNumber: ['', Validators.required],
    airline: ['', Validators.required],
    aircraftType: ['', Validators.required],
    route: [null as any, Validators.required],
    departureDate: [new Date(), Validators.required],
    departureTime: ['12:00', Validators.required],
    status: ['SCHEDULED']
  });

  ngOnInit() {
    this.routeService.getRoutes().subscribe(data => this.routes = data);

    const flight = this.data?.flight;
    if (flight) {
      this.isEdit = true;
      const dep = flight.scheduledDeparture ? new Date(flight.scheduledDeparture) : new Date();
      const timeStr = `${String(dep.getHours()).padStart(2, '0')}:${String(dep.getMinutes()).padStart(2, '0')}`;
      this.flightForm.patchValue({
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        aircraftType: flight.aircraftType,
        route: flight.route,
        departureDate: dep,
        departureTime: timeStr,
        status: flight.status || 'SCHEDULED'
      });
    }
  }

  onSave() {
    if (!this.flightForm.valid) return;

    const formValue = this.flightForm.getRawValue();
    const selectedRoute = formValue.route as { id?: number } | null;
    const scheduledDeparture = this.combineDateAndTime(
      formValue.departureDate,
      formValue.departureTime || '00:00'
    );

    const payload: Flight = {
      flightNumber: formValue.flightNumber!,
      airline: formValue.airline!,
      aircraftType: formValue.aircraftType!,
      route: selectedRoute?.id ? { id: selectedRoute.id } : formValue.route,
      scheduledDeparture: scheduledDeparture!,
      scheduledArrival: scheduledDeparture!,
      status: this.isEdit ? formValue.status! : 'SCHEDULED'
    };

    const flight = this.data?.flight;
    const request = flight?.id
      ? this.flightService.updateFlight(flight.id, payload)
      : this.flightService.createFlight(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.dialogRef.close(false)
    });
  }

  private combineDateAndTime(dateVal: Date | string | null | undefined, time: string): string | null {
    if (!dateVal) return null;
    const date = dateVal instanceof Date ? new Date(dateVal) : new Date(dateVal);
    const [h, m] = time.split(':').map(Number);
    date.setHours(h || 0, m || 0, 0, 0);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
