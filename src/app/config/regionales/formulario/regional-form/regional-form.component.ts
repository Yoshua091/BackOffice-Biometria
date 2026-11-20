import { Component, OnInit } from '@angular/core';
import { FORM_MODE } from 'src/app/core/constants';
import { RegionalesService } from '../../regionales.service';
import { ApiService } from 'src/app/core/data/api.service';
import { SessionService } from 'src/app/core/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-regional-form',
  templateUrl: './regional-form.component.html',
  styleUrls: ['./regional-form.component.scss']
})
export class RegionalFormComponent implements OnInit {
  mode: FORM_MODE;

  form: RegionalesForm;
  gerentesRegionales: any[] = []

  constructor(
    private regionalesService: RegionalesService,
    private api: ApiService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const { mode } = this.route.snapshot.queryParams;
    if (mode !== 'editar' && mode !== 'crear') {
      throw new Error(`El modo ${mode} para el formulario es incorrecto`);
    }

    if (mode === 'editar' && !this.regionalesService.current) {
      this.router.navigate(['/config', 'regionales']);
    }
    this.mode = mode;
  }

  async ngOnInit(): Promise<void> {
    await this.listarSeguros(); //  primero cargar gerentes

    if (this.mode === 'editar') {
      const regional = this.regionalesService.current;

      this.form = new RegionalesForm(regional);

      //  
      const gerenteMatch = this.gerentesRegionales.find(
        g => g._id === regional.usuarioGerente?._id
      );

      if (gerenteMatch) {
        this.form.controls.usuarioGerente.setValue(gerenteMatch);
      }

    } else {
      this.form = new RegionalesForm({} as any);
    }
  }

  async listarSeguros() {
    try {
      const response = await this.api.usuarios.buscarGerentesRegionales();
      if (response.data && Array.isArray(response.data)) {
        this.gerentesRegionales = response.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      try {
        const usuarioGerenteInfo = {
          apellido: this.form.controls.usuarioGerente.value.apellido,
          nombre: this.form.controls.usuarioGerente.value.nombre,
          _id: this.form.controls.usuarioGerente.value._id,
        }
        const { _id, ...regional } = this.form.getRawValue();
        this.mode === 'editar' ?
          await this.api.regionales.actualizarRegional({
            ...this.form.getRawValue(), usuarioGerente: usuarioGerenteInfo, estado: 1,
            usuarioRegistra: this.regionalesService?.current?.usuarioRegistra
          }) :
          await this.api.regionales.registratRegional({ ...regional, usuarioGerente: usuarioGerenteInfo });

        await this.router.navigate(['/config', 'regionales']);
      } catch (e) {
        console.log(e);
      }
    }
  }

}

export class RegionalesForm extends FormGroup {

  constructor(regional: any) {
    super({
      _id: new FormControl(regional._id),
      nombre: new FormControl(regional.nombre),
      idRegion: new FormControl(regional.idRegion),
      usuarioGerente: new FormControl(regional.usuarioGerente)
    });


    this.controls.nombre.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]);

    this.controls.idRegion.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
    ]);

    this.controls.usuarioGerente.setValidators([
      Validators.required,
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
