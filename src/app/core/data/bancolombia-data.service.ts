import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleHistorico, DetallePAB, Dispersion, Historico } from '../entities/bancolombia.interface';
import { APIData } from './api-data';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BancolombiaDataService extends APIData<any>{

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'bancolombia';
  }

  async registrarDispersiones(form: FormData): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/dispersiones/registrar`, form).toPromise();
  }

  async registrarHistoricos(form: FormData): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/registrarhistorico`, form).toPromise();
  }

  async getListaDispersiones(): Promise<ResponseStruct<Dispersion[]>> {
    return this.http.get<ResponseStruct<Dispersion[]>>(`${this.url}/dispersiones/listar`).toPromise();
  }

  async getListaHistoricos(): Promise<ResponseStruct<Historico[]>> {
    return this.http.get<ResponseStruct<Historico[]>>(`${this.url}/dispersiones/historico/listar`).toPromise();
  }

  async getDetallleHistorico(_id: string): Promise<ResponseStruct<DetalleHistorico>> {
    return this.http.get<ResponseStruct<DetalleHistorico>>(`${this.url}/dispersiones/historico/listar/detalle/${_id}`).toPromise();
  }

  async getDetalllePBA(_id: string): Promise<ResponseStruct<DetallePAB>> {
    return this.http.get<ResponseStruct<DetallePAB>>(`${this.url}/dispersiones/pab/detalle/${_id}`).toPromise();
  }

}
