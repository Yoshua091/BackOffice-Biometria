import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../core/data/api.service';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-sincronizacion',
  templateUrl: './sincronizacion.component.html',
  styleUrls: ['./sincronizacion.component.scss']
})
export class SincronizacionComponent implements OnInit {

  form: SincronizacionForm;
  ultimaSincronizacion: { usuario: string; cantidad: number; fecha: string; };

  constructor(private api: ApiService) {
    this.form = new SincronizacionForm();
  }

  ngOnInit(): void {
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        const raw = this.form.getRawValue();
        const {data} = await this.api.solicitudes.sincronizar(raw);
        this.ultimaSincronizacion = {...raw, cantidad: data.length, fecha: moment().toISOString()};
        this.form.reset();
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }
}

declare type SincronizacionFormControls = { [key: string]: any } & { usuario: FormControl };

class SincronizacionForm extends FormGroup {

  controls: SincronizacionFormControls;

  constructor() {
    super({usuario: new FormControl()});

    this.controls.usuario.setValidators([Validators.required]);
  }
}
