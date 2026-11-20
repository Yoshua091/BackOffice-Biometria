import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoporteRoutingModule } from './soporte-routing.module';
import { PermisosEjecucionComponent } from './roles/permisos-ejecucion/permisos-ejecucion.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { SoporteComponent } from './soporte.component';
import { ListadoRolesComponent } from './roles/listado/listado-roles.component';
import { RolesComponent } from './roles/roles.component';
import {RolesService} from './roles/roles.service';
import { SincronizacionComponent } from './sincronizacion/sincronizacion.component';
import {CoreModule} from '../core/core.module';


@NgModule({
  declarations: [
    PermisosEjecucionComponent,
    SoporteComponent,
    ListadoRolesComponent,
    RolesComponent,
    SincronizacionComponent
  ],
    imports: [
        CommonModule,
        SoporteRoutingModule,
        ReactiveFormsModule,
        NgbCollapseModule,
        CoreModule
    ],
  providers: [
    RolesService
  ]
})
export class SoporteModule { }
