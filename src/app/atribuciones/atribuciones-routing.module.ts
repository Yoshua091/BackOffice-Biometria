import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AtribucionesComponent } from './atribuciones.component';

const routes: Routes = [
  {
    path: '',
    component: AtribucionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtribucionesRoutingModule { }
