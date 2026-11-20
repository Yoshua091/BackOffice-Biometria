import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Solicitudes} from 'src/app/core/entities/solicitudes';
import {Cliente} from 'src/app/core/entities/solicitudes';
import {PermisosComponentes, TiposMiembro} from 'src/app/core/types';
import {CobranzasService} from '../cobranzas.service';
import {MotivoMora} from '../../core/entities/motivo-mora';
import {MOTIVOS_MORA, STORAGE_KEYS} from '../../core/constants';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppDateAdapterFormatter} from '../../template/template-date-picker-adapter.service';
import * as moment from 'moment';
import {ApiService} from '../../core/data/api.service';
import {element} from 'protractor';
import {environment} from '../../../environments/environment';
import {RegComentarioModalComponent} from '../modales/reg-comentario-modal/reg-comentario-modal.component';
import {SeleccionarClienteModalComponent} from '../modales/seleccionar-cliente-modal/seleccionar-cliente-modal.component';
import {AlertButtons, AlertComponent} from '../../shared/alert/alert.component';
import { Permisos } from 'src/app/core/entities/permisos';

@Component({
  selector: 'app-crear-acuerdo-pago',
  templateUrl: './crear-acuerdo-pago.component.html',
  styleUrls: ['./crear-acuerdo-pago.component.scss'],
  providers: [AppDateAdapterFormatter],
})
export class CrearAcuerdoPagoComponent implements OnInit {

  cliente: Cliente;
  motivosMora: MotivoMora[];
  form: CrearAcuerdoPagoForm;
  minFechaAcuerdo: NgbDateStruct;
  maxFechaAcuerdo: NgbDateStruct;
  permisos: Permisos[];
  tienePermiso: boolean;

  get esClienteExperto(): boolean {
    const miembros = this.cobranzasService.cobranza.miembros;
    return miembros.length === 1 && miembros.every(m => m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  get esIndividual(): boolean {
    const miembros = this.cobranzasService.cobranza.miembros;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    const {CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE} = TiposMiembro;
    return miembros.every((m, idx) => idx === liderIdx ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m.tipoMiembro.id));
  }

  get esGrupal(): boolean {
    const miembros = this.cobranzasService.cobranza.miembros;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.MIEMBRO);
  }

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private api: ApiService,
    private modal: NgbModal,
    public cobranzasService: CobranzasService,
    private ngbDateAdapter: AppDateAdapterFormatter
  ) {
    if (!this.cobranzasService.cobranza || !this.cobranzasService.carteraVencida) {
      const {snapshot: {queryParams}} = this.route;
      this.router.navigate(['/cartera'], {queryParams});
    }

    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    this.tienePermiso = false;

    this.minFechaAcuerdo = this.ngbDateAdapter.fromModel(moment().format(`DD-MM-YYYY`));
    this.maxFechaAcuerdo = this.ngbDateAdapter.fromModel(moment().add(3, 'days').format(`DD-MM-YYYY`));
    this.motivosMora = MOTIVOS_MORA;
    this.form = new CrearAcuerdoPagoForm({} as CrearAcuerdoPago);
  }

  ngOnInit(): void {
  }

  cancelar(): void {
    this.router.navigate(['..']);
  }

  async seleccionarCliente(): Promise<void> {
    const modalRef = await this.modal.open(SeleccionarClienteModalComponent, {centered: true, size: 'lg'});
    modalRef.componentInstance.cobranza = this.cobranzasService.cobranza;
    modalRef.componentInstance.identificacion = this.cliente && this.cliente.datosIdentificacionCliente.numeroIdentificacion;
    modalRef.componentInstance.seleccionar.subscribe(async value => {
      if (value) {
        this.cliente = this.cobranzasService.cobranza.miembros.find(m => m.datosIdentificacionCliente?.numeroIdentificacion === value);
        modalRef.close();
      }
    });
  }

  async crearAcuerdo(componente: number, accion: number): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid && !!this.cliente) {
      try {
        const {status} = await this.api.cobranzas.registrarAcuerdo({
          ...this.form.getRawValue(),
          identificacionCliente: this.cliente.datosIdentificacionCliente?.numeroIdentificacion,
          cartera_id: this.cobranzasService.carteraVencida._id,
          solicitud_id: this.cobranzasService.cobranza._id,
        });
        if (status === 200) {
          await this.router.navigate(['/', 'cartera']);
        }
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    } else if (this.form.valid && !this.cliente) {
      const result = this.modal.open(AlertComponent, {centered: true, size: 'lg'});
      result.componentInstance.title = 'Acción requerida';
      result.componentInstance.description = 'Es necesario seleccionar un cliente para crear el acuerdo';
      result.componentInstance.buttons = AlertButtons.INFO;
    }
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.COBRANZAS);
    const {modulos} = componente.find(m => m?.id === 3);
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
}

class CrearAcuerdoPago {
  comentario: string;
  fechaAcuerdo: string;
  motivoMora: string;
}

class CrearAcuerdoPagoForm extends FormGroup {
  constructor(filtro: CrearAcuerdoPago) {
    super({
      comentario: new FormControl(filtro.comentario),
      fechaAcuerdo: new FormControl(filtro.fechaAcuerdo),
      motivoMora: new FormControl(filtro.motivoMora),
    });

    this.controls.comentario.setValidators([
      Validators.required,
    ]);

    this.controls.fechaAcuerdo.setValidators([
      Validators.required,
    ]);
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    raw.fechaAcuerdo = moment(raw.fechaAcuerdo, 'DD-MM-YYYY').utc(false).endOf('day').toISOString();

    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
