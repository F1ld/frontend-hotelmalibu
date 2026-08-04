export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
export type EstadoEstadia = 'ACTIVA' | 'COMPLETADA' | 'CANCELADA';

export interface Reserva {
  id: number;
  huesped: number;
  huesped_nombre: string;
  tipo_habitacion: number;
  tipo_habitacion_nombre: string;
  habitacion: number | null;
  habitacion_numero: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoReserva;
  notas: string;
  created_at: string;
  updated_at: string;
}

export interface ReservaInput {
  huesped: number;
  tipo_habitacion: number;
  habitacion?: number | null;
  fecha_inicio: string;
  fecha_fin: string;
  notas?: string;
}

export interface Estadia {
  id: number;
  reserva: number;
  habitacion: number;
  habitacion_numero: string;
  huesped: number;
  huesped_nombre: string;
  fecha_entrada: string;
  fecha_salida: string | null;
  estado: EstadoEstadia;
  notas: string;
}
