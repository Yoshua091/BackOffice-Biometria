import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Solicitudes } from 'src/app/core/entities/solicitudes';
import { Cliente } from 'src/app/core/entities/solicitudes';
import {EstadoCredito, TiposMiembro} from '../../../core/types';
import * as moment from 'moment';
import {CobranzasService} from '../../cobranzas.service';

@Component({
  selector: 'app-seleccionar-cliente-modal',
  templateUrl: './seleccionar-cliente-modal.component.html',
  styleUrls: ['./seleccionar-cliente-modal.component.scss']
})
export class SeleccionarClienteModalComponent implements OnInit {

  @Output() seleccionar: EventEmitter<any> = new EventEmitter<any>();

  @Input() cobranza: Solicitudes;
  @Input() identificacion: number;

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

    if (!!this.identificacion) {
      this.form = new RegComentarioForm(this.identificacion);
    }
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        this.seleccionar.emit(this.form.getRawValue());
      } catch (e) {
        console.log(e);
      }
    }
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
}

export class RegComentarioForm extends FormGroup {

  constructor(identificacion?: number) {
    super({
      identificacion: new FormControl(identificacion || 0),
    });

    this.controls.identificacion.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    return super.getRawValue()?.identificacion;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

