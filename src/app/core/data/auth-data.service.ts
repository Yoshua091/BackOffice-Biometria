import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthCredentials} from '../types';
import {ResponseStruct} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {

  private endpoint = 'auth';

  constructor(private http: HttpClient) { }

  login(credentials: AuthCredentials): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${environment.host}/${this.endpoint}/login`, credentials).toPromise();
  }

}
