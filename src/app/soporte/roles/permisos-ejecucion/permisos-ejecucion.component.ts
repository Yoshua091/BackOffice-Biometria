import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {ApiService} from '../../../core/data/api.service';
import {STORAGE_KEYS} from '../../../core/constants';
import {Acciones, Modulos, Permisos} from '../../../core/entities/permisos';
import {Rol} from '../../../core/entities/rol';
import {environment} from '../../../../environments/environment';
import {RolesService} from '../roles.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-permisos-ejecucion',
  templateUrl: './permisos-ejecucion.component.html',
  styleUrls: ['./permisos-ejecucion.component.scss']
})
export class PermisosEjecucionComponent implements OnInit {

  form: RolesForm = new RolesForm();
  permiso: Permisos;
  permisosEjecucion: Permisos[];
  roles: Rol[];

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public rolesService: RolesService,
  ) {
    this.permisosEjecucion = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.permisosEjecucion || [];

    if (!this.rolesService.current) {
      this.router.navigate(['/soporte', 'roles']);
    }

    this.form.controls._id.setValue(this.rolesService.current._id);
    this.form.controls.permisosEjecucion.setValue(this.rolesService.current.permisosEjecucion);
  }

  async guardar(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        await this.api.roles.modificar(this.form.getRawValue());

        this.router.navigate(['..'], { relativeTo: this.route});
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  ngOnInit(): void {
  }
}


class PermisoFormControl extends FormControl {
  readonly value: PermisoFormGroup;
}

class RolesForm extends FormGroup {

  controls: { _id: FormControl, permisosEjecucion: PermisosForm };
  permiso: PermisoFormControl;

  get valid(): boolean {
    return super.valid && this.permiso.valid;
  }

  get invalid(): boolean {
    return super.invalid || this.permiso.invalid;
  }

  constructor() {
    super({
      _id: new FormControl(),
      permisosEjecucion: new PermisosForm()
    });

    this.permiso = new PermisoFormControl(null, [Validators.required]);

    this.controls._id.setValidators([Validators.required]);
  }

  markAllAsTouched(): void {
    super.markAllAsTouched();
    this.permiso.markAllAsTouched();
  }
}

declare type PermisoFormGroup = FormGroup & { controls: { id: FormControl; menu: FormControl; modulos: ModulosForm; } };

class PermisosForm extends FormArray {

  controls: PermisoFormGroup[];

  constructor() {
    const permisosEjecucion: Permisos[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.permisosEjecucion || [];
    super(permisosEjecucion.map(pe => new FormGroup({
      id: new FormControl(pe.id),
      menu: new FormControl(pe.menu),
      modulos: new ModulosForm(pe.modulos)
    })));
  }

  setValue(value: Permisos[], options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    this.controls.forEach(c => {
      const cPermiso = value?.find(p => p.id === c.controls.id.value);
      c.controls.modulos.setValue(cPermiso?.modulos || []);
    });
  }

}

declare type ModuloFormGroup = FormGroup & { controls: { id: FormControl; modulo: FormControl; acciones: AccionesForm; } };

class ModulosForm extends FormArray {

  controls: ModuloFormGroup[];

  constructor(modulos: Modulos[]) {
    super(modulos.map(m => new FormGroup({
      id: new FormControl(m.id),
      modulo: new FormControl(m.modulo),
      acciones: new AccionesForm(m.acciones)
    })));
  }

  setValue(value: Modulos[], options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    this.controls.forEach(c => {
      const cModulo = value.find(p => p.id === c.controls.id.value);
      c.controls.acciones.setValue(cModulo?.acciones || []);
    });
  }
}

declare type AccionFormGroup = FormGroup & { controls: { id: FormControl; accion: FormControl; checked: FormControl; } };

class AccionesForm extends FormArray {

  controls: AccionFormGroup[];

  constructor(acciones: Acciones[]) {
    super(acciones.map(m => new FormGroup({
      id: new FormControl(m.id),
      accion: new FormControl(m.accion),
      checked: new FormControl()
    })));
  }

  setValue(value: Acciones[], options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    this.controls.forEach(c => {
      const cAccion = value.find(p => p.id === c.controls.id.value);
      c.controls.checked.setValue(!!cAccion);
    });
  }

  getRawValue(): any[] {
    return super.getRawValue()
      .filter(r => !!r.checked)
      .map(r => {
        delete r.checked;
        return r;
      });
  }

}
