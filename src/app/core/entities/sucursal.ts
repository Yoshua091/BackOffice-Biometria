import { UsuarioRegistra } from './usuarioRegistra';

// tslint:disable
export class Sucursal {
  _id: string;
  _rev: string;
  nombre: string;
  direccion: string;
  telefono: number;
  estado: number;
  idSucursal: string;
  agencia?: string; 
  usuarioRegistra: UsuarioRegistra; // TODO: cambiar por user
  updatedAt: string;
  region:any;
}
