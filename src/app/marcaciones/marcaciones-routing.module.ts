import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';import { ListadoLotesMarcacionesComponent } from './listado-lotes-marcaciones/listado-lotes-marcaciones.component';
;

const routes: Routes = [
  {
    path: '',
    component: ListadoLotesMarcacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarcacionesRoutingModule { }
