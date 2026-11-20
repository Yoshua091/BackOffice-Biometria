import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../core/session.service';
import {ApiService} from '../../core/data/api.service';
import {Solicitudes} from '../../core/entities/solicitudes';
import {Router} from '@angular/router';
import {STORAGE_KEYS} from '../../core/constants';

@Component({
  selector: 'app-buscar-prop-header',
  templateUrl: './buscar-prop-header.component.html',
  styleUrls: ['./buscar-prop-header.component.scss']
})
export class BuscarPropHeaderComponent implements OnInit {

  form: BuscarPropHeaderForm;
  solicitudes: Solicitudes[];
  atributos: { clave: string, nombre: string }[] = [
    {clave: 'numeroPrestamo', nombre: 'Número de prestamo'},
    {clave: 'cedula', nombre: 'Identificación'},
    {clave: 'idSucursal', nombre: '# Solicitud'},
  ];

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(private api: ApiService, public session: SessionService, private router: Router) {
    this.form = new BuscarPropHeaderForm({} as BuscarPropHeaderFormStruct);
  }

  ngOnInit(): void {
  }

  async buscar(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        const {data} = await this.api.solicitudes.buscarPorCedulaNombre(this.form.getRawValue());
        this.solicitudes = data;
      } catch (e) {
        console.log(e);
      }
    }
  }

  // tslint:disable-next-line:variable-name
  async detalleSolicitud(_id: string): Promise<void> {
    await this.router.navigate(['/propuestas', 'detalle'], {queryParams: {_id}});
  }

  async pageChange(offset: number): Promise<void> {
  }
}

type TipoBusqueda = 'numeroPrestamo' | 'cedula' | 'idSucursal';

class BuscarPropHeaderFormStruct {
  // tslint:disable-next-line
  clave: TipoBusqueda;
  // tslint:disable-next-line
  valor: string;
}

class BuscarPropHeaderForm extends FormGroup {
  constructor(filtro: BuscarPropHeaderFormStruct) {
    super({
      clave: new FormControl(filtro.clave),
      valor: new FormControl(filtro.valor)
    });

    this.controls.clave.setValidators([
      Validators.required,
    ]);

    this.controls.valor.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    const value = super.getRawValue();
    switch (value.clave as TipoBusqueda) {
      case 'idSucursal':
        return {idSolicitud: value.valor};
      case 'cedula':
        return {cedula: value.valor};
      case 'numeroPrestamo':
        return {numeroPrestamo: value.valor};
      default:
        return {};
    }
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
