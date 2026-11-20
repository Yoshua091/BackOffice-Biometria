import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Permisos } from 'src/app/core/entities/permisos';
import { SessionService } from 'src/app/core/session.service';
import { PermisosComponentes } from 'src/app/core/types';
import { AlertButtons, AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit, AfterViewChecked {
  @ViewChild('CajaComentarios') cajaComentarios: ElementRef;
  @Input() solicitud: any;

  formComentario: ComentarioForm;
  permisos: Permisos[];
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    public session: SessionService,
    public modal: NgbModal,
  ) {
    const { _id } = this.route.snapshot.queryParams;
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.formComentario = new ComentarioForm({ _id, mensaje: '' });
  }

  ngAfterViewChecked(): void {
    const { nativeElement: element } = this.cajaComentarios;
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }

  ngOnInit(): void {
  }

  async agregarComentario(): Promise<void> {
    this.formComentario.markAllAsTouched();

    if (this.formComentario.valid) {
      try {
        const formObj: { _id: string, mensaje: string } = this.formComentario.getRawValue();
        await this.api.solicitudes.agregarComentario(formObj);
        this.formComentario.controls.mensaje.reset('');
        this.solicitud = (await this.api.solicitudes.buscarPorId({ _id: formObj._id })).data[0];
      } catch (e) {
        console.log(e);
      }
    }
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.PROPUESTAS);
    const { modulos } = componente.find(m => m?.id === 1);
    const { acciones } = modulos.find(m => m?.id === componenteId);
    const permisoacciones = acciones.find(m => m?.id === accion);

    if (permisoacciones?.id !== accion) {
      const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });

      info.title = 'Permiso';
      info.description = 'No tiene permisos';
      info.buttons = AlertButtons.INFO;
    } else {
      this.agregarComentario();
    }
  }


}

class ComentarioForm extends FormGroup {

  constructor(comentario: { _id: string, mensaje: string }) {
    super({
      _id: new FormControl(comentario._id),
      mensaje: new FormControl(comentario.mensaje)
    });

    this.controls.mensaje.setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(280),
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

