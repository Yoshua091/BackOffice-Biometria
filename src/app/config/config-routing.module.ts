import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {MetasComponent} from './metas/metas.component';
import {SucursalesComponent} from './sucursales/sucursales.component';
import {ListadoComponent} from './sucursales/listado/listado.component';
import {SucursalesFormComponent} from './sucursales/formulario/sucursales-form.component';
import {EmpleadosComponent} from './empleados/empleados.component';
import {ListadoEmpleadosComponent} from './empleados/listado/listado-empleados.component';
import {EmpleadosFormComponent} from './empleados/formulario/empleados-form.component';
import {SucursalesResolver} from '../core/resolvers.service';
import { ListadoZonasComponent } from './sucursales/zonas/listado/listado-zonas.component';
import { ZonasFormComponent } from './sucursales/zonas/formulario/zonas-form.component';
import { RegionalesComponent } from './regionales/regionales.component';
import { ListadoRegionalComponent } from './regionales/listado/listado-regional/listado-regional.component';
import { RegionalFormComponent } from './regionales/formulario/regional-form/regional-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sucursales',
        component: SucursalesComponent,
        children: [
          {path: '', component: ListadoComponent},
          {path: 'formulario', component: SucursalesFormComponent},
          {path: 'listado-zonas', component: ListadoZonasComponent},
          {path: 'formulario-zonas', component: ZonasFormComponent},
        ]
      },
      {
        path: 'regionales',
        component: RegionalesComponent,
        children: [
          {path: '', component: ListadoRegionalComponent},
          {path: 'formulario', component: RegionalFormComponent},
        ]
      },
      {path: 'control-empleados',
      component: EmpleadosComponent,
      children: [
        {path: '', component: ListadoEmpleadosComponent},
        {path: 'formulario', component: EmpleadosFormComponent, resolve: {sucursales: SucursalesResolver}},
      ]},
      {path: 'metas', component: MetasComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule {
}
