import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIData } from './api-data';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PreguntasDataService extends APIData<any> {

  constructor(protected http: HttpClient) { 
    super(http);
    this.endpoint = 'preguntas/otp';
  }

  async obtenerPreguntasOtp(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/obtener`, element).toPromise();
  }

  async validarPreguntasOtp(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/validar`, element).toPromise();
  }
}
