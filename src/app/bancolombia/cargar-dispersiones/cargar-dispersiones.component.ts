import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cargar-dispersiones',
  templateUrl: './cargar-dispersiones.component.html',
  styleUrls: ['./cargar-dispersiones.component.scss']
})
export class CargarDispersionesComponent implements OnInit {
  @Output() subirArchivo: EventEmitter<any> = new EventEmitter<any>();

  form: CargarCSVForm;

  constructor() {
    this.form = new CargarCSVForm();
   }

  ngOnInit(): void {
  }

  seleccionarArchivo({files}: HTMLInputElement): void {
    if (files.length > 0) {
      const file = files[0];
      this.form.patchValue({
        dispersionesRegistrar: file
      });
    }
  }

  _subirArchivo(): void {
    this.subirArchivo.emit(this.form.getRawValue());
    this.form.reset();
  }

}

class CargarCSVForm extends FormGroup {
  constructor() {
    super({
      dispersionesRegistrar: new FormControl()
    });
  }
}

