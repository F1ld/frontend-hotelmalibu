// src/app/features/habitaciones/tipos-habitacion-list/tipos-habitacion-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoHabitacion, TipoHabitacionInput } from '../models/tipo-habitacion.model';
import { TiposHabitacionService } from '../services/tipos-habitacion.service';

@Component({
  selector: 'app-tipos-habitacion-list',
  imports: [FormsModule],
  templateUrl: './tipos-habitacion-list.component.html',
  styleUrl: './tipos-habitacion-list.component.css',
})
export class TiposHabitacionListComponent {
  private readonly tiposHabitacionService = inject(TiposHabitacionService);

  readonly tipos = signal<TipoHabitacion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly mostrandoFormulario = signal(false);
  readonly tipoEnEdicion = signal<TipoHabitacion | null>(null);
  readonly formulario: TipoHabitacionInput = { nombre: '', capacidad: 1, tarifa_base: '0' };

  constructor() {
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      this.tipos.set(await this.tiposHabitacionService.listar());
    } catch {
      this.error.set('No se pudieron cargar los tipos de habitación.');
    } finally {
      this.cargando.set(false);
    }
  }

  abrirCreacion(): void {
    this.tipoEnEdicion.set(null);
    this.formulario.nombre = '';
    this.formulario.capacidad = 1;
    this.formulario.tarifa_base = '0';
    this.mostrandoFormulario.set(true);
  }

  abrirEdicion(tipo: TipoHabitacion): void {
    this.tipoEnEdicion.set(tipo);
    this.formulario.nombre = tipo.nombre;
    this.formulario.capacidad = tipo.capacidad;
    this.formulario.tarifa_base = tipo.tarifa_base;
    this.mostrandoFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.tipoEnEdicion.set(null);
  }

  async guardar(): Promise<void> {
    this.error.set(null);
    try {
      const enEdicion = this.tipoEnEdicion();
      if (enEdicion) {
        const actualizado = await this.tiposHabitacionService.actualizar(
          enEdicion.id,
          this.formulario
        );
        this.tipos.update((lista) =>
          lista.map((t) => (t.id === actualizado.id ? actualizado : t))
        );
      } else {
        const creado = await this.tiposHabitacionService.crear(this.formulario);
        this.tipos.update((lista) => [...lista, creado]);
      }
      this.cancelarFormulario();
    } catch {
      this.error.set('No se pudo guardar el tipo de habitación.');
    }
  }

  async eliminar(tipo: TipoHabitacion): Promise<void> {
    this.error.set(null);
    try {
      await this.tiposHabitacionService.eliminar(tipo.id);
      this.tipos.update((lista) => lista.filter((t) => t.id !== tipo.id));
    } catch {
      this.error.set('No se pudo eliminar el tipo de habitación.');
    }
  }
}