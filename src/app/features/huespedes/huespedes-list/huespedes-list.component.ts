// src/app/features/huespedes/huespedes-list/huespedes-list.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Huesped, HuespedInput } from '../models/huesped.model';
import { HuespedesService } from '../services/huespedes.service';

@Component({
  selector: 'app-huespedes-list',
  imports: [FormsModule],
  templateUrl: './huespedes-list.component.html',
  styleUrl: './huespedes-list.component.css',
})
export class HuespedesListComponent {
  private readonly huespedesService = inject(HuespedesService);

  readonly huespedes = signal<Huesped[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly mostrandoFormulario = signal(false);
  readonly huespedEnEdicion = signal<Huesped | null>(null);
  readonly formulario: HuespedInput = {
    nombre: '',
    documento_identidad: '',
    telefono: '',
    email: '',
  };

  constructor() {
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      this.huespedes.set(await this.huespedesService.listar());
    } catch {
      this.error.set('No se pudieron cargar los huéspedes.');
    } finally {
      this.cargando.set(false);
    }
  }

  abrirCreacion(): void {
    this.huespedEnEdicion.set(null);
    this.formulario.nombre = '';
    this.formulario.documento_identidad = '';
    this.formulario.telefono = '';
    this.formulario.email = '';
    this.mostrandoFormulario.set(true);
  }

  abrirEdicion(huesped: Huesped): void {
    this.huespedEnEdicion.set(huesped);
    this.formulario.nombre = huesped.nombre;
    this.formulario.documento_identidad = huesped.documento_identidad;
    this.formulario.telefono = huesped.telefono;
    this.formulario.email = huesped.email;
    this.mostrandoFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.huespedEnEdicion.set(null);
  }

  async guardar(): Promise<void> {
    this.error.set(null);
    try {
      const enEdicion = this.huespedEnEdicion();
      if (enEdicion) {
        const actualizado = await this.huespedesService.actualizar(
          enEdicion.id,
          this.formulario
        );
        this.huespedes.update((lista) =>
          lista.map((h) => (h.id === actualizado.id ? actualizado : h))
        );
      } else {
        const creado = await this.huespedesService.crear(this.formulario);
        this.huespedes.update((lista) => [...lista, creado]);
      }
      this.cancelarFormulario();
    } catch {
      this.error.set('No se pudo guardar el huésped.');
    }
  }

  async eliminar(huesped: Huesped): Promise<void> {
    this.error.set(null);
    try {
      await this.huespedesService.eliminar(huesped.id);
      this.huespedes.update((lista) => lista.filter((h) => h.id !== huesped.id));
    } catch {
      this.error.set('No se pudo eliminar el huésped.');
    }
  }
}