import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudesSoporte } from '../entities/solicitudes-soporte';
import { transferirSolicitud, transferirSolicitudBuscar } from '../entities/tranferir-solicitud';
import { APIData } from './api-data';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesSoporteService extends APIData<SolicitudesSoporte>{

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'solicitudes';
   }

  async buscarPorIdSolicitud(element: { idSolicitud }): Promise<ResponseStruct<SolicitudesSoporte>> {
    this.endpoint = 'solicitudes';
    return this.http.post<ResponseStruct<SolicitudesSoporte>>(`${this.url}/buscar/por/idsolicitud`, element).toPromise();
  }

  async buscarPorId(element: { _id }): Promise<ResponseStruct<SolicitudesSoporte>> {
    this.endpoint = 'solicitudes';
    return this.http.post<ResponseStruct<SolicitudesSoporte>>(`${this.url}/buscar/id`, element).toPromise();
  }

  async modificarSolicitud(element: { solicitud: SolicitudesSoporte, cambios: any, motivo: string }): Promise<ResponseStruct<SolicitudesSoporte>> {
    this.endpoint = 'soporte/solicitudes';
    return this.http.post<ResponseStruct<SolicitudesSoporte>>(`${this.url}/modificar`, element).toPromise();
  }

  async transferirSolicitud(element: transferirSolicitud): Promise<ResponseStruct<transferirSolicitud>> {
    this.endpoint = 'soporte/solicitudes';
    return this.http.post<ResponseStruct<transferirSolicitud>>(`${this.url}/transferirentrezonas`, element).toPromise();
  }

  async transferirBuscar(element: {estado: number}): Promise<ResponseStruct<transferirSolicitudBuscar[]>> {
    this.endpoint = 'soporte/solicitudes';
    return this.http.post<ResponseStruct<transferirSolicitudBuscar[]>>(`${this.url}/transferirentrezonasbuscar`, element).toPromise();
  }
}
