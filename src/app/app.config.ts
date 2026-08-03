// src/app/app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// INICIO MODIFICACIÓN (Fase 1)
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// FIN MODIFICACIÓN

import { routes } from './app.routes';
// INICIO MODIFICACIÓN (Fase 1)
import { authInterceptor } from './core/auth/auth.interceptor';
// FIN MODIFICACIÓN

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // INICIO MODIFICACIÓN (Fase 1)
    provideHttpClient(withInterceptors([authInterceptor]))
    // FIN MODIFICACIÓN
  ]
};