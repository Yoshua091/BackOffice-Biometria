import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FORM_MODE } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Empleado } from 'src/app/core/entities/empleado';
import { Sucursal } from 'src/app/core/entities/sucursal';
import { Zona } from 'src/app/core/entities/zona';
import { SucursalesService } from '../../sucursales.service';
import { ZonasService } from '../zonas.service';

@Component({
  selector: 'app-zonas-form',
  templateUrl: './zonas-form.component.html',
  styleUrls: ['./zonas-form.component.scss']
})
export class ZonasFormComponent implements OnInit {
  mode: FORM_MODE;
  form: ZonasForm;
  asesores: Empleado[];
  sucursales: any;

  constructor(
    private route: ActivatedRoute,
    private zonasService: ZonasService,
    private router: Router,
    private api: ApiService,
    private sucursalesService: SucursalesService,
  ) {
    const { mode } = this.route.snapshot.queryParams;
    this.sucursales = this.route.snapshot.queryParams;
    if (mode !== 'editar' && mode !== 'crear') {
      throw new Error(`El modo ${mode} para el formulario es incorrecto`);
    }

    if (mode === 'editar' && !this.zonasService.current) {
      const {_id, nombre} = this.sucursales;
      this.router.navigate(['/config', 'sucursales', 'listado-zonas'], { queryParams: { _id, nombre }});
    }
    this.mode = mode;
  }

  async ngOnInit(): Promise<void> {
    this.listarAsesores();
    if (this.mode === 'editar') {
      this.form = new ZonasForm(this.zonasService.current);
    } else {
      this.form = new ZonasForm({} as Zona);
    }
  }

  async listarAsesores(): Promise<void> {
    const { _id } = this.sucursales;
    try {
      const { data } = await this.api.usuarios.buscarPorSucursal({ _id });
      this.asesores = data;
    } catch (e) {
      console.log(e);
    }
  }

  async submit(): Promise<void> {
    const { _id } = this.sucursales;
    if (this.form.valid) {
      try {
        this.mode === 'editar' ?
          await this.api.zonas.modificar(this.form.getRawValue()) :
          await this.api.zonas.registrar({ sucursal_id: _id, ...this.form.getRawValue() });

        await this.zonas();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async zonas(): Promise<void> {
    const { _id, nombre } = this.sucursales;
    await this.router.navigate(['/config', 'sucursales', 'listado-zonas'], { queryParams: { _id, nombre } });
  }

}

export class ZonasForm extends FormGroup {

  constructor(zona: Zona) {
    super({
      nombre: new FormControl(zona.nombre),
      usuario_id: new FormControl(zona.usuario_id),
    });

    if (zona._id) {
      this.controls._id = new FormControl(zona._id);
    }

    if (zona.sucursal_id) {
      this.controls.sucursal_id = new FormControl(zona.sucursal_id);
    }

    this.controls.nombre.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]);

    this.controls.usuario_id.setValidators([
      Validators.required,
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
