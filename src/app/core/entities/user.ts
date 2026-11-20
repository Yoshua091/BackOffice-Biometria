// tslint:disable

import {Rol} from './rol';
import {Perfil} from './perfil';
import {Sucursal} from './sucursal';

export class User {
  _id?: number;
  _rev :string;
  cedula: number;
  nombre: string;
  apellido: string;
  ultimaConexion: string;
  rol: Rol;
  perfil: Perfil;
  sucursal: Sucursal;
  idUsuario: string;
  codigoAsesor: number;
  usuario: string;
  sucursales?: Sucursal[];
}
