import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        NgbNavModule,
    ],
  providers: [],
})
export class DashboardModule { }
