import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstadosSolicitudString } from 'src/app/core/constants';
import { Cliente, Solicitudes } from 'src/app/core/entities/solicitudes';
import { EstadoSolicitud } from 'src/app/core/pipes/estado-solicitud.pipe';
import { SessionService } from 'src/app/core/session.service';
import { TiposMiembro } from 'src/app/core/types';
import { SolicitudesModalLogComponent } from 'src/app/propuestas/modales/solicitudes-modal-log/solicitudes-modal-log.component';

@Component({
  selector: 'app-card-desembolsos',
  templateUrl: './card-desembolsos.component.html',
  styleUrls: ['./card-desembolsos.component.scss']
})
export class CardDesembolsosComponent implements OnInit {

  @Input() propuesta: Solicitudes;
  @Output() reenviar: EventEmitter<{ propuesta: Solicitudes, estado: EstadoSolicitud[] }> = new EventEmitter();
  miembros: Cliente[];
  estadosSolicitud = EstadosSolicitudString;
  estados: EstadoSolicitudMap = new EstadoSolicitudMap();

  constructor(private session: SessionService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.miembros = this.propuesta.miembros;
  }

  esClienteExperto(propuesta: Solicitudes): boolean {
    return propuesta && propuesta.miembros.length === 1 &&
      propuesta.miembros.every(m => m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  esIndividual(propuesta: Solicitudes): boolean {
    const { miembros } = propuesta;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    const { CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE } = TiposMiembro;

    return miembros.every((m, idx) => idx === liderIdx ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m.tipoMiembro.id));
  }

  esGrupal(propuesta: Solicitudes): boolean {
    const { miembros } = propuesta;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);

    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.MIEMBRO);
  }

  getNameMiembro(miembro: Cliente) {
    return `${miembro.datosPersonalesCliente.nombre1 || ''} ${miembro.datosPersonalesCliente.nombre2 || ''} ${miembro.datosPersonalesCliente.apellido1 || ''} ${miembro.datosPersonalesCliente.apellido2 || ''}`
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

  formatearError(propuesta: Solicitudes): string {
    if (propuesta.estado === 71) {
      if (propuesta.siif?.wsgyg29?.error && typeof propuesta.siif?.wsgyg29?.error === "object") {
        return `Error: ${propuesta.siif?.wsgyg29?.error.errno}, Code: ${propuesta.siif?.wsgyg29?.error.code}, Syscall: ${propuesta.siif?.wsgyg29?.error.syscall}`;
      } else {
        return `Error: ${propuesta.siif?.wsgyg29?.error}`;
      }
    }

    if (propuesta.estado === 81) {
      if (propuesta.siif?.wsgyg05?.error && typeof propuesta.siif?.wsgyg05?.error === "object") {
        return `Error: ${propuesta.siif?.wsgyg05?.error.errno}, Code: ${propuesta.siif?.wsgyg05?.error.code}, Syscall: ${propuesta.siif?.wsgyg05?.error.syscall}`;
      } else {
        return `Error: ${propuesta.siif?.wsgyg05?.error}`;
      }
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

  reenviarEmit(propuesta: Solicitudes, estado: EstadoSolicitud[]) {
    {
      this.reenviar.emit({ propuesta, estado });
    }
  }
}


class EstadoSolicitudMap {
  LegalizandoCredito = [EstadoSolicitud.LegalizandoCredito];
  DesembolsoConfirmado = [EstadoSolicitud.DesembolsoConfirmado];
  ValidacionAsistente = [EstadoSolicitud.ValidacionAsistente];
}