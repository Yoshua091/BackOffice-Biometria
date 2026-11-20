import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesembolsosComponent } from './desembolsos/desembolsos.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { TransferirSolicitudesComponent } from './transferir-solicitudes/transferir-solicitudes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'solicitudesEditar',
        component: SolicitudesComponent
      },
      {
        path: 'transferirSolicitudes',
        component: TransferirSolicitudesComponent
      },
      {
        path: 'desembolsos',
        component: DesembolsosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
