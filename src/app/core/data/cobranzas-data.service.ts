import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {APIData} from './api-data';
import {ResponseStruct} from './api.service';
import {MotivoMora} from '../entities/motivo-mora';
import { Cartera } from '../entities/lote';

@Injectable({
  providedIn: 'root',
})
export class CobranzasDataService extends APIData<any> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'cartera';
  }

  async buscarLotes(pagina: number, cantidadPagina: number): Promise<ResponseStruct<Cartera>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/lotes/buscar/${pagina}/${cantidadPagina}`).toPromise();
  }

  async buscarLotePorId(id_lote: string): Promise<ResponseStruct<Cartera>> {
    return this.http.get<ResponseStruct<any>>(`${this.url}/lotes/buscarpor_id/${id_lote}`).toPromise();
  }

  async registrarLote(form: FormData): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/lotes/registrar`, form).toPromise();
  }

  async registrarAcuerdo(element: RegistrarAcuerdoBody): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/registrar/acuerdos`, element).toPromise();
  }

  async registrarComentario(element: RegistrarComentarioBody): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/registrar/comentarios`, element).toPromise();
  }

  async buscar(element: { sucursal_id: string, zona_id: string }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/buscar`, element).toPromise();
  }

  async descargarAcuerdo(query: { [p: string]: any }): Promise<Blob> {
    const params = new HttpParams({fromObject: query});
    return this.http.get<Promise<Blob>>(`${this.url}/acuerdo/descargarcarta`, {params, responseType: 'blob' as 'json'}).toPromise();
  }

}

interface RegistrarAcuerdoBody {
  cartera_id: string;
  comentario: string;
  fechaAcuerdo: string;
  motivoMora: MotivoMora;
  solicitud_id: string;
}

interface RegistrarComentarioBody {
  cartera_id: string;
  comentario: string;
  solicitud_id: string;
}

