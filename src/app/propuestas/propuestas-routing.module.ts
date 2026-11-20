import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PropuestasComponent} from './propuestas.component';
import {BuscarPropHeaderComponent} from './buscar/buscar-prop-header.component';
import {FiltrarPropHeaderComponent} from './filtrar/filtrar-prop-header.component';
import {ListadoPropuestasComponent} from './listado/listado-propuestas.component';
import {DetallePropuestaComponent} from './detalle/detalle-propuesta.component';
import {SolicitudResolver} from '../core/resolvers.service';

const routes: Routes = [
  {
    path: '',
    component: PropuestasComponent,
    children: [
      {path: '', component: ListadoPropuestasComponent},
      {path: 'detalle', component: DetallePropuestaComponent, resolve: {solicitud: SolicitudResolver}},
      {path: 'filtrar', component: FiltrarPropHeaderComponent},
      {path: 'buscar', component: BuscarPropHeaderComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropuestasRoutingModule { }
