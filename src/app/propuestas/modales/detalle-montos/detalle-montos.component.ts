import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-montos',
  templateUrl: './detalle-montos.component.html',
  styleUrls: ['./detalle-montos.component.scss']
})
export class DetalleMontosComponent implements OnInit {

  @Input() historialMontos: any[] = [];

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
