import { Component, Input, OnInit } from '@angular/core';
import { Cliente, Solicitudes } from '../../../core/entities/solicitudes';
import { Plazo } from '../../../core/entities/plazo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { REGEX, STORAGE_KEYS } from '../../../core/constants';
import { TiposMiembro, TipoSolicitud } from '../../../core/types';
import * as moment from 'moment';
import { SessionService } from 'src/app/core/session.service';
import { BehaviorSubject } from 'rxjs';

declare let simulador;

@Component({
  selector: 'app-ajustar-montos',
  templateUrl: './ajustar-montos.component.html',
  styleUrls: ['./ajustar-montos.component.scss']
})
export class AjustarMontosComponent implements OnInit {

  @Input() propuesta: Solicitudes;
  @Input() plazos: Plazo[];
  @Input() tipoSolicitud: TipoSolicitud;
  @Input() cliente: Cliente;
  @Input() plus: any;
  @Input() garantia: any;
  @Input() usuarioRegistra: any;
  @Input() score: any;
  @Input() miembrosLista: any[]
  @Input() renovacion: any;
  @Input() motor: any;
  @Input() soat: any;

  form: AjustarMontoForm;
  resultadoSimulador: any = {};
  creditoFng: any;
  rolConsulta: any
  aplicaValidacion: boolean
  fechaActual: Date = new Date();
  miembroCodeudor: boolean = false;
  mensaje: string = '';
  config: any;
  private banderaFNGSubject = new BehaviorSubject<boolean | undefined>(undefined);
  banderaFNGPrimerValor: boolean | undefined;
  constructor(public modal: NgbActiveModal, public session: SessionService,) {
    this.aplicaValidacion = false
  }

  ngOnInit(): void {
    const maxMeses = this.soat ? 12 : this.plus ? 48 : 24;

    this.plazos = this.plazos.filter(item => item.meses <= maxMeses);
    this.simularCuotaa();
    this.creditoFng = this.garantia;
    this.rolConsulta = this.session.user.rol.id
    this.config = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.simulador;


    this.aplicaValidacion = ((this.tipoSolicitud === TipoSolicitud.CLIENTE_EXPERTO || this.tipoSolicitud === TipoSolicitud.INDIVIDUAL) && (!!this.usuarioRegistra?.fng && !!this.resultadoSimulador?.tasaFNG));

    console.log(this.resultadoSimulador)
    this.miembroCodeudor = this.miembrosLista.every(x => x.tipoMiembro.id === TiposMiembro.CODEUDOR_ASALARIADO || TiposMiembro.CODEUDOR_INDEPENDIENTE)
    console.log(this.miembroCodeudor)
    this.capturarPrimerValorBanderaFNG();
    this.banderaFNGSubject.next(this.resultadoSimulador?.banderaFNG);

    // Simular cambios en resultadoSimulador.banderaFNG
    setTimeout(() => {
      // Verifica si this.resultadoSimulador y this.resultadoSimulador.banderaFNG no son null o undefined
      if (this.resultadoSimulador?.banderaFNG !== null && this.resultadoSimulador?.banderaFNG !== undefined) {
        this.resultadoSimulador.banderaFNG = false;
        this.banderaFNGSubject.next(this.resultadoSimulador.banderaFNG);
      } else {
        // Si banderaFNG es null o undefined, puedes manejarlo de otra manera o simplemente no hacer nada
        console.log("banderaFNG es null o undefined");
      }
    }, 5000);

    this.form.get('monto')?.valueChanges.subscribe(() => {
      this.calcularMontoPrestamo(); // Actualiza el valor cada vez que cambie
    });

    this.form.get('monto')?.valueChanges.subscribe(() => {
      this.mostrarMontoSolicitado(); // Actualiza el valor cada vez que cambie
    });
  }


