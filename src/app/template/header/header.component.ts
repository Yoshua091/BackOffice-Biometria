import { SessionService } from './../../core/session.service';
import { Component, OnInit, Output } from '@angular/core';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(public session: SessionService) {
    }

  ngOnInit(): void {

  }

  toggleSideBar(): void {
    this.toggleSideBarForMe.emit();
  }
}
