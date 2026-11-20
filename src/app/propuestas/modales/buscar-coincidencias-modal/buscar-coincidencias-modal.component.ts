import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buscar-coincidencias-modal',
  templateUrl: './buscar-coincidencias-modal.component.html',
  styleUrls: ['./buscar-coincidencias-modal.component.scss']
})
export class BuscarCoincidenciasModalComponent  {

  @Input() coincidencias: any[] = [];

  constructor(
    public activeModal: NgbActiveModal, public modal: NgbActiveModal
  ) {}

  cerrar(): void {
    this.activeModal.close();
  }
}