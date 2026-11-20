import { Injectable } from '@angular/core';
import {APIData} from './api-data';
import {Meta} from '../entities/meta';
import {HttpClient} from '@angular/common/http';
import {ResponseStruct} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MetasDataService extends APIData<Meta> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'metas';
  }

  buscar(): Promise<ResponseStruct<Meta[]>> {
    return this.http.get<ResponseStruct<Meta[]>>(`${this.url}/buscar`).toPromise();
  }

  modificar(element: Meta): Promise<ResponseStruct<Meta>> {
    return this.http.post<ResponseStruct<Meta>>(`${this.url}/modificar`, element).toPromise();
  }
}
