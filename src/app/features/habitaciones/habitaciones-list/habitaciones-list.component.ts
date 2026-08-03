// src/app/features/habitaciones/habitaciones-list/habitaciones-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { EstadoHabitacion, Habitacion, HabitacionInput } from '../models/habitacion.model';
import { TipoHabitacion } from '../models/tipo-habitacion.model';
import { HabitacionesService } from '../services/habitaciones.service';
import { TiposHabitacionService } from '../services/tipos-habitacion.service';

@Component({
  selector: 'app-habitaciones-list',
  imports: [FormsModule],
  templateUrl: './habitaciones-list.component.html',
  styleUrl: './habitaciones-list.component.css',
})
export class HabitacionesListComponent {
  private readonly habitacionesService = inject(HabitacionesService);
  private readonly tiposHabitacionService = inject(TiposHabitacionService);
  private readonly authService = inject(AuthService);

  readonly rol = this.authService.rol;
  readonly esAdmin = () => this.rol() === 'ADMIN';
  readonly esHousekeeping = () => this.rol() === 'HOUSEKEEPING';

  readonly habitaciones = signal<Habitacion[]>([]);
  readonly tipos = signal<TipoHabitacion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly mostrandoFormulario = signal(false);
  readonly habitacionEnEdicion = signal<Habitacion | null>(null);
  readonly formulario: HabitacionInput = { numero: '', tipo_habitacion: 0 };

  // Punto 4: transiciones manuales disponibles por estado, coherentes
  // con las reglas del backend (apps/hotels/services.py).
  private readonly transicionesPorEstado: Record<EstadoHabitacion, EstadoHabitacion[]> = {
    LIBRE: ['MANTENIMIENTO', 'FUERA_DE_SERVICIO'],
    LIMPIEZA: ['LIBRE', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'],
    MANTENIMIENTO: ['LIBRE', 'FUERA_DE_SERVICIO'],
    FUERA_DE_SERVICIO: ['LIBRE', 'MANTENIMIENTO'],
    OCUPADA: [],
  };

  constructor() {
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const [habitaciones, tipos] = await Promise.all([
        this.habitacionesService.listar(),
        // Solo ADMIN puede leer tipos de habitación (Punto 2: tarifas).
        this.esAdmin() ? this.tiposHabitacionService.listar() : Promise.resolve([]),
      ]);
      this.habitaciones.set(habitaciones);
      this.tipos.set(tipos);
    } catch {
      this.error.set('No se pudieron cargar las habitaciones.');
    } finally {
      this.cargando.set(false);
    }
  }

  transicionesDisponibles(habitacion: Habitacion): EstadoHabitacion[] {
    const posibles = this.transicionesPorEstado[habitacion.estado] ?? [];
    if (this.esAdmin()) {
      return posibles;
    }
    if (this.esHousekeeping()) {
      // HOUSEKEEPING (Punto 2): solo Limpieza→Libre y reporte de Mantenimiento.
      return posibles.filter(
        (destino) =>
          (habitacion.estado === 'LIMPIEZA' && destino === 'LIBRE') ||
          destino === 'MANTENIMIENTO'
      );
    }
    return [];
  }

  async cambiarEstado(habitacion: Habitacion, nuevoEstado: EstadoHabitacion): Promise<void> {
    this.error.set(null);
    try {
      const actualizada = await this.habitacionesService.cambiarEstado(
        habitacion.id,
        nuevoEstado
      );
      this.habitaciones.update((lista) =>
        lista.map((h) => (h.id === actualizada.id ? actualizada : h))
      );
    } catch {
      this.error.set('No se pudo cambiar el estado de la habitación.');
    }
  }

  abrirCreacion(): void {
    this.habitacionEnEdicion.set(null);
    this.formulario.numero = '';
    this.formulario.tipo_habitacion = this.tipos()[0]?.id ?? 0;
    this.mostrandoFormulario.set(true);
  }

  abrirEdicion(habitacion: Habitacion): void {
    this.habitacionEnEdicion.set(habitacion);
    this.formulario.numero = habitacion.numero;
    this.formulario.tipo_habitacion = habitacion.tipo_habitacion;
    this.mostrandoFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.habitacionEnEdicion.set(null);
  }

  async guardar(): Promise<void> {
    this.error.set(null);
    try {
      const enEdicion = this.habitacionEnEdicion();
      if (enEdicion) {
        const actualizada = await this.habitacionesService.actualizar(
          enEdicion.id,
          this.formulario
        );
        this.habitaciones.update((lista) =>
          lista.map((h) => (h.id === actualizada.id ? actualizada : h))
        );
      } else {
        const creada = await this.habitacionesService.crear(this.formulario);
        this.habitaciones.update((lista) => [...lista, creada]);
      }
      this.cancelarFormulario();
    } catch {
      this.error.set('No se pudo guardar la habitación.');
    }
  }

  async eliminar(habitacion: Habitacion): Promise<void> {
    this.error.set(null);
    try {
      await this.habitacionesService.eliminar(habitacion.id);
      this.habitaciones.update((lista) => lista.filter((h) => h.id !== habitacion.id));
    } catch {
      this.error.set('No se pudo eliminar la habitación.');
    }
  }
}