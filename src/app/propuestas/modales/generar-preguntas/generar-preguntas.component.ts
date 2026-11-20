import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generar-preguntas',
  templateUrl: './generar-preguntas.component.html',
  styleUrls: ['./generar-preguntas.component.scss']
})
export class GenerarPreguntasComponent implements OnInit {

  @Input() data: any;
  @Output() respuestasEnviadas = new EventEmitter<any[]>(); // Nuevo EventEmitter
  respuestaSeleccionada: any = {};

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  enviarRespuestas(form: NgForm) {
    if (form.valid) {
      const respuestas = [];
      for (const pregunta of this.data.preguntas) {
        const respuestaId = this.respuestaSeleccionada[pregunta.idPregunta];
        if (respuestaId) {
          respuestas.push({ idPregunta: pregunta.idPregunta, idRespuesta: respuestaId });
        }
      }
      //
      this.respuestasEnviadas.emit(respuestas);
      console.log(respuestas)
      this.modal.close();
    }
  }
}
