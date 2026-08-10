// src/app/app.routes.ts
import { Routes } from '@angular/router';
// INICIO MODIFICACIÓN (Fase 2)
import { authGuard } from './core/auth/auth.guard';
// FIN MODIFICACIÓN

export const routes: Routes = [
  // INICIO MODIFICACIÓN (Fase 2)
  // Nota: '/login' aún no está registrada porque el componente de login
  // no existe todavía. El authGuard redirige ahí; falta crear esa ruta
  // cuando se construya el componente correspondiente.
  {
    path: 'habitaciones',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/habitaciones/habitaciones.routes').then(
        (m) => m.habitacionesRoutes
      ),
  },
  {
    path: 'huespedes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/huespedes/huespedes.routes').then((m) => m.huespedesRoutes),
  },
  // INICIO MODIFICACIÓN (Fase 3)
  {
    path: 'reservas',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/reservas/reservas.routes').then((m) => m.reservasRoutes),
  },
  // FIN MODIFICACIÓN
  // INICIO MODIFICACIÓN (Fase 4)
  {
    path: 'inventario',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/inventario/inventario.routes').then(
        (m) => m.inventarioRoutes
      ),
  },
  {
    path: 'consumos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/consumos/consumos.routes').then(
        (m) => m.consumosRoutes
      ),
  },
  // FIN MODIFICACIÓN
];