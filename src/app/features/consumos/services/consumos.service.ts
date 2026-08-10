// src/app/features/consumos/services/consumos.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Consumo, ConsumoInput } from '../models/consumo.model';

const BASE = '/api/inventory';
const CONSUMOS_URL = `${BASE}/consumos/`;

@Injectable({ providedIn: 'root' })
export class ConsumosService {
  private readonly http = inject(HttpClient);

  listar(estadiaId?: number): Promise<Consumo[]> {
    const url = estadiaId
      ? `${CONSUMOS_URL}?estadia=${estadiaId}`
      : CONSUMOS_URL;
    return firstValueFrom(this.http.get<Consumo[]>(url));
  }

  listarPorEstadia(estadiaId: number): Promise<Consumo[]> {
    return firstValueFrom(
      this.http.get<Consumo[]>(`${BASE}/estadias/${estadiaId}/consumos/`)
    );
  }

  obtener(id: number): Promise<Consumo> {
    return firstValueFrom(this.http.get<Consumo>(`${CONSUMOS_URL}${id}/`));
  }

  registrar(datos: ConsumoInput): Promise<Consumo> {
    return firstValueFrom(this.http.post<Consumo>(CONSUMOS_URL, datos));
  }
}
