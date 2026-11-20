import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/data/api.service';

@Component({
  selector: 'app-errores-dispersion',
  templateUrl: './errores-dispersion.component.html',
  styleUrls: ['./errores-dispersion.component.scss']
})
export class ErroresDispersionComponent implements OnInit {
  @Output() ver: EventEmitter<any> = new EventEmitter();

  form: ErrorDispersionFiltroForm;
  dataTabla: any[];
  mostrarTabla: boolean;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new ErrorDispersionFiltroForm({} as FiltroErrorDispersionFormStruct);
    this.mostrarTabla = false;
  }

  ngOnInit(): void {
  }

  async filtrar(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        const filtro = Number(this.form.controls.tipoReporte.value)
        const { data } = await this.api.dispersiones.buscarPorEstadoDispersion({estado: filtro});
        this.dataTabla = data;
        this.mostrarTabla = true;
      } catch (e) {
        console.log(e);
      }
    }
  }

  // emitEvent() {
  //   this.ver.emit();
  // }
  // async verSolicitud(_id: string): Promise<void> {
  //   await this.router.navigate(['/propuestas', 'detalle'], {queryParams: {_id}});
  // }

  async emitEvent(_id: string): Promise<void> {
    try {
      await this.router.navigate(
        ['/Dispersiones',  'ver-solicitud']);
    } catch (e) {
      console.log(e);
    }
  }

}

class FiltroErrorDispersionFormStruct {
  tipoReporte: string;
}

class ErrorDispersionFiltroForm extends FormGroup {
  constructor(filtro: FiltroErrorDispersionFormStruct) {
    super({
      tipoReporte: new FormControl(filtro.tipoReporte)
    });

    this.controls.tipoReporte.setValidators([
      Validators.required,
    ]);
  }


  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
