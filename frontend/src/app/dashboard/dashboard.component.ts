import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MenuService, MenuItem } from '../core/services/menu.service';
import { MenuNavComponent } from './menu-nav/menu-nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MenuNavComponent,
    MatDividerModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <mat-sidenav-container class="dashboard-container">
      <mat-sidenav #sidenav mode="side" opened class="app-sidenav">
        <div class="logo-container">
          <mat-icon class="logo-icon">flight_takeoff</mat-icon>
          <span class="logo-text">AIRCONTROL PRO</span>
        </div>

        <div class="user-profile">
          <div class="avatar">
            {{ (authService.user()?.username || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="user-info">
            <span class="username">{{ authService.user()?.username }}</span>
            <span class="role">{{ authService.user()?.role }}</span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <mat-nav-list class="menu-list">
          <a mat-list-item class="menu-link" routerLink="/dashboard" routerLinkActive="menu-active" [routerLinkActiveOptions]="{ paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' }">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Inicio</span>
          </a>

          <app-menu-nav [items]="menuItems"></app-menu-nav>

          <mat-divider></mat-divider>

          <button mat-list-item (click)="authService.logout()" class="logout-btn">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Cerrar sesión</span>
          </button>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="app-content">
        <mat-toolbar class="app-toolbar">
          <button mat-icon-button class="acp-icon-btn" (click)="sidenav.toggle()" aria-label="Menú">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">Centro de control aeroportuario</span>
        </mat-toolbar>

        <main class="main-viewport acp-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .user-info { display: flex; flex-direction: column; gap: 2px; }
    .toolbar-title {
      margin-left: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--acp-text-muted);
      letter-spacing: 0.02em;
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  menuService = inject(MenuService);
  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuService.getMenu().subscribe({
      next: (items) => this.menuItems = items,
      error: (err) => console.error('Error loading menu', err)
    });
  }
}
