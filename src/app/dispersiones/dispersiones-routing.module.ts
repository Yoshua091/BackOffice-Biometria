import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CiclosDispersionComponent } from './ciclos-dispersion/ciclos-dispersion.component';
import { DispersionesComponent } from './dispersiones.component';
import { ErroresDispersionComponent } from './errores-dispersion/errores-dispersion.component';

const routes: Routes = [
  {
    path: '',
    component: CiclosDispersionComponent,
    children: [
      {
        path: 'dispersiones-error',
        component: ErroresDispersionComponent
      },
      {
        path: 'dispersiones-ciclos',
        component: CiclosDispersionComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispersionesRoutingModule { }

