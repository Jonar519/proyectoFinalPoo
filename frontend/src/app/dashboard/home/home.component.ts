import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { FlightService } from '../../core/services/flight.service';
import { OperationService } from '../../core/services/operation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="acp-page">
      <header class="acp-page-header">
        <div>
          <h1 class="acp-page-title">Bienvenido, {{ authService.user()?.username }}</h1>
          <p class="acp-page-subtitle">Panel de control de tráfico aéreo — AIRCONTROL PRO</p>
        </div>
      </header>

      <div class="acp-stats-grid">
        <mat-card class="acp-card acp-stat-card">
          <mat-card-content>
            <div class="acp-stat-icon" style="background:#e3f2fd;color:#1565c0">
              <mat-icon>flight_takeoff</mat-icon>
            </div>
            <div class="acp-stat-info">
              <h3>{{ flightCount }}</h3>
              <p>Vuelos programados</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="acp-card acp-stat-card">
          <mat-card-content>
            <div class="acp-stat-icon" style="background:#f3e5f5;color:#7b1fa2">
              <mat-icon>settings_input_component</mat-icon>
            </div>
            <div class="acp-stat-info">
              <h3>{{ operationCount }}</h3>
              <p>Operaciones registradas</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="acp-card acp-stat-card">
          <mat-card-content>
            <div class="acp-stat-icon" style="background:#fff3e0;color:#ef6c00">
              <mat-icon>warning</mat-icon>
            </div>
            <div class="acp-stat-info">
              <h3>2</h3>
              <p>Alertas de clima</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="acp-card acp-stat-card">
          <mat-card-content>
            <div class="acp-stat-icon" style="background:#e8f5e9;color:#2e7d32">
              <mat-icon>cloud</mat-icon>
            </div>
            <div class="acp-stat-info">
              <h3>24°C</h3>
              <p>Condiciones actuales</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <section>
        <h2 class="section-title">Actividad reciente</h2>
        <mat-card class="acp-card">
          <mat-card-content>
            <div *ngIf="recentOperations.length > 0" class="activity-list">
              <div *ngFor="let op of recentOperations" class="activity-item">
                <mat-icon [class]="op.status === 'COMPLETED' ? 'icon-ok' : 'icon-fail'">
                  {{ op.status === 'COMPLETED' ? 'check_circle' : 'error' }}
                </mat-icon>
                <div class="activity-details">
                  <span class="activity-title">{{ op.flightNumber }} — {{ op.status }}</span>
                  <span class="activity-time">{{ op.operationTime | date:'short' }}</span>
                </div>
              </div>
            </div>
            <p *ngIf="recentOperations.length === 0" class="acp-no-data">No hay actividades recientes.</p>
          </mat-card-content>
        </mat-card>
      </section>
    </div>
  `,
  styles: [`
    .section-title {
      margin: 0 0 16px;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .activity-list { display: flex; flex-direction: column; }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid var(--acp-border);
    }
    .activity-item:last-child { border-bottom: none; }
    .activity-details { display: flex; flex-direction: column; gap: 2px; }
    .activity-title { font-weight: 600; color: var(--acp-text); }
    .activity-time { font-size: 0.8rem; color: var(--acp-text-muted); }
    .icon-ok { color: #2e7d32; }
    .icon-fail { color: #c62828; }
  `]
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  private flightService = inject(FlightService);
  private operationService = inject(OperationService);

  flightCount = 0;
  operationCount = 0;
  recentOperations: any[] = [];

  ngOnInit() {
    this.flightService.getFlights().subscribe(flights => this.flightCount = flights.length);
    this.operationService.getOperations().subscribe(ops => {
      this.operationCount = ops.length;
      this.recentOperations = ops.slice(-5).reverse();
    });
  }
}
