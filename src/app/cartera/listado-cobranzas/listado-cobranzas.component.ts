import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import {STORAGE_KEYS} from 'src/app/core/constants';
import {ApiService} from 'src/app/core/data/api.service';
import { Permisos } from 'src/app/core/entities/permisos';
import {Cartera, Solicitudes} from 'src/app/core/entities/solicitudes';
import {Sucursal} from 'src/app/core/entities/sucursal';
import {Zona} from 'src/app/core/entities/zona';
import {EstadoCredito, PermisosComponentes, TiposMiembro} from 'src/app/core/types';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import {CobranzasService} from '../cobranzas.service';

@Component({
  selector: 'app-listado-cobranzas',
  templateUrl: './listado-cobranzas.component.html',
  styleUrls: ['./listado-cobranzas.component.scss']
})
export class ListadoCobranzasComponent implements OnInit {

  form: FiltroListadoCobranzasForm;
  cobranzas: Solicitudes[] = [];
  sucursales: Sucursal[];
  zonas: Zona[];
  permisos: Permisos[];
  tienePermiso: boolean;
  paginador = {cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1};

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(
    private api: ApiService,
    private modal: NgbModal,
    public cobranzasService: CobranzasService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const sucursales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUCURSALES));
    const {queryParams} = this.route.snapshot;
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.tienePermiso = false;
    this.sucursales = sucursales ? sucursales : null;
    this.form = new FiltroListadoCobranzasForm((queryParams || {}) as FiltroListadoCobranzasFormStruct);

    this.form.controls.sucursal_id.valueChanges.subscribe(async value => {
      try {
        const { data } = await this.api.zonas.buscar({ sucursal_id: value });
        this.zonas = data;
      } catch (e) {
        console.log(e);
      }
    });
    this.paginador.pagina = !!queryParams.pagina ? queryParams.pagina : 1;
  }

  async ngOnInit(): Promise<void> {
    const {sucursal_id} = this.route.snapshot.queryParams;

    if (!!sucursal_id) {
      this.form.controls.sucursal_id.updateValueAndValidity();
      await this.filtrar();
    }
  }

  async gestionarCartera(cobranza: Solicitudes, componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      this.cobranzasService.cobranza = cobranza;
      const {pagina} = this.paginador;
      try {
        await this.router.navigate(
          ['/cartera', 'gestionar-cartera'],
          {
            queryParams: {
              ...this.form.getRawValue(),
              ...{solicitud_id: cobranza._id},
              pagina,
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async filtrar(): Promise<void> {
    this.form.markAllAsTouched();
    const {zona_id: zonaActual} = this.route.snapshot.queryParams;
    const {zona_id: zonaSeleccionada} = this.form.getRawValue();
    const pagina = zonaActual === zonaSeleccionada ? this.paginador.pagina : 1;

    if (this.form.valid) {
      try {
        const filtro = {
          ...this.form.getRawValue(),
          pagina,
        };
        const { data: {data, totalRegistros} } = await this.api.cobranzas.buscar(filtro);
        this.cobranzas = data;
        this.paginador.cantidad = totalRegistros;
        this.paginador.pagina = pagina;
        await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {...this.form.getRawValue(), pagina},
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  esClienteExperto(cobranza: Solicitudes): boolean {
    return cobranza && cobranza.miembros.length === 1 &&
      cobranza.miembros.every(m => m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  esIndividual(cobranza: Solicitudes): boolean {
    const { miembros } = cobranza;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    const { CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE } = TiposMiembro;

    return miembros.every((m, idx) => idx === liderIdx ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m.tipoMiembro.id));
  }

  esGrupal(cobranza: Solicitudes): boolean {
    const { miembros } = cobranza;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);

    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.MIEMBRO);
  }

  esGarantia(solicitud: Solicitudes): boolean {
    const { miembros } = solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER_GARANTIA);
   // const tipoCreedito = TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.solicitud.tipoSolicitud.id ? true : false;

    return miembros.every((m, idx) => idx === liderIdx ? true : false);
  }

  estadoCobro(cartera: Cartera): EstadoCredito {
    const sinAcuerdos = (cartera && cartera?.acuerdos?.length === 0) && EstadoCredito.SIN_ACUERDO;
    const conAcuerdos = sinAcuerdos !== EstadoCredito.SIN_ACUERDO &&
      cartera.acuerdos.some(a => moment(a.fechaAcuerdo).diff(moment(), 'hours') >= 0) &&
      EstadoCredito.CON_ACUERDO;
    const acuerdosVencidos = sinAcuerdos !== EstadoCredito.SIN_ACUERDO &&
      cartera.acuerdos.every(a => moment(a.fechaAcuerdo).diff(moment(), 'hours') < 0) &&
      EstadoCredito.ACUERDO_VENCIDO;

    return sinAcuerdos || conAcuerdos || acuerdosVencidos || EstadoCredito.SIN_ACUERDO;
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.COBRANZAS);
    const {modulos} = componente.find(m => m?.id === 3);
    const {acciones} = modulos.find(m => m?.id === componenteId);
    const permisoacciones = acciones.find(m => m?.id === accion);

    if (permisoacciones?.id !== accion){
      this.tienePermiso = false;
      const {componentInstance: info} = this.modal.open(AlertComponent, {centered: true});

      info.title = 'Permiso';
      info.description = 'No tiene permisos';
      info.buttons = AlertButtons.INFO;
    } else {
      this.tienePermiso = true;
    }
  }
}

class FiltroListadoCobranzasFormStruct {
  estadoAcuerdo: number;
  orden: number;
  // tslint:disable-next-line
  sucursal_id: string;
  // tslint:disable-next-line
  zona_id: string;
}


class FiltroListadoCobranzasForm extends FormGroup {
  constructor(filtro: FiltroListadoCobranzasFormStruct) {
    super({
      sucursal_id: new FormControl(filtro.sucursal_id),
      zona_id: new FormControl(filtro.zona_id || null),
      estadoAcuerdo: new FormControl(Number(filtro.estadoAcuerdo) || null),
      orden: new FormControl(Number(filtro.orden) || 0),
    });

    this.controls.sucursal_id.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    Object.keys(raw).forEach(k => !!raw[k] || raw[k] === 0 ? raw : delete raw[k]);

    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
