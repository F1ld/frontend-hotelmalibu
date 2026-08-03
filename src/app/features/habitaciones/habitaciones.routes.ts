// src/app/features/habitaciones/habitaciones.routes.ts
import { Routes } from '@angular/router';

export const habitacionesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./habitaciones-list/habitaciones-list.component').then(
        (m) => m.HabitacionesListComponent
      ),
  },
  {
    path: 'tipos',
    loadComponent: () =>
      import('./tipos-habitacion-list/tipos-habitacion-list.component').then(
        (m) => m.TiposHabitacionListComponent
      ),
  },
];