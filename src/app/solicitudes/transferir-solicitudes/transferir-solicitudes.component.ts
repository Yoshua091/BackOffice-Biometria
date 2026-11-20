import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstadoTransferencia } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Solicitudes } from 'src/app/core/entities/solicitudes';
import { Sucursal } from 'src/app/core/entities/sucursal';
import { transferirSolicitudBuscar } from 'src/app/core/entities/tranferir-solicitud';
import { Zona } from 'src/app/core/entities/zona';
import { SessionService } from 'src/app/core/session.service';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transferir-solicitudes',
  templateUrl: './transferir-solicitudes.component.html',
  styleUrls: ['./transferir-solicitudes.component.scss']
})
export class TransferirSolicitudesComponent implements OnInit {
  estado: string;
  form: TransferenciaForm;
  solicitudes: Solicitudes[];
  sucursales: Sucursal[];
  zonasOrigen: Zona[];
  zonasDestino: Zona[];
  estados: EstadoTransferenciaMap = new EstadoTransferenciaMap();
  listado: transferirSolicitudBuscar[] = [];


  constructor(private api: ApiService, public session: SessionService, private modal: NgbModal) {
    this.form = new TransferenciaForm({} as TransferenciaSolicitudFormStruct);


    this.form.controls.sucursalOrigen.valueChanges.subscribe(async value => {
      try {
        if (value !== '') {
        const { data } = await this.api.zonas.buscar({ sucursal_id: value });
        this.zonasOrigen = data;
        }
      } catch (e) {
        console.log(e);
      }
    });

    this.form.controls.sucursalDestino.valueChanges.subscribe(async value => {
      try {
        if (value !== '') {
          const { data } = await this.api.zonas.buscar({ sucursal_id: value });
          this.zonasDestino = data;
        }
      } catch (e) {
        console.log(e);
      }
    });

  }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async cargarTodos(): Promise<void> {
    try {
      const { data } = await this.api.sucursales.buscar();
      this.sucursales = data;
    } catch (e) {
      console.log(e);
    }
  }

  async transferirSolicitud(): Promise<void> {
      try {
        const { zonaOrigen, zonaDestino, motivo } = this.form.getRawValue();
        await this.api.solicitudesSoporte.transferirSolicitud({ zonaOrigen, zonaDestino, motivo });
        this.limpiarDatos();
      } catch (e) {
        console.log(e);
      }
  }

  async confirmar(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const result = this.modal.open(AlertComponent, { centered: true, size: 'sm' });
      result.componentInstance.title = 'Transferir';
      result.componentInstance.description = `Estás seguro que deseas transferir`;
      result.componentInstance.buttons = AlertButtons.CONFIRM;

      const confirmar = await result.result;

      if (confirmar) {
        await this.transferirSolicitud();
      }
    }
  }

  async activeIdChange(): Promise<void> {
    const estado = Number(this.estado);
   await this.loadTransferenciaPorEstado(estado);
  }

  async loadTransferenciaPorEstado(estado: number): Promise<void> {
      try {
       const { data } = await this.api.solicitudesSoporte.transferirBuscar({estado})
       this.listado = data;
       this.listado.sort((a, b) => b.fecha.localeCompare(a.fecha));

      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
  }

  limpiarDatos(){
   this.form.controls.motivo.setValue('');
   this.form.controls.zonaDestino.setValue('');
   this.form.controls.zonaOrigen.setValue('');
   this.form.controls.sucursalDestino.setValue('');
  this.form.controls.sucursalOrigen.setValue('');
  }
}

class TransferenciaSolicitudFormStruct {
  sucursalOrigen: string;
  sucursalDestino: string;
  zonaOrigen: string;
  zonaDestino: string;
  motivo: string;
}

class TransferenciaForm extends FormGroup {
  constructor(transferencia: TransferenciaSolicitudFormStruct) {
    super({
      sucursalOrigen: new FormControl(transferencia.sucursalOrigen),
      sucursalDestino: new FormControl(transferencia.sucursalOrigen),
      zonaOrigen: new FormControl(transferencia.zonaOrigen),
      zonaDestino: new FormControl(transferencia.zonaDestino),
      motivo: new FormControl(transferencia.motivo),
    });

    this.controls.sucursalOrigen.setValidators([
      Validators.required,
    ]);

    this.controls.sucursalDestino.setValidators([
      Validators.required,
    ]);

    this.controls.zonaOrigen.setValidators([
      Validators.required,
    ]);

    this.controls.zonaDestino.setValidators([
      Validators.required,
    ]);

    this.controls.motivo.setValidators([
      Validators.required,
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

class EstadoTransferenciaMap {
  SolicitudRegistrada = [EstadoTransferencia.SolicitudRegistrada].join('-');
  ProcesandoTransferencia = [EstadoTransferencia.ProcesandoTransferencia].join('-');
  TransferenciaFinalizada = [EstadoTransferencia.TransferenciaFinalizada].join('-');
  ListaTranferencia = [EstadoTransferencia.ListaTranferencia].join('-');
}


