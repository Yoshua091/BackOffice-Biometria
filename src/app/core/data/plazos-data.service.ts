import { Injectable } from '@angular/core';
import {APIData} from './api-data';
import {HttpClient} from '@angular/common/http';
import {ResponseStruct} from './api.service';
import {Plazo} from '../entities/plazo';

@Injectable({
  providedIn: 'root'
})
export class PlazosDataService extends APIData<Plazo>{

  constructor(protected http: HttpClient) {
    super(http);

    this.endpoint = 'plazo';
  }

  prestamo(): Promise<ResponseStruct<Plazo[]>> {
    return this.http.get<ResponseStruct<Plazo[]>>(`${this.url}/prestamo`).toPromise();
  }
}
