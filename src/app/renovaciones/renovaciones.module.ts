import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RenovacionesRoutingModule} from './renovaciones-routing.module';
import {ListadoRenovacionesComponent} from './listado-renovaciones/listado-renovaciones.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core/core.module';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DetalleRenovacionComponent} from './detalle-renovacion/detalle-renovacion.component';
import {RenovacionesComponent} from './renovaciones.component';


@NgModule({
  declarations: [
    RenovacionesComponent,
    ListadoRenovacionesComponent,
    DetalleRenovacionComponent,
  ],
  imports: [
    CommonModule,
    RenovacionesRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    NgbPaginationModule,
  ]
})
export class RenovacionesModule {
}
