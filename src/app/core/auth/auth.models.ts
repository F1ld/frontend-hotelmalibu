// src/app/core/auth/auth.models.ts
export type Rol = 'ADMIN' | 'RECEPCION' | 'HOUSEKEEPING' | 'ALMACEN' | 'PLATFORM_ADMIN';

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface DecodedAccessToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  tenant_id: number | null;
  rol: Rol;
  nombre: string;
}