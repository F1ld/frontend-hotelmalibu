// src/app/features/habitaciones/models/habitacion.model.ts
export type EstadoHabitacion =
  | 'LIBRE'
  | 'OCUPADA'
  | 'LIMPIEZA'
  | 'MANTENIMIENTO'
  | 'FUERA_DE_SERVICIO';

export interface Habitacion {
  id: number;
  numero: string;
  tipo_habitacion: number;
  tipo_habitacion_nombre: string;
  estado: EstadoHabitacion;
}

export interface HabitacionInput {
  numero: string;
  tipo_habitacion: number;
}