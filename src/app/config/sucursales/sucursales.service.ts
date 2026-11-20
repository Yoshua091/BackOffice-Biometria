import {Injectable} from '@angular/core';
import {Sucursal} from '../../core/entities/sucursal';

@Injectable()
export class SucursalesService {

  current: Sucursal;

  constructor() {
  }
}
