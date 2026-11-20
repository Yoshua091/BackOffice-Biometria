import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotorRolesRoutingModule } from './motor-roles-routing.module';
import { CargarArchivoPrimeraLineaComponent } from './primera-linea/cargar-archivo-primera-linea/cargar-archivo-primera-linea.component';
import { ListadoLotesPrimeraLineaComponent } from './primera-linea/listado-lotes-primera-linea/listado-lotes-primera-linea.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalesComponent } from './modales/modales.component';


@NgModule({
  declarations: [CargarArchivoPrimeraLineaComponent, ListadoLotesPrimeraLineaComponent, ModalesComponent],
  imports: [
    CommonModule,
    MotorRolesRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbPaginationModule
  ]
})
export class MotorRolesModule { }
