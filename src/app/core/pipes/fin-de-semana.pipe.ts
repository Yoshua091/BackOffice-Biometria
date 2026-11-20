import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'finDeSemana'
})
export class FinDeSemanaPipe implements PipeTransform {

  transform(): boolean {
    return [0, 6].includes(moment().day());
  }

}
