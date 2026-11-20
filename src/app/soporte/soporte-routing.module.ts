import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PermisosEjecucionComponent} from './roles/permisos-ejecucion/permisos-ejecucion.component';
import {SoporteComponent} from './soporte.component';
import {ListadoRolesComponent} from './roles/listado/listado-roles.component';
import {RolesComponent} from './roles/roles.component';
import {SincronizacionComponent} from './sincronizacion/sincronizacion.component';

const routes: Routes = [
  {
    path: '',
    component: SoporteComponent,
    children: [
      {
        path: 'roles',
        component: RolesComponent,
        children: [
          {path: '', component: ListadoRolesComponent},
          {path: 'permisos-ejecucion', component: PermisosEjecucionComponent}
        ]
      },
      {
        path: 'sincronizacion',
        component: SincronizacionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoporteRoutingModule {
}
