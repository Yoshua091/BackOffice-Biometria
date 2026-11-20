import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GestionCarteraComponent} from './gestion-cartera/gestion-cartera.component';
import {CrearAcuerdoPagoComponent} from './crear-acuerdo-pago/crear-acuerdo-pago.component';
import {CarteraComponent} from './cartera.component';
import {ListadoCobranzasComponent} from './listado-cobranzas/listado-cobranzas.component';

const routes: Routes = [
  {
    path: '',
    component: CarteraComponent,
    children: [
      {path: '', component: ListadoCobranzasComponent},
      {path: 'gestionar-cartera', component: GestionCarteraComponent},
      {path: 'crear-acuerdo', component: CrearAcuerdoPagoComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteraRoutingModule { }
