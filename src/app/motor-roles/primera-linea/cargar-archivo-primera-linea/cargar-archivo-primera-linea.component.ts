import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionService } from 'src/app/core/session.service';

@Component({
  selector: 'app-cargar-archivo-primera-linea',
  templateUrl: './cargar-archivo-primera-linea.component.html',
  styleUrls: ['./cargar-archivo-primera-linea.component.scss']
})
export class CargarArchivoPrimeraLineaComponent implements OnInit {


  @Output() subirArchivo: EventEmitter<any> = new EventEmitter<any>();
  titulo: string = '';
  form: CargarCSVForm;
  mostrarCargueReglas: boolean;

  constructor(private session: SessionService) { 
    this.form = new CargarCSVForm();
    this.session.user.rol.id === 11 ? this.titulo = 'Primera': this.titulo = 'Segunda'
    this.session.user.rol.id === 11 ? this.mostrarCargueReglas = true : this.mostrarCargueReglas = false;
  }

  ngOnInit(): void {
  }

  seleccionarArchivo({files}: HTMLInputElement): void {
    if (files.length > 0) {
      const file = files[0];
      this.form.patchValue({
        ReglasMotor: file
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
      ReglasMotor: new FormControl()
    });
  }
}
