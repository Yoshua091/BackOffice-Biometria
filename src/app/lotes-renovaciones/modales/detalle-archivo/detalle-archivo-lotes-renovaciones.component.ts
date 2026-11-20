import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Lote, Registro } from 'src/app/core/entities/renovaciones';
import {ProcesadoLoteRenovacion} from '../../../core/types';

@Component({
  selector: 'app-detalle-archivo-lotes-renovaciones',
  templateUrl: './detalle-archivo-lotes-renovaciones.component.html',
  styleUrls: ['./detalle-archivo-lotes-renovaciones.component.scss']
})
export class DetalleArchivoLotesRenovacionesComponent implements OnInit {

  @Output() seleccionar: EventEmitter<any> = new EventEmitter<any>();

  @Input() lote: Lote;

  get enProceso(): Registro[] {
    return this.lote?.registros.filter(r => r.procesado === ProcesadoLoteRenovacion.PROCESANDO) || [];
  }

  get confirmados(): Registro[] {
    return this.lote?.registros.filter(r => r.procesado === ProcesadoLoteRenovacion.PROCESADO) || [];
  }

  get excluidos(): Registro[] {
    return this.lote?.registros.filter(r => r.procesado > ProcesadoLoteRenovacion.PROCESADO) || [];
  }

  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }
}

