// src/app/features/habitaciones/services/habitaciones.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EstadoHabitacion, Habitacion, HabitacionInput } from '../models/habitacion.model';

const BASE_URL = '/api/hotels/habitaciones/';

@Injectable({ providedIn: 'root' })
export class HabitacionesService {
  private readonly http = inject(HttpClient);

  listar(): Promise<Habitacion[]> {
    return firstValueFrom(this.http.get<Habitacion[]>(BASE_URL));
  }

  crear(datos: HabitacionInput): Promise<Habitacion> {
    return firstValueFrom(this.http.post<Habitacion>(BASE_URL, datos));
  }

  actualizar(id: number, datos: Partial<HabitacionInput>): Promise<Habitacion> {
    return firstValueFrom(this.http.patch<Habitacion>(`${BASE_URL}${id}/`, datos));
  }

  eliminar(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}${id}/`));
  }

  cambiarEstado(id: number, estado: EstadoHabitacion): Promise<Habitacion> {
    return firstValueFrom(
      this.http.patch<Habitacion>(`${BASE_URL}${id}/estado/`, { estado })
    );
  }
}