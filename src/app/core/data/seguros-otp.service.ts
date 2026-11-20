import { Injectable } from '@angular/core';
import { APIData } from './api-data';
import { HttpClient } from '@angular/common/http';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SegurosOtpService extends APIData<any> {

  constructor(protected http: HttpClient) { 
    super(http);
    this.endpoint = 'otp';
  }

  async enviarOTP(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/seguros/enviar`, element).toPromise();
  }

  async validarOTP(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/seguros/validar`, element).toPromise();
  }
}
