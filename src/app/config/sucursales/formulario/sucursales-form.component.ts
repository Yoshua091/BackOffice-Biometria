import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

import {ApiService} from '../../../core/data/api.service';
import {SessionService} from '../../../core/session.service';
import {Sucursal} from '../../../core/entities/sucursal';
import {FORM_MODE, REGEX} from '../../../core/constants';
import {SucursalesService} from '../sucursales.service';
import {Empleado} from '../../../core/entities/empleado';
import {EmpleadosForm} from '../../empleados/formulario/empleados-form.component';

@Component({
  selector: 'app-sucursales-form',
  templateUrl: './sucursales-form.component.html',
  styleUrls: ['./sucursales-form.component.scss']
})
export class SucursalesFormComponent implements OnInit {

  mode: FORM_MODE;
  form: SucursalesForm;
  regionales: any[] = []

  constructor(
    private sucursalesService: SucursalesService,
    private api: ApiService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const {mode} = this.route.snapshot.queryParams;
    if (mode !== 'editar' && mode !== 'crear') {
      throw new Error(`El modo ${mode} para el formulario es incorrecto`);
    }

    if (mode === 'editar' && !this.sucursalesService.current) {
      this.router.navigate(['/config', 'sucursales']);
    }
    this.mode = mode;
  }


async ngOnInit(): Promise<void> {

  await this.listarRegionales();

  if (this.mode === 'editar') {

    const sucursal = this.sucursalesService.current;

    // Verificar si la regional existe en la lista
    const existeRegional = this.regionales.find(
      r => r._id === sucursal.region?._id
    );

    // Si NO existe, agregarla manualmente
    if (!existeRegional && sucursal.region) {
      this.regionales.push(sucursal.region);
    }

    this.form = new SucursalesForm(sucursal);

  } else {

    this.form = new SucursalesForm({} as Sucursal);

  }
}



  async listarRegionales() {
    try {
      const response = await this.api.regionales.consultarRegionales();
      if (response.data && Array.isArray(response.data)) {
        this.regionales = response.data;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      try {
        const formData = this.form.getRawValue();

        // Eliminar la propiedad 'usuarioGerente' (o la propiedad que quieras excluir)
        delete formData.region.usuarioRegistra;
        delete formData.region.usuarioGerente;
        delete formData.region.createdAt;
        delete formData.region.estado;
        delete formData.region.updatedAt;
        delete formData.region.__v;
        this.mode === 'editar' ?
          await this.api.sucursales.modificar(formData) :
          await this.api.sucursales.registrar(formData);

        await this.router.navigate(['/config', 'sucursales']);
      } catch (e) {
        console.log(e);
      }
    }
  }
}


export class SucursalesForm extends FormGroup {

  constructor(sucursal: Sucursal) {
    super({
      nombre: new FormControl(sucursal.nombre),
      direccion: new FormControl(sucursal.direccion),
      telefono: new FormControl(sucursal.telefono),
      idSucursal: new FormControl(sucursal.idSucursal),
      agencia: new FormControl(sucursal.agencia),
      region: new FormControl(sucursal.region),
    });

    if (sucursal._id) {
      this.controls._id = new FormControl(sucursal._id);
    }

    if (sucursal._rev) {
      this.controls._rev = new FormControl(sucursal._rev);
    }

    if (sucursal.idSucursal) {
      this.controls.idSucursal = new FormControl(sucursal.idSucursal);
    }

    this.controls.nombre.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]);

    this.controls.direccion.setValidators([
      Validators.required
    ]);

    this.controls.telefono.setValidators([
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      Validators.pattern(REGEX.CELLPHONE),
    ]);

    this.controls.idSucursal.setValidators([
      Validators.required,
    ]);

    this.controls.agencia.setValidators([
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
    ]);

    this.controls.region.setValidators([
      Validators.required
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
