import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RenovacionesService} from '../renovaciones.service';
import {TiposMiembro} from '../../core/types';
import * as moment from 'moment';

declare const simulador;

@Component({
  selector: 'app-detalle-renovacion',
  templateUrl: './detalle-renovacion.component.html',
  styleUrls: ['./detalle-renovacion.component.scss']
})
export class DetalleRenovacionComponent implements OnInit {

  resultadoSimulador: any = {};

  get esClienteExperto(): boolean {
    const {miembros} = this.sRenovacion.solicitud;
    return miembros.length === 1 && miembros.every(m => m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  get esIndividual(): boolean {
    const {miembros} = this.sRenovacion.solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    const {CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE} = TiposMiembro;
    return miembros.every((m, idx) => idx === liderIdx ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m.tipoMiembro.id));
  }

  get esGrupal(): boolean {
    const {miembros} = this.sRenovacion.solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.MIEMBRO);
  }

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public sRenovacion: RenovacionesService
  ) {
    if (!this.sRenovacion.solicitud) {
      const {snapshot: {queryParams}} = this.route;
      this.router.navigate(['/renovacion'], {queryParams});
    }

    const {error: errorSimulacion, simulacion} = simulador.cuotaGrupal(this.sRenovacion.solicitud, moment().toISOString(false));
    this.resultadoSimulador = (!errorSimulacion && simulacion) || new Error(`E-SIM: simulador ha fallado.  ${errorSimulacion}`);
  }

  ngOnInit(): void {
  }
}
