import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {Md5} from 'ts-md5';

import {SessionService} from '../../../core/session.service';
import {ApiService} from '../../../core/data/api.service';
import {Empleado} from '../../../core/entities/empleado';
import {Perfil} from '../../../core/entities/perfil';
import {Sucursal} from '../../../core/entities/sucursal';
import {Rol} from '../../../core/entities/rol';
import {FORM_MODE, STORAGE_KEYS} from '../../../core/constants';
import {EmpleadosService} from '../empleados.service';

@Component({
  selector: 'app-empleados-form',
  templateUrl: './empleados-form.component.html',
  styleUrls: ['./empleados-form.component.scss']
})
export class EmpleadosFormComponent implements OnInit {

  mode: FORM_MODE;
  form: EmpleadosForm;
  roles: Rol[];
  perfiles: Perfil[];
  sucursales: Sucursal[];
  showPassword: boolean;

  constructor(
    private empleadosService: EmpleadosService,
    private api: ApiService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const {mode} = this.route.snapshot.queryParams;
    if (mode !== 'editar' && mode !== 'crear') {
      throw new Error(`El modo ${mode} para el formulario es incorrecto`);
    }

    if (mode === 'editar' && !this.empleadosService.current) {
      this.router.navigate(['/config', 'control-empleados']);
    }

    this.mode = mode;
    this.sucursales = this.route.snapshot.data.sucursales.data;
    this.roles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLES)) || null;
    this.perfiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERFILES)) || null;
  }

  async ngOnInit(): Promise<void> {
    if (this.mode === 'editar') {
      this.form = new EmpleadosForm(this.empleadosService.current, this.mode);
      this.form.controls.sucursal.disable();
    } else {
      this.form = new EmpleadosForm({} as Empleado, this.mode);
      this.form.controls.sucursal.enable();
    }
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        const empleado = this.form.getRawValue();
        const {data, codigo} = this.mode === 'editar' ?
          await this.api.usuarios.modificar(empleado) :
          await this.api.usuarios.registrar(empleado);
        const existeUsuario = COD_USUARIO_EXISTE.some(c => c === codigo);

        if (!existeUsuario) {
          await this.router.navigate(['/config', 'control-empleados']);
        }

      } catch (e) {
        console.log(e);
      }
    }
  }

  comparador(a: { _id, id }, b: { _id, id }): boolean {
    return (a && b) && ((a._id && b._id) && a._id === b._id || (a.id && b.id) && a.id === b.id);
  }
}


export class EmpleadosForm extends FormGroup {

  mode: FORM_MODE;

  constructor(empleado: Empleado, mode: FORM_MODE) {
    super({
      nombre: new FormControl(empleado.nombre),
      apellido: new FormControl(empleado.apellido),
      cedula: new FormControl(empleado.cedula),
      rol: new FormControl(empleado.rol),
      usuario: new FormControl(empleado.usuario),
      clave: new FormControl(empleado.clave),
      md5: new FormControl(empleado.clave),
      codigoAsesor: new FormControl(empleado.codigoAsesor),
      sucursal: new FormControl(empleado.sucursal),
      perfil: new FormControl(empleado.perfil),
      lider: new FormControl(!!empleado.lider),
    });

    this.mode = mode;

    if (empleado._id) {
      this.controls._id = new FormControl(empleado._id);
    }
    if (empleado._rev) {
      this.controls._rev = new FormControl(empleado._rev);
    }

    this.controls.nombre.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]);

    this.controls.apellido.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]);

    this.controls.cedula.setValidators([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);

    this.controls.usuario.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
    ]);

    this.controls.clave.setValidators([
      (ctrl: AbstractControl) => this.mode === 'crear' ? Validators.required(ctrl) : null,
      Validators.minLength(1),
    ]);

    this.controls.clave?.valueChanges.subscribe(value => {
      this.controls.md5.setValue(Md5.hashStr(value));
    });

    this.controls.rol.setValidators([
      Validators.required,
    ]);

    this.controls.sucursal.setValidators([
      Validators.required,
    ]);

    this.controls.perfil.setValidators([
      Validators.required,
    ]);

    this.controls.rol.valueChanges.subscribe(value => {
      if (value.id === 1) {
        this.controls.codigoAsesor.setValue('');
        this.controls.codigoAsesor.setValidators([Validators.required]);
        this.controls.codigoAsesor.enable();

      } else {
        this.controls.codigoAsesor.setValue(0);
        this.controls.codigoAsesor.setValidators([]);
        this.controls.codigoAsesor.disable();
      }
      this.controls.codigoAsesor.updateValueAndValidity();
      this.controls.codigoAsesor.markAsTouched();
    });
  }

  getRawValue(): any {
    const value = super.getRawValue();

    value.clave = value.md5;
    delete value.md5;

    return value;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

// Codigos que en WS indican que un usuario ya existe, por CC, o por usuario
const COD_USUARIO_EXISTE = ['02USUACT200-S00004', '02USUACT200-S00005', '02USUREG200-S00004', '02USUREG200-S00008'];
