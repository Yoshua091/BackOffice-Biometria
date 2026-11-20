import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {ReportesRoutingModule} from './reportes-routing.module';
import {ReportesComponent} from './reportes.component';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ReportesComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ReactiveFormsModule,
    NgbDatepickerModule
  ]
})
export class ReportesModule {
}
