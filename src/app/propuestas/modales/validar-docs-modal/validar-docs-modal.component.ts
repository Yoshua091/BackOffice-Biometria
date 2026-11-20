import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Foto } from '../../../core/entities/solicitudes';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { TemplateElement } from '@angular/compiler-cli/src/ngtsc/translator';
import { Permisos } from 'src/app/core/entities/permisos';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { PermisosComponentes, TipoSolicitud } from 'src/app/core/types';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EstadoSolicitud } from 'src/app/core/pipes/estado-solicitud.pipe';
import { SessionService } from 'src/app/core/session.service';
import { toArray } from 'rxjs/operators';

@Component({
  selector: 'app-validar-docs-modal',
  templateUrl: './validar-docs-modal.component.html',
  styleUrls: ['./validar-docs-modal.component.scss']
})
export class ValidarDocsModalComponent implements OnInit {

  // evento emitido cuando cambia el documento visualizado.
  // Ayuda a saber cuando buscar un nuevo adjunto.
  @Output() documentoChange: EventEmitter<string> = new EventEmitter<string>();

  // evento emitido cuando cambia el estado de aprobacion del documento.
  @Output() aprobacionChange: EventEmitter<any> = new EventEmitter();

  // atributos expuestos del componente
  @Input() documentos: Subject<{ [key: string]: Foto }>; // listado de objetos tipo Foto para mapear a @aprobarImgFormList.
  @Input() modo: ModoModalAprobarImagen; // el modo de renderización del modal de verificación de documentos.
  @Input() declaracionFondos: string; // el modo de renderización del modal de verificación de documentos.
  @Input() validarEncabezado: number;
  @Input() tipoSolicitud: any;
  @Input() estadoSolicitud: number;

  // formularios reactivos de aprobación de una imagen.
  // Son usados para vigilar el check de aprobacion y hacer las validaciones correspondientes.
  aprobarImgForms: { [key: string]: AprobarImagenForm };

  // listado de adjuntos base 64 que han sido consultados
  imagenes$: { nombre: string, base64: string }[] = [];

  imagenesObligatorias$: { nombre: string, label: string, obligatoria: boolean, encontrada: boolean }[] = [];


  // documentos seleccionado actualmente en el listado.
  // Sirve para extraer el adjunto desde imagenes$ o para cambiar el estado de aprobacion.
  seleccionado: string;

  // claves de los nombres de los documentos.
  // Corresponden a las propiedades del objeto fotos de cada miembro
  keys: string[];

  // indica si el modal se mantiene abierto despues de aprobar/rechazar un documento
  mantenerAbierto = true;

  // instancia del modal de fotos en modo detalle
  detalleFotoModal: NgbModalRef;

  permisos: Permisos[];
  estado: number;
  habilitarBoton: boolean

  constructor(public modal: NgbActiveModal, private modalService: NgbModal, private modalAlert: NgbModal, private sanitizer: DomSanitizer,
    public session: SessionService) {
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.documentos = new Subject<{ [key: string]: Foto }>();

    // debugger;
    // this.documentos.subscribe((documentosObj: { [key: string]: Foto }) => {
    //   // Convertir el objeto de documentos a un array de fotos
    //   const documentosArray = Object.values(documentosObj);

    //   // Verificar cada foto obligatoria y agregarla si no está presente
    //   this.imagenesObligatorias$.forEach(foto => {
    //     // Verificar si la foto no está presente en el array de documentos
    //     const fotoEncontrada = documentosArray.find(doc => doc.nombre === foto.nombre);
    //     if (!fotoEncontrada) {
    //       // Crear un elemento de Foto para la foto actual con valores predeterminados
    //       const nuevaFoto: any = {
    //         id: null, // Asignar un ID adecuado si es necesario
    //         Nombreid: null, // Asignar un nombre de ID adecuado si es necesario
    //         nombre: foto.nombre, // Nombre de la foto
    //         aprobada: 0 // Estado predeterminado de aprobación
    //       };
    //       // Agregar la foto al array de documentos
    //       documentosArray.push(nuevaFoto);
    //     }
    //   });

    //   this.documentos.next(documentosArray.reduce((acc, foto) => {
    //     acc[foto.keyNombre] = foto;
    //     return acc;
    //   }, {} as { [key: string]: any }));
    // });


    this.documentos.subscribe(obj => {
      this.keys = Object.keys(obj);
    
      const keysComplementarias = ['fotoComplementaria3', 'fotoComplementaria4', 'fotoComplementaria5'];
    
      this.aprobarImgForms = this.keys.reduce<{ [key: string]: AprobarImagenForm }>((map, key) => {
        const form = new AprobarImagenForm(obj[key]);
    
        // Si la key es una de las complementarias, ajustar el título
        if (keysComplementarias.includes(key)) {
          const tituloActual = form.controls.titulo.value;
          if (tituloActual) {
            form.controls.titulo.setValue(`${tituloActual} /información complementaria`);
          }
        }
    
        map[key] = form;
        return map;
      }, {} as { [key: string]: AprobarImagenForm });
    
      if (this.modo === ModoModalAprobarImagen.Firmas) {
        const docAnvIdx = this.keys.findIndex(k => k.toLowerCase().includes('documentoanverso'));
        const documentoAnverso = this.aprobarImgForms[this.keys[docAnvIdx]].controls.nombre.value;
        this.documentoChange.emit(documentoAnverso);
      }
      console.log(this.aprobarImgForms);
    
      const seleccionadoDefaultIdx = this.modo === ModoModalAprobarImagen.Firmas ? 1 : 0;
    
      let seleccionadoIdx = this.seleccionado ?
        this.keys.findIndex(k => k === this.seleccionado) : seleccionadoDefaultIdx;
      seleccionadoIdx = this.seleccionado && seleccionadoIdx + 1 < this.keys.length ? seleccionadoIdx + 1 : seleccionadoIdx;
    
      this.seleccionado = this.keys[seleccionadoIdx];
    
      this.estado = this.estadoSolicitud;
      this.habilitarBoton = false;
      this.estado === EstadoSolicitud.ValidacionGerente || this.estado === EstadoSolicitud.ValidacionAsistente ||
        this.estado === EstadoSolicitud.ValidacionIdentidad ? this.habilitarBoton = false : this.habilitarBoton = true;
      for (const [id, keyFoto] of Object.entries(this.keys)) {
        if (keyFoto == 'firmaGarantia' && TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.tipoSolicitud) {
          this.documentoChange.emit(this.currentForm.controls.nombre.value);
          break;
        } else {
          undefined;
        }
      }
    
      this.documentoChange.emit(this.currentForm.controls.nombre.value);
      this.cerrarModal();
    });
    }

  get currentForm(): AprobarImagenForm {
      return this.aprobarImgForms[this.seleccionado];
    }

  ngOnInit(): void {
    }

  _documentoChange(ev: NgbNavChangeEvent): void {
      this.documentoChange.emit(this.aprobarImgForms[ev.nextId].controls.nombre.value);
    }

  obtenerImagen(nombre: string): string {

      // return this.validarEncabezado === 1 ? this.imagenServerEstatico(nombre) : this.imagenBaseDatos(nombre);
      return this.imagenServerEstatico(nombre)
    }

  imagenServerEstatico(nombre: string): string {
      const img = this.imagenes$.find(item => item.nombre === nombre);
      //  const url = img ? img.base64 : ''
      // return this.sanitizer.bypassSecurityTrustUrl(url);
      return img ? img.base64 : '';
    }

  aprobarImagen(estado: number): void {
      if(!this.currentForm.controls.estado.value && estado === 1 && this.modo === ModoModalAprobarImagen.Documentos) {
      this.currentForm.controls.estado.setValidators([() => ({ required: true })]);
      this.currentForm.controls.estado.updateValueAndValidity();
    } else {
      this.aprobacionChange.emit({ ...this.currentForm.getRawValue(), encabezado: this.validarEncabezado, ...{ estado }, });
    }

    this.mantenerAbierto = false;
  }

  cerrarModal(): void {
    const estadoDocumento = this.keys.every(x =>
      this.modo === ModoModalAprobarImagen.Firmas && x === 'fotoDocumentoAnverso' ? true :
        this.aprobarImgForms[x].controls.aprobada.value !== 0);
    if (!this.mantenerAbierto && estadoDocumento) {
      this.modal.close();
    }
  }

  nivelDetalleFoto(template: TemplateRef<any>, instance: any): void {
    this.modalService.open(template, { centered: true, size: 'lg' });
  }

  permisosModulos(estado: number, accion: number): any {
    const componenteId = this.modo === ModoModalAprobarImagen.Documentos ? 1 : 2;
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.PROPUESTAS);
    const { modulos } = componente.find(m => m?.id === 1);
    const { acciones } = modulos.find(m => m?.id === componenteId);
    const permisoacciones = acciones.find(m => m?.id === accion);

    if (permisoacciones?.id !== accion) {
      const { componentInstance: info } = this.modalAlert.open(AlertComponent, { centered: true });

      info.title = 'Permiso';
      info.description = 'No tiene permisos';
      info.buttons = AlertButtons.INFO;
    } else {
      this.aprobarImagen(estado);
    }
  }

}

export enum ModoModalAprobarImagen {
  Documentos,
  Firmas,
}

class AprobarImagenForm extends FormGroup {
  constructor(element: Foto) {
    super({
      idImagen: new FormControl(element.id),
      nombre: new FormControl(element.Nombreid),
      titulo: new FormControl(element.nombre),
      estado: new FormControl(element.aprobada === 1), // el req modificar/imagen usa el atributo @estado, no @aprobada
      aprobada: new FormControl(element.aprobada), // @aprobada -> este es solo para el icono check/rejected en el listado.
    });
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    delete raw.aprobada;

    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
