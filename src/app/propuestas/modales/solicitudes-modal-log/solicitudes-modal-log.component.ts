import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LogEstados, Solicitudes } from 'src/app/core/entities/solicitudes';

@Component({
  selector: 'app-solicitudes-modal-log',
  templateUrl: './solicitudes-modal-log.component.html',
  styleUrls: ['./solicitudes-modal-log.component.scss']
})
export class SolicitudesModalLogComponent implements OnInit {
  @Input() log: LogEstados[];

  logEstado: LogEstados[];

  constructor(public modal: NgbActiveModal) {
    this.logEstado = new Array<LogEstados>();
   }

   ngOnInit(): void {
    this.logEstado = (this.log || []).map((item: LogEstados) => ({
      ...item,
      usuario: {
        ...item.usuario,
        rol: item.estado?.idEstado === 1 ? 'Asesor' : item.usuario?.rol
      }
    }));
  }

}
