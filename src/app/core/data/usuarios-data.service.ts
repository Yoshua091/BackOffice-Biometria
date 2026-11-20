import {Empleado} from '../entities/empleado';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APIData} from './api-data';
import {ResponseStruct} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosDataService extends APIData<Empleado> {


  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'usuarios';
  }

  buscar(): Promise<ResponseStruct<Empleado[]>> {
    return this.http.get<ResponseStruct<Empleado[]>>(`${this.url}/buscar`).toPromise();
  }

  buscarPorSucursal(element: { _id }): Promise<ResponseStruct<Empleado[]>> {
    return this.http.post<ResponseStruct<Empleado[]>>(`${this.url}/buscar/sucursal`, element).toPromise();
  }

  registrar(element: Empleado): Promise<ResponseStruct<Empleado>> {
    return this.http.post<ResponseStruct<Empleado>>(`${this.url}/registrar`, element).toPromise();
  }

  modificar(element: Empleado): Promise<ResponseStruct<Empleado>> {
    return this.http.post<ResponseStruct<Empleado>>(`${this.url}/modificar`, element).toPromise();
  }

  borrar(element: Empleado): Promise<ResponseStruct<Empleado>> {
    return this.http.post<ResponseStruct<Empleado>>(`${this.url}/borrar`, element).toPromise();
  }

  buscarGerentesRegionales(): Promise<ResponseStruct<Empleado[]>> {
    return this.http.get<ResponseStruct<Empleado[]>>(`${this.url}/buscar/gerentes/regionales`).toPromise();
  }
}
