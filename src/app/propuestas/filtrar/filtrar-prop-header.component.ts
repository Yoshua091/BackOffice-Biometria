import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Sucursal} from '../../core/entities/sucursal';
import {SessionService} from '../../core/session.service';
import {STORAGE_KEYS} from '../../core/constants';
import {ApiService} from '../../core/data/api.service';
import {Empleado} from '../../core/entities/empleado';
import {Solicitudes} from '../../core/entities/solicitudes';
import {Router} from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filtrar-prop-header.component.html',
  styleUrls: ['./filtrar-prop-header.component.scss']
})
export class FiltrarPropHeaderComponent implements OnInit {

  form: FilterHeaderForm;
  solicitudes: Solicitudes[];
  sucursales: Sucursal[];
  asesores: Empleado[];

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(private api: ApiService, public session: SessionService, private router: Router) {
    const sucursales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUCURSALES));
    this.sucursales = sucursales ? sucursales : null;
    this.form = new FilterHeaderForm({} as FilterHeaderFormStruct);
  }

  ngOnInit(): void {
    this.form.controls.sucursal_id.valueChanges.subscribe(async value => {
      try {
        const {data} = await this.api.usuarios.buscarPorSucursal({_id: value});
        this.asesores = data;
      } catch (e) {
        console.log(e);
      }
    });

    this.form.controls.asesor_id.valueChanges.subscribe(async value => {
      try {
        const {data} = await this.api.solicitudes.buscarPorAsesor({_id: value});
        this.solicitudes = data;
      } catch (e) {
        console.log(e);
      }
    });
  }

  limpiar(): void {
    this.form.reset();
  }

  async pageChange(offset: number): Promise<void> {
  }
}

class FilterHeaderFormStruct {
  // tslint:disable-next-line
  sucursal_id: string;
  // tslint:disable-next-line
  asesor_id: string;
}

class FilterHeaderForm extends FormGroup {
  constructor(filtro: FilterHeaderFormStruct) {
    super({
      sucursal_id: new FormControl(filtro.sucursal_id),
      asesor_id: new FormControl(filtro.asesor_id)
    });
  }
}
