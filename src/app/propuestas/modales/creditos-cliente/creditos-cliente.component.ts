import {Component, Input, OnInit} from '@angular/core';
import {Cliente, Solicitudes} from '../../../core/entities/solicitudes';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-creditos-cliente',
  templateUrl: './creditos-cliente.component.html',
  styleUrls: ['./creditos-cliente.component.scss']
})
export class CreditosClienteComponent implements OnInit {

  @Input() solicitudes: Solicitudes[];
  @Input() cliente: Cliente;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
