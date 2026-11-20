import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {ApiService} from '../../core/data/api.service';
import {SessionService} from '../../core/session.service';

@Component({
  selector: 'app-empleados',
  template: '<router-outlet></router-outlet>',
})
export class EmpleadosComponent implements OnInit {

  constructor(
    private api: ApiService,
    private session: SessionService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

}
