import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotesRenovacionesRoutingModule } from './lotes-renovaciones-routing.module';
import { CargarCsvRenovacionesComponent } from './cargar-csv-renovaciones/cargar-csv-renovaciones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ListadoLotesRenovacionesComponent } from './listado-lotes-renovaciones/listado-lotes-renovaciones.component';
import {DetalleArchivoLotesRenovacionesComponent} from './modales';


@NgModule({
  declarations: [
    CargarCsvRenovacionesComponent,
    ListadoLotesRenovacionesComponent,
    DetalleArchivoLotesRenovacionesComponent,
  ],
  imports: [
    CommonModule,
    LotesRenovacionesRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbPaginationModule
  ]
})
export class LotesRenovacionesModule { }
