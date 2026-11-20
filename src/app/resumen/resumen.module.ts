import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumenRoutingModule } from './resumen-routing.module';
import { ResumenComponent } from './resumen.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ResumenComponent],
  imports: [
    CommonModule,
    ResumenRoutingModule,
    ReactiveFormsModule,
    NgbDatepickerModule
  ]
})
export class ResumenModule { }
