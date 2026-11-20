import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {DetalleArchivoModalComponent} from './modales';
import { CargarCsvComponent } from './cargar-csv/cargar-csv.component';
import {ListadoLotesComponent} from './listado-lotes/listado-lotes.component';
import {LotesRoutingModule} from './lotes-routing.module';
import {NgbNavModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CargarCsvComponent,
    ListadoLotesComponent,
    DetalleArchivoModalComponent,
  ],
  imports: [
    CommonModule,
    LotesRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbPaginationModule
  ]
})
export class LotesModule {
}
