// src/app/features/consumos/models/consumo.model.ts

export interface Consumo {
  id: number;
  estadia: number;
  producto: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string;
  fecha: string;
  registrado_por: number | null;
  registrado_por_nombre: string | null;
  notas: string;
}

export interface ConsumoInput {
  estadia: number;
  producto: number;
  cantidad: number;
  notas?: string;
}
