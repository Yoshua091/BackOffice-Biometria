import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstadosSolicitudString, STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Comite } from 'src/app/core/entities/comite';
import { UsuarioAsignado } from 'src/app/core/entities/comite.interface';
import { Cliente, Solicitudes } from 'src/app/core/entities/solicitudes';
import { User } from 'src/app/core/entities/user';
import { DataSolicitudPipe } from 'src/app/core/pipes/data-solicitud.pipe';
import { EstadoSolicitud } from 'src/app/core/pipes/estado-solicitud.pipe';
import { SessionService } from 'src/app/core/session.service';
import { Roles, TiposMiembro, TipoSolicitud } from 'src/app/core/types';
import { AsignarComiteComponent } from 'src/app/propuestas/modales/asignar-comite/asignar-comite.component';
import { LogSiifModalComponent } from 'src/app/propuestas/modales/log-siif-modal/log-siif-modal.component';
import { ModificarDatosClienteComponent } from 'src/app/propuestas/modales/modificar-datos-cliente/modificar-datos-cliente.component';
import { MotivosRechazoAltairComponent } from 'src/app/propuestas/modales/motivos-rechazo-altair/motivos-rechazo-altair.component';
import { SolicitudesModalLogComponent } from 'src/app/propuestas/modales/solicitudes-modal-log/solicitudes-modal-log.component';

