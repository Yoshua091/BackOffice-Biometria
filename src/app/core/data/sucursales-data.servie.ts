import {APIData} from './api-data';
import {Sucursal} from '../entities/sucursal';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResponseStruct} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService extends APIData<Sucursal> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'sucursales';
  }

  buscar(): Promise<ResponseStruct<Sucursal[]>> {
    return this.http.get<ResponseStruct<Sucursal[]>>(`${this.url}/buscar`).toPromise();
  }

  registrar(element: Sucursal): Promise<any> {
    return this.http.post(`${this.url}/registrar`, element).toPromise();
  }

  modificar(element: Sucursal): Promise<any> {
    return this.http.post(`${this.url}/modificar`, element).toPromise();
  }

  borrar(element: { _id, _rev }): Promise<any> {
    return this.http.post(`${this.url}/borrar`, element).toPromise();
  }

  async atribucionesModificar(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/atribuciones/modificar`, element).toPromise();
  }

}
