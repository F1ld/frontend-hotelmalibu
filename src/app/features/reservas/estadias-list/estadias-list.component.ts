import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ReservasService } from '../services/reservas.service';
import { Estadia } from '../models/reserva.model';

@Component({
  selector: 'app-estadias-list',
  standalone: true,
  templateUrl: './estadias-list.component.html',
  styleUrl: './estadias-list.component.css',
})
export class EstadiasListComponent {
  private readonly reservasService = inject(ReservasService);
  private readonly authService = inject(AuthService);

  readonly rol = this.authService.rol;
  readonly estadias = signal<Estadia[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  async cargar() {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const data = await this.reservasService.listarEstadias();
      this.estadias.set(data);
    } catch (err: any) {
      this.error.set(err.message || 'Error al cargar estadías');
    } finally {
      this.cargando.set(false);
    }
  }

  async checkOut(estadia: Estadia) {
    if (!confirm(`¿Está seguro de realizar el Check-out para la estadía #${estadia.id}?`)) return;
    this.error.set(null);
    this.cargando.set(true);
    try {
      await this.reservasService.checkOut(estadia.id);
      await this.cargar();
    } catch (err: any) {
      this.error.set(err.message || 'Error al realizar Check-out');
    } finally {
      this.cargando.set(false);
    }
  }
}
