// tslint:disable
export class Lote {
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
  numRegistros: number;
  registros: LoteRegistro[];
  createdAt: string;
  updatedAt: string;
  estado: number;
  archivo: string;
  validacion: {
    proceso: number;
    correctos: number;
    error: number;
  };
  error: any[];
}

export class LoteRegistro {
  solicitud_id: string
  sucursal_id: string
  zona_id: string
  nombre: string
  apellidos: string
  telefono1: string
  telefono2: string
  direccion: string
  diasEnMora: number
  totalDeuda: number
  estadoCobro: number
  idSolicitud: string;
  saldo: number;
  simd1: number;
  simd2: number;
  simd3: number;
  estado: string;
  idEstado: number;
  logEstado: {
    fecha: string;
    estado: string;
  }[];
  procesado: boolean;
}

export interface Cartera {
  lista: Lista[];
  total: number;
}

export interface Lista {
  usuario:      Usuario;
  validacion:   Validacion;
  _id:          string;
  numRegistros: number;
  archivo:      string;
  errorProceso: number;
  error:        Error[];
  estado:       number;
  avance:       number;
  createdAt:    Date;
  updatedAt:    Date;
  __v:          number;
}

export interface Error {
  error: string;
}

export interface Usuario {
  _id:       string;
  idUsuario: string;
  nombre:    string;
  apellido:  string;
}

export interface Validacion {
  proceso:   number;
  correctos: number;
  error:     number;
}

export interface DetalleLote {
  usuario:      Usuario;
  validacion:   Validacion;
  _id:          string;
  numRegistros: number;
  archivo:      string;
  registros:    Registro[];
  errorProceso: number;
  error:        Error[];
  estado:       number;
  avance:       number;
  createdAt:    Date;
  updatedAt:    Date;
  __v:          number;
}

export interface Error {
  error: string;
}

export interface Registro {
  _idSolicitud: string;
  idSolicitud:  string;
  diasEnMora:   number;
  saldo:        number;
  estadoCobro:  number;
  totalDeuda:   number;
  simd1:        number;
  simd2:        number;
  simd3:        number;
  estado:       string;
  idEstado:     number;
  logEstado:    LogEstado[];
  procesado:    boolean;
  _id:          string;
}

export interface LogEstado {
  fecha:  Date;
  estado: string;
  _id:    string;
}