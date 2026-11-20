import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Referencias, ReferenciaTipo} from '../../../core/entities/referencias';
import {Cliente} from '../../../core/entities/solicitudes';
import { SessionService } from 'src/app/core/session.service';

@Component({
  selector: 'app-confirmar-ref',
  templateUrl: './confirmar-ref.component.html',
  styleUrls: ['./confirmar-ref.component.scss']
})
export class ConfirmarRefComponent implements OnInit {

  @Input() referencias: Referencias[];
  @Input() clienteNombre: any;
  @Input() clienteTelefono: any;

  form: ConfirmarRefForm;

  constructor(public modal: NgbActiveModal, public session: SessionService) {
  }

  ngOnInit(): void {
    this.form = new ConfirmarRefForm(this.referencias);
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.modal.close(this.form.getRawValue());
    }
  }
}

class ConfirmarRefForm extends FormGroup {

  constructor(referencias: Referencias[]) {
    super({
      preguntas: new FormArray(referencias.map<FormGroup>(r => new FormGroup({
        _id: new FormControl(r._id),
        _rev: new FormControl(r._rev),
        pregunta: new FormControl(r.pregunta),
        tipo: new FormControl(r.tipo),
        respuestas: new FormControl(r.respuestas),
        respuestaCliente: new FormControl(r.respuestaCliente),
        lonMax: new FormControl(r.lonMax),
      })))
    });

    this.preguntas.controls.forEach(pregunta => (pregunta as FormGroup).controls.respuestaCliente.setValidators([Validators.required]));
  }

  get preguntas(): FormArray {
    return this.controls.preguntas as FormArray;
  }

  findPregunta(i: number): FormGroup {
    return this.preguntas.at(i) as FormGroup;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
