import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { REGEX } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Cliente, Solicitudes } from 'src/app/core/entities/solicitudes';

@Component({
  selector: 'app-modificar-datos-cliente',
  templateUrl: './modificar-datos-cliente.component.html',
  styleUrls: ['./modificar-datos-cliente.component.scss']
})
export class ModificarDatosClienteComponent implements OnInit {
  @Input() solicitud: Solicitudes;
  form: ModificarDatosClienteForm;

  miembro: Cliente[];
  _id: string;
  identificacion: string;
  constructor(
    public modal: NgbActiveModal,
    private api: ApiService,
  ) {
    this.form = new ModificarDatosClienteForm({} as ModificarDatosCliente);
  }

  ngOnInit(): void {
    this.miembro = this.solicitud.miembros;
  }

  mostrarDatos(identificacion: number) {
    const miembroFiltrado = this.miembro.filter(x => Number(x.datosIdentificacionCliente.numeroIdentificacion) === identificacion);
    console.log(miembroFiltrado)
    this.setCampos(miembroFiltrado)
  }

  setCampos(miembroFiltrado: any) {
    this.form.controls.telefono.setValue(miembroFiltrado[0].datosContactoCliente.telefono);
    this.form.controls.telefono1.setValue(miembroFiltrado[0].datosContactoCliente.telefono1);
    this.form.controls.email.setValue(miembroFiltrado[0].datosContactoCliente.email);
    this.form.controls.direccion.setValue(miembroFiltrado[0].datosContactoCliente.direccion);
    this.form.controls.barrio.setValue(miembroFiltrado[0].datosContactoCliente.barrio);
    this.form.controls.indicaciones.setValue(miembroFiltrado[0].datosContactoCliente.indicaciones);
    this._id = this.solicitud._id
    this.identificacion = miembroFiltrado[0].datosIdentificacionCliente.numeroIdentificacion

  }

  actualizarDatos() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      try {
        this.api.solicitudes.datosContactoCliente({
          _id: this._id,
          numeroIdentificacion: this.identificacion,
          ...this.form.getRawValue()
        }).then(response => {
          if (response.status === 200) {
            this.modal.close();
          }
        })
      } catch (error) {
        console.log(error);
      }

    }
  }

}


class ModificarDatosCliente {
  telefono: number;
  telefono1: number;
  email: string;
  direccion: string;
  barrio: string;
  indicaciones: string
  miembro: string;
  id: string;
  numeroIdentificacion: number;

}

export class ModificarDatosClienteForm extends FormGroup {

  constructor(datosCliente: ModificarDatosCliente) {
    super({
      email: new FormControl(datosCliente.email),
      direccion: new FormControl(datosCliente.direccion),
      telefono: new FormControl(datosCliente.telefono),
      telefono1: new FormControl(datosCliente.telefono1),
      barrio: new FormControl(datosCliente.barrio),
      indicaciones: new FormControl(datosCliente.indicaciones),
      miembro: new FormControl(datosCliente.miembro)
    });


    this.controls.email.setValidators([
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(REGEX.EMAIL),
    ]);

    this.controls.direccion.setValidators([
      Validators.maxLength(150),
    ]);

    this.controls.telefono.setValidators([
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(REGEX.CELLPHONE),
    ]);

    this.controls.telefono1.setValidators([
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(REGEX.CELLPHONE),
    ]);

    this.controls.barrio.setValidators([
      Validators.maxLength(50),
      Validators.pattern(REGEX.ALPHANUMERIC),
    ]);

    this.controls.indicaciones.setValidators([
      Validators.maxLength(150),
      Validators.pattern(REGEX.ALPHANUMERIC),
    ]);

    this.controls.miembro.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    delete raw.miembro;

    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

