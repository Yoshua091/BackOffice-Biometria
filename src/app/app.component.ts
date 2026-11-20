import { Component } from '@angular/core';
import { version, compilation } from '../../package.json';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'prospera';

  constructor() {
    console.log(`development version: ${version}`);
    console.log(`compilation version: ${compilation}`);
  }
}
