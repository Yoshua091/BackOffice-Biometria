import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EdicionCamposSolicitudParams } from 'src/app/core/data/solicitudes-data.service';
import { TiposCampos } from 'src/app/core/types';
import { Cliente } from '../../../core/entities/solicitudes';
import * as moment from 'moment';

const {number: numero, select: selector, text: texto, date: fecha} = TiposCampos;

@Component({
  selector: 'app-edicion-campos-modal',
  templateUrl: './edicion-campos-modal.component.html',
  styleUrls: ['./edicion-campos-modal.component.scss']
})

export class EdicionCamposModalComponent implements OnInit {

  readonly TIPOS_CAMPOS = {numero, selector, texto, fecha};

  @Output() camposEdicion: EventEmitter<any> = new EventEmitter<any>();

  @Input() cliente: Cliente;
  @Input() propiedades: any;
  @Input() valorActual: any;

  form: EdicionCamposForm;
  label: string;
  valorActualLabel: string;

  constructor(
    public modal: NgbActiveModal) {
    this.label = '';
    this.valorActualLabel = '';
  }


  ngOnInit(): void {
    this.label = this.propiedades?.label;
    this.valorActualLabel = this.propiedades.tipo === this.TIPOS_CAMPOS.selector ? this.valorActual[this.propiedades.opciones.etiqueta] :
      this.valorActual;
    this.form = new EdicionCamposForm({} as EdicionCamposSolicitudParams, this.propiedades);
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.camposEdicion.emit(this.form.getRawValue());
      this.modal.close();
    }
  }
}


class EdicionCamposForm extends FormGroup {

  constructor(edicionCampos: EdicionCamposSolicitudParams, private propiedades: any) {

    super({
      motivo: new FormControl(edicionCampos.motivo),
      valor: new FormControl(edicionCampos.valor),
    });

    this.controls.motivo.setValidators([
      Validators.required,
    ]);

    this.controls.valor.setValidators(propiedades.validadores);
  }

  getRawValue(): any {
    const value = super.getRawValue();
    value.valor = this.propiedades?.tipo === TiposCampos.number ? Number(value.valor) :
      this.propiedades?.tipo === TiposCampos.date ? moment(value.valor, 'DD-MM-YYYY').toISOString() :
        value.valor;
    return value;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}


