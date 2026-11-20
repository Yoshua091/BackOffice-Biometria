import {SessionService} from '../../core/session.service';
import {Router} from '@angular/router';
import {ApiService} from '../../core/data/api.service';

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sucursales',
  template: '<router-outlet></router-outlet>',
})
export class SucursalesComponent implements OnInit {

  constructor(
    private api: ApiService,
    private session: SessionService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

}
