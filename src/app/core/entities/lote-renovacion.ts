// tslint:disable
import {Simulacion} from './solicitudes';

export class LoteRenovacion {
  _id: string;
  _rev: string;
  usuario_id: string;
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    usuario: string;
  };
  numRegistros: 5;
  archivo: string;
  validacion: {
    proceso: number;
    correctos: number;
    error: number;
  };
  registros: LoteRenovacionRegistro[];
  error: any[];
  estado: number;
  createdAt: string;
  updatedAt: string;
}

export class LoteRenovacionRegistro {
  idSolicitud: string;
  idSolicitudPadre?: string;
  createdAt: string;
  updatedAt: string;
  estado: number;
  pavance: number;
  saldo: number;
  tipoRenovacion: string;
  porcentajeRenovacion: number;
  montoPreaprobado: number;
  simulacion: Simulacion;
  vigencia: string;
  procesado: number;
  log: string;
  index: 0;
  cambioMiembros: false;
  linea: string;
}


