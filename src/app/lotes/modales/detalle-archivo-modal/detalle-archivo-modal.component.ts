import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalleLote, Registro } from '../../../core/entities/lote';

@Component({
  selector: 'app-detalle-archivo-modal',
  templateUrl: './detalle-archivo-modal.component.html',
  styleUrls: ['./detalle-archivo-modal.component.scss']
})
export class DetalleArchivoModalComponent implements OnInit {

  @Output() seleccionar: EventEmitter<any> = new EventEmitter<any>();

  @Input() lote: DetalleLote;

  get enProceso(): Registro[] {
    return this.lote.registros.filter(r => r.idEstado === 0) || [];
  }

  get confirmados(): Registro[] {
    return this.lote.registros.filter(r => r.idEstado === 100) || [];
  }

  get excluidos(): Registro[] {
    return this.lote.registros.filter(r => r.idEstado > 0 && r.idEstado < 100) || [];
  }

  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }
}

