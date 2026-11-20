import { Component, OnInit } from '@angular/core';
import { CobranzasService } from '../cobranzas.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from '../../core/data/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegComentarioModalComponent } from '../modales';
import { environment } from '../../../environments/environment';
import { Acuerdo, CarteraCuotas, Solicitudes } from '../../core/entities/solicitudes';
import { EstadoCredito, PermisosComponentes, RangosNotificaciones, Roles } from '../../core/types';
import { RANGOS_CARTERA, STORAGE_KEYS } from '../../core/constants';
import { SessionService } from '../../core/session.service';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { Permisos } from 'src/app/core/entities/permisos';

@Component({
  selector: 'app-gestion-cartera',
  templateUrl: './gestion-cartera.component.html',
  styleUrls: ['./gestion-cartera.component.scss']
})
export class GestionCarteraComponent implements OnInit {

  esPrimeraNotificacion: boolean;
  esSegundaNotificacion: boolean;
  esTerceraNotificacion: boolean;
  puedeCrearAcuerdo: boolean;
  pagosMinimos: CarteraCuotas[] = [];
  permisos: Permisos[];
  tienePermiso: boolean;
  listaComentarios: any[] = [];

  get pagoFechaHoy(): number {
    const { acuerdoVigente } = this.cobranza;

    if (!!acuerdoVigente) {
      const fechaLimite = moment().format('DD-MM-YYYY');
      return this.pagosMinimos.find(pm => moment(pm.fecha).format('DD-MM-YYYY') === fechaLimite)?.valor;
    }

    return 0;
  }

  /**
   * Indica si una cartera tiene fechas disponibles para crear acuerdos.
   *
   * Si la fecha del último item, del array cuotas de cartera, es mayor o igual a la fecha de hoy, entonces hay fechas disponibles.
   * @public puedeCrearAcuerdo: Mientras haya fechas disponibles se puede crear acuerdos para el rol permitido
   */
  get hayFechasDisponibles(): boolean {
    const { carteraVencida } = this.cobranza;

    if (!!carteraVencida) {
      const { cuotas } = carteraVencida;

      return moment(cuotas[cuotas.length - 1].fecha)
        .utc(false)
        .endOf('day')
        .diff(moment().utc(false).endOf('day')) >= 0;
    }

    return false;
  }

  constructor(
    public cobranza: CobranzasService,
    private api: ApiService,
    private session: SessionService,
    private modal: NgbModal,
    private router: Router,
    public route: ActivatedRoute
  ) {
    if (!this.cobranza.cobranza || !this.cobranza.carteraVencida) {
      const { snapshot: { queryParams } } = this.route;
      this.router.navigate(['/cartera'], { queryParams });
    }
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.tienePermiso = false;


    const { diasEnMora } = this.cobranza.carteraVencida;

    this.listarComentarios(this.cobranza.carteraVencida);

    this.inicializarPagosMinimos();

    this.esPrimeraNotificacion = GestionCarteraComponent.esNotificacion(diasEnMora, RangosNotificaciones.PRIMERA_NOTIFICACION);
    this.esSegundaNotificacion = GestionCarteraComponent.esNotificacion(diasEnMora, RangosNotificaciones.SEGUNDA_NOTIFICACION);
    this.esTerceraNotificacion = GestionCarteraComponent.esNotificacion(diasEnMora, RangosNotificaciones.TERCERA_NOTIFICACION);
    this.puedeCrearAcuerdo = (this.esPrimeraNotificacion || this.esSegundaNotificacion || this.esTerceraNotificacion) &&
      this.rolParaCrearAcuerdo() === this.session.user.rol.id &&
      this.hayFechasDisponibles;

  }

  static esNotificacion(diasEnMora: number, tipo: RangosNotificaciones): boolean {
    const rangoNotificacion = RANGOS_CARTERA.sort((ra, rb) => ra.desde - rb.desde)[tipo];

    return diasEnMora >= rangoNotificacion.desde && diasEnMora <= rangoNotificacion.hasta;
  }

  ngOnInit(): void {
  }

