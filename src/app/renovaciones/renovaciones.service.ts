import { Injectable } from '@angular/core';
import {Cliente, Solicitudes} from '../core/entities/solicitudes';
import {TiposMiembro} from '../core/types';

@Injectable({
  providedIn: 'root'
})
export class RenovacionesService {

  // tslint:disable:variable-name
  private _solicitud: Solicitudes = null;
  private _lider: Cliente = null;

  get solicitud(): Solicitudes {
    return this._solicitud;
  }

  set solicitud(value: Solicitudes) {
    if (!!value) {
      this._solicitud = value;

      // TODO: esta sección de código se puede encapsular en un metodo global
      const { miembros } = this._solicitud;
      const {LIDER, CLIENTE_EXPERTO} = TiposMiembro;

      this._lider = miembros.find(item => [LIDER, CLIENTE_EXPERTO].includes(item.tipoMiembro.id));
    }
  }

  get lider(): Cliente {
    return this._lider;
  }

  constructor() {
  }
}
