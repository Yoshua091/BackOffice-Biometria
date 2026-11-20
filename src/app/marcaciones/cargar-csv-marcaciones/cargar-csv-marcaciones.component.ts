import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cargar-csv-marcaciones',
  templateUrl: './cargar-csv-marcaciones.component.html',
  styleUrls: ['./cargar-csv-marcaciones.component.scss']
})
export class CargarCsvMarcacionesComponent implements OnInit {

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
        MarcacionLotesRegistrar: file
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
      MarcacionLotesRegistrar: new FormControl()
    });
  }
}
