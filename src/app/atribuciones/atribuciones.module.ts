import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtribucionesRoutingModule } from './atribuciones-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { AtribucionesComponent } from './atribuciones.component';


@NgModule({
  declarations: [AtribucionesComponent],
  imports: [
    CommonModule,
    AtribucionesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    CoreModule,
    FormsModule
  ]
})
export class AtribucionesModule { }