  simularCuotaa() {
    this.form = new AjustarMontoForm(this.miembros, this.cliente, this.tipoSolicitud, this.plus, this.garantia, this.propuesta?.renovacion, this.motor, this.soat);
    this.form.controls.montos.valueChanges.subscribe(value => {
      const { miembros } = this.propuesta;
      const findMiembro = ({ numeroIdentificacion }) =>
        miembros.find(({ datosIdentificacionCliente }) =>
          datosIdentificacionCliente.numeroIdentificacion === numeroIdentificacion);
      value.forEach(m => {
        if (m.monto !== undefined) {
          findMiembro(m).solicitudEconomica.valoresDetalles.monto = Number(m.monto);
        }
      });


      this.resultadoSimulador = simulador.cuotaGrupal(this.propuesta, moment().toISOString())?.simulacion;
      if (this.propuesta.motor && this.propuesta.renovacion) {
        this.resultadoSimulador = simulador.cuotaGrupal(this.propuesta, moment().toISOString())?.simulacion;
      } else if (this.propuesta.motor) {
        this.resultadoSimulador = simulador.simuladorMotor(this.propuesta, moment().toISOString(false)).simulacion;
      }
    });
    this.resultadoSimulador = simulador.cuotaGrupal(this.propuesta, moment().toISOString())?.simulacion;
    if (this.propuesta.motor && this.propuesta.renovacion) {
      this.resultadoSimulador = simulador.cuotaGrupal(this.propuesta, moment().toISOString())?.simulacion;
    } else if (this.propuesta.motor) {
      this.resultadoSimulador = simulador.simuladorMotor(this.propuesta, moment().toISOString(false)).simulacion;
    }

    this.form.controls.plazoMeses.valueChanges
      .subscribe(value => {
        simulador.lider(this.propuesta.miembros).solicitudEconomica.valoresDetalles.plazoMeses = value;
        this.resultadoSimulador = simulador.cuotaGrupal(this.propuesta, moment().toISOString())?.simulacion;
        if (this.propuesta.motor && this.propuesta.renovacion) {
          this.resultadoSimulador = simulador.cuotaGrupal(this.propuesta, moment().toISOString())?.simulacion;
        } else if (this.propuesta.motor) {
          this.resultadoSimulador = simulador.simuladorMotor(this.propuesta, moment().toISOString(false)).simulacion;
        }
      });
  }

  get miembros(): Cliente[] {
    return this.propuesta.miembros.filter(m =>
      this.tipoSolicitud === TipoSolicitud.INDIVIDUAL ? m.tipoMiembro.id === TiposMiembro.LIDER :
        this.tipoSolicitud === TipoSolicitud.CLIENTE_EXPERTO ? m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO :
          this.tipoSolicitud === TipoSolicitud.INDIVIDUAL_CON_GARANTIA ? m.tipoMiembro.id === TiposMiembro.LIDER_GARANTIA :
            this.tipoSolicitud === TipoSolicitud.GRUPAL
    );
  }

  cuotaMiembro(identificacion: number): number {
    return this.resultadoSimulador?.cuotasMiembros?.find(m => m.identificacion === identificacion)?.cuotaMensual || NaN;
  }

  cuotaMaximaMiembro(identificacion: number | string): number {
    const miembro = this.miembros?.find(m => m.datosIdentificacionCliente.numeroIdentificacion === identificacion);
    return simulador.cuotaMax(miembro) || NaN;
  }

  submit(): void {
    this.form.markAllAsTouched();

    const aprobar = this.validarBotonAceptar();
    console.log(aprobar)

    this.form.markAllAsTouched();

    if (this.form.valid && aprobar) {
      this.modal.close(this.form.getRawValue());
    }
  }

