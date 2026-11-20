import {Menu} from './menu';
import {Permisos} from './permisos';

// tslint:disable
export class Rol {
  _id: string;
  _rev: string;
  id: number;
  rol: string;
  menu: Menu[];
  permisosEjecucion: Permisos[];
}
