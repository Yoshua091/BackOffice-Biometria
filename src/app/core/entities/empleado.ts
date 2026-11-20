import {Sucursal} from './sucursal';
import {Perfil} from './perfil';
import {Rol} from './rol';

// tslint:disable
export class Empleado {
  _id: string;
  _rev :string;
  cedula: number;
  nombre: string;
  apellido: string;
  rol: Rol;
  perfil: Perfil;
  lider: boolean;
  regional: boolean;
  sucursal: Sucursal;
  idUsuario: string;
  codigoAsesor: number;
  usuario: string;
  clave: string;
}
