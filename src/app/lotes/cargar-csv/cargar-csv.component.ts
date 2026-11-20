import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-cargar-csv',
  templateUrl: './cargar-csv.component.html',
  styleUrls: ['./cargar-csv.component.scss']
})
export class CargarCsvComponent {

  @Output() subirArchivo: EventEmitter<any> = new EventEmitter<any>();

  form: CargarCSVForm;

  constructor() {
    this.form = new CargarCSVForm();
  }

  seleccionarArchivo({files}: HTMLInputElement): void {
    if (files.length > 0) {
      const file = files[0];
      this.form.patchValue({
        CarteraLotesRegistrar: file
      });
    }
  }

  _subirArchivo(file: HTMLInputElement): void {
    this.subirArchivo.emit(this.form.getRawValue());
    this.form.reset();
    file.value = null;
  }
}

class CargarCSVForm extends FormGroup {
  constructor() {
    super({
      CarteraLotesRegistrar: new FormControl()
    });
  }
}
