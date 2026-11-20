import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponseStruct} from './api.service';
import {ParsedUrlQueryInput, stringify} from 'querystring';


export interface ModelStruct {
  id?: number;
}

export class APIData<T> {
  protected host: string;
  protected endpoint: string;
  protected http: HttpClient;

  get url(): string {
    return `${environment.host}/${this.endpoint}`;
  }

  constructor(http: HttpClient) {
    this.http = http;
    this.host = environment.host;
  }

  // TODO: reemplazar `${environment.host}/${this.endpoint}` por la propiedad get url

  all(): Promise<ResponseStruct<T[]>> {
    if (typeof this.endpoint === 'undefined') { throw new Error('Error: endpoint property is undefined'); }
    return this.http.get<ResponseStruct<T[]>>(`${environment.host}/${this.endpoint}`).toPromise();
  }

  filterBy(filter: ParsedUrlQueryInput): Promise<ResponseStruct<T[]>> {
    if (typeof this.endpoint === 'undefined') { throw new Error('Error: endpoint property is undefined'); }
    return this.http.get<ResponseStruct<T[]>>(`${environment.host}/${this.endpoint}/filter?${stringify(filter)}`).toPromise();
  }

  findByID(id: number): Promise<ResponseStruct<T>> {
    if (typeof this.endpoint === 'undefined') { throw new Error('Error: endpoint property is undefined'); }
    return this.http.get<ResponseStruct<T>>(`${environment.host}/${this.endpoint}/${id}`).toPromise();
  }

  create(element: T): Promise<ResponseStruct<T>> {
    if (typeof this.endpoint === 'undefined') { throw new Error('Error: endpoint property is undefined'); }
    return this.http.post<ResponseStruct<T>>(`${environment.host}/${this.endpoint}`, element).toPromise();
  }

  update(element: T): Promise<ResponseStruct<any>> {
    if (typeof this.endpoint === 'undefined') { throw new Error('Error: endpoint property is undefined'); }
    return this.http.put<ResponseStruct<any>>(`${environment.host}/${this.endpoint}/${(element as ModelStruct).id}`, element).toPromise();
  }

  delete(element: T): Promise<ResponseStruct<any>> {
    if (typeof this.endpoint === 'undefined') { throw new Error('Error: endpoint property is undefined'); }
    return this.http.delete<ResponseStruct<any>>(`${environment.host}/${this.endpoint}/${(element as ModelStruct).id}`).toPromise();
  }
}
