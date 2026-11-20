import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TemplateComponent} from './template.component';
import {TemplateGuard} from './template-guard.service';
import {SimuladorResolver} from '../core/resolvers.service';

const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    canActivate: [TemplateGuard],
    canActivateChild: [TemplateGuard],
    children: [
      {
        path: 'maps',
        loadChildren: () => import('../maps/maps.module').then(m => m.MapsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'propuestas',
        loadChildren: () => import('../propuestas/propuestas.module').then(m => m.PropuestasModule)
      },
      {
        path: 'reportes',
        loadChildren: () => import('../reportes/reportes.module').then(m => m.ReportesModule)
      },
      {
        path: 'config',
        loadChildren: () => import('../config/config.module').then(m => m.ConfigModule)
      },
      {
        path: 'resumen',
        loadChildren: () => import('../resumen/resumen.module').then(m => m.ResumenModule)
      },
      {
        path: 'cartera',
        loadChildren: () => import('../cartera/cartera.module').then(m => m.CarteraModule)
      },
      {
        path: 'lotes',
        loadChildren: () => import('../lotes/lotes.module').then(m => m.LotesModule)
      },
      {
        path: 'renovacion',
        loadChildren: () => import('../renovaciones/renovaciones.module').then(m => m.RenovacionesModule)
      },
      {
        path: 'renovacion-lotes',
        loadChildren: () => import('../lotes-renovaciones/lotes-renovaciones.module').then(m => m.LotesRenovacionesModule)
      },
      {
        path: 'soporte',
        loadChildren: () => import('../soporte/soporte.module').then(m => m.SoporteModule)
      },
      {
        path: 'solicitudesSoporte',
        loadChildren: () => import('../solicitudes/solicitudes.module').then(m => m.SolicitudesModule)
      },
      {
        path: 'bancolombia',
        loadChildren: () => import('../bancolombia/bancolombia.module').then(m => m.BancolombiaModule)
      },
      {
        path: 'Dispersiones',
        loadChildren: () => import('../dispersiones/dispersiones.module').then(m => m.DispersionesModule)
      },
      {
        path: 'comunicaciones',
        loadChildren: () => import('../comunicaciones/comunicaciones.module').then(m => m.ComunicacionesModule)
      },
      {
        path: 'marcaciones',
        loadChildren: () => import('../marcaciones/marcaciones.module').then(m => m.MarcacionesModule)
      },
      {
        path: 'atribuciones',
        loadChildren: () => import('../atribuciones/atribuciones.module').then(m => m.AtribucionesModule)
      },
      {
        path: 'primeraLinea',
        loadChildren: () => import('../motor-roles/motor-roles.module').then(m => m.MotorRolesModule)
      },
    ],
    resolve: {simulador: SimuladorResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule {
}
