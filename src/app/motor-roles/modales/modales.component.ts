import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';
import { SessionService } from 'src/app/core/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modales',
  templateUrl: './modales.component.html',
  styleUrls: ['./modales.component.scss']
})
export class ModalesComponent implements OnInit {


  @Output() subirArchivo: EventEmitter<any> = new EventEmitter<any>();
  @Input() loteEstado: number;

  form: CargarCSVForm;
  mensajeBotonCargueValores: string = '';
  tipoLote: string = '';

  constructor(public modal: NgbActiveModal, private api: ApiService, private session: SessionService) {
    this.form = new CargarCSVForm();
  }

  ngOnInit(): void {
  }

  seleccionarArchivo({ files }: HTMLInputElement): void {
    if (files.length > 0) {
      const file = files[0];
      this.form.patchValue({
        ValidarReglas: file
      });
    }
  }

  async onSubirArchivos(): Promise<void> {
    const ValidarReglas = this.form.controls.ValidarReglas.value;

    if (!!ValidarReglas) {
      const formData = new FormData();
      formData.append('ValidarReglas', ValidarReglas);

      try {
        this.tipoLote = (this.loteEstado === 1) ? 'dev' : 'prod';

        const response = await this.api.motor.validarLoteReglasMotor(formData, this.tipoLote);
        if (response && response.data) {
          this.form.reset();
          const textContent = response.data
          this.downloadTextFile(textContent, 'archivo.txt');
          this.modal.close();
        }
      } catch (e) {
        if (!environment.production) {
          console.error(e);
        }
      }
    }
  }

  downloadTextFile(content: string, fileName: string): void {
    // Crear un objeto Blob a partir del contenido
    const blob = new Blob([content], { type: 'text/plain' });

    // Crear una URL para el objeto Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un elemento <a> para iniciar la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    // Agregar el elemento al DOM y hacer clic en él para descargar
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


}

class CargarCSVForm extends FormGroup {

  constructor() {
    super({
      ValidarReglas: new FormControl()
    });
  }
}

