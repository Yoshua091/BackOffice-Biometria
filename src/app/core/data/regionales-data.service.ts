import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIData } from './api-data';
import { ResponseStruct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RegionalesDataService extends APIData<any> {

  constructor(protected http: HttpClient) { 
    super(http);
    this.endpoint = 'regionales';
  }

  consultarRegionales(): Promise<ResponseStruct<any[]>> {
    return this.http.get<ResponseStruct<any[]>>(`${this.url}/consultar/activas`).toPromise();
  }

  async registratRegional(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/registrar`, element).toPromise();
  }

  async actualizarRegional(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/actualizar`, element).toPromise();
  }
}
