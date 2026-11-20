import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {Cliente} from '../../../core/entities/solicitudes';
import {REGEX, STORAGE_KEYS} from '../../../core/constants';
import {OTPManager} from '../../../core/o-t-p-manager';

const {tiempoOTP, intentosOTP: nIntentosOTP} = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)) || {} as any;

@Component({
  selector: 'app-validar-otp',
  templateUrl: './validar-otp.component.html',
  styleUrls: ['./validar-otp.component.scss']
})
export class ValidarOtpComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  _otpManager: OTPManager;
  counter = 0;
  timer: Subscription;
  form: ValidarOTPForm;
  formPreguntas: PreguntasForm;

  @Output() iniciarValidacion: EventEmitter<void> = new EventEmitter<void>();
  @Output() generarCodigoOTP: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirmarCodigoOTP: EventEmitter<any> = new EventEmitter<any>();
  @Output() obtenerPreguntas: EventEmitter<any> = new EventEmitter<any>();
  @Output() validarPreguntas: EventEmitter<any> = new EventEmitter<any>();

  @Input() guion: string;

  @Input()
  get otpManager(): OTPManager {
    return this._otpManager;
  }

  get nombre(): string {
    const {datosPersonalesCliente: {nombre1, nombre2, apellido1, apellido2}} = this._otpManager.value;
    return `${nombre1} ${nombre2} ${apellido1} ${apellido2}`;
  }

  get identificacion(): number | string {
    const {datosIdentificacionCliente: {numeroIdentificacion}} = this._otpManager.value;
    return numeroIdentificacion;
  }

  get telefono(): string {
    const {datosContactoCliente: {telefono}} = this._otpManager.value;
    return telefono;
  }

  // Los estados de identidad confirmada se muestran si:
  // Se han generado min 1 codigo y max 3
  get mostrarEstado(): boolean {
    const {otp: {intentosOtp}} = this._otpManager.value;
    return intentosOtp.length > 0;
  }

  get mostrarPreguntasOTP(): boolean {
    const {otp: {validadoOtp, resultadoPreguntas}} = this._otpManager.value;
    const {generar, preguntas} = this._otpManager.ultimoIntento || {};
    return !!preguntas &&
      !resultadoPreguntas &&
      ['false', false].includes(validadoOtp) &&
      (!this._otpManager.intentosDisponibles || generar?.ResultadoGeneracion.codResultadoOTP === '3');
  }

  constructor(public modal: NgbActiveModal) {
    this._otpManager = new OTPManager(tiempoOTP, nIntentosOTP);
    this._otpManager.flujoCodigo.subscribe(_ => this.generarCodigoOTP.emit());
    this._otpManager.flujoPreguntas.subscribe(_ => this.obtenerPreguntas.emit());
    this._otpManager.temporizador.subscribe(_ => this.counter = _);
    this._otpManager.subscribe(_ => {
      this.form = new ValidarOTPForm(_);
      this.formPreguntas = new PreguntasForm(_);
    });
  }

  ngOnInit(): void {
  }

  _iniciarValidacion(): void {
    if (this._otpManager.intentosRestantes === 0 && this._otpManager.ultimoIntento?.generar) {
      this.obtenerPreguntas.emit();
    } else {
      this.iniciarValidacion.emit();
    }
  }

  confirmarOTP(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.confirmarCodigoOTP.emit(this.form.getRawValue());
    }
  }

  _validarPreguntas(): void {
    this.formPreguntas.markAllAsTouched();

    if (this.formPreguntas.valid) {
      this.validarPreguntas.emit(this.formPreguntas.getRawValue());
    }
  }
}

class ValidarOTPForm extends FormGroup {
  constructor({datosIdentificacionCliente: {numeroIdentificacion}}: Cliente) {
    super({
      identificacion: new FormControl(numeroIdentificacion),
      codigoOtp: new FormControl(),
    });

    this.controls.codigoOtp.setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(REGEX.NUMERIC),
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

class PreguntasForm extends FormGroup {
  constructor({otp: {intentosOtp}}: Cliente) {
    const preguntas = intentosOtp[intentosOtp.length - 1]?.preguntas?.Pregunta;
    super(preguntas?.reduce((map, p) => {
      map[p.orden] = new FormControl('');

      return map;
    }, {}) || {});
  }

  getRawValue(): any {
    const raw = super.getRawValue();
    const keys = Object.keys(super.getRawValue());

    return keys.map( (k) => ({ idPregunta: k, idRespuesta: raw[k] }));
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

