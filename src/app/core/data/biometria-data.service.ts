import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseStruct } from './api.service';

export enum ResultadoBiometria {
  ACEPTADO = 'ACEPTADO',
  RECHAZADO = 'RECHAZADO',
  FALSO_POSITIVO = 'FALSO_POSITIVO',
  RECHAZO_DATOS = 'RECHAZO_DATOS',
  ERROR_TECNICO = 'ERROR_TECNICO'
}

export interface DetalleComparacionBiometria {
  campo: string;
  valorEsperado: string;
  valorRecibido: string;
  coincide: boolean;
}

export interface ResultadoBiometriaData {
  ok: boolean;
  response?: {
    tipo?: ResultadoBiometria;
    respuestaDecisiones?: string[];
  };
  message?: string;
  comparacionDatos?: {
    coincide: boolean;
    coincidencias: number;
    detalles?: DetalleComparacionBiometria[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class BiometriaDataService {
  private endpoint = 'biometria';
  private endpointComparacion = 'biometria/comparacion';

  constructor(private http: HttpClient) { }

  validar(formData: FormData): Promise<ResponseStruct<ResultadoBiometriaData>> {
    return this.http.post<ResponseStruct<ResultadoBiometriaData>>(`${environment.host}/${this.endpoint}`, formData, {
      headers: {skip: 'true'}
    }).toPromise();
  }

  compararDatos(element: { idSolicitud: string }): Promise<ResponseStruct<ResultadoBiometriaData>> {
    return this.http.post<ResponseStruct<ResultadoBiometriaData>>(`${environment.host}/${this.endpointComparacion}`, element, {
      headers: {skip: 'true'}
    }).toPromise();
  }
}
