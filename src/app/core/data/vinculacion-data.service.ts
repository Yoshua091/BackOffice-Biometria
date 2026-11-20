import {Injectable} from '@angular/core';
import {APIData} from './api-data';
import {Solicitudes} from '../entities/solicitudes';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponseStruct} from './api.service';
import {TiposReferencias} from '../types';

@Injectable({
  providedIn: 'root'
})
export class VinculacionDataService extends APIData<any> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'vinculacion';
  }

  async buscar(): Promise<ResponseStruct<any>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/buscar`).toPromise();
  }
}
