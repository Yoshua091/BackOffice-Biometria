import {Injectable} from '@angular/core';
import {APIData} from './api-data';
import {HttpClient} from '@angular/common/http';
import {ResponseStruct} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesDataService extends APIData<any> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'reportes';
  }

  async buscar(): Promise<ResponseStruct<any>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/buscar`).toPromise();
  }

  async dashboard(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/dashboard`, element).toPromise();
  }
}
