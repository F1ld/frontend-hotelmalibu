// src/app/features/inventario/inventario.routes.ts
import { Routes } from '@angular/router';

export const inventarioRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./productos-list/productos-list.component').then(
        (m) => m.ProductosListComponent
      ),
  },
];
