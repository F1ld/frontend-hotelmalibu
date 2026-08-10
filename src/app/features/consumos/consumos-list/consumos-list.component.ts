// src/app/features/consumos/consumos-list/consumos-list.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ConsumosService } from '../services/consumos.service';
import { InventarioService } from '../../inventario/services/inventario.service';
import { ReservasService } from '../../reservas/services/reservas.service';
import { Consumo, ConsumoInput } from '../models/consumo.model';
import { Producto } from '../../inventario/models/inventario.model';
import { Estadia } from '../../reservas/models/reserva.model';

@Component({
  selector: 'app-consumos-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './consumos-list.component.html',
  styleUrl: './consumos-list.component.css',
})
export class ConsumosListComponent {
  private readonly consumosService = inject(ConsumosService);
  private readonly inventarioService = inject(InventarioService);
  private readonly reservasService = inject(ReservasService);
  private readonly authService = inject(AuthService);

  readonly rol = this.authService.rol;
  readonly estadiasActivas = signal<Estadia[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly consumos = signal<Consumo[]>([]);

  readonly estadiaSeleccionadaId = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mostrandoFormulario = signal(false);

  formulario: Omit<ConsumoInput, 'estadia'> = {
    producto: 0,
    cantidad: 1,
    notas: '',
  };

  // Total en S/ de consumos cargados a la estadía seleccionada
  readonly totalConsumos = computed(() =>
    this.consumos().reduce(
      (acc, c) => acc + Number(c.precio_unitario) * c.cantidad,
      0
    )
  );

  constructor() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const [estadias, productos] = await Promise.all([
        this.reservasService.listarEstadias(),
        this.inventarioService.listarProductos(),
      ]);
      // Solo estadías ACTIVAS
      this.estadiasActivas.set(estadias.filter(e => e.estado === 'ACTIVA'));
      this.productos.set(productos);
    } catch {
      this.error.set('Error al cargar los datos. Intenta de nuevo.');
    } finally {
      this.cargando.set(false);
    }
  }

  async seleccionarEstadia(id: number) {
    this.estadiaSeleccionadaId.set(id);
    this.consumos.set([]);
    this.error.set(null);
    if (!id) return;
    try {
      const consumos = await this.consumosService.listarPorEstadia(id);
      this.consumos.set(consumos);
    } catch {
      this.error.set('Error al cargar consumos de esta estadía.');
    }
  }

  abrirFormulario() {
    this.formulario = { producto: 0, cantidad: 1, notas: '' };
    this.mostrandoFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrandoFormulario.set(false);
  }

  async registrarConsumo() {
    const estadiaId = this.estadiaSeleccionadaId();
    if (!estadiaId || !this.formulario.producto) {
      this.error.set('Selecciona una estadía y un producto válidos.');
      return;
    }
    this.error.set(null);
    try {
      await this.consumosService.registrar({
        estadia: estadiaId,
        ...this.formulario,
      });
      this.cerrarFormulario();
      // Recargar consumos y stock actualizado
      const [consumos, productos] = await Promise.all([
        this.consumosService.listarPorEstadia(estadiaId),
        this.inventarioService.listarProductos(),
      ]);
      this.consumos.set(consumos);
      this.productos.set(productos);
    } catch (err: any) {
      const data = err?.error;
      if (data?.cantidad) {
        this.error.set(data.cantidad[0] || 'Stock insuficiente.');
      } else if (data?.estadia) {
        this.error.set(data.estadia[0] || 'La estadía no está activa.');
      } else {
        this.error.set('Error al registrar el consumo. Verifica los datos.');
      }
    }
  }

  estadiaLabel(e: Estadia): string {
    return `Hab. ${e.habitacion_numero} — ${e.huesped_nombre}`;
  }

  productoLabel(p: Producto): string {
    return `${p.nombre} (stock: ${p.stock_actual})`;
  }
}
