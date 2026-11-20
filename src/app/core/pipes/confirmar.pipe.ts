import { Pipe, PipeTransform } from '@angular/core';
import {Cliente} from '../entities/solicitudes';
import {STORAGE_KEYS} from '../constants';

const {intentosOTP} = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)) || {} as any;

@Pipe({
  name: 'confirmar'
})
export class ConfirmarPipe implements PipeTransform {

  VALIDADORES = {
    otp: (cliente: Cliente) => {
      return [false, 'false'].includes(cliente.otp.validadoOtp) &&
        !!cliente.otp.intentosOtp[cliente.otp.intentosOtp.length - 1]?.preguntas;
    }
  };

  transform(value: any, prop: string): boolean {
    return this.VALIDADORES[prop](value);
  }



}
