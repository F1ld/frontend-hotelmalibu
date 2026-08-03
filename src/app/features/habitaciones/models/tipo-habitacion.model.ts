// src/app/features/habitaciones/models/tipo-habitacion.model.ts
export interface TipoHabitacion {
  id: number;
  nombre: string;
  capacidad: number;
  // DecimalField de DRF se serializa como string.
  tarifa_base: string;
}

export type TipoHabitacionInput = Omit<TipoHabitacion, 'id'>;