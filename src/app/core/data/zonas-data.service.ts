import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Zona } from '../entities/zona';
import { APIData } from './api-data';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ZonasDataService extends APIData<Zona> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'zonas';
   }

  buscar(element: {sucursal_id} ): Promise<ResponseStruct<Zona[]>> {
    return this.http.post<ResponseStruct<Zona[]>>(`${this.url}/listar`, element).toPromise();
  }

  registrar(element: Zona): Promise<ResponseStruct<Zona>> {
    return this.http.post<ResponseStruct<Zona>>(`${this.url}/registrar`, element).toPromise();
  }

  modificar(element: Zona): Promise<ResponseStruct<Zona>> {
    return this.http.post<ResponseStruct<Zona>>(`${this.url}/modificar`, element).toPromise();
  }

  borrar(element: { _id, sucursal_id }): Promise<any> {
    return this.http.post(`${this.url}/borrar`, element).toPromise();
  }

  borrarUsuarioZona(element: { _id, sucursal_id }): Promise<any> {
    return this.http.post(`${this.url}/borrar/asesor`, element).toPromise();
  }

}
