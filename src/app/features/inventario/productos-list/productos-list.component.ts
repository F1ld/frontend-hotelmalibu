// src/app/features/inventario/productos-list/productos-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { InventarioService } from '../services/inventario.service';
import { Producto, ProductoInput, Proveedor, EntradaStockInput } from '../models/inventario.model';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.css',
})
export class ProductosListComponent {
  private readonly inventarioService = inject(InventarioService);
  private readonly authService = inject(AuthService);

  readonly rol = this.authService.rol;
  readonly productos = signal<Producto[]>([]);
  readonly proveedores = signal<Proveedor[]>([]);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  // Estado del modal de producto
  readonly mostrandoFormProducto = signal(false);
  readonly productoEnEdicion = signal<Producto | null>(null);

  // Estado del modal de entrada de stock
  readonly mostrandoFormEntrada = signal(false);
  readonly productoParaEntrada = signal<Producto | null>(null);

  formularioProducto: ProductoInput = {
    nombre: '',
    categoria: '',
    stock_minimo: 0,
    costo: '0.00',
    precio: '0.00',
  };

  formularioEntrada: Omit<EntradaStockInput, 'producto'> = {
    proveedor: 0,
    cantidad: 1,
    costo_unitario: '0.00',
    notas: '',
  };

  constructor() {
    this.cargar();
  }

  async cargar() {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const [productos, proveedores] = await Promise.all([
        this.inventarioService.listarProductos(),
        this.inventarioService.listarProveedores(),
      ]);
      this.productos.set(productos);
      this.proveedores.set(proveedores);
    } catch {
      this.error.set('Error al cargar los datos. Intenta de nuevo.');
    } finally {
      this.cargando.set(false);
    }
  }

  // ── Producto ─────────────────────────────────────────────────────────────

  abrirFormProducto(producto?: Producto) {
    if (producto) {
      this.productoEnEdicion.set(producto);
      this.formularioProducto = {
        nombre: producto.nombre,
        categoria: producto.categoria,
        stock_minimo: producto.stock_minimo,
        costo: producto.costo,
        precio: producto.precio,
      };
    } else {
      this.productoEnEdicion.set(null);
      this.formularioProducto = {
        nombre: '',
        categoria: '',
        stock_minimo: 0,
        costo: '0.00',
        precio: '0.00',
      };
    }
    this.mostrandoFormProducto.set(true);
  }

  cerrarFormProducto() {
    this.mostrandoFormProducto.set(false);
    this.productoEnEdicion.set(null);
  }

  async guardarProducto() {
    this.error.set(null);
    try {
      const enEdicion = this.productoEnEdicion();
      if (enEdicion) {
        await this.inventarioService.actualizarProducto(enEdicion.id, this.formularioProducto);
      } else {
        await this.inventarioService.crearProducto(this.formularioProducto);
      }
      this.cerrarFormProducto();
      await this.cargar();
    } catch {
      this.error.set('Error al guardar el producto. Verifica los datos.');
    }
  }

  // ── Entrada de Stock ─────────────────────────────────────────────────────

  abrirFormEntrada(producto: Producto) {
    this.productoParaEntrada.set(producto);
    this.formularioEntrada = {
      proveedor: 0,
      cantidad: 1,
      costo_unitario: producto.costo,
      notas: '',
    };
    this.mostrandoFormEntrada.set(true);
  }

  cerrarFormEntrada() {
    this.mostrandoFormEntrada.set(false);
    this.productoParaEntrada.set(null);
  }

  async guardarEntrada() {
    const producto = this.productoParaEntrada();
    if (!producto || !this.formularioEntrada.proveedor) {
      this.error.set('Selecciona un proveedor válido.');
      return;
    }
    this.error.set(null);
    try {
      await this.inventarioService.registrarEntrada({
        producto: producto.id,
        ...this.formularioEntrada,
      });
      this.cerrarFormEntrada();
      await this.cargar();
    } catch {
      this.error.set('Error al registrar la entrada de stock.');
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  get puedeGestionarCatalogo(): boolean {
    return this.rol() === 'ADMIN' || this.rol() === 'ALMACEN';
  }

  totalStockCritico(): number {
    return this.productos().filter(p => p.stock_critico).length;
  }
}
