import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cargar-csv-renovaciones',
  templateUrl: './cargar-csv-renovaciones.component.html',
  styleUrls: ['./cargar-csv-renovaciones.component.scss']
})
export class CargarCsvRenovacionesComponent implements OnInit {

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
        RenovacionLotesRegistrar: file
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
      RenovacionLotesRegistrar: new FormControl()
    });
  }
}
