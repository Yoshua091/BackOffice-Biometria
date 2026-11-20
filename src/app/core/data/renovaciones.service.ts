import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote, Renovacion } from '../entities/renovaciones';
import { APIData } from './api-data';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RenovacionesService extends APIData<any>{

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'renovacion';
  }

  async registrarLoteRenovacion(form: FormData): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/lotes/registrar`, form).toPromise();
  }

  async buscarLotes(page: number, elementsByPage: number): Promise<ResponseStruct<Renovacion>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/lotes/buscar/${page}/${elementsByPage}`).toPromise();
  }

  async buscarLotePorId(id: string): Promise<ResponseStruct<Lote>> {
    return this.http.get<ResponseStruct<Lote>>(`${this.url}/lotes/buscarpor_id/${id}`).toPromise();
  }
}
