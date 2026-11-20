import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIData } from './api-data';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DispersionesService extends APIData<any> {

  constructor(protected http: HttpClient) { 
    super(http);
    this.endpoint = 'dispersiones';
  }

  async buscarPorEstadoDispersion(element: { estado: number }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/buscar/porestadodispersion`, element).toPromise();
  }

  async getCanalFechas(canal: string, fechaInicio: string, fechaFinal: string): Promise<ResponseStruct<any>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/lotes/buscarporcanalyfechas/${canal}/${fechaInicio}/${fechaFinal}`).toPromise();
  }

  async getBuscarId(id: string): Promise<ResponseStruct<any>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/lotes/buscarpor_id/${id}`).toPromise();
  }

  async resetearDispersiones(element: { documento: number, tipoDocumento: number, descripcion: string }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/resetear`, element).toPromise();
  }

}