  listarComentarios(listaComentariosCobranza: any) {
    this.listaComentarios = [];
    const listaGestion = listaComentariosCobranza?.gestion;
    const listaGestionAsesor = listaComentariosCobranza?.gestionAsesor === undefined ? [] : listaComentariosCobranza?.gestionAsesor;
    const listaGestionGestor = listaComentariosCobranza?.gestionGestor === undefined ? [] : listaComentariosCobranza?.gestionGestor;

    this.listaComentarios.push(...listaGestion, ...listaGestionAsesor, ...listaGestionGestor)
    this.listaComentarios.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async registrarComentario(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      const modalRef = await this.modal.open(RegComentarioModalComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.cobranza = this.cobranza.cobranza;
      modalRef.componentInstance.registrar.subscribe(async ({ identificacionCliente, comentario }) => {

        comentario = !!this.clientePorIdentificacion(identificacionCliente) ?
          `${this.clientePorIdentificacion(identificacionCliente)}: ${comentario}` : comentario;
        try {
          await this.api.cobranzas.registrarComentario({
            comentario,
            cartera_id: this.cobranza.carteraVencida._id,
            solicitud_id: this.cobranza.cobranza._id,
          });

          const { data } = await this.api.solicitudes.buscarPorId({ _id: this.cobranza.cobranza._id })

          this.cobranza.cobranza = data[0];
          modalRef.close();
          this.listarComentarios(this.cobranza.carteraVencida);
        } catch (e) {
          if (!environment.production) {
            console.log(e);
          }
        }
      });
    }
  }

  async crearAcuerdo(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      try {
        const { snapshot: { queryParams } } = this.route;
        await this.router.navigate(['/cartera', 'crear-acuerdo'], { queryParams });
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  async descargarAcuerdo(): Promise<void> {
    const { acuerdoVigente, cobranza, carteraVencida } = this.cobranza;
    const { identificacionCliente, fechaAcuerdo } = acuerdoVigente;

    try {
      const query = { _id: cobranza._id, cartera_id: carteraVencida._id, acuerdo_id: acuerdoVigente._id };
      const contrato: Blob = await this.api.cobranzas.descargarAcuerdo(query);
      const url = URL.createObjectURL(contrato);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `acdo-${identificacionCliente}-${moment(fechaAcuerdo).format('YYYY-MM-DD')}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e);
    }

  }

  estadoAcuerdo(acuerdo: Acuerdo): EstadoCredito {
    const conAcuerdos = moment(acuerdo.fechaAcuerdo).diff(moment(), 'hours') >= 0 && EstadoCredito.CON_ACUERDO;
    const acuerdosVencidos = moment(acuerdo.fechaAcuerdo).diff(moment(), 'hours') < 0 && EstadoCredito.ACUERDO_VENCIDO;

    return conAcuerdos || acuerdosVencidos || EstadoCredito.SIN_ACUERDO;
  }

  clientePorIdentificacion(identificacion: string | number): string {
    const { datosPersonalesCliente } = this.cobranza.cobranza.miembros
      .find(m => m.datosIdentificacionCliente.numeroIdentificacion === identificacion) || {};
    const nombreCompleto = !!datosPersonalesCliente && [
      datosPersonalesCliente.nombre1,
      datosPersonalesCliente.nombre2,
      datosPersonalesCliente.apellido1,
      datosPersonalesCliente.apellido2
    ] || [];
    return nombreCompleto.join(' ');
  }

  /**
   * Establece un listado de pagos segun la fecha.
   * Fecha de creación del acuerdo si tiene acuerdo vigente, o fecha desde hoy si .
   * @private
   */
  private inicializarPagosMinimos(): void {
    const { carteraVencida: { cuotas }, acuerdoVigente } = this.cobranza;
    const fromDate = !!acuerdoVigente ? acuerdoVigente.createdAt : moment().toISOString();
    const fromIdx = cuotas.findIndex(c => moment(fromDate).format('DD-MM-YYYY') === moment(c.fecha).format('DD-MM-YYYY'));

    const untilDate = !!acuerdoVigente ? acuerdoVigente.fechaAcuerdo : cuotas[cuotas.length - 1]?.fecha;
    const untilIdx = cuotas.findIndex(c => moment(untilDate).format('DD-MM-YYYY') === moment(c.fecha).format('DD-MM-YYYY'));

    this.pagosMinimos = fromIdx < 0 ? [] : cuotas.slice(fromIdx, untilIdx + 1);
  }

  /**
   * Obtiene el rol que puede crear acuerdos para la cartera actual.
   *
   * Asistente puede crear acuerdo si un asesor antes hizo un acuerdo y está vencido.
   * Gerente puede crear acuerdo si un asistente hizo un acuerdo y está vencido.
   * @private
   */
  private rolParaCrearAcuerdo(): Roles {
    const { acuerdoVigente, acuerdosRangoActual } = this.cobranza;

    const acuerdosPorAsesor = acuerdosRangoActual.filter(a => a.usuario.rol.id === Roles.ASESOR);
    const acuerdosPorAsistente = acuerdosRangoActual.filter(a => a.usuario.rol.id === Roles.ASISTENTE);
    const acuerdosPorGerente = acuerdosRangoActual.filter(a => a.usuario.rol.id === Roles.GERENTE);

    const asistentePuedeCrear = !acuerdoVigente && acuerdosPorAsesor.length === 1 && acuerdosPorAsistente.length === 0;
    const gerentePuedeCrear = !acuerdoVigente && acuerdosPorAsistente.length === 1 && acuerdosPorGerente.length === 0;

    return (asistentePuedeCrear && Roles.ASISTENTE) || (gerentePuedeCrear && Roles.GERENTE);
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.COBRANZAS);
    const { modulos } = componente.find(m => m?.id === 3);
    const { acciones } = modulos.find(m => m?.id === componenteId);
    const permisoacciones = acciones.find(m => m?.id === accion);

    if (permisoacciones?.id !== accion) {
      this.tienePermiso = false;
      const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });

      info.title = 'Permiso';
      info.description = 'No tiene permisos';
      info.buttons = AlertButtons.INFO;
    } else {
      this.tienePermiso = true;
    }
  }
}
