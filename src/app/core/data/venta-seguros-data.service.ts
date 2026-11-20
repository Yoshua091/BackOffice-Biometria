import { Injectable } from '@angular/core';
import { APIData } from './api-data';
import { HttpClient } from '@angular/common/http';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VentaSegurosDataService extends APIData<any>{

  constructor(protected http: HttpClient) { 
    super(http);
    this.endpoint = 'seguros';
  }


  async listarSeguros(): Promise<ResponseStruct<any[]>> {
    return this.http.get<ResponseStruct<any[]>>(`${this.url}/listar`).toPromise();
  }
}
