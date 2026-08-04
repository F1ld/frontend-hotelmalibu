import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { HabitacionesService } from '../../habitaciones/services/habitaciones.service';
import { TiposHabitacionService } from '../../habitaciones/services/tipos-habitacion.service';
import { HuespedesService } from '../../huespedes/services/huespedes.service';
import { ReservasService } from '../services/reservas.service';
import { Reserva, ReservaInput } from '../models/reserva.model';
import { Habitacion } from '../../habitaciones/models/habitacion.model';
import { TipoHabitacion } from '../../habitaciones/models/tipo-habitacion.model';
import { Huesped } from '../../huespedes/models/huesped.model';

@Component({
  selector: 'app-reservas-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reservas-list.component.html',
  styleUrl: './reservas-list.component.css',
})
export class ReservasListComponent {
  private readonly reservasService = inject(ReservasService);
  private readonly habitacionesService = inject(HabitacionesService);
  private readonly tiposHabitacionService = inject(TiposHabitacionService);
  private readonly huespedesService = inject(HuespedesService);
  private readonly authService = inject(AuthService);

  readonly rol = this.authService.rol;
  readonly reservas = signal<Reserva[]>([]);
  readonly huespedes = signal<Huesped[]>([]);
  readonly tiposHabitacion = signal<TipoHabitacion[]>([]);
  readonly habitaciones = signal<Habitacion[]>([]);
  
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  
  readonly mostrandoFormulario = signal(false);
  readonly reservaEnEdicion = signal<Reserva | null>(null);
  
  readonly mostrandoAsignacion = signal(false);
  readonly reservaParaAsignar = signal<Reserva | null>(null);
  readonly habitacionesDisponibles = signal<Habitacion[]>([]);
  
  formulario: ReservaInput = {
    huesped: 0,
    tipo_habitacion: 0,
    fecha_inicio: '',
    fecha_fin: '',
    notas: ''
  };

  habitacionAsignadaId = 0;

  constructor() {
    this.cargar();
    this.cargarDatosDesplegables();
  }

  async cargar() {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const data = await this.reservasService.listar();
      this.reservas.set(data);
    } catch (err: any) {
      this.error.set(err.message || 'Error al cargar reservas');
    } finally {
      this.cargando.set(false);
    }
  }

  async cargarDatosDesplegables() {
    try {
      const [huespedesData, tiposData, habsData] = await Promise.all([
        this.huespedesService.listar(),
        this.tiposHabitacionService.listar(),
        this.habitacionesService.listar()
      ]);
      this.huespedes.set(huespedesData);
      this.tiposHabitacion.set(tiposData);
      this.habitaciones.set(habsData);
    } catch (err: any) {
      this.error.set('Error al cargar datos necesarios');
    }
  }

  abrirCreacion() {
    this.reservaEnEdicion.set(null);
    this.formulario = {
      huesped: 0,
      tipo_habitacion: 0,
      fecha_inicio: '',
      fecha_fin: '',
      notas: ''
    };
    this.mostrandoFormulario.set(true);
    this.mostrandoAsignacion.set(false);
  }

  abrirEdicion(reserva: Reserva) {
    this.reservaEnEdicion.set(reserva);
    this.formulario = {
      huesped: reserva.huesped,
      tipo_habitacion: reserva.tipo_habitacion,
      habitacion: reserva.habitacion,
      fecha_inicio: reserva.fecha_inicio.split('T')[0],
      fecha_fin: reserva.fecha_fin.split('T')[0],
      notas: reserva.notas
    };
    this.mostrandoFormulario.set(true);
    this.mostrandoAsignacion.set(false);
  }

  cancelarFormulario() {
    this.mostrandoFormulario.set(false);
    this.reservaEnEdicion.set(null);
  }

  async guardar() {
    this.error.set(null);
    this.cargando.set(true);
    try {
      if (this.reservaEnEdicion()) {
        await this.reservasService.actualizar(this.reservaEnEdicion()!.id, this.formulario);
      } else {
        await this.reservasService.crear(this.formulario);
      }
      this.mostrandoFormulario.set(false);
      await this.cargar();
    } catch (err: any) {
      this.error.set(err.message || 'Error al guardar reserva');
    } finally {
      this.cargando.set(false);
    }
  }

  async cancelarReserva(reserva: Reserva) {
    if (!confirm(`¿Está seguro de cancelar la reserva #${reserva.id}?`)) return;
    this.error.set(null);
    this.cargando.set(true);
    try {
      await this.reservasService.cancelar(reserva.id);
      await this.cargar();
    } catch (err: any) {
      this.error.set(err.message || 'Error al cancelar reserva');
    } finally {
      this.cargando.set(false);
    }
  }

  abrirAsignacion(reserva: Reserva) {
    this.reservaParaAsignar.set(reserva);
    const disponibles = this.habitaciones().filter(
      (h) => h.tipo_habitacion === reserva.tipo_habitacion && h.estado === 'LIBRE'
    );
    this.habitacionesDisponibles.set(disponibles);
    this.habitacionAsignadaId = disponibles.length > 0 ? disponibles[0].id : 0;
    this.mostrandoAsignacion.set(true);
    this.mostrandoFormulario.set(false);
  }

  cancelarAsignacion() {
    this.mostrandoAsignacion.set(false);
    this.reservaParaAsignar.set(null);
  }

  async confirmarAsignacion() {
    if (!this.habitacionAsignadaId || !this.reservaParaAsignar()) return;
    this.error.set(null);
    this.cargando.set(true);
    try {
      await this.reservasService.asignarHabitacion(this.reservaParaAsignar()!.id, this.habitacionAsignadaId);
      this.mostrandoAsignacion.set(false);
      await this.cargar();
      await this.cargarDatosDesplegables(); // Refrescar habitaciones
    } catch (err: any) {
      this.error.set(err.message || 'Error al asignar habitación');
    } finally {
      this.cargando.set(false);
    }
  }

  async hacerCheckIn(reserva: Reserva) {
    if (!confirm(`¿Está seguro de realizar el Check-in para la reserva #${reserva.id}?`)) return;
    this.error.set(null);
    this.cargando.set(true);
    try {
      await this.reservasService.checkIn(reserva.id);
      await this.cargar();
    } catch (err: any) {
      this.error.set(err.message || 'Error al realizar Check-in');
    } finally {
      this.cargando.set(false);
    }
  }

  esAdminOCrecepcion() {
    const r = this.rol();
    return r === 'ADMIN' || r === 'RECEPCION' || r === 'PLATFORM_ADMIN';
  }
}
