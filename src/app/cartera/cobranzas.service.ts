import { Injectable } from '@angular/core';
import {Acuerdo, Cartera, Cliente, Solicitudes} from '../core/entities/solicitudes';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CobranzasService {

  // tslint:disable:variable-name
  private _cobranza: Solicitudes;
  private _carteraVencida: Cartera = null;

  cliente: Array<Cliente>;

  get cobranza(): Solicitudes {
    return this._cobranza;
  }

  set cobranza(value: Solicitudes) {
    this._carteraVencida = value.cartera.cartera.find(c => c.estadoCobro === 0);
    this._cobranza = value;
  }

  get carteraVencida(): Cartera {
    return this._carteraVencida;
  }

  get acuerdoVigente(): Acuerdo {
    if (!!this._carteraVencida && this._carteraVencida.acuerdos.length > 0) {
      return this._carteraVencida.acuerdos
        .find(a => moment(a.fechaAcuerdo).diff(moment().utc(false).endOf('day'), 'hours') >= 0);
    }

    return null;
  }

  get acuerdosRangoActual(): Acuerdo[] {
    const {acuerdos, diasEnMora} = this.carteraVencida;
    return acuerdos.filter(a => diasEnMora >= a.rango.desde && diasEnMora <= a.rango.hasta);
  }

  constructor() {
  }
}
