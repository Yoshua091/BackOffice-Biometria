import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListadoLotesComponent} from './listado-lotes/listado-lotes.component';

const routes: Routes = [
  {
    path: '',
    component: ListadoLotesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotesRoutingModule { }
