import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { REGEX } from '../core/constants';
import { ApiService } from '../core/data/api.service';
import { Sucursal } from '../core/entities/sucursal';

class AtribucionesFormStruct {
  _id: string;
  monto: string;
  plazo: string;
}

class AtribucionesForm extends FormGroup {
  constructor(atribucion: AtribucionesFormStruct) {
    super({
      monto: new FormControl(atribucion.monto, [
        Validators.required,
        Validators.pattern(REGEX.CELLPHONE),
      ]),
      plazo: new FormControl(atribucion.plazo, [
        Validators.required,
        Validators.pattern(REGEX.NUMERIC),
      ]),
    });
  }
}

@Component({
  selector: 'app-atribuciones',
  templateUrl: './atribuciones.component.html',
  styleUrls: ['./atribuciones.component.scss']
})
export class AtribucionesComponent implements OnInit {

  sucursales: any[] = [];
  sucursales$: Observable<Sucursal[]>;
  filter = new FormControl('');
  aviso: boolean = true;
  form: FormGroup;  // Un único formulario principal

  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      // Puedes agregar controles globales aquí si los necesitas
    });
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async cargarTodos(): Promise<void> {
    try {
      const { data } = await this.api.sucursales.buscar();
      this.sucursales = data.sort((a, b) => Number(a.idSucursal) - Number(b.idSucursal));

      // Crear formularios para cada sucursal
      this.sucursales.forEach(sucursal => {
        const atribucionesForm = new AtribucionesForm({
          _id: sucursal._id,
          monto: sucursal.montoMaxAprobacionGrte || 0,
          plazo: sucursal.plazoMaxAprobacionGrte || 0
        });
        this.form.addControl(String(sucursal._id), atribucionesForm);
      });
      

    } catch (e) {
      console.log(e);
    }
  }

  getFormGroup(sucursal: Sucursal): FormGroup {
    const sucursalId = String(sucursal._id)
    return this.form.get(sucursalId) as FormGroup;
  }

  submit() {
    if (this.form.valid) {
      try {
        this.api.sucursales.atribucionesModificar(this.form.getRawValue())

      } catch (e) {
        console.log(e);
      }
    }
  }

  enviarFormulario(sucursal: Sucursal): void {

    if (this.form.valid) {
      try {
        const formulario = this.getFormGroup(sucursal);
        const valoresModificados = formulario.getRawValue();

        // Lógica para enviar solo los campos modificados (valoresModificados)
        console.log('Campos modificados:', valoresModificados);

        // Puedes llamar a tu servicio API aquí para enviar los datos modificados
        this.api.sucursales.atribucionesModificar({...valoresModificados, _id: sucursal._id})

      } catch (e) {
        console.log(e);
      }
    }
  }
}
