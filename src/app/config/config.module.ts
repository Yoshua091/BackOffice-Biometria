import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {ConfigRoutingModule} from './config-routing.module';
import {ConfigComponent} from './config.component';
import {MetasComponent} from './metas/metas.component';
import {SucursalesComponent} from './sucursales/sucursales.component';
import {ListadoComponent} from './sucursales/listado/listado.component';
import {SucursalesFormComponent} from './sucursales/formulario/sucursales-form.component';
import {EmpleadosComponent} from './empleados/empleados.component';
import {EmpleadosFormComponent} from './empleados/formulario/empleados-form.component';
import {ListadoEmpleadosComponent} from './empleados/listado/listado-empleados.component';
import {EmpleadosService} from './empleados/empleados.service';
import {SucursalesService} from './sucursales/sucursales.service';
import { ZonasFormComponent } from './sucursales/zonas/formulario/zonas-form.component';
import { ListadoZonasComponent } from './sucursales/zonas/listado/listado-zonas.component';
import { ZonasService } from './sucursales/zonas/zonas.service';
import { RegionalesComponent } from './regionales/regionales.component';
import { RegionalFormComponent } from './regionales/formulario/regional-form/regional-form.component';
import { ListadoRegionalComponent } from './regionales/listado/listado-regional/listado-regional.component';

@NgModule({

  declarations: [
    ConfigComponent,
    MetasComponent,
    SucursalesComponent,
    ListadoComponent,
    SucursalesFormComponent,
    EmpleadosComponent,
    ListadoEmpleadosComponent,
    EmpleadosFormComponent,
    ZonasFormComponent,
    ListadoZonasComponent,
    RegionalesComponent,
    RegionalFormComponent,
    ListadoRegionalComponent,
  ],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    NgbNavModule,
    ReactiveFormsModule
  ],
  providers: [
    EmpleadosService,
    SucursalesService,
    ZonasService
  ],
})
export class ConfigModule {
}
