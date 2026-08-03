// src/app/features/habitaciones/services/tipos-habitacion.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TipoHabitacion, TipoHabitacionInput } from '../models/tipo-habitacion.model';

const BASE_URL = '/api/hotels/tipos-habitacion/';

@Injectable({ providedIn: 'root' })
export class TiposHabitacionService {
  private readonly http = inject(HttpClient);

  listar(): Promise<TipoHabitacion[]> {
    return firstValueFrom(this.http.get<TipoHabitacion[]>(BASE_URL));
  }

  crear(datos: TipoHabitacionInput): Promise<TipoHabitacion> {
    return firstValueFrom(this.http.post<TipoHabitacion>(BASE_URL, datos));
  }

  actualizar(id: number, datos: Partial<TipoHabitacionInput>): Promise<TipoHabitacion> {
    return firstValueFrom(this.http.patch<TipoHabitacion>(`${BASE_URL}${id}/`, datos));
  }

  eliminar(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}${id}/`));
  }
}