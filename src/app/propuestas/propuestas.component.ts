import {Component, OnInit} from '@angular/core';
import {ApiService} from '../core/data/api.service';

@Component({
  selector: 'app-propuestas',
  template: '<router-outlet></router-outlet>',
})
export class PropuestasComponent implements OnInit {

  constructor(private api: ApiService) {
  }

  async ngOnInit(): Promise<void> {
  }

}
