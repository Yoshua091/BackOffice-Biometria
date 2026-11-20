import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import {MotivoRechazoDevolucion} from '../../../core/entities/motivo-rechazo-devolucion';
import {STORAGE_KEYS} from '../../../core/constants';

@Component({
  selector: 'app-causal-rechazo-devolucion',
  templateUrl: './causal-rechazo-devolucion.component.html',
  styleUrls: ['./causal-rechazo-devolucion.component.scss']
})
export class CausalRechazoDevolucionComponent implements OnInit {


  causales: { [k: string]: MotivoRechazoDevolucion[] };
  form: CausalRechazoDevolucionForm;

  constructor(public modal: NgbActiveModal) {
    this.form = new CausalRechazoDevolucionForm();
    this.causales = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.causalRechazo || [];
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

export class CausalRechazoDevolucionForm extends FormGroup {
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
