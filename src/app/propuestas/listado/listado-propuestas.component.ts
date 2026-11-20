import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {Solicitudes} from '../../core/entities/solicitudes';
import {ApiService} from '../../core/data/api.service';
import {EstadoSolicitud} from '../../core/pipes/estado-solicitud.pipe';
import {SessionService} from '../../core/session.service';
import {STORAGE_KEYS} from '../../core/constants';
import {Sucursal} from '../../core/entities/sucursal';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {PermisosComponentes, Roles} from '../../core/types';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { Permisos } from 'src/app/core/entities/permisos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listado-propuestas',
  templateUrl: './listado-propuestas.component.html',
  styleUrls: ['./listado-propuestas.component.scss']
})
export class ListadoPropuestasComponent implements OnInit {

  estados: EstadoSolicitudMap = new EstadoSolicitudMap();
  listados: ListadoSolicitud = {};
  form: ListadoPropuestasFiltroForm;
  sucursales: Sucursal[];
  anios: any[]
  meses: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  paginador = {cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1};
  estado: string;
  permisos: Permisos[];

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(
    private api: ApiService,
    private router: Router,
    private session: SessionService,
    private route: ActivatedRoute,
    private modal: NgbModal) {

    const {queryParams} = this.route.snapshot;
    const sucursales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUCURSALES)) || [];
    this.anios = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)).anos || [];

    this.sucursales = [Roles.ADMIN, Roles.COMITE, Roles.CONSULTA, Roles.COORDINADOCREDITO].includes(this.session.user.rol.id) ?
      [...[({_id: 'TODOS', nombre: 'TODOS'} as Sucursal)], ...sucursales] : sucursales;

    const filtroListadoInicial = {...queryParams, _idSucursal: this.sucursales[0]._id};

    this.form = new ListadoPropuestasFiltroForm(filtroListadoInicial as FiltroListadoSolicitudFormStruct);
    this.estado = !!queryParams.estado ? queryParams.estado : this.estados.ValidacionAsistente;
    this.paginador.pagina = !!queryParams.pagina ? queryParams.pagina : 1;
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
  }

  async ngOnInit(): Promise<void> {
    await this.loadCantidadesPorEstado();
    await this.loadSolicitudesPorEstado(this.estado.split('-').map(e => Number(e)), this.paginador.pagina);
  }

  async loadCantidadesPorEstado(): Promise<void> {
    try {
      const {_idSucursal, ano, mes} = this.form.getRawValue();
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
        const response = await this.api.solicitudes.buscarPorEstado({
          ...{ estados, pagina },
          ...this.form.getRawValue()
        });
  
        localStorage.setItem("count_comite", JSON.stringify(response.comite));
  
        let listado = response.data || [];
  
        if (this.session?.user?.rol?.id === 2 && estados.includes(45)) {
          listado.sort((a, b) =>
            this.getFechaLlegadaValidacion(a) - this.getFechaLlegadaValidacion(b)
          );
        }
  
        this.listados[estados.join('-')].listado = listado;
        this.listados[estados.join('-')].pagina = pagina;
        this.paginador.pagina = pagina;
  
        await this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            ...this.form.getRawValue(),
            pagina,
            estado: estados.join('-')
          },
        });
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    } else {
      setTimeout(_ => this.loadSolicitudesPorEstado(estados, pagina), 500);
    }
  }
  
  private getFechaLlegadaValidacion(solicitud: any): number {
    const log = (solicitud.logEstados || [])
      .find((l: any) => l.estado?.idEstado === 1);
  
    return log ? new Date(log.fecha).getTime() : Infinity;
  }
  

  permisoVerSolicitud(propuesta: Solicitudes): boolean {
    return this.session.hasSolicitudPermissions(propuesta);
  }

  async activeIdChange(): Promise<void> {
    const estados: number[] = this.estado.split('-').map(e => Number(e));
    await this.loadSolicitudesPorEstado(estados, this.paginador.pagina);
  }

  async pageChange(offset: number): Promise<void> {
    const estados: number[] = this.estado.split('-').map(e => Number(e));
    await this.loadSolicitudesPorEstado(estados, offset);
  }

  async filtrar(): Promise<void> {
    const estados: number[] = this.estado.split('-').map(e => Number(e));
    try {
      await this.loadCantidadesPorEstado();
      await this.loadSolicitudesPorEstado(estados, 1);
    } catch (e) {
      if (!environment.production) {
        console.log(e);
      }
    }
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.PROPUESTAS);
    const {modulos} = componente.find(m => m?.id === 1);
    const {acciones} = modulos.find(m => m?.id === componenteId);
    const permisoacciones = acciones.find(m => m?.id === accion);

    if (permisoacciones?.id !== accion){
      const {componentInstance: info} = this.modal.open(AlertComponent, {centered: true});

      info.title = 'Permiso';
      info.description = 'No tiene permisos';
      info.buttons = AlertButtons.INFO;
    } else {
      this.filtrar();
    }
  }

}

interface ListadoSolicitud {
  [k: number]: { cantidad: number, listado: Solicitudes[], pagina: number };
}

class EstadoSolicitudMap {
  Renovaciones = [EstadoSolicitud.RenovacionActiva].join('-');
  ValidacionAsistente = [EstadoSolicitud.ValidacionAsistente].join('-');
  ValidacionGerente = [EstadoSolicitud.ValidacionGerente].join('-');
  Comite = [EstadoSolicitud.Comite].join('-');
  ValidacionIdentidad = [EstadoSolicitud.ValidacionIdentidad].join('-');
  AprobadaDesembolsada = [EstadoSolicitud.AprobadaDesembolsada].join('-');
  Rechazada = [EstadoSolicitud.Rechazada].join('-');
  Devuelta = [EstadoSolicitud.Devuelta].join('-');
  AltaCliente = [
    EstadoSolicitud.AltaCliente62,
    EstadoSolicitud.AltaCliente63,
    EstadoSolicitud.AltaCliente64,
    EstadoSolicitud.AltaClienteEnviado,
    EstadoSolicitud.AltaClienteValidar,
  ].join('-');
  RegistrandoCredito = [
    EstadoSolicitud.ErrorCreacionCredito,
    EstadoSolicitud.AnuladasPorCore,
    EstadoSolicitud.ErrorAsociarCodeudores,
    EstadoSolicitud.DesembolsoFallido,
  ].join('-');
  Dispersion = [
    EstadoSolicitud.enDispersion,
    EstadoSolicitud.enDispersionEstado,
    EstadoSolicitud.Dispersion,
  ].join('-');
  Finalizada = [EstadoSolicitud.Finalizada].join('-');
  Anulada = [EstadoSolicitud.Anulada].join('-');
}

class FiltroListadoSolicitudFormStruct {
  // tslint:disable-next-line
  _idSucursal: string;
  ano: string;
  mes: string;
  orden: number;
}

class ListadoPropuestasFiltroForm extends FormGroup {
  constructor(filtro: FiltroListadoSolicitudFormStruct) {
    super({
      _idSucursal: new FormControl(filtro._idSucursal || 'TODOS'),
      ano: new FormControl(filtro.ano || moment().format('YYYY')),
      mes: new FormControl(filtro.mes || moment().format('MM')),
      orden: new FormControl(filtro.orden || 0),
    });
  }
}
