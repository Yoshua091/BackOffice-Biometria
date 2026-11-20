import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/data/api.service';
import {Meta} from '../../core/entities/meta';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertButtons, AlertComponent} from '../../shared/alert/alert.component';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.scss']
})
export class MetasComponent implements OnInit {

  current: number; // hace referencia al perfil actual, indicando el index dentro del array
  forms: MetaForm[];
  metas: Meta[];

  constructor(private api: ApiService, private modal: NgbModal) {
  }

  async ngOnInit(): Promise<void> {
    await this.cargarMetas();
  }

  async modificar(metaForm: MetaForm): Promise<void> {
    metaForm.markAllAsTouched();

    if (metaForm.valid) {
      try {
        await this.api.metas.modificar(metaForm.getRawValue());
        await this.cargarMetas();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async cargarMetas(): Promise<void> {
    try {
      const {data} = await this.api.metas.buscar();

      this.metas = data;
      this.forms = this.metas.map(meta => new MetaForm({...meta}));
      this.current = 0; // array index
    } catch (e) {
      console.log(e);
    }
  }
}

export class MetaForm extends FormGroup {

  constructor(meta: Meta) {
    super({
      _id: new FormControl(meta._id),
      _rev: new FormControl(meta._rev),
      estado: new FormControl(meta.estado),
      cuantiaMensual: new FormControl(meta.cuantiaMensual),
      creimientoCartera: new FormControl(meta.creimientoCartera),
      carteraVencida10: new FormControl(meta.carteraVencida10),
      carteraVencida30: new FormControl(meta.carteraVencida30),
      ventasSeguro: new FormControl(meta.ventasSeguro),
      ventasDatafono: new FormControl(meta.ventasDatafono),
      numeroPrestamos: new FormControl(meta.numeroPrestamos),
      aperturaCuentas: new FormControl(meta.aperturaCuentas),
      perfil: new FormControl(meta.perfil),
    });

    this.controls.cuantiaMensual.setValidators([
      Validators.required,
      Validators.maxLength(9),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
    this.controls.creimientoCartera.setValidators([
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
    this.controls.carteraVencida10.setValidators([
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
    this.controls.carteraVencida30.setValidators([
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
    this.controls.ventasSeguro.setValidators([
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
    this.controls.ventasDatafono.setValidators([
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
    this.controls.numeroPrestamos.setValidators([
      Validators.required,
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
    this.controls.aperturaCuentas.setValidators([
      Validators.required,
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);

  }

  getRawValue(): any {
    const value = super.getRawValue();

    value.estado = Number(value.estado);
    value.cuantiaMensual = Number(value.cuantiaMensual);
    value.creimientoCartera = Number(value.creimientoCartera);
    value.carteraVencida10 = Number(value.carteraVencida10);
    value.carteraVencida30 = Number(value.carteraVencida30);
    value.ventasSeguro = Number(value.ventasSeguro);
    value.ventasDatafono = Number(value.ventasDatafono);
    value.numeroPrestamos = Number(value.numeroPrestamos);
    value.aperturaCuentas = Number(value.aperturaCuentas);

    return value;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