  validarBotonAceptar(): boolean {

    const seleccionMotorPlusMontosMayores = "4-2-25-50"
    const seccionMotor = this.motor?.seleccionActual?.split('-');
    const minimo = this.config.siif_smmlv * Number(seccionMotor?.[2]);
    const maximo = this.config.siif_smmlv * Number(seccionMotor?.[3]);
    const montoPrestado = Number(this.resultadoSimulador?.montoPrestado);

    const montoMinimo = Number(seccionMotor?.[2]) === 1 ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.montoMinimoCredito : minimo;

    const esPlusMontosMayores =
      this.plus === true &&
      this.motor?.seleccionActual === seleccionMotorPlusMontosMayores;


    if (this.propuesta?.renovacion) {
      const esValido = this.validarReglasRenovaciones();
      if (!esValido) {
        return false; // Botón deshabilitado
      }
      return true; // Si pasó las reglas de renovación → habilitado
    }

    if (montoPrestado <= montoMinimo || montoPrestado > maximo) {
      this.mensaje = `El monto total prestado debe estar entre ${montoMinimo.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })} y ${maximo.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })}.`;

      return false;
    }

    if (this.plus === true && this.resultadoSimulador?.montoPrestado <= (this.config.siif_smmlv * 10)) {
      const menor = this.config.siif_smmlv * 10;
      this.mensaje = `El monto total prestado no puede ser menor que ${menor.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })}.`;
      return false; // Si plus es true y el monto prestado es menor o igual a 10 salarios, el botón se deshabilita
    }

    if (esPlusMontosMayores) {

      const minimo = this.config.siif_smmlv * Number(seccionMotor?.[2]);
      const maximo = this.config.siif_smmlv * Number(seccionMotor?.[3]);
      const montoPrestado = Number(this.resultadoSimulador?.montoPrestado);

      if (montoPrestado < minimo || montoPrestado > maximo) {
        this.mensaje = `La solicitud debe tener un monto total prestado menor o igual a ${minimo.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        })} y ${maximo.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        })}.`;

        return false;
      }
    }

    if (this.resultadoSimulador?.montoPrestado >= (this.config.siif_smmlv * 25) && !esPlusMontosMayores) {
      const maximo = this.config.siif_smmlv * 25;
      this.mensaje = `El monto total prestado no debe superar los ${maximo.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })}.`;
      return false; // Si la garantía no es 2 y el monto prestado es mayor o igual a 35587500, el botón se deshabilita
    }

    if (this.isConditionMet()) {
      this.mensaje = 'Debe modificar el plazo entre 12 y 24 meses por el tipo de garantía.'
      return false; // Si la garantía es 2 y el monto prestado es mayor a 7800000 y cumple con el score, el botón se deshabilita
    }

    if (this.resultadoSimulador === null) {
      return false;
    }

    return true; // Si ninguna de las condiciones anteriores se cumple, el botón se habilita
  }


  isConditionMet(): boolean {
    if (this.propuesta.motor && this.resultadoSimulador === null) {
      return (this.resultadoSimulador?.montoPrestado > (this.config.siif_smmlv * 6) && this.banderaFNGPrimerValor === true && this.resultadoSimulador?.plazo < 12) || this.resultadoSimulador === null ||
        (this.form.controls.plazoMeses.value.meses < 12 && this.banderaFNGPrimerValor === true && this.form.controls.montos.value[0].monto > (this.config.siif_smmlv * 6));
    } else {
      return (this.resultadoSimulador?.montoPrestado > (this.config.siif_smmlv * 6) && this.banderaFNGPrimerValor === true && this.resultadoSimulador?.plazo < 12) ||
        (this.form.controls.plazoMeses.value.meses < 12 && this.banderaFNGPrimerValor === true && this.form.controls.montos.value[0].monto > (this.config.siif_smmlv * 6));
    }
  }

  hayErrorFNG(): boolean {
    // Si no hay simulación → mostrar mensaje
    if (!this.resultadoSimulador) {
      return true;
    }

    const smmlv6 = this.config.siif_smmlv * 6;

    const plazoMeses =
      typeof this.form.controls.plazoMeses.value === 'number'
        ? this.form.controls.plazoMeses.value
        : this.form.controls.plazoMeses.value?.meses;

    const monto = Number(
      String(this.form.controls.montos.value?.[0]?.monto).replace(/[^\d]/g, '')
    );

    return (
      this.banderaFNGPrimerValor === true &&
      (
        (this.resultadoSimulador.montoPrestado > smmlv6 &&
          this.resultadoSimulador.plazo < 12) ||
        (plazoMeses < 12 && monto > smmlv6)
      )
    );
  }



