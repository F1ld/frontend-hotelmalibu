// src/app/features/huespedes/services/huespedes.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Huesped, HuespedInput } from '../models/huesped.model';

const BASE_URL = '/api/guests/huespedes/';

@Injectable({ providedIn: 'root' })
export class HuespedesService {
  private readonly http = inject(HttpClient);

  listar(): Promise<Huesped[]> {
    return firstValueFrom(this.http.get<Huesped[]>(BASE_URL));
  }

  crear(datos: HuespedInput): Promise<Huesped> {
    return firstValueFrom(this.http.post<Huesped>(BASE_URL, datos));
  }

  actualizar(id: number, datos: Partial<HuespedInput>): Promise<Huesped> {
    return firstValueFrom(this.http.patch<Huesped>(`${BASE_URL}${id}/`, datos));
  }

  eliminar(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}${id}/`));
  }
}