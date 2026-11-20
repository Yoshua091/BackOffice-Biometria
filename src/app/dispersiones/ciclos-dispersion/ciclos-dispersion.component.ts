import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { LotesDispersion } from 'src/app/core/entities/lotes-dispersion';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { DetalleLotesDispersionesComponent } from '../modales/detalle-lotes-dispersiones/detalle-lotes-dispersiones.component';

@Component({
  selector: 'app-ciclos-dispersion',
  templateUrl: './ciclos-dispersion.component.html',
  styleUrls: ['./ciclos-dispersion.component.scss']
})
export class CiclosDispersionComponent implements OnInit {
  paginador = {cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1};
  form: CiclosDispersionFiltroForm;
  dataTabla: any[] = [];
  mostrarTabla: boolean;
  maxDate: any;
  noHayDatos: boolean
  errores: String;
  habilitarDetalle: boolean;
  canales: any
  estados: any;
  estadoDispersion: any;

  mostrarDatos: any[];
  
  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }
  constructor(
    private api: ApiService,
    private modal: NgbModal
  ) {
    this.form = new CiclosDispersionFiltroForm();
    this.canales = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.dispersiones.canales;
    this.estados = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.dispersiones.estadoLote;
    this.mostrarTabla = false;
    this.noHayDatos = false
    const today = new Date();
    this.habilitarDetalle = false;
    this.maxDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

  ngOnInit(): void {
  }

  


  async filtrar(): Promise<void> {
    this.form.markAllAsTouched();
    let fechaInicial = new Date();
    let fechaFinal = new Date();
    fechaInicial = this.form.controls.fechaInicial.value;
    fechaFinal = this.form.controls.fechaFinal.value
  
    if (this.form.valid) {
  
      try {
        const { canal, fechaInicial, fechaFinal } = this.form.getRawValue();
        const { data } = await this.api.dispersiones.getCanalFechas(canal, fechaInicial, fechaFinal);
        this.dataTabla = data;
        this.mostrarTabla = this.dataTabla.length > 0 ? true : false;
        this.noHayDatos = this.dataTabla.length > 0 ? false : true;
        
        // Calcula el índice de inicio y fin de la página actual
        const startIndex = (this.paginador.pagina - 1) * this.paginador.cantidadPagina;
        const endIndex = startIndex + this.paginador.cantidadPagina;

        this.mostrarDatos = [];

          // Asigna los datos de la página actual a mostrarDatos
          const tablaIndex = this.dataTabla.slice(startIndex, endIndex);
  
          // Calcula la cantidad total de elementos para la paginación
          this.paginador.cantidad = this.dataTabla.length;

          tablaIndex.forEach((x => {
          for (const objetoEstado of this.estados) {
            if (x.estado === objetoEstado.id) {
               this.estadoDispersion = objetoEstado.estado;
              this.crearObjeto(x, this.estadoDispersion)
            }
          }
        }))
  
        this.detalleLotes();
      } catch (e) {
        console.log(e);
        this.noHayDatos = e.error.data.length > 0 ? false : true; 
        this.mostrarTabla = e.error.data.length > 0 ? true : false; 
      }
    } else {
      const result = this.modal.open(AlertComponent, { centered: true });
      result.componentInstance.title = 'Acción requerida';
      result.componentInstance.description = 'La fecha final debe ser mayor que la fecha inicial';
      result.componentInstance.buttons = AlertButtons.INFO;
    }
  }
  

  crearObjeto(objeto, estado) {
    this.mostrarDatos.push({
      createdAt: objeto.createdAt,
      nombreLote: objeto.nombreLote,
      estado: estado,
      numeroDeRegistros: objeto.proceso.numeroDeRegistros,
      registrosConfirmados: objeto.proceso.registrosConfirmados,
      id: objeto._id
    });
  }
  detalle(element): void {
    const { componentInstance } = this.modal.open(DetalleLotesDispersionesComponent, { centered: true, windowClass: 'modal-detalle-dispersiones' });
    componentInstance.element = element;
  }

  detalleLotes(): void {
    for (let i = 0; i < this.dataTabla.length; i++) {
      if (this.dataTabla[i].estado.id === 100) {
        this.habilitarDetalle = false;
      } else {
        this.habilitarDetalle = true;
      }
    }
  }

  TienePropiedad(objeto, propiedad) {
    return typeof objeto !== 'undefined' && objeto.hasOwnProperty(propiedad);
  }



}


class CiclosDispersionFiltroForm extends FormGroup {
  constructor() {
    super({
      canal: new FormControl(1),
      fechaInicial: new FormControl(moment()
      .format('DD-MM-YYYY')),
      fechaFinal: new FormControl(moment()
      .format('DD-MM-YYYY')),
    });

    this.controls.canal.setValidators([
      Validators.required,
    ]);

    this.controls.fechaInicial.setValidators([
      Validators.required,
    ]);

    this.controls.fechaFinal.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    raw.fechaInicial = moment(raw.fechaInicial, 'DD-MM-YYYY').format('YYYY-MM-DD');
    raw.fechaFinal = moment(raw.fechaFinal, 'DD-MM-YYYY').format('YYYY-MM-DD');
    raw.canal = Number(raw.canal)

    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
