import { Injectable } from '@angular/core';
import { APIData } from './api-data';
import { Solicitudes } from '../entities/solicitudes';
import { Empleado } from '../entities/empleado';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseStruct } from './api.service';
import { TiposReferencias } from '../types';
import { STORAGE_KEYS } from '../constants';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesDataService extends APIData<Solicitudes> {

  get pathImg(): string {
    const { pathImg } = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
    return pathImg || null;
  }

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = 'solicitudes';
  }

  buscarPorId(element: { _id }): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.post<ResponseStruct<Solicitudes[]>>(`${this.url}/buscar/id`, element).toPromise();
  }

  buscarPorAsesor(element: { _id }): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.post<ResponseStruct<Solicitudes[]>>(`${this.url}/buscar/idasesor`, element).toPromise();
  }

  buscarPorCedulaNombre(element: any): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.post<ResponseStruct<Solicitudes[]>>(`${this.url}/buscar/nombrecedula`, element).toPromise();
  }

  buscarPorEstado(element: { estados: number[], pagina: number }): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.post<ResponseStruct<Solicitudes[]>>(`${this.url}/buscar/por/sucursal`, element).toPromise();
  }

  buscarPorCedula(element: { numeroIdentificacion: number }): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.post<ResponseStruct<Solicitudes[]>>(`${this.url}/buscar/cedula`, element).toPromise();
  }

  asignarAnalita(idSolicitud: string, asesor: Empleado): Promise<ResponseStruct<Solicitudes>> {
    const elements = { _id: idSolicitud, usuario: asesor };
    return this.http.post<ResponseStruct<Solicitudes>>(`${this.url}/asignaranalista`, elements).toPromise();
  }

  contarPorEstado(element: { _idSucursal: string, ano: string, mes: string }): Promise<ResponseStruct<{ [estado: number]: number }>> {
    return this.http.post<ResponseStruct<{ [estado: number]: number }>>(`${this.url}/contar/por/sucursal`, element).toPromise();
  }

  pendientesHoy(): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.get<ResponseStruct<Solicitudes[]>>(`${this.url}/pendientes/hoy`).toPromise();
  }

  pendientesMes(): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.get<ResponseStruct<Solicitudes[]>>(`${this.url}/pendientes/mes`).toPromise();
  }

  pendientesTodo(): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.get<ResponseStruct<Solicitudes[]>>(`${this.url}/pendientes/todo`).toPromise();
  }

  pendientesFecha(element: { fechaInicio: string, fechaFin: string }): Promise<ResponseStruct<Solicitudes[]>> {
    return this.http.post<ResponseStruct<Solicitudes[]>>(`${this.url}/pendientes/fecha`, element).toPromise();
  }

  agregarComentario(element: { _id: string, mensaje: string }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/registrar/chat`, element).toPromise();
  }

  modificarEstado(element: { _id: string, estado: number }): Promise<ResponseStruct<Solicitudes>> {
    return this.http.post<ResponseStruct<Solicitudes>>(`${this.url}/modificar`, element).toPromise();
  }

  // obtenerAdjuntoServerEstatico(element: { _id: string, nombre: number }): Promise<Blob> {

  //   // if (!this.pathImg) {
  //   //   return Promise.reject('Error al encontrar la ruta al servidor de contenidos estáticos');
  //   // }

  //   const urlImagen = 'http://146.190.59.1/static/img/'

  //   return this.http.get<Blob>(`${urlImagen + element._id}/${element.nombre}.png`, {

  //     responseType: 'blob' as 'json',
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json',
  //     })
  //   }).toPromise();
  // }

  obtenerAdjuntoServerEstatico(element: { _id: string, nombre: number }): Promise<Blob> {

    if (!this.pathImg) {
      return Promise.reject('Error al encontrar la ruta al servidor de contenidos estáticos');
    }

    return this.http.get<Blob>(`${this.pathImg + element._id}/${element.nombre}.png`, {
      responseType: 'blob' as 'json',
      headers: { skip: "true" }
    }).toPromise();
  }

  obtenerAdjunto(element: { _id: string, nombre: number }): Promise<ResponseStruct<{ data: Iterable<number> }>> {
    return this.http.post<ResponseStruct<{ data: Iterable<number> }>>(`${this.url}/obtener/adjunto`, element).toPromise();
  }

  modificarImagen(element: { _id: string, idImagen: number, estado: number, mensajes?: { motivo: string } }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/modificar/imagen`, element).toPromise();
  }

  aprobar(element: AprobarParams): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/aprobacion`, element).toPromise();
  }

  async aprobarOTP(element: any): Promise<ResponseStruct<any>> {
    // return null;
    return this.http.post<ResponseStruct<any>>(`${this.url}/otp/aprobargerente`, element).toPromise();
  }

  async registrarReferencias(element: { identificacion: string; preguntas: any[]; _id: string, grupo: TiposReferencias }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/registrar/referencias`, element).toPromise();
  }

  async buscarScriptSimulador(): Promise<Blob> {
    const options = { headers: { Accept: 'application/javascript' }, responseType: 'blob' };
    // @ts-ignore
    return this.http.get<ResponseStruct<any>>('/assets/simulador.js', options).toPromise();
  }

  async ajustarMonto(element: { _id: string, montos: any[], plazoMeses: any }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/modificar/montos`, element).toPromise();
  }

  async iniciarOTP(element: { identificacion: string; _id: string, fechaEquipo: string }): Promise<ResponseStruct<Solicitudes>> {
    return this.http.post<ResponseStruct<Solicitudes>>(`${this.url}/iniciar/codigo/otp`, element).toPromise();
  }

  async generarCodigoOTP(element: { identificacion: string; _id: string, fechaEquipo: string }): Promise<ResponseStruct<Solicitudes>> {
    return this.http.post<ResponseStruct<Solicitudes>>(`${this.url}/generar/codigo/otp`, element).toPromise();
  }

  async confirmarOTP(element: { identificacion: string; _id: string, codigoOtp: number | string }): Promise<ResponseStruct<Solicitudes>> {
    return this.http.post<ResponseStruct<Solicitudes>>(`${this.url}/verificar/codigo/otp`, element).toPromise();
  }

  async obtenerPreguntasOTP(element: { _id: string, identificacion: number | string }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/obtener/preguntas/otp`, element).toPromise();
  }

  async validarPreguntasOTP(element: { _id: string, identificacion: string, respuestas: any[] }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/validar/preguntas/otp`, element).toPromise();
  }

  async historialCredito(element: HistoriaCreditoParams): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/historiaCredito`, element).toPromise();
  }

  async edicionCamposSolicitud(element: EdicionCamposSolicitudParams): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/modificar/campos`, element).toPromise();
  }

  // tslint:disable-next-line:variable-name
  async contrato(_id: string): Promise<Blob> {
    return this.http.get<Blob>(`${this.url}/obtener/contrato`, {
      params: { _id },
      responseType: 'blob' as 'json',
    }).toPromise();
  }

  async sabanasDatos({ ruta, ...rest }: { ruta: string, inicio: string, fin: string }): Promise<Blob> {
    const params: HttpParams = new HttpParams({ fromObject: { ...rest } });
    return this.http.get<Blob>(`${this.host}${ruta}`, {
      params,
      responseType: 'blob' as 'json',
    }).toPromise();
  }

  async vinculacionCuentas(element: { tipo: '1' | '2' }): Promise<Blob> {
    const params: HttpParams = new HttpParams({ fromObject: element });
    return this.http.get<any>(`${this.url}/obtener/vinculacion`, {
      params,
      responseType: 'blob' as 'json',
    }).toPromise();
  }

  async buscarRenovacion(element: { sucursal_id: string, zona_id: string }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/buscar/renovacion`, element).toPromise();
  }

  async sincronizar(element: { usuario: string }): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/sincronizar/asesor/usuario`, element).toPromise();
  }

  async datosContactoCliente(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/modificar/datoscontactocliente`, element).toPromise();
  }
  async obtenerPosiciones(element: { _idSucursal: string, ano: string, mes: string }): Promise<ResponseStruct<any[]>> {
    return this.http.post<ResponseStruct<any[]>>(`${this.url}/obtener/posiciones`, element).toPromise();
  }

  async agregarSeguro(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/seguros/agregar`, element).toPromise();
  }

  async eliminarSeguro(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/seguros/borrar`, element).toPromise();
  }

  async buscarCoincidencias(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/buscar/coincidencias`, element).toPromise();
  }

  async buscarDesembolsosEnCurso(element: any): Promise<ResponseStruct<any>> {
    return this.http.post<ResponseStruct<any>>(`${this.url}/buscar/desembolso/encurso`, element).toPromise();
  }
}

interface HistoriaCreditoParams {
  primerApellido: string;
  tipoIdentificacion: number;
  identificacion: string;
}

interface AprobarParams {
  _id: string;
  identificacion: string;
  aprobacion: {
    fotos: boolean;
    firmas: boolean;
    historial: boolean;
    referencias: boolean;
    clienteExperto: boolean;
  };
}

interface AprobarOTPParams {
  _id: string;
  identificacion: string;
  validadoGerente: boolean;
}

export interface EdicionCamposSolicitudParams {
  _id: string;
  identificacion: string;
  campo: string;
  valor: string;
  motivo: string;
}
