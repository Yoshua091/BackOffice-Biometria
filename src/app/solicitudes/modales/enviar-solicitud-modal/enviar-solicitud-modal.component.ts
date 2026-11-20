import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import JSONEditor from 'jsoneditor';

@Component({
  selector: 'app-enviar-solicitud-modal',
  templateUrl: './enviar-solicitud-modal.component.html',
  styleUrls: ['./enviar-solicitud-modal.component.scss']
})
export class EnviarSolicitudModalComponent implements OnInit {

  _elementos: any;
  hayCambios: boolean = true;
  @Input() set elementos(value: any){
    if (value) {
      this._elementos = value;
      this.hayCambios = true;
    }else{
      this.hayCambios = false;
    }
  };

  @Input() idSolicitud: string;
  mensajeCtrl: FormControl;
  editor: JSONEditor;
  
  private options = {
    "language": "es",
    "enableTransform": false
  }

  constructor(public modal: NgbActiveModal) {
    this.mensajeCtrl = new FormControl('');
    this.mensajeCtrl.setValidators([]);
  }

  ngOnInit(): void {
    if (this.hayCambios) {
      var container = document.getElementById("json-editor-diff");
      this.editor = new JSONEditor(container, this.options);
      this.editor.set(this._elementos);
      this.editor.setMode('view');
      this.editor.expandAll();
    }
  }

  confirmar(): void {
    if (this.mensajeCtrl.value == "") {
      this.mensajeCtrl.setValidators([Validators.required]);
      this.mensajeCtrl.updateValueAndValidity();
    }else{
      this.modal.close({mensajes: {motivo: this.mensajeCtrl.value}});
    }
  }

}
