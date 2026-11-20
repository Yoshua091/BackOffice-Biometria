import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EdicionCamposSolicitudParams } from 'src/app/core/data/solicitudes-data.service';
import { Desembolso } from 'src/app/core/entities/solicitudes-soporte';

@Component({
  selector: 'app-edicion-desembolso',
  templateUrl: './edicion-desembolso.component.html',
  styleUrls: ['./edicion-desembolso.component.scss']
})
export class EdicionDesembolsoComponent implements OnInit {
  @Output() camposEdicion: EventEmitter<any> = new EventEmitter<any>();
  @Input() desembolso: Desembolso;

  tranferencia: any[];
  bancos: any[];
  tipoCuenta: any[];
  tipoTransferenciaSeleccionada: any
  mostraCampos: boolean;
  form: EdicionCamposForm;

  constructor(
    public modal: NgbActiveModal
  ) {
    this.tranferencia = tipoTransferencia
    this.bancos = bancos
    this.tipoCuenta = tipoCuenta
    this.mostraCampos = false;

  }

  ngOnInit(): void {
    this.form = new EdicionCamposForm({} as EdicionCamposSolicitudParams);

  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.controls.tipoTransferencia.value.id === 1 && this.form.controls.motivo.value !== null) {
      this.camposEdicion.emit(this.form.getRawValue());
      this.modal.close();
    } else if (this.form.controls.tipoTransferencia.value.id === 2 
      && this.form.controls.motivo.value !== null
      && this.form.controls.banco.value !== null
      && this.form.controls.tipoCuenta.value !== null
      && this.form.controls.numeroCuenta.value !== null
      ) {
        this.camposEdicion.emit(this.form.getRawValue());
        this.modal.close();
    }
  }

  seleccionarTipoTransferencia(event: any) {
    const selectedValue = event.target.value;
    const index = selectedValue.indexOf(':');
    const valueWithoutColon = index !== -1 ? selectedValue.slice(0, index) : selectedValue;
    const tipoTRanferencia = parseInt(valueWithoutColon.trim(), 10);
    this.mostraCampos = tipoTRanferencia === 1 ? true : false
  }
}

export const tipoTransferencia = [
  {
    id: 1,
    tipo: 'Retiro en Ventanilla Bancolombia',
    costoDesembolso: 19028,
  },
  {
    id: 2,
    tipo: 'Transferencia bancaria',
    costoDesembolso: 0,
  },
  // {
  //   id: 3,
  //   tipo: 'Supergiros',
  //   costoDesembolso: 4000,
  // },
  // {
  //   id: 4,
  //   tipo: 'Convenio',
  //   costoDesembolso: 0,
  // },
]

