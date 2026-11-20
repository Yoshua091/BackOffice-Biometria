import { Pipe, PipeTransform } from '@angular/core';
import {Cartera} from '../entities/solicitudes';

@Pipe({
  name: 'extraerDataCartera'
})
export class DataCarteraPipe implements PipeTransform {

  transform(value: unknown, data: 'estadoCobro', ...args: unknown[]): Cartera {
    if (value && data) {
      switch (data) {
        case 'estadoCobro':
          return (value as Cartera[]).find(item => item.estadoCobro !== 100);
        default: return null;
      }
    }
    return null;
  }

}
