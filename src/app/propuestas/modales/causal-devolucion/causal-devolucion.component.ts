import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { MotivoRechazoDevolucion } from 'src/app/core/entities/motivo-rechazo-devolucion';

@Component({
  selector: 'app-causal-devolucion',
  templateUrl: './causal-devolucion.component.html',
  styleUrls: ['./causal-devolucion.component.scss']
})
export class CausalDevolucionComponent implements OnInit {

  causales: { [k: string]: MotivoRechazoDevolucion[] };
  form: CausalDevolucionForm;

  constructor(public modal: NgbActiveModal) {
    this.form = new CausalDevolucionForm();
    this.causales = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.causalDevolucion || [];
  }

  ngOnInit(): void {
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.modal.close(this.form.getRawValue());
    }
  }
}


export const CAUSALES_RECHAZO_DEVOLUCION = {
  rechazo: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.causalRechazo || [],
  devolucion: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.causalDevolucion || [],
};

export class CausalDevolucionForm extends FormGroup {
  constructor() {
    super({
      causal: new FormControl()
    });

    this.controls.causal.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    const causal = super.getRawValue()?.causal;

    causal.fecha = moment().toISOString();

    return causal;
  }
}

