import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'extraerDataSolicitud'
})
export class DataSolicitudPipe implements PipeTransform {


  transform(value: unknown, data: 'monto' | 'lider', ...args: unknown[]): unknown {
    if (value && data) {
      switch (data) {
        case 'monto':
          let valor = 0;
          (value as any[]).forEach(item => valor = valor + item.solicitudEconomica.valoresDetalles.monto);
          return valor;
        case 'lider':
          return (value as any[]).find(item => [1, 3, 6].includes(item.tipoMiembro.id));
        default: return 'sin datos';
      }
    }
    return null;
  }

}
