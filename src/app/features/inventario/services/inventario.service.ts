// src/app/features/inventario/services/inventario.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  EntradaStock,
  EntradaStockInput,
  Producto,
  ProductoInput,
  Proveedor,
  ProveedorInput,
} from '../models/inventario.model';

const BASE = '/api/inventory';
const PROVEEDORES_URL = `${BASE}/proveedores/`;
const PRODUCTOS_URL = `${BASE}/productos/`;
const PRODUCTOS_CRITICOS_URL = `${BASE}/productos/stock-critico/`;
const ENTRADAS_URL = `${BASE}/entradas-stock/`;

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);

  // ── Proveedores ──────────────────────────────────────────────────────────

  listarProveedores(): Promise<Proveedor[]> {
    return firstValueFrom(this.http.get<Proveedor[]>(PROVEEDORES_URL));
  }

  crearProveedor(datos: ProveedorInput): Promise<Proveedor> {
    return firstValueFrom(this.http.post<Proveedor>(PROVEEDORES_URL, datos));
  }

  actualizarProveedor(id: number, datos: Partial<ProveedorInput>): Promise<Proveedor> {
    return firstValueFrom(
      this.http.patch<Proveedor>(`${PROVEEDORES_URL}${id}/`, datos)
    );
  }

  // ── Productos ────────────────────────────────────────────────────────────

  listarProductos(): Promise<Producto[]> {
    return firstValueFrom(this.http.get<Producto[]>(PRODUCTOS_URL));
  }

  listarProductosStockCritico(): Promise<Producto[]> {
    return firstValueFrom(this.http.get<Producto[]>(PRODUCTOS_CRITICOS_URL));
  }

  obtenerProducto(id: number): Promise<Producto> {
    return firstValueFrom(this.http.get<Producto>(`${PRODUCTOS_URL}${id}/`));
  }

  crearProducto(datos: ProductoInput): Promise<Producto> {
    return firstValueFrom(this.http.post<Producto>(PRODUCTOS_URL, datos));
  }

  actualizarProducto(id: number, datos: Partial<ProductoInput>): Promise<Producto> {
    return firstValueFrom(
      this.http.patch<Producto>(`${PRODUCTOS_URL}${id}/`, datos)
    );
  }

  // ── Entradas de Stock ────────────────────────────────────────────────────

  listarEntradas(productoId?: number): Promise<EntradaStock[]> {
    const url = productoId
      ? `${ENTRADAS_URL}?producto=${productoId}`
      : ENTRADAS_URL;
    return firstValueFrom(this.http.get<EntradaStock[]>(url));
  }

  registrarEntrada(datos: EntradaStockInput): Promise<EntradaStock> {
    return firstValueFrom(this.http.post<EntradaStock>(ENTRADAS_URL, datos));
  }
}