@Component({
  selector: 'app-card-propuesta',
  templateUrl: './card-propuesta.component.html',
  styleUrls: ['./card-propuesta.component.scss'],
  providers: [
    DataSolicitudPipe
  ]
})
export class CardPropuestaComponent implements OnInit {
  @Input() propuesta: Solicitudes;
  @Output() ver: EventEmitter<any> = new EventEmitter();
  @Output() cargarComite: EventEmitter<any> = new EventEmitter();
  miembros: Cliente[];
  estadosSolicitud = EstadosSolicitudString;
  esLider: boolean = false;
  comite: Comite[] = [];
  analista: UsuarioAsignado;
  currentUser: User;
  fechaEstados: string
  fechaInicio: any;
  fechaFin: any;
  vigenciaSolicitud: string;
  vigenciaSolicitudColor: number;
  propuestaGarantia: boolean;
  propuestaPlus: boolean;
  isCollapsed = true;
  miembrosDispersion: any[];
  mostrarMotivoAltair: boolean;
  mostrarSolicitudSoporte: boolean;
  mostrarLogSiiw: boolean;
  motor:any;
  constructor(public session: SessionService, private modal: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
    this.estadoFechas();
    this.vigenciaSolicitudDias();
    //this.getTipoCredito()
    this.miembros = this.propuesta?.miembros;
    this.mostrarMotivoAltair = this.propuesta && this.propuesta?.altair && this.propuesta?.altair.motivoRechazo && this.propuesta.altair.motivoRechazo.length > 0 && this.propuesta?.altair !== undefined ? true : false;
    this.mostrarSolicitudSoporte = this.propuesta?.soporte?.soporte === true ? true : false;
    this.propuesta?.log.every(x => x.mostrar === true ? this.mostrarLogSiiw = true : this.mostrarLogSiiw = false);
    this.miembrosDispersion = this.propuesta.miembros.filter(x => x.tipoMiembro.id <= TiposMiembro.CLIENTE_EXPERTO || x.tipoMiembro.id <= TiposMiembro.LIDER_GARANTIA)
    this.propuestaGarantia = TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.propuesta.tipoSolicitud.id && this.propuesta.motor === undefined ? true : false;
    this.propuestaPlus = this.propuesta.tipoSolicitud?.plus === true && this.propuesta.motor === undefined ? true : false;
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    this.motor = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOTOR));
    if (this.propuesta.comite) {
      this.analista = this.propuesta.comite.usuarioAsignado;
    }
    const currentUser = this.session.user;
    const comite = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMITE));
    this.esLider = comite.find(user => user.idUsuario === currentUser.idUsuario)?.lider ? true : false;
    if (this.esLider) {
      this.comite = comite.filter(user => user.idUsuario !== currentUser.idUsuario);
    }
  }

  obtenerValores(propuesta: any): string {
    if (propuesta.motor !== undefined && propuesta.motor?.seleccionActual !== undefined) {

      const seleccionActual = propuesta.motor?.seleccionActual.split('-').map(Number); // Convierte los valores a número
      const idSolicitud = seleccionActual[0];  // Primer valor es el id de solicitud
      const idGarantia = seleccionActual[1];   // Segundo valor es el id de garantía

      const solicitud = this.motor.tipoSolicitud.find(s => s.id === idSolicitud);
      const garantia = this.motor.tipoGarantia.find(g => g.id === idGarantia);

      if (solicitud && garantia) {
        return `${solicitud.tipo} ${garantia.descripcion}`;
      }
    }
  }

  //getTipoCredito() {
  //   debugger
  //   if (this.propuesta.motor !== undefined) {
  //     const seleccionActual = this.propuesta.motor.seleccionActual;

  //     // Dividir seleccionActual y convertir a números
  //     const valores = seleccionActual.split('-').map(Number);  // Convertir a número
  //     const tipoCredito = valores[0];
  //     const tipoComision = valores[1];

  //     // Llamar a obtenerValores y manejar el resultado
  //     const resultado = this.obtenerValores(tipoCredito, tipoComision);

  //     if (resultado) {
  //       console.log(`Tipo de solicitud: ${resultado.solicitud}`);
  //       console.log(`Tipo de garantía: ${resultado.garantia}`);
  //     } else {
  //       console.error('No se encontraron valores para la selección actual.');
  //     }
  //   }
  // }


  estadoFechas() {
    if (this.propuesta.fechaEstados !== undefined) {
      for (const [estado, fecha] of Object.entries(this.propuesta.fechaEstados)) {
        if (Number(estado) == this.propuesta.estado) {
          this.fechaEstados = String(fecha);
          break;
        }
      }
    } else {
      this.fechaEstados = this.propuesta.createdAt;
    }
  }

  vigenciaSolicitudDias() {
    var fechaCreacionSolicitud = new Date(this.propuesta?.fechaCreacionSolicitud);
    var fechaActualSolicitud = new Date()
    var fechaFormatoInicial = new Date(fechaCreacionSolicitud).toLocaleDateString();
    var fechaFormatoActual = new Date(fechaActualSolicitud).toLocaleDateString();
    var fechaInicioSinGuion = fechaFormatoInicial.split("/");
    var fechaFinalSinGuion = fechaFormatoActual.split("/");

    this.fechaInicio = fechaInicioSinGuion;
    this.fechaFin = fechaFinalSinGuion;

    var diff = Date.UTC(this.fechaFin[2], this.fechaFin[1] - 1, this.fechaFin[0], 0, 0, 0) - Date.UTC(this.fechaInicio[2], this.fechaInicio[1] - 1, this.fechaInicio[0], 0, 0, 0);

    var secleft = diff / 1000 / 60;
    var hrsleft = secleft / 60;
    var daysleft = hrsleft / 24;

    this.vigenciaSolicitud = String(daysleft) + ' Días';
    this.vigenciaSolicitudColor = daysleft;
  }

  esClienteExperto(propuesta: Solicitudes): boolean {
    return propuesta && propuesta.miembros.length === 1 &&
      propuesta.miembros.every(m => m?.tipoMiembro?.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  esIndividual(propuesta: Solicitudes): boolean {
    const { miembros } = propuesta;
    const liderIdx = miembros.findIndex(m => m?.tipoMiembro?.id === TiposMiembro.LIDER);
    const { CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE } = TiposMiembro;
    const tipoCreedito = TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.propuesta?.tipoSolicitud?.id ? true : false;

    return miembros.every((m, idx) => idx === liderIdx && !tipoCreedito ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m?.tipoMiembro?.id));
  }

  esGrupal(propuesta: Solicitudes): boolean {
    const { miembros } = propuesta;
    const liderIdx = miembros.findIndex(m => m?.tipoMiembro?.id === TiposMiembro.LIDER);
    const tipoCreedito = TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.propuesta?.tipoSolicitud?.id ? true : false;

    return miembros.every((m, idx) => idx === liderIdx && !tipoCreedito ? true : m?.tipoMiembro?.id === TiposMiembro.MIEMBRO);
  }

  esGarantia(propuesta: Solicitudes): boolean {
    const { miembros } = propuesta;
    const liderIdx = miembros.findIndex(m => m?.tipoMiembro?.id === TiposMiembro.LIDER_GARANTIA);
    const tipoCreedito = TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.propuesta?.tipoSolicitud?.id ? true : false;

    return miembros.every((m, idx) => idx === liderIdx && !!tipoCreedito ? true : false);
  }

  getNameMiembro(miembro: Cliente) {
    return `${miembro.datosPersonalesCliente.nombre1 || ''} ${miembro.datosPersonalesCliente.nombre2 || ''} ${miembro.datosPersonalesCliente.apellido1 || ''} ${miembro.datosPersonalesCliente.apellido2 || ''}`
  }

  get puedeEditarCampos(): boolean {
    const { GERENTE, ASISTENTE } = Roles;
    return [GERENTE, ASISTENTE].includes(this.session.user.rol.id);
  }

  mostrarDatosDispersionesCodigo(): boolean {
    let tieneCodigoPlataforma
    this.miembrosDispersion.forEach(miembro => {
      tieneCodigoPlataforma = miembro.dispersion.codigoPlataforma !== undefined ? true : false;
    });
    return tieneCodigoPlataforma
  }

  mostrarDatosDispersiones(): boolean {
    let tieneCodigoPlataformaCodigpo
    this.miembrosDispersion.forEach(miembro => {
      tieneCodigoPlataformaCodigpo = miembro.dispersion.descripcionPlataforma !== undefined ? true : false;

    });
    return tieneCodigoPlataformaCodigpo
  }

  sumCuotas({ miembros }) {
    return miembros?.reduce((sum, m) =>
      [4, 5].includes(m.tipoMiembro.id) ?
        sum :
        sum + m.solicitudEconomica.valoresDetalles.monto,
      0);
  }

  permisoVerSolicitud(propuesta: Solicitudes): boolean {
    return this.session.hasSolicitudPermissions(propuesta);
  }

  async descargarContrato(): Promise<void> {

    const { _id } = this.propuesta;

    try {
      const contrato: Blob = await this.api.solicitudes.contrato(_id);
      const url = URL.createObjectURL(contrato);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `contrato_${_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e);
    }
  }

  async asignarComite() {
    const { _id } = this.propuesta;
    const { componentInstance, result } = await this.modal.open(AsignarComiteComponent, {
      centered: true,
      windowClass: 'modal-edicion-campos-solicitud'
    });
    componentInstance.comite = this.comite;
    if (this.analista) {
      componentInstance.selectedUser = this.analista;
    }
    const { selectUser } = await result;
    const resp = await this.api.solicitudes.asignarAnalita(_id, selectUser);
    if (resp.status === 200) {
      this.analista = selectUser;
      this.cargarComite.emit();
    }
  }

  copyToClipboard(element) {
    var r = document.createRange();
    r.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    try {
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    } catch (err) { }
  }

  async solicitudLog(propuesta: Solicitudes): Promise<void> {
    await this.abrilModalSolicitudLog(propuesta);
  }

  async solicitudLogRechazoAltair(propuesta: Solicitudes): Promise<void> {
    await this.abrilModalMotivoRechazoAltair(propuesta);
  }

  async solicitudLogSiif(propuesta: Solicitudes): Promise<void> {
    await this.abrilModalSiifLog(propuesta);
  }

  async abrilModalSolicitudLog(propuesta: Solicitudes): Promise<void> {
    const { componentInstance } = await this.modal.open(SolicitudesModalLogComponent, {
      centered: true,
      windowClass: 'modal-edicion-campos-solicitud'
    });
    componentInstance.log = propuesta?.logEstados || [];
  }

  async abrilModalMotivoRechazoAltair(propuesta: Solicitudes): Promise<void> {
    const { componentInstance } = await this.modal.open(MotivosRechazoAltairComponent, {
      centered: true,
      windowClass: 'modal-altair-rechazo'
    });
    componentInstance.altair = propuesta?.altair || []
    componentInstance.log = propuesta.log;

  }

  async abrilModalSiifLog(propuesta: Solicitudes): Promise<void> {
    const { componentInstance } = await this.modal.open(LogSiifModalComponent, {
      centered: true,
      windowClass: 'modal-altair-rechazo'
    });
    componentInstance.log = propuesta.log;

  }

  async abrilModalEdicionDatosContacto(propuesta: Solicitudes): Promise<void> {
    const { componentInstance } = await this.modal.open(ModificarDatosClienteComponent, {
      centered: true, size: 'lg'
    });
    componentInstance.solicitud = this.propuesta || [];

  }

  emitEvent() {
    this.ver.emit();
  }

}
