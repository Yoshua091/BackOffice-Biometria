import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoLotesPrimeraLineaComponent } from './primera-linea/listado-lotes-primera-linea/listado-lotes-primera-linea.component';

const routes: Routes = [
  {
    path: '',
    component: ListadoLotesPrimeraLineaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotorRolesRoutingModule { }
