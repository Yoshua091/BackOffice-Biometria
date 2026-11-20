import { Pipe, PipeTransform } from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Pipe({
  name: 'invalidControl',
  pure: false
})
export class InvalidControlPipe implements PipeTransform {

  transform(control: AbstractControl, ...args: unknown[]): unknown {
    return control.invalid && (control.dirty || control.touched);
  }

}
