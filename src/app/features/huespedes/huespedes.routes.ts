// src/app/features/huespedes/huespedes.routes.ts
import { Routes } from '@angular/router';

export const huespedesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./huespedes-list/huespedes-list.component').then(
        (m) => m.HuespedesListComponent
      ),
  },
];