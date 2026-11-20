import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportesComponent} from './reportes.component';
import {OpcionesReportesResolver, OpcionesVinculacionResolver} from '../core/resolvers.service';

const routes: Routes = [
  {
    path: '',
    component: ReportesComponent,
    resolve: {
      opcionesVinculacion: OpcionesVinculacionResolver,
      opcionesReportes: OpcionesReportesResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
