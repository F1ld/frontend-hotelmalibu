// src/app/features/consumos/consumos.routes.ts
import { Routes } from '@angular/router';

export const consumosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./consumos-list/consumos-list.component').then(
        (m) => m.ConsumosListComponent
      ),
  },
];
