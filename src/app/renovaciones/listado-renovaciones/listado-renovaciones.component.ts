import {Component, OnInit} from '@angular/core';
import {CALIFICACIONES_RENOVACION, STORAGE_KEYS} from 'src/app/core/constants';
import {ApiService} from 'src/app/core/data/api.service';
import {Empleado} from 'src/app/core/entities/empleado';
import {Sucursal} from 'src/app/core/entities/sucursal';
import {Solicitudes} from '../../core/entities/solicitudes';
import {PermisosComponentes, TiposMiembro} from '../../core/types';
import {ActivatedRoute, Router} from '@angular/router';
import {RenovacionesService} from '../renovaciones.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Zona} from 'src/app/core/entities/zona';
import { Permisos } from 'src/app/core/entities/permisos';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listado-renovaciones',
  templateUrl: './listado-renovaciones.component.html',
  styleUrls: ['./listado-renovaciones.component.scss']
})
export class ListadoRenovacionesComponent implements OnInit {

  calificaciones: string[] = CALIFICACIONES_RENOVACION;
  form: FiltroListadoRenovacionesForm;
  sucursales: Sucursal[];
  zonas: Zona[];
  renovaciones: Solicitudes[] = [];
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
    private router: Router,
    private route: ActivatedRoute,
    private sRenovacion: RenovacionesService,
    private modal: NgbModal,
  ) {
    const sucursales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUCURSALES));
    const {queryParams} = this.route.snapshot;
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.tienePermiso = false;

    this.sucursales = sucursales ? sucursales : null;
    this.form = new FiltroListadoRenovacionesForm((queryParams || {}) as FiltroListadoRenovacionesFormStruct);

    this.form.controls.sucursal_id.valueChanges.subscribe(async value => {
      try {
        const {data} = await this.api.zonas.buscar({sucursal_id: value});
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
        const {data: {data, totalRegistros}} = await this.api.solicitudes.buscarRenovacion(filtro);
        this.renovaciones = data;
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

  esClienteExperto(solicitud: Solicitudes): boolean {
    return solicitud && solicitud.miembros.length === 1 &&
      solicitud.miembros.every(m => m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  esIndividual(solicitud: Solicitudes): boolean {
    const {miembros} = solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    const {CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE} = TiposMiembro;

    return miembros.every((m, idx) => idx === liderIdx ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m.tipoMiembro.id));
  }

  esGrupal(solicitud: Solicitudes): boolean {
    const {miembros} = solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);

    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.MIEMBRO);
  }
  
  esGarantia(solicitud: Solicitudes): boolean {
    const { miembros } = solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER_GARANTIA);
   // const tipoCreedito = TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.solicitud.tipoSolicitud.id ? true : false;

    return miembros.every((m, idx) => idx === liderIdx ? true : false);
  }

  async detalles(renovacion: Solicitudes, componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      this.sRenovacion.solicitud = renovacion;
      const {pagina} = this.paginador;
      try {
        await this.router.navigate(
          ['/renovacion', 'detalles'],
          {
            queryParams: {
              ...this.form.getRawValue(),
              pagina,
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.RENOVACION);
    const {modulos} = componente.find(m => m?.id === 4);
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

class FiltroListadoRenovacionesFormStruct {
  calificacion: string;
  // tslint:disable-next-line
  sucursal_id: string;
  // tslint:disable-next-line
  zona_id: string;
}


class FiltroListadoRenovacionesForm extends FormGroup {

  constructor(filtro: FiltroListadoRenovacionesFormStruct) {
    super({
      sucursal_id: new FormControl(filtro.sucursal_id),
      zona_id: new FormControl(filtro.zona_id || null),
      calificacion: new FormControl(filtro.calificacion || null)
    });

    this.controls.sucursal_id.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    Object.keys(raw).forEach(k => !raw[k] ? delete raw[k] : raw);

    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
