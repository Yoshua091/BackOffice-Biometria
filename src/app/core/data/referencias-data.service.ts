import { Injectable } from '@angular/core';
import {APIData} from './api-data';
import {Referencias} from '../entities/referencias';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponseStruct} from './api.service';
import {TiposReferencias} from '../types';

@Injectable({
  providedIn: 'root'
})
export class ReferenciasDataService extends APIData<Referencias>{

  constructor(protected http: HttpClient) {
    super(http);

    this.endpoint = 'referencias';
  }

  buscar(grupo: TiposReferencias): Promise<ResponseStruct<Referencias[]>> {
    return this.http.post<ResponseStruct<Referencias[]>>(`${this.url}/buscar`, {grupo}).toPromise();
  }
}