  validarReglasRenovaciones(): boolean {
    this.mensaje = '';

    const montoSolicitado = this.mostrarMontoSolicitado();

    if (this.hayErrorFNG()) {
      this.mensaje = 'Debe modificar el plazo entre 12 y 24 meses por el tipo de garantía.';
      return false;
    }

    const montoPrestado = this.resultadoSimulador?.montoPrestado;
    const smmlv = this.config.siif_smmlv;
    const tipoRenovacion = this.propuesta?.renovacion?.tipoRenovacion;

    const esPlus = this.plus === true || this.propuesta?.tipoSolicitud?.plus === true;
    const esPremium = this.propuesta?.tipoSolicitud?.premium === true;
    const esRenovacionAAA = ['A', 'AA', 'AAA'].includes(tipoRenovacion);

    if (esPlus) {
      if (esRenovacionAAA) {
        if (this.resultadoSimulador?.planDeInteres?.tasa === 'N/A') {
          this.mensaje = 'El monto solicitado no cuenta con un plan de interés definido.';
          return false;
        }

        if (esPremium) {
          if (montoPrestado < smmlv * 25 || montoPrestado >= smmlv * 50) {
            const minimo = smmlv * 25;
            const maximo = smmlv * 50;

            this.mensaje = `La solicitud debe tener un monto total prestado menor o igual a ${minimo.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0
            })} y ${maximo.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0
            })}.`;

            return false;
          }
        } else {
          if (montoPrestado < smmlv * 10 || montoPrestado >= smmlv * 25) {
            const minimo = smmlv * 10;
            const maximo = smmlv * 25;

            this.mensaje = `La solicitud debe tener un monto total prestado entre ${minimo.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0
            })} y ${maximo.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0
            })}.`;

            return false;
          }
        }
      } else {
        if (montoPrestado < smmlv * 10 || montoPrestado > smmlv * 25) {
          const minimo = smmlv * 10;
          const maximo = smmlv * 25;

          this.mensaje = `La solicitud debe tener un monto total prestado entre ${minimo.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
          })} y ${maximo.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
          })}.`;

          return false;
        }
      }
    }

    if (this.resultadoSimulador?.planDeInteres?.tasa === 'N/A') {
      this.mensaje = `El monto solicitado no cuenta con un plan de interés definido.`;
      return false;
    }

    return true;
  }



  comparador(a: { idPlazo }, b: { idPlazo }): boolean {
    return (a && b) && a.idPlazo === b.idPlazo;
  }

  capturarPrimerValorBanderaFNG(): void {
    this.banderaFNGSubject.subscribe((valor) => {
      if (this.banderaFNGPrimerValor === undefined && valor !== undefined) {
        this.banderaFNGPrimerValor = valor;
      }
    });
    this.banderaFNGSubject.next(this.resultadoSimulador?.banderaFNG);
  }

  calcularMontoPrestamo(): number {
    const montosFormArray = this.form.get('montos') as FormArray;
    const saldo = this.propuesta?.renovacion?.saldo || 0;
    // Suma el monto total del FormArray más el saldo
    const totalMonto = montosFormArray.controls.reduce((total, group: AbstractControl) => {
      const monto = group.get('monto')?.value || 0;
      return total + parseFloat(monto);
    }, 0);

    return totalMonto + saldo; // Devuelve el total del monto más el saldo
  }

  mostrarMontoSolicitado(): number {  
    const montosFormArray = this.form.get('montos') as FormArray;
    // Suma el monto total del FormArray más el saldo
    const totalMonto = montosFormArray.controls.reduce((total, group: AbstractControl) => {
      const monto = group.get('monto')?.value || 0;
      return total + parseFloat(monto);
    }, 0);

    return totalMonto; // 
  }

  mostrarValorSoat(): number {
    debugger
    const miembros = this.propuesta?.miembros || [];

    const montoSoat = miembros[0]?.desembolso?.seguroSoat?.[0]?.resultadoSoat?.data?.cotizacionSeleccionada?.valorTotal || 0

    return montoSoat;
  }
  
  mostrarTotalSolicitadoMasSoat(): number {
    return this.mostrarMontoSolicitado() + this.mostrarValorSoat();
  }
}

class AjustarMontoForm extends FormGroup {
  constructor(miembros: Cliente[], cliente: Cliente, tipoSolicitud: TipoSolicitud, plus: any, garantia: any, renovacion, motor: any, soat: boolean) {
    super({
      montos: new MontosFormArray(miembros, cliente, tipoSolicitud, plus, garantia, renovacion, motor, soat),
      plazoMeses: new FormControl(miembros.length > 1 ?
        simulador.lider(miembros).solicitudEconomica.valoresDetalles.plazoMeses :
        miembros[0].solicitudEconomica.valoresDetalles.plazoMeses
      ),
    });
  }

