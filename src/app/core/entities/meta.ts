import {Perfil} from './perfil';

// tslint:disable
export class Meta {
  _id: string;
  _rev: string;
  estado: number;
  cuantiaMensual: number;
  creimientoCartera: number;
  carteraVencida10: number;
  carteraVencida30: number;
  ventasSeguro: number;
  ventasDatafono: number;
  numeroPrestamos: number;
  aperturaCuentas: number;
  perfil: Perfil;
}