export const bancos = [
  {
    id: 1,
    banco: "BANCAMIA S.A.",
    codigo: 1059,
    bancolombia: "1059",
    costoDesembolso: 6747
  },
  {
    id: 2,
    banco: "BANCO AGRARIO",
    codigo: 1040,
    bancolombia: "1040",
    costoDesembolso: 6747
  },
  {
    id: 3,
    banco: "BANCO AV VILLAS",
    codigo: 1052,
    bancolombia: "6013677",
    costoDesembolso: 6747
  },
  {
    id: 4,
    banco: "BANCO CAJA SOCIAL BCSC SA",
    codigo: 1032,
    bancolombia: "5600829",
    costoDesembolso: 6747
  },
  {
    id: 5,
    banco: "BANCO COOPERATIVO COOPCENTRAL",
    codigo: 1066,
    bancolombia: "1066",
    costoDesembolso: 6747
  },
  {
    id: 6,
    banco: "BANCO CREDIFINANCIERA SA.",
    codigo: 1558,
    bancolombia: "1558",
    costoDesembolso: 6747
  },
  {
    id: 7,
    banco: "BANCO DAVIVIENDA SA",
    codigo: 1051,
    bancolombia: "5895142",
    costoDesembolso: 6747
  },
  {
    id: 8,
    banco: "BANCO DE BOGOTA",
    codigo: 1001,
    bancolombia: "5600010",
    costoDesembolso: 6747
  },
  {
    id: 9,
    banco: "BANCO DE OCCIDENTE",
    codigo: 1023,
    bancolombia: "5600230",
    costoDesembolso: 6747
  },
  {
    id: 10,
    banco: "BANCO FALABELLA S.A.",
    codigo: 1062,
    bancolombia: "1062",
    costoDesembolso: 6747
  },
  {
    id: 12,
    banco: "BANCO GNB SUDAMERIS",
    codigo: 1012,
    bancolombia: "5600120",
    costoDesembolso: 6747
  },
  {
    id: 13,
    banco: "BANCO J.P. MORGAN COLOMBIA S.A",
    codigo: 1071,
    bancolombia: "1071",
    costoDesembolso: 6747
  },
  {
    id: 14,
    banco: "BANCO MUNDO MUJER",
    codigo: 1047,
    bancolombia: "1047",
    costoDesembolso: 6747
  },
  {
    id: 15,
    banco: "BANCO PICHINCHA",
    codigo: 1060,
    bancolombia: "1060",
    costoDesembolso: 6747
  },
  {
    id: 16,
    banco: "BANCO POPULAR",
    codigo: 1002,
    bancolombia: "5600023",
    costoDesembolso: 6747
  },
  {
    id: 17,
    banco: "BANCO SANTANDER DE NEGOCIOS CO",
    codigo: 1065,
    bancolombia: "1065",
    costoDesembolso: 6747
  },
  {
    id: 18,
    banco: "BANCO SERFINANZA S.A",
    codigo: 1069,
    bancolombia: "1069",
    costoDesembolso: 6747
  },
  {
    id: 19,
    banco: "BANCO W S.A.",
    codigo: 1053,
    bancolombia: "1053",
    costoDesembolso: 6747
  },
  {
    id: 20,
    banco: "BANCOLDEX S.A.",
    codigo: 1031,
    bancolombia: "1031",
    costoDesembolso: 6747
  },
  {
    id: 21,
    banco: "BANCOLOMBIA",
    codigo: 1007,
    bancolombia: "5600078",
    costoDesembolso: 4510
  },
  {
    id: 22,
    banco: "BANCOOMEVA",
    codigo: 1061,
    bancolombia: "1061",
    costoDesembolso: 6747
  },
  {
    id: 23,
    banco: "BBVA COLOMBIA",
    codigo: 1013,
    bancolombia: "5600133",
    costoDesembolso: 6747
  },
  {
    id: 24,
    banco: "CITIBANK",
    codigo: 1009,
    bancolombia: "5600094",
    costoDesembolso: 6747
  },
  {
    id: 25,
    banco: "COLTEFINANCIERA S.A",
    codigo: 1370,
    bancolombia: "1370",
    costoDesembolso: 6747
  },
  {
    id: 26,
    banco: "CONFIAR",
    codigo: 1292,
    bancolombia: "1292",
    costoDesembolso: 6747
  },
  {
    id: 27,
    banco: "COOFINEP COOPERATIVA FINANCIER",
    codigo: 1291,
    bancolombia: "1291",
    costoDesembolso: 6747
  },
  {
    id: 28,
    banco: "COOPERATIVA FINANCIERA DE ANTI",
    codigo: 1283,
    bancolombia: "1283",
    costoDesembolso: 6747
  },
  {
    id: 29,
    banco: "COOTRAFA COOPERATIVA FINANCIER",
    codigo: 1289,
    bancolombia: "1289",
    costoDesembolso: 6747
  },
  {
    id: 31,
    banco: "FINANCIERA JURISCOOP S.A. COMP",
    codigo: 1121,
    bancolombia: "1121",
    costoDesembolso: 6747
  },
  {
    id: 32,
    banco: "GIROS Y FINANZAS CF",
    codigo: 1303,
    bancolombia: "1303",
    costoDesembolso: 6747
  },
  {
    id: 33,
    banco: "IRIS",
    codigo: 1637,
    bancolombia: "1637",
    costoDesembolso: 6747
  },
  {
    id: 34,
    banco: "ITAU",
    codigo: 1014,
    bancolombia: "5600146",
    costoDesembolso: 6747
  },
  {
    id: 35,
    banco: "ITAU antes Corpbanca",
    codigo: 1006,
    bancolombia: "5600065",
    costoDesembolso: 6747
  },
  {
    id: 36,
    banco: "MIBANCO S.A.",
    codigo: 1067,
    bancolombia: "1067",
    costoDesembolso: 6747
  },
  {
    id: 37,
    banco: "NEQUI",
    codigo: 1507,
    bancolombia: "1507",
    costoDesembolso: 2321
  },
  {
    id: 38,
    banco: "RAPPIPAY",
    codigo: 1151,
    bancolombia: "1151",
    costoDesembolso: 6747
  },
  {
    id: 39,
    banco: "SCOTIABANK COLPATRIA S.A",
    codigo: 1019,
    bancolombia: "5600191",
    costoDesembolso: 6747
  }
]

export const tipoCuenta = [
  {
    id: 1,
    tipo: "Cuenta Corriente",
    bancolombia: 1
  },
  {
    id: 3,
    tipo: "Cuenta de Ahorros",
    bancolombia: 7
  }
];


class EdicionCamposForm extends FormGroup {

  constructor(edicionCampos: EdicionCamposSolicitudParams) {

    super({
      motivo: new FormControl(edicionCampos.motivo),
      valor: new FormControl(edicionCampos.valor),
      banco: new FormControl(),
      tipoTransferencia: new FormControl(),
      tipoCuenta: new FormControl(),
      numeroCuenta: new FormControl()
    });

    this.controls.motivo.setValidators([
      Validators.required,
    ]);

    this.controls.valor.setValidators([
      Validators.required,
    ]);

    this.controls.tipoTransferencia.setValidators([
      Validators.required,
    ]);

    this.controls.banco.setValidators([
      Validators.required,
    ]);

    this.controls.tipoCuenta.setValidators([
      Validators.required,
    ]);

    this.controls.numeroCuenta.setValidators([
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(16),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);
  }


  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

