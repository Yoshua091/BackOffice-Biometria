import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Cliente, Solicitudes} from '../../core/entities/solicitudes';
import {SessionService} from '../../core/session.service';
import {PermisosComponentes, TiposMiembro, TipoSolicitud} from '../../core/types';
import {EstadosSolicitudString, STORAGE_KEYS} from '../../core/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudesModalLogComponent } from 'src/app/propuestas/modales/solicitudes-modal-log/solicitudes-modal-log.component';
import { AlertButtons, AlertComponent } from '../alert/alert.component';
import { Permisos } from 'src/app/core/entities/permisos';

declare const simulador;

@Component({
  selector: 'app-lista-propuestas',
  templateUrl: './lista-propuestas.component.html',
  styleUrls: ['./lista-propuestas.component.scss']
})
export class ListaPropuestasComponent implements OnInit {

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() cargarComite: EventEmitter<any> = new EventEmitter();
  
  @Input() listado: Solicitudes[];
  @Input() cantidad: number;
  @Input() pagina: number;
  @Input() cantidadPorPagina: number;

  clientesContrato: (miembros: Cliente[]) => number;
  sumCuotas: (solicitud: Solicitudes) => number;
  lider: (miembros: Cliente[]) => any;
  cuotaGrupal: (solicitud: Solicitudes, fechaCredito: string) => any;
  simuladorMotor:(solicitud: Solicitudes, fechaCredito: string) => any;
  cuotaMax: (miembro: Cliente) => number;

  estadosSolicitud = EstadosSolicitudString;
  collection: Solicitudes[] = [];
  permisos: Permisos[];
  tienePermiso: boolean;

  constructor(
    private router: Router,
    private session: SessionService,
    private modal: NgbModal,
    private route: ActivatedRoute) {
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.tienePermiso = false;
    this.prepararSimulador();
  }

  ngOnInit(): void {
  }

  esClienteExperto(propuesta: Solicitudes): boolean {
    return propuesta && propuesta.miembros.length === 1 &&
      propuesta.miembros.every(m => m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  esIndividual(propuesta: Solicitudes): boolean {
    const {miembros} = propuesta;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    const {CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE} = TiposMiembro;

    return miembros.every((m, idx) => idx === liderIdx ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m.tipoMiembro.id));
  }

  esGrupal(propuesta: Solicitudes): boolean {
    const {miembros} = propuesta;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);

    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.MIEMBRO);
  }

  tipoPropuesta(propuesta: Solicitudes): TipoSolicitud {
    return this.esClienteExperto ? TipoSolicitud.CLIENTE_EXPERTO :
      this.esIndividual ? TipoSolicitud.INDIVIDUAL :
        this.esGrupal ? TipoSolicitud.GRUPAL :
          TipoSolicitud.INDEFINIDA;
  }

  permisoVerSolicitud(propuesta: Solicitudes): boolean {
    return this.session.hasSolicitudPermissions(propuesta);
  }

  // tslint:disable-next-line:variable-name
  async detalleSolicitud(_id: string): Promise<void> {
    const {queryParams} = this.route.snapshot;
    try {
      await this.router.navigate(
        ['/propuestas', 'detalle'],
        {
          queryParams: {
            _id,
            ...queryParams
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  private prepararSimulador(): void {
    try {
      this.clientesContrato = simulador.clientesContrato.bind(simulador);
      this.sumCuotas = simulador.sumCuotas.bind(simulador);
      this.cuotaMax = simulador.cuotaMax.bind(simulador);
      this.lider = simulador.lider.bind(simulador);
      this.cuotaGrupal = simulador.cuotaGrupal.bind(simulador);
      this.simuladorMotor = simulador.cuotaGrupal.bind(simulador);
    } catch (e) {
      console.log(e);
    }
  }

  async solicitudLog(propuesta: Solicitudes): Promise<void> {
    await this.abrilModalSolicitudLog(propuesta);
  }

  async abrilModalSolicitudLog(propuesta: Solicitudes): Promise<void> {
    const { componentInstance } = await this.modal.open(SolicitudesModalLogComponent, {
      centered: true,
      windowClass: 'modal-edicion-campos-solicitud'
    });
    componentInstance.log = propuesta?.logEstados || [];
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.PROPUESTAS);
    const {modulos} = componente.find(m => m?.id === 1);
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
