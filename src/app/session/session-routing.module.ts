import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {SessionGuard} from './session-guard.service';
import {SessionComponent} from './session.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: '',
    component: SessionComponent,
    children: [
      {path: 'login', component: LoginComponent},
    ],
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule {
}
