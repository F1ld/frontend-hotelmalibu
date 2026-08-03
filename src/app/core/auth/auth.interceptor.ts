// src/app/core/auth/auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const RUTAS_SIN_TOKEN = ['/api/accounts/login/', '/api/accounts/refresh/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (RUTAS_SIN_TOKEN.some((ruta) => req.url.includes(ruta))) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();
  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && accessToken) {
        return from(authService.refresh()).pipe(
          switchMap((nuevoAccessToken) => {
            const reintento = req.clone({
              setHeaders: { Authorization: `Bearer ${nuevoAccessToken}` },
            });
            return next(reintento);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};