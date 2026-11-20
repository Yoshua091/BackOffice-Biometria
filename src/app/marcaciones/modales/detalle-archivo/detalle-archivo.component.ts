import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Lote, Registro } from 'src/app/core/entities/renovaciones';
import { ProcesadoLoteRenovacion } from 'src/app/core/types';

@Component({
  selector: 'app-detalle-archivo',
  templateUrl: './detalle-archivo.component.html',
  styleUrls: ['./detalle-archivo.component.scss']
})
export class DetalleArchivoComponent implements OnInit {

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

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