  get montos(): MontosFormArray {
    return this.controls.montos as MontosFormArray;
  }

  getRawValue(): any {
    const raw = super.getRawValue();
    raw.montos.forEach(m => {
      delete m.nombreCompleto;

      m.monto = Number(m.monto);
    });
    return raw;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

}

class MontosFormArray extends FormArray {

  constructor(miembros: Cliente[], cliente: Cliente, tipoSolicitud: TipoSolicitud, plus, garantia, renovacion, motor, soat) {
    super(miembros.map(m => new FormGroup({
      nombreCompleto: new FormControl(
        m.datosPersonalesCliente.nombre1 + ' ' +
        m.datosPersonalesCliente.nombre2 + ' ' +
        m.datosPersonalesCliente.apellido1 + ' ' +
        m.datosPersonalesCliente.apellido2
      ),
      numeroIdentificacion: new FormControl(m.datosIdentificacionCliente.numeroIdentificacion),
      monto: new FormControl(
        { value: m.solicitudEconomica.valoresDetalles.monto, disabled: m.datosIdentificacionCliente.numeroIdentificacion !== cliente.datosIdentificacionCliente.numeroIdentificacion }, [
        Validators.required,
        Validators.pattern(REGEX.CURRENCY),
        (ctrl) => {

          if (renovacion && (tipoSolicitud === TipoSolicitud.CLIENTE_EXPERTO ||
            tipoSolicitud === TipoSolicitud.INDIVIDUAL_CON_GARANTIA
          )
          ) {
            const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
            const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG));
            const { montoMinimoCredito, montoMaximo } = local ?
              local : session ?
                session : new Error('STRG-CONF: Error al extraer la variable config del storage');
            return (ctrl.value && +ctrl.value < montoMinimoCredito && { monto: `El monto mínimo es ${montoMinimoCredito}` }) || null;
          }

          if (!renovacion && !soat) {
            const seleccionMotorPlusMontosMayores = "4-2-25-50";

            if (tipoSolicitud === TipoSolicitud.GRUPAL) {
              const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
              const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG));
              const { montoMinimoCredito, montoMaximo } = local ?
                local : session ?
                  session : new Error('STRG-CONF: Error al extraer la variable config del storage');

              return (ctrl.value && +ctrl.value < 1000000 && { monto: `El monto mínimo es 1000000` }) ||
                (ctrl.value && +ctrl.value > montoMaximo && { monto: `El monto máximo es ${montoMaximo}` }) || null;

            } else if (plus === true && !renovacion && motor?.seleccionActual !== seleccionMotorPlusMontosMayores) {
              const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
              const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG));
              const { montoMinimoCredito, montoMaximo } = local ?
                local : session ?
                  session : new Error('STRG-CONF: Error al extraer la variable config del storage');

              return (ctrl.value && +ctrl.value > montoMaximo && { monto: `El monto máximo es ${montoMaximo}` }) || null;

            } else if (plus === true && !renovacion && motor?.seleccionActual === seleccionMotorPlusMontosMayores) {
              return null;

            } else {
              const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
              const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG));
              const { montoMinimoCredito, montoMaximo } = local ?
                local : session ?
                  session : new Error('STRG-CONF: Error al extraer la variable config del storage');

              return (ctrl.value && +ctrl.value < montoMinimoCredito && { monto: `El monto mínimo es ${montoMinimoCredito}` }) ||
                (ctrl.value && +ctrl.value > montoMaximo && { monto: `El monto máximo es ${montoMaximo}` }) || null;
            }
          }
        }
      ]
      )
    })));
  }

  get montoMin(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.montoMinimoCredito;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.montoMinimoCredito;

    return local ? local : session ? session : 0;
  }

  get montoMax(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.montoMinimo;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.montoMinimo;

    return local ? local : session ? session : 0;
  }

  get groups(): FormGroup[] {
    return this.controls as FormGroup[];
  }

}
