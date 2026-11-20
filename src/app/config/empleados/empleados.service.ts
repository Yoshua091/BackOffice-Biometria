import {Injectable} from '@angular/core';
import {Empleado} from '../../core/entities/empleado';

@Injectable()
export class EmpleadosService {

  current: Empleado;

  constructor() {
  }
}
