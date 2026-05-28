import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterLink, RouterLinkActive, IsActiveMatchOptions } from '@angular/router';
import { MenuItem } from '../../core/services/menu.service';

@Component({
  selector: 'app-menu-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    RouterLink,
    RouterLinkActive,
    MenuNavComponent
  ],
  template: `
    <ng-container *ngFor="let item of items; trackBy: trackById">
      <a *ngIf="!hasChildren(item) && item.route"
         mat-list-item
         class="menu-link"
         [routerLink]="item.route"
         routerLinkActive="menu-active"
         [routerLinkActiveOptions]="linkActiveOptions">
        <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
        <span matListItemTitle>{{ item.label }}</span>
      </a>

      <mat-expansion-panel *ngIf="hasChildren(item)"
                           class="submenu-panel"
                           [expanded]="isGroupExpanded(item)"
                           [class.group-active]="isGroupActive(item)">
        <mat-expansion-panel-header class="submenu-header">
          <mat-panel-title>
            <mat-icon>{{ item.icon }}</mat-icon>
            <span>{{ item.label }}</span>
          </mat-panel-title>
        </mat-expansion-panel-header>

        <mat-nav-list class="sub-nav-list">
          <app-menu-nav [items]="item.children"></app-menu-nav>
        </mat-nav-list>
      </mat-expansion-panel>
    </ng-container>
  `,
  styles: [`
    :host { display: block; }

    .submenu-header {
      height: 48px !important;
    }

    .submenu-header mat-panel-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sub-nav-list {
      padding: 0 !important;
    }
  `]
})
export class MenuNavComponent {
  @Input({ required: true }) items: MenuItem[] = [];

  readonly linkActiveOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored'
  };

  constructor(private router: Router) {}

  hasChildren(item: MenuItem): boolean {
    return !!item.children && item.children.length > 0;
  }

  trackById(_index: number, item: MenuItem): number {
    return item.id;
  }

  isGroupActive(item: MenuItem): boolean {
    return this.hasActiveChild(item);
  }

  isGroupExpanded(item: MenuItem): boolean {
    return this.hasActiveChild(item) || true;
  }

  private hasActiveChild(item: MenuItem): boolean {
    if (!item.children?.length) {
      return false;
    }
    return item.children.some(child => {
      if (child.route && this.router.isActive(child.route, this.linkActiveOptions)) {
        return true;
      }
      return this.hasActiveChild(child);
    });
  }
}
