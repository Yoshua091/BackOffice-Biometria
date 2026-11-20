import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumaKeys'
})
export class SumaKeysPipe implements PipeTransform {

  // tslint:disable-next-line:variable-name
  _invalidKeys = ['id', '_id', '_rev'];

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'object') { throw new Error('es necesario un objeto para realizar la sumatoria'); }

    let sum = 0;
    const keys = Object.keys(value);

    keys.forEach(key => {
      if (typeof value[key] === 'object') {
        this.transform(value[key], args);
      }

      if (!this._invalidKeys.includes(key) && typeof value[key] === 'number') {
        sum += value[key];
      }
    });
    return sum;
  }

}
