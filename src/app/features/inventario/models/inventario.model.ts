// src/app/features/inventario/models/inventario.model.ts

export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  created_at: string;
  updated_at: string;
}

export interface ProveedorInput {
  nombre: string;
  contacto?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock_actual: number;
  stock_minimo: number;
  costo: string;
  precio: string;
  stock_critico: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductoInput {
  nombre: string;
  categoria?: string;
  stock_minimo?: number;
  costo: string;
  precio: string;
}

export interface EntradaStock {
  id: number;
  producto: number;
  producto_nombre: string;
  proveedor: number;
  proveedor_nombre: string;
  cantidad: number;
  costo_unitario: string;
  fecha: string;
  registrado_por: number | null;
  registrado_por_nombre: string | null;
  notas: string;
}

export interface EntradaStockInput {
  producto: number;
  proveedor: number;
  cantidad: number;
  costo_unitario: string;
  notas?: string;
}
