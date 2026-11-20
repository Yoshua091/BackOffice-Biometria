import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Solicitudes } from 'src/app/core/entities/solicitudes';
import { EstadoSolicitud } from 'src/app/core/pipes/estado-solicitud.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-desembolsos',
  templateUrl: './desembolsos.component.html',
  styleUrls: ['./desembolsos.component.scss']
})
export class DesembolsosComponent implements OnInit {
  estado: string;
  listados: ListadoSolicitud = {};
  paginador = { cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1 };
  estados: EstadoSolicitudMap = new EstadoSolicitudMap();

  anios:any[];
  meses: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  form: ListadoPropuestasFiltroForm;

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
    ) {
    const {queryParams} = this.route.snapshot;
    this.form = new ListadoPropuestasFiltroForm({...queryParams});
  }

  async ngOnInit(): Promise<void> {
    this.anios = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)).anos || [];
    await this.loadCantidadesPorEstado();
    await this.loadSolicitudesPorEstado(this.estado.split('-').map(e => Number(e)), this.paginador.pagina);
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {...this.form.getRawValue()},
    });
  }

  async loadCantidadesPorEstado(): Promise<void> {
    try {
      const {_idSucursal, ano, mes} = { ...this.form.getRawValue() as FiltroListadoSolicitudFormStruct };
      const zonaId = 'TODAS'
      const { data } = await this.api.solicitudes.contarPorEstado({_idSucursal, ano, mes});
      Object.keys(this.estados)
        .forEach(k => this.listados[this.estados[k]] = {cantidad: this.estados[k].split('-').reduce((sum, e) => sum + (data[e] || 0), 0), listado: [], pagina: 1});
    } catch (e) {
      if (!environment.production) {
        console.log(e);
      }
    }
  }

  async loadSolicitudesPorEstado(estados: number[], pagina: number): Promise<void> {
    if (this.listados[estados.join('-')]) {
      try {
        const { data } = await this.api.solicitudes.buscarPorEstado({
          ...{ estados, pagina },
          ...this.form.getRawValue()
        });
        this.listados[estados.join('-')].listado = this.ordenPorFecha(data);
        this.listados[estados.join('-')].pagina = pagina;
        this.paginador.pagina = pagina;
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    } else {
      setTimeout(_ => this.loadSolicitudesPorEstado(estados, pagina), 500);
    }
  }

  async filtrar(): Promise<void> {
    const estados: number[] = this.estado.split('-').map(e => Number(e));
    try {
      await this.loadCantidadesPorEstado();
      await this.loadSolicitudesPorEstado(estados, 1);
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {...this.form.getRawValue()},
      });
    } catch (e) {
      if (!environment.production) {
        console.log(e);
      }
    }
  }
  
  async activeIdChange(): Promise<void> {
    const estados: number[] = this.estado.split('-').map(e => Number(e));
    await this.loadSolicitudesPorEstado(estados, this.paginador.pagina);
  }

  async pageChange(offset: number): Promise<void> {
    const estados: number[] = this.estado.split('-').map(e => Number(e));
    await this.loadSolicitudesPorEstado(estados, offset);
  }

  private ordenPorFecha(data: Solicitudes[]): Solicitudes[] {
    return data.sort((a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix())
  }

}

interface ListadoSolicitud {
  [k: number]: { cantidad: number, listado: Solicitudes[], pagina: number };
}

class EstadoSolicitudMap {
  CreacionCreditoFallida = [EstadoSolicitud.ErrorCreacionCredito].join('-');
  DesembolsoFallido = [EstadoSolicitud.DesembolsoFallido].join('-');
  AltaDeClientes = [EstadoSolicitud.AltaClienteEnviado].join('-');
}
class FiltroListadoSolicitudFormStruct {
  // tslint:disable-next-line
  _idSucursal: string;
  ano: string;
  mes: string;
  orden: number;
}
class ListadoPropuestasFiltroForm extends FormGroup {
  constructor(filtro) {
    super({
      _idSucursal: new FormControl('TODOS'),
      ano: new FormControl(filtro.ano || moment().format('YYYY')),
      mes: new FormControl(filtro.mes || moment().format('MM')),
      orden: new FormControl(0),
    });
  }
}