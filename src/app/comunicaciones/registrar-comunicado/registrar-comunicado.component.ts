import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { arrayBufferToBase64, STORAGE_KEYS } from 'src/app/core/constants';
import { Categoria } from 'src/app/core/entities/categoria';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { AppDateAdapterFormatter } from 'src/app/template/template-date-picker-adapter.service';

@Component({
  selector: 'app-registrar-comunicado',
  templateUrl: './registrar-comunicado.component.html',
  styleUrls: ['./registrar-comunicado.component.scss'],
  providers: [AppDateAdapterFormatter],
})
export class RegistrarComunicadoComponent implements OnInit {
  @Output() subirArchivo: EventEmitter<any> = new EventEmitter<any>();


  form: ComunicadoForm;
  minFecha: NgbDateStruct;
  listCategoria: Categoria[] = [];

  constructor(
    private ngbDateAdapter: AppDateAdapterFormatter,
    private modal: NgbModal) {
    this.listCategoria  = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG2)).categorias || [];
    this.form = new ComunicadoForm({} as ComunicacionesFormStruct);
    this.form.controls.comunicado.setValue('');
    this.form.controls.titulo.setValue('');
    this.minFecha = this.ngbDateAdapter.fromModel(moment().format(`DD-MM-YYYY`));
  }

  ngOnInit(): void {
  }

  seleccionarArchivo({ files }: HTMLInputElement) {
    const size = files[0].size;
    const sizeMB = 400000
    if (files.length > 0 && size <= sizeMB) {
      var file = files[0];

      this.form.patchValue({
        base64: file
      });
    } else {
      const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });

      info.title = 'Acción requerida';
      info.description = 'El archivo supera los 400Kb';
      info.buttons = AlertButtons.INFO;
    }
  }

  getBase64(file) {
    var fileReader = new FileReader();
    if (file) {
      fileReader.readAsDataURL(file);
    }
    return new Promise((resolve, reject) => {
      fileReader.onload = (event) => {
        resolve(event.target.result.slice(28));
      };
    })
  }

  async _subirArchivo() { 
    this.form.markAllAsTouched();
    if (this.form.valid) {
      
    var fileToLoad = this.form.controls.base64.value;
    const base64 = await this.getBase64(fileToLoad)
    this.form.controls.base64.setValue(base64)
      this.subirArchivo.emit(this.form.getRawValue());
      this.form.reset();
    }
  }

}




class ComunicacionesFormStruct {
  seccion: string;
  vigencia: string;
  comunicado: string;
  base64: any;
  titulo: string;
}


class ComunicadoForm extends FormGroup {
  constructor(comunicado: ComunicacionesFormStruct) {
    super({
      seccion: new FormControl(comunicado.seccion),
      vigencia: new FormControl(comunicado.vigencia),
      comunicado: new FormControl(comunicado.comunicado),
      titulo: new FormControl(comunicado.titulo),
      base64: new FormControl(comunicado.base64)
    });

    this.controls.seccion.setValidators([
      Validators.required,
    ]);

    this.controls.vigencia.setValidators([
      Validators.required,
    ]);

    this.controls.comunicado.setValidators([
      Validators.required,   
      Validators.minLength(1),
      Validators.maxLength(250),
    ]);

    this.controls.titulo.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]);

    this.controls.base64.setValidators([
      Validators.required,
    ]);
  }


 getRawValue(): any {
    const value = super.getRawValue();

    value.vigencia =  moment(value.vigencia, 'DD-MM-YYYY').format('YYYY-MM-DD');

    return value;
  }


  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
