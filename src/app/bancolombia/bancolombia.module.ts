import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BancolombiaRoutingModule } from './bancolombia-routing.module';
import { CargarDispersionesComponent } from './cargar-dispersiones/cargar-dispersiones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ListadoDispersionesComponent } from './listado-dispersiones/listado-dispersiones.component';
import { BancolombiaComponent } from './bancolombia.component';
import { ListadoHistoricoComponent } from './listado-historico/listado-historico.component';
import { CargarHistoricoComponent } from './cargar-historico/cargar-historico.component';
import { DetalleArchivoHistoricoComponent } from './modales/detalle-archivo-historico/detalle-archivo-historico.component';
import { DetalleArchivoDispersionesComponent } from './modales/detalle-archivo-dispersiones/detalle-archivo-dispersiones.component';


@NgModule({
  declarations: [CargarDispersionesComponent, ListadoDispersionesComponent, BancolombiaComponent, ListadoHistoricoComponent, CargarHistoricoComponent, DetalleArchivoHistoricoComponent, DetalleArchivoDispersionesComponent],
  imports: [
    CommonModule,
    BancolombiaRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbPaginationModule
  ]
})
export class BancolombiaModule { }
