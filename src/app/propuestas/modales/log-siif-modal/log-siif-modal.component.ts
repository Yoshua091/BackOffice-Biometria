import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Log } from 'src/app/core/entities/solicitudes';

@Component({
  selector: 'app-log-siif-modal',
  templateUrl: './log-siif-modal.component.html',
  styleUrls: ['./log-siif-modal.component.scss']
})
export class LogSiifModalComponent implements OnInit {
  @Input() log: Log[];

  motivoSiif: Log[];
  fechaMotivoRechazo: any;

  constructor(public modal: NgbActiveModal) { 
    this.motivoSiif = new Array<any>();
  }

  ngOnInit(): void {
    this.motivoSiif = this.log.filter(x => x.mostrar === true);
    this.motivoSiif.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

}
