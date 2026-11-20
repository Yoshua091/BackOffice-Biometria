import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: unknown, trueValue: any, falseValue: any, ...args: unknown[]): unknown {
    return value ? trueValue : falseValue;
  }

}
