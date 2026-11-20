import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Altair, Log } from 'src/app/core/entities/solicitudes';

@Component({
  selector: 'app-motivos-rechazo-altair',
  templateUrl: './motivos-rechazo-altair.component.html',
  styleUrls: ['./motivos-rechazo-altair.component.scss']
})
export class MotivosRechazoAltairComponent implements OnInit {
  @Input() altair: Altair;
  @Input() log: Log[];

  motivoRechazo: any[];
  fechaMotivoRechazo: any;

  constructor(public modal: NgbActiveModal) { 
    this.motivoRechazo = new Array<any>();
  }

  ngOnInit(): void {
    this.motivoRechazo = this.altair?.motivoRechazo;
    this.log?.forEach(x => this.fechaMotivoRechazo = x.fecha)
  }

}
