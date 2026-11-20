import { Injectable } from '@angular/core';
import {APIData} from './api-data';
import {HttpClient} from '@angular/common/http';
import {ResponseStruct} from './api.service';
import {Rol} from '../entities/rol';
import {Sucursal} from '../entities/sucursal';

@Injectable({
  providedIn: 'root'
})
export class RolesDataService extends APIData<Rol>{

  constructor(protected http: HttpClient) {
    super(http);

    this.endpoint = 'roles';
  }

  buscar(): Promise<ResponseStruct<Rol[]>> {
    return this.http.post<ResponseStruct<Rol[]>>(`${this.url}/buscar`, null).toPromise();
  }

  modificar(element: any): Promise<ResponseStruct<Rol[]>> {
    return this.http.post<ResponseStruct<Rol[]>>(`${this.url}/permisos-ejecucion/modificar`, element).toPromise();
  }

}
