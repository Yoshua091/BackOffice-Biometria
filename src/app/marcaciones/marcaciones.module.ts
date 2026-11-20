import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarcacionesRoutingModule } from './marcaciones-routing.module';
import { CoreModule } from '../core/core.module';
import { CargarCsvMarcacionesComponent } from './cargar-csv-marcaciones/cargar-csv-marcaciones.component';
import { ListadoLotesMarcacionesComponent } from './listado-lotes-marcaciones/listado-lotes-marcaciones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DetalleArchivoComponent } from './modales/detalle-archivo/detalle-archivo.component';


@NgModule({
  declarations: [
    CargarCsvMarcacionesComponent, 
    ListadoLotesMarcacionesComponent, DetalleArchivoComponent],
  imports: [
    CommonModule,
    MarcacionesRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbPaginationModule
  ]
})
export class MarcacionesModule { }
