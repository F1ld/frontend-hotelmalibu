// src/app/features/huespedes/models/huesped.model.ts
export interface Huesped {
  id: number;
  nombre: string;
  documento_identidad: string;
  telefono: string;
  email: string;
}

export type HuespedInput = Omit<Huesped, 'id'>;