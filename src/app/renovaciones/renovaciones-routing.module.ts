import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {RenovacionesComponent} from './renovaciones.component';
import {ListadoRenovacionesComponent} from './listado-renovaciones/listado-renovaciones.component';
import {DetalleRenovacionComponent} from './detalle-renovacion/detalle-renovacion.component';

const routes: Routes = [
  {
    path: '', component: RenovacionesComponent,
    children: [
      {path: '', component: ListadoRenovacionesComponent},
      {path: 'detalles', component: DetalleRenovacionComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenovacionesRoutingModule {
}
