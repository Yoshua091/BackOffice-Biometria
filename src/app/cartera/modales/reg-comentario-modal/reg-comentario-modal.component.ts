import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {Cartera, Solicitudes} from 'src/app/core/entities/solicitudes';
import { Cliente } from 'src/app/core/entities/solicitudes';
import {EstadoCredito, TiposMiembro} from '../../../core/types';
import {CobranzasService} from '../../cobranzas.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reg-comentario-modal',
  templateUrl: './reg-comentario-modal.component.html',
  styleUrls: ['./reg-comentario-modal.component.scss']
})
export class RegComentarioModalComponent implements OnInit {

  @Output() registrar: EventEmitter<any> = new EventEmitter<any>();

  @Input() cobranza: Solicitudes;

  miembros: Cliente[] = [];
  form: RegComentarioForm;

  get lider(): Cliente {
    if (!!this.cobranza) {
      const { miembros } = this.cobranza;
      const {LIDER, CLIENTE_EXPERTO} = TiposMiembro;

      return miembros.find(item => [LIDER, CLIENTE_EXPERTO].includes(item.tipoMiembro.id));
    }

    return null;
  }

  get codeudores(): Cliente[] {
    if (!!this.cobranza) {
      const { miembros } = this.cobranza;
      const {LIDER, CLIENTE_EXPERTO} = TiposMiembro;
      return miembros.filter(item => ![LIDER, CLIENTE_EXPERTO].includes(item.tipoMiembro.id));
    }

    return null;
  }

  constructor(public modal: NgbActiveModal, private cobranzas: CobranzasService) {
    this.form = new RegComentarioForm();
  }

  ngOnInit(): void {
    this.cobranzas.cobranza = this.cobranza;
  }

  estadoAcuerdoPorCliente(identificacionCliente: number | string): EstadoCredito {
    if (!!this.cobranzas.cobranza) {
      const {acuerdos} = this.cobranzas.carteraVencida;
      const acuerdosCliente = acuerdos.filter(a => a.identificacionCliente === identificacionCliente);

      const sinAcuerdos = acuerdosCliente.length === 0 && EstadoCredito.SIN_ACUERDO;
      const conAcuerdos = sinAcuerdos !== EstadoCredito.SIN_ACUERDO &&
        acuerdosCliente.some(a => moment(a.fechaAcuerdo).diff(moment(), 'hours') >= 0) &&
        EstadoCredito.CON_ACUERDO;
      const acuerdosVencidos = sinAcuerdos !== EstadoCredito.SIN_ACUERDO &&
        acuerdosCliente.every(a => moment(a.fechaAcuerdo).diff(moment(), 'hours') < 0) &&
        EstadoCredito.ACUERDO_VENCIDO;

      return sinAcuerdos || conAcuerdos || acuerdosVencidos || EstadoCredito.SIN_ACUERDO;
    }

    return null;
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        this.registrar.emit(this.form.getRawValue());
      } catch (e) {
        console.log(e);
      }
    }
  }
}

export class RegComentarioForm extends FormGroup {

  constructor() {
    super({
      identificacionCliente: new FormControl(0),
      comentario: new FormControl(),
    });

    this.controls.identificacionCliente.setValidators([
      Validators.required,
    ]);

    this.controls.comentario.setValidators([
      Validators.required,
      Validators.maxLength(5000)
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

