import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/data/api.service';
import { SessionService } from 'src/app/core/session.service';

@Component({
  selector: 'app-regionales',
  template: '<router-outlet></router-outlet>',
})
export class RegionalesComponent implements OnInit {

  constructor(
    private api: ApiService,
    private session: SessionService,
    private router: Router,
  ) { }


  ngOnInit(): void {
  }

}
