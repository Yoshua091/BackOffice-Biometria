import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import JSONEditor from 'jsoneditor';
import { diff } from 'jsondiffpatch';
import { ApiService, ResponseStruct } from 'src/app/core/data/api.service';

import { EnviarSolicitudModalComponent } from '../modales/enviar-solicitud-modal/enviar-solicitud-modal.component';
import { SolicitudesSoporte } from 'src/app/core/entities/solicitudes-soporte';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  form: ConsultarSolicitudForm;
  solicitud: ResponseStruct<SolicitudesSoporte>;
  editor: JSONEditor;
  sendInfo: boolean = false;

  private options = {
    "language": "es",
    "enableTransform": false,
    "limitDragging": true,
    "history": true,
    "enableSort": false,
    "maxVisibleChilds": 50
  }

  constructor(private modal: NgbModal, private api: ApiService) { 
    this.form = new ConsultarSolicitudForm();
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(()=>{
      if(this.editor){
        this.editor.destroy();
      }
    });
    var container = document.getElementById("jsoneditor");
    this.editor = new JSONEditor(container, this.options);
    this.editor.destroy();
  }

  async enviarJSON(){
    try {
      const changes = diff(this.solicitud.data, this.editor.get());     
      const {componentInstance, result} = this.modal.open(EnviarSolicitudModalComponent, {centered: true, windowClass: 'modal-rechazo'});
      componentInstance.elementos = changes;
      componentInstance.idSolicitud = this.form.controls.id_solicitud.value;
      const { mensajes } = await result;
      if(mensajes.motivo){
        const resp = await this.api.solicitudesSoporte.modificarSolicitud({solicitud: this.editor.get(), cambios: changes, motivo: mensajes.motivo});
        if(resp.status = 200){
          this.editor.destroy();
          this.form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    
    if (this.editor) {
      this.editor.destroy();
    }

    if (this.form.valid) {
      try {
        const raw = this.form.getRawValue();
        this.sendInfo = true;
        if ((raw.id_solicitud as string).length > 16) {
          let response = await this.api.solicitudesSoporte.buscarPorId({ _id: raw.id_solicitud });
          response.data = response.data[0];
          this.solicitud = response;
        } else {
          this.solicitud = await this.api.solicitudesSoporte.buscarPorIdSolicitud({ idSolicitud: raw.id_solicitud });
        }
        var container = document.getElementById("jsoneditor");
        this.editor = new JSONEditor(container, this.options);
        this.editor.set(this.solicitud?.data || {} );
        this.editor.expandAll();
      } catch (e) {
        this.editor.destroy();
        this.sendInfo = false;
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

}

declare type ConsultarSolicitudFormControls = { [key: string]: any } & { id_solicitud: FormControl };

class ConsultarSolicitudForm extends FormGroup {

  controls: ConsultarSolicitudFormControls;

  constructor() {
    super({id_solicitud: new FormControl()});

    this.controls.id_solicitud.setValidators([Validators.required]);
  }
}