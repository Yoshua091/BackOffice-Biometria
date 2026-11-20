import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cargar-historico',
  templateUrl: './cargar-historico.component.html',
  styleUrls: ['./cargar-historico.component.scss']
})
export class CargarHistoricoComponent implements OnInit {
  @Output() subirArchivo: EventEmitter<any> = new EventEmitter<any>();

  form: CargarCSVForm;

  constructor() {
    this.form = new CargarCSVForm();
  }

  ngOnInit(): void {
  }

  seleccionarArchivo({ files }: HTMLInputElement): void {
    if (files.length > 0) {
      const file = files[0];
      this.form.patchValue({
        historicosRegistrar: file
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
      historicosRegistrar: new FormControl()
    });
  }
}
