import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispersionesRoutingModule } from './dispersiones-routing.module';
import { ErroresDispersionComponent } from './errores-dispersion/errores-dispersion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';
import { DispersionesComponent } from './dispersiones.component';
import { CiclosDispersionComponent } from './ciclos-dispersion/ciclos-dispersion.component';
import { DetalleLotesDispersionesComponent } from './modales/detalle-lotes-dispersiones/detalle-lotes-dispersiones.component';


@NgModule({
  declarations: [ErroresDispersionComponent, DispersionesComponent, CiclosDispersionComponent, DetalleLotesDispersionesComponent],
  imports: [
    CommonModule,
    DispersionesRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    CoreModule,
    RouterModule,
    NgbModule,
    NgbPaginationModule
  ]
})
export class DispersionesModule { }
