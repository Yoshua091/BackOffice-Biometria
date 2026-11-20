import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadosSolicitudString } from 'src/app/core/constants';
import { Solicitudes } from 'src/app/core/entities/solicitudes';
import { TiposMiembro } from 'src/app/core/types';
import { EstadoSolicitud } from 'src/app/core/pipes/estado-solicitud.pipe';
import { ApiService } from 'src/app/core/data/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertButtons, AlertComponent, AlertLevel } from 'src/app/shared/alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lista-solicitudes',
  templateUrl: './lista-solicitudes.component.html',
  styleUrls: ['./lista-solicitudes.component.scss']
})
export class ListaSolicitudesComponent implements OnInit {

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() listado: Solicitudes[];
  @Input() cantidad: number;
  @Input() pagina: number;
  @Input() cantidadPorPagina: number;

  estadosSolicitud = EstadosSolicitudString;
  collection: Solicitudes[] = [];
  estados: EstadoSolicitudMap = new EstadoSolicitudMap();

  constructor(
    private api: ApiService,
    private modal: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
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

  async reenviar(values: { propuesta: Solicitudes, estado: number[] }) {
    const { propuesta, estado } = values
    const { _id, idSolicitud } = propuesta;
    let sucess = false;
    const state = estado[0]
    try {

      const result = await this.modal.open(AlertComponent, { centered: true, size: 'md' });
      result.componentInstance.title = 'Confirmación';
      result.componentInstance.description = "¿Confirma que desea realizar esta acción?";
      result.componentInstance.level = AlertLevel.PRIMARY_LEVEL;
      result.componentInstance.buttons = AlertButtons.CONFIRM;

      const validation = await result.result;

      if (validation) {
        const { mensaje } = await this.api.solicitudes.modificarEstado({ _id, estado: state });
        const { data, status } = await this.api.solicitudes.buscarPorId({ _id });

        const result = this.modal.open(AlertComponent, { centered: true, size: 'md' });

        if (status === 200 && data[0].estado === state) {
          result.componentInstance.title = 'Cambio Exitoso';
          result.componentInstance.description = `Se modificó correctamente el estado de la solicitud número: ${idSolicitud}`;
          result.componentInstance.level = AlertLevel.SUCCES_LEVEL;
          result.componentInstance.buttons = AlertButtons.INFO;
          sucess = true;
        } else {
          result.componentInstance.title = 'Ops! algo salió mal';
          result.componentInstance.description = mensaje;
          result.componentInstance.level = AlertLevel.DANGER_LEVEL;
          result.componentInstance.buttons = AlertButtons.INFO;
          sucess = false;
        }

        result.result.then(() => {
          if (sucess) {
            this.reloadCurrentRoute();
          }
        }).catch(() => {
          if (sucess) {
            this.reloadCurrentRoute();
          }
        });
      }

    } catch (e) {
      console.log(e);
    }
  }

  sumCuotas({ miembros }) {
    return miembros?.reduce((sum, m) =>
      [4, 5].includes(m.tipoMiembro.id) ?
        sum :
        sum + m.solicitudEconomica.valoresDetalles.monto,
      0);
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

  reloadCurrentRoute() {
    const currentUrl = this.router.url.substring(0, this.router.url.indexOf('?'));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl], { queryParams: this.route.snapshot.queryParams });
    });
  }
}

class EstadoSolicitudMap {
  LegalizandoCredito = [EstadoSolicitud.LegalizandoCredito];
  DesembolsoConfirmado = [EstadoSolicitud.DesembolsoConfirmado];
  ValidacionAsistente = [EstadoSolicitud.ValidacionAsistente];
}


