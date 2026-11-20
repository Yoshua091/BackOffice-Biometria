import {Injectable} from '@angular/core';
import {Rol} from '../../core/entities/rol';

@Injectable()
export class RolesService {

  current: Rol;

  constructor() {
  }
}
