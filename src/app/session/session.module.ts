import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SessionRoutingModule} from './session-routing.module';
import {SessionComponent} from './session.component';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SessionGuard} from './session-guard.service';
import {NgxSpinnerModule} from 'ngx-spinner';



@NgModule({
  declarations: [SessionComponent, LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SessionRoutingModule,
    NgxSpinnerModule,
  ],
  providers: [
    SessionGuard
  ]
})
export class SessionModule {
}
