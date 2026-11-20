import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BancolombiaComponent } from './bancolombia.component';
import { ListadoDispersionesComponent } from './listado-dispersiones/listado-dispersiones.component';
import { ListadoHistoricoComponent } from './listado-historico/listado-historico.component';

const routes: Routes = [
  {
    path: '',
    component: BancolombiaComponent,
    children: [
      {
        path: 'dispersiones-pab',
        component: ListadoDispersionesComponent
      },
      {
        path: 'dispersiones-historico',
        component: ListadoHistoricoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BancolombiaRoutingModule { }

