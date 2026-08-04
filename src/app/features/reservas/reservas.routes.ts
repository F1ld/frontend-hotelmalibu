import { Routes } from '@angular/router';

export const reservasRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./reservas-list/reservas-list.component').then(
        (m) => m.ReservasListComponent
      ),
  },
  {
    path: 'estadias',
    loadComponent: () =>
      import('./estadias-list/estadias-list.component').then(
        (m) => m.EstadiasListComponent
      ),
  },
];
