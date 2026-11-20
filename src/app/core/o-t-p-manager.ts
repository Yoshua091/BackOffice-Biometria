import {Injectable} from '@angular/core';
import {interval, Observable, Subject, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import * as moment from 'moment';

import {Cliente, IntentoOTP} from './entities/solicitudes';

export class OTPManager extends Subject<Cliente> {

  // tslint:disable:variable-name
  private tiempoOTP = 0;
  private intentosOTP = 0;
  private _temporizador: Subscription;
  private _contador = 0;
  private contador: Subject<number> = new Subject<number>();

  flujoCodigo: Subject<void> = new Subject<void>();
  flujoPreguntas: Subject<any> = new Subject<any>();
  value: Cliente;

  // la identidad de un cliente es confirmada cuando:
  // El otp fue validado
  // Contenga por lo menos un intento
  get identidadConfirmada(): boolean {
    const {otp: {validadoOtp, intentosOtp, resultadoPreguntas}} = this.value;
    const {resultado, aprobacion} = resultadoPreguntas || {};
    return ([true, 'true'].includes(validadoOtp) && (intentosOtp.length > 0)) ||
      ([true, 'true'].includes(aprobacion) && [true, 'true'].includes(resultado));
  }

  // Los estados de identidad confirmada se muestran si:
  // Se han generado min 1 codigo y max 3
  get mostrarEstado(): boolean {
    const {otp: {intentosOtp}} = this.value;
    return intentosOtp.length > 0;
  }

  // Intento de codigo OTP que está vigente, es decir:
  // Con tiempo de vida menor a tiempoOTP seg.
  // Que se ha generado correctamente.
  // Que no se haya validado totalmente el otp, porque de ser asi, no hay que validar otros codigos.
  get codigoOTPVigente(): IntentoOTP {
    const {otp: {intentosOtp, validadoOtp}} = this.value;
    const intentoFinder = ({generar, verificar}) =>
      !!generar && !verificar &&
      moment().diff(moment(generar.fechaEquipo)) / 1000 > 0 &&
      moment().diff(moment(generar.fechaEquipo)) / 1000 <= this.tiempoOTP &&
      [true, 'true'].includes(generar.ResultadoGeneracion.resultadoOTP) &&
      [false, 'false'].includes(validadoOtp);
    return intentosOtp.find(intentoFinder);
  }

  // Intento con codigo otp vigente y contador en curso mayor a 0
  get codigoOTPEnCurso(): boolean {
    return !!this.codigoOTPVigente && this._contador > 0;
  }

  // Intento inicializado para validar por otp o preguntas según disponibilidad
  get intentoInicializado(): boolean {
    return !!this.ultimoIntento && !this.ultimoIntento.generar && !this.ultimoIntento.preguntas;
  }

  // Intentos que tiene disponible un cliente para validar su identidad.
  // No puede ser mayor a 3.
  get intentosDisponibles(): boolean {
    return (this.intentosRestantes > 0 && !this.ultimoIntento?.preguntas) ||
      (this.intentosRestantes === 0 && !!this.ultimoIntento?.generar && !this.ultimoIntento?.preguntas);
  }

  get intentosRestantes(): number {
    const {otp: {intentosOtp}} = this.value;
    return this.intentosOTP - intentosOtp.length;
  }

  get mostrarPreguntasOTP(): boolean {
    const {otp: {validadoOtp, resultadoPreguntas}} = this.value;
    const {generar, preguntas} = this.ultimoIntento || {};
    return !!preguntas &&
      !resultadoPreguntas &&
      ['false', false].includes(validadoOtp) &&
      (!this.intentosDisponibles || generar?.ResultadoGeneracion.codResultadoOTP === '3');
  }

  get ultimoIntento(): IntentoOTP {
    const {otp: {intentosOtp}} = this.value;
    return intentosOtp[intentosOtp.length - 1];
  }

  get temporizador(): Observable<number> {
    return this.contador.asObservable();
  }

  constructor(tiempoOTP: number, intentosOTP: number) {
    super();
    if (!tiempoOTP || !intentosOTP) { throw new Error('Error: variable config no fue encontrada'); }
    this.tiempoOTP = tiempoOTP;
    this.intentosOTP = intentosOTP;
  }

  next(c: Cliente): void {
    super.next(c);
    this.value = c;

    // cuando el intento tiene un estado inicial
    if (this.intentoInicializado) {

      // flujo por codigo
      // Si para el intento generado el codigo es diferente de 3 se solicita enviar el codigo OTP
      // de lo contrario se deben solicitar las preguntas
      this.ultimoIntento.codResultadoOTP === '4' ?
        this.flujoCodigo.next() :
        this.flujoPreguntas.next();

    }
    // cuando el intento fue inicializado y tiene un otp generado
    else if (this.ultimoIntento?.generar && !this.ultimoIntento?.preguntas) {

      if (!this.codigoOTPEnCurso && !this.identidadConfirmada) {
        // solamente con el contador en 0 puede iniciarse un nuevo timer
        // un contador mayor a 0 indica que hubo un intento fallido
        // por lo que debe inmediatemente detnerse el timer
        if (this.ultimoIntento.generar.ResultadoGeneracion.codResultadoOTP === '3') {
          this.flujoPreguntas.next();
        } else {
          this._contador === 0 ? this.iniciarTimer() : this.detenerTimer();
        }
      } else {
        this.detenerTimer();
      }
    }
  }

  // Actualiza el contador e inicia un nuevo timer a partir de los segundos restantes.
  iniciarTimer(): void {
    const intento = this.codigoOTPVigente;
    if (intento) {
      const segTranscurridos = parseInt((moment().diff(moment(intento.generar.fechaEquipo)) / 1000).toFixed(0), 10);
      const segRestantes = this.tiempoOTP - segTranscurridos;

      this._contador = segRestantes;
      this._temporizador = interval(1000).pipe(take(segRestantes)).subscribe(_ => {
        this._contador--;
        this.contador.next(this._contador);
        if (this._contador <= 0) {
          this.detenerTimer();
          this.next({...this.value});
        }
      });
    }
  }

  // Detiene el timer y reestablece el contador a 0.
  detenerTimer(): void {
    this._temporizador.unsubscribe();
    this._contador = 0;
    this.contador.next(this._contador);
    this.value = {...this.value};
  }
}

