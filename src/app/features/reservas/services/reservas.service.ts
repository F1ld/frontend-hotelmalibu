import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Reserva, ReservaInput, Estadia } from '../models/reserva.model';

const RESERVAS_URL = '/api/reservations/reservas/';
const ESTADIAS_URL = '/api/reservations/estadias/';
const HUESPEDES_ESTADIAS_URL = '/api/reservations/huespedes/';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly http = inject(HttpClient);

  listar(): Promise<Reserva[]> {
    return firstValueFrom(this.http.get<Reserva[]>(RESERVAS_URL));
  }
  
  obtener(id: number): Promise<Reserva> {
    return firstValueFrom(this.http.get<Reserva>(`${RESERVAS_URL}${id}/`));
  }
  
  crear(datos: ReservaInput): Promise<Reserva> {
    return firstValueFrom(this.http.post<Reserva>(RESERVAS_URL, datos));
  }
  
  actualizar(id: number, datos: Partial<ReservaInput>): Promise<Reserva> {
    return firstValueFrom(this.http.patch<Reserva>(`${RESERVAS_URL}${id}/`, datos));
  }
  
  cancelar(id: number): Promise<Reserva> {
    return firstValueFrom(this.http.post<Reserva>(`${RESERVAS_URL}${id}/cancelar/`, {}));
  }
  
  asignarHabitacion(id: number, habitacionId: number): Promise<Reserva> {
    return firstValueFrom(
      this.http.post<Reserva>(`${RESERVAS_URL}${id}/asignar-habitacion/`, { habitacion: habitacionId })
    );
  }
  
  checkIn(id: number): Promise<Estadia> {
    return firstValueFrom(this.http.post<Estadia>(`${RESERVAS_URL}${id}/check-in/`, {}));
  }

  listarEstadias(): Promise<Estadia[]> {
    return firstValueFrom(this.http.get<Estadia[]>(ESTADIAS_URL));
  }
  
  obtenerEstadia(id: number): Promise<Estadia> {
    return firstValueFrom(this.http.get<Estadia>(`${ESTADIAS_URL}${id}/`));
  }
  
  checkOut(id: number): Promise<Estadia> {
    return firstValueFrom(this.http.post<Estadia>(`${ESTADIAS_URL}${id}/check-out/`, {}));
  }
  
  listarEstadiasPorHuesped(huespedId: number): Promise<Estadia[]> {
    return firstValueFrom(
      this.http.get<Estadia[]>(`${HUESPEDES_ESTADIAS_URL}${huespedId}/estadias/`)
    );
  }
}
