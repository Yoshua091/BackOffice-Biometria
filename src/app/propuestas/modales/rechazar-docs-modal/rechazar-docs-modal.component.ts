import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {Foto} from '../../../core/entities/solicitudes';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-rechazar-docs-modal',
  templateUrl: './rechazar-docs-modal.component.html',
  styleUrls: ['./rechazar-docs-modal.component.scss']
})
export class RechazarDocsModalComponent implements OnInit {
  @Input() img: string;
  @Input() miembro: {nombre1: string, nombre2: string, apellido1: string, apellido2: string};
  @Input() idSolicitud: string;
  mensajeCtrl: FormControl;

  constructor(public modal: NgbActiveModal) {
    this.mensajeCtrl = new FormControl('');
    this.mensajeCtrl.setValidators([]);
  }

  get nombres(): string {
    return this.miembro ? `${this.miembro.nombre1} ${this.miembro.nombre2} ${this.miembro.apellido1} ${this.miembro.apellido2}` : '';
  }

  ngOnInit(): void {
  }

  confirmar(): void {
    this.modal.close({mensajes: {motivo: this.mensajeCtrl.value}});
  }

}
