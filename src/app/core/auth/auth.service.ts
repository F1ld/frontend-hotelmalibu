// src/app/core/auth/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DecodedAccessToken, LoginResponse, Rol } from './auth.models';

const ACCESS_KEY = 'pms_access_token';
const REFRESH_KEY = 'pms_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly accessTokenSignal = signal<string | null>(
    localStorage.getItem(ACCESS_KEY)
  );

  readonly isAuthenticated = computed(() => this.accessTokenSignal() !== null);

  readonly claims = computed<DecodedAccessToken | null>(() => {
    const token = this.accessTokenSignal();
    return token ? this.decode(token) : null;
  });

  readonly rol = computed<Rol | null>(() => this.claims()?.rol ?? null);
  readonly tenantId = computed<number | null>(() => this.claims()?.tenant_id ?? null);

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>('/api/accounts/login/', { email, password })
    );
    this.setTokens(response.access, response.refresh);
  }

  async logout(): Promise<void> {
    const refresh = localStorage.getItem(REFRESH_KEY);
    try {
      if (refresh) {
        await firstValueFrom(this.http.post('/api/accounts/logout/', { refresh }));
      }
    } finally {
      this.clearTokens();
      this.router.navigate(['/login']);
    }
  }

  async refresh(): Promise<string> {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) {
      throw new Error('No hay refresh token disponible.');
    }
    const response = await firstValueFrom(
      this.http.post<LoginResponse>('/api/accounts/refresh/', { refresh })
    );
    this.setTokens(response.access, response.refresh ?? refresh);
    return response.access;
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  private setTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    this.accessTokenSignal.set(access);
  }

  private clearTokens(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this.accessTokenSignal.set(null);
  }

  private decode(token: string): DecodedAccessToken | null {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as DecodedAccessToken;
    } catch {
      return null;
    }
  }
}