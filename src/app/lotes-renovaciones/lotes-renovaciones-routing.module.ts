import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoLotesRenovacionesComponent } from './listado-lotes-renovaciones/listado-lotes-renovaciones.component';

const routes: Routes = [
  {
    path: '',
    component: ListadoLotesRenovacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotesRenovacionesRoutingModule { }
