import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';
import { STORAGE_KEYS } from '../core/constants';

import {ApiService, ResponseStruct} from '../core/data/api.service';
import { Permisos } from '../core/entities/permisos';
import { PermisosComponentes } from '../core/types';
import { AlertButtons, AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  formSabanasDatos: SabanasDatosForm;
  formVentaSeguro: FormGroup = new FormGroup({});
  formReportesAltair: ReportesAltairForm;
  formAsociacionCuentas: AsociacionCuentasForm;
  dias: any[];
  permisos: Permisos[];
  tienePermiso: boolean;

  opcionesVinculacion: {nombre: string; tipo: number}[];
  opcionesReportes: {nombre: string; ruta: string, archivo: string}[];

  constructor(private api: ApiService, private route: ActivatedRoute, private modal: NgbModal) {
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.tienePermiso = false;
    const {data: opcionesVinculacion} = this.route.snapshot.data.opcionesVinculacion as ResponseStruct<{nombre: string; tipo: number}[]>;
    const {data: opcionesReportes} = this.route.snapshot.data.opcionesReportes as ResponseStruct<{nombre: string; ruta: string; archivo: string}[]>;
    this.opcionesVinculacion = opcionesVinculacion;
    this.opcionesReportes = opcionesReportes;
    this.formReportesAltair = new ReportesAltairForm();
    this.formSabanasDatos = new SabanasDatosForm(opcionesReportes[0]);
    this.formAsociacionCuentas = new AsociacionCuentasForm();

  }

  ngOnInit(): void {
  }

  async descargarSabanasDatos(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      this.formSabanasDatos.markAllAsTouched();

      if (this.formSabanasDatos.valid) {
        const reporte = this.opcionesReportes.find(r => this.formSabanasDatos.getRawValue().ruta === r.ruta);
        const csv = await this.api.solicitudes.sabanasDatos(this.formSabanasDatos.getRawValue());
        const blob: Blob = new Blob([csv]);

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${reporte.archivo}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }

  async descargarVinculacionCuentas(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      this.formAsociacionCuentas.markAllAsTouched();

      if (this.formAsociacionCuentas.valid) {
        const csv = await this.api.solicitudes.vinculacionCuentas(this.formAsociacionCuentas.getRawValue());
        const blob: Blob = new Blob([csv]);

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `InscripcionCuentas${moment().format('DDMMYYYYHHmmSS')}.txt`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }

  compareDiaSelect(a: {}, b: {}): boolean {
    return true;
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.REPORTES);
    const {modulos} = componente.find(m => m?.id === 5);
    const {acciones} = modulos.find(m => m?.id === componenteId);
    const permisoacciones = acciones.find(m => m?.id === accion);

    if (permisoacciones?.id !== accion){
      this.tienePermiso = false;
      const {componentInstance: info} = this.modal.open(AlertComponent, {centered: true});

      info.title = 'Permiso';
      info.description = 'No tiene permisos';
      info.buttons = AlertButtons.INFO;
    } else {
      this.tienePermiso = true;
    }
  }

  get tipoReporteAltair(): AbstractControl{
    return this.formReportesAltair.get('tipo');
  }

}

class SabanasDatosForm extends FormGroup {

  constructor(ruta) {
    super({
      ruta: new FormControl(ruta || ''),
      inicio: new FormControl(moment()
        .subtract(1, 'days')
        .format('DD-MM-YYYY')),
      fin: new FormControl(moment()
        .subtract(1, 'days')
        .format('DD-MM-YYYY')),
    });
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    raw.inicio = moment(raw.inicio, 'DD-MM-YYYY').format('YYYY-MM-DD');
    raw.fin = moment(raw.fin, 'DD-MM-YYYY').format('YYYY-MM-DD');

    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

class AsociacionCuentasForm extends FormGroup {
  constructor() {
    super({
      tipo: new FormControl(1),
    });
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
class ReportesAltairForm extends FormGroup {
  constructor() {
    super({
      tipo: new FormControl(1),
    });
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
