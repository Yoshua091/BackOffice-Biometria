import { Directive } from '@angular/core';

import { Sidebar } from './sidebar.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[closeSidebar]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '(click)': '_onClick()'
  }
})
// tslint:disable-next-line:directive-class-suffix
export class CloseSidebar {
  // tslint:disable-next-line:variable-name
  constructor(private _sidebar: Sidebar) {}

  /** @internal */
  _onClick(): void {
    if (this._sidebar) {
      this._sidebar.close();
    }
  }
}
