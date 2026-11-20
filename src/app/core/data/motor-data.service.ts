import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseStruct } from './api.service';
import { APIData } from './api-data';

@Injectable({
  providedIn: 'root'
})
export class MotorDataService extends APIData<any>{

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'motor';
   }

   async motorReglasBuscarLotes(estado: number): Promise<ResponseStruct<any>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/consultar/reglas/${estado}`).toPromise();
  }

   async registrarLoteReglasMotor(form: FormData): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/cargar/reglas`, form).toPromise();
  }

  async validarLoteReglasMotor(form: FormData, simular: string): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/validar/reglas/${simular}`, form).toPromise();
  }

  async aprobarLoteReglasMotor(aprobar: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/aprobar/reglas`, aprobar).toPromise();
  }
}
