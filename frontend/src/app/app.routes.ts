import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'flights',
        loadComponent: () => import('./dashboard/flights/flight-list.component').then(m => m.FlightListComponent)
      },
      {
        path: 'operations/takeoff',
        loadComponent: () => import('./dashboard/operations/takeoff-page.component').then(m => m.TakeoffPageComponent)
      },
      {
        path: 'operations/landing',
        loadComponent: () => import('./dashboard/operations/landing-page.component').then(m => m.LandingPageComponent)
      },
      {
        path: 'operations/cargo',
        loadComponent: () => import('./dashboard/operations/cargo-page.component').then(m => m.CargoPageComponent)
      },
      {
        path: 'operations',
        redirectTo: 'operations/takeoff',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
