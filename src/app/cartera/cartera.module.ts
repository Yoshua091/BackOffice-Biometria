import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbDatepickerModule, NgbNavModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

import { CarteraRoutingModule } from './cartera-routing.module';
import {ListadoCobranzasComponent} from './listado-cobranzas/listado-cobranzas.component';
import {CrearAcuerdoPagoComponent} from './crear-acuerdo-pago/crear-acuerdo-pago.component';
import {GestionCarteraComponent} from './gestion-cartera/gestion-cartera.component';
import {RegComentarioModalComponent, SeleccionarClienteModalComponent} from './modales';
import {CoreModule} from '../core/core.module';
import {CobranzasService} from './cobranzas.service';
import {CarteraComponent} from './cartera.component';


@NgModule({
  declarations: [
    CarteraComponent,
    ListadoCobranzasComponent,
    CrearAcuerdoPagoComponent,
    GestionCarteraComponent,
    RegComentarioModalComponent,
    SeleccionarClienteModalComponent,
  ],
  imports: [
    CommonModule,
    CarteraRoutingModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbNavModule,
    NgbPaginationModule,
    CoreModule
  ],
  providers: [
    CobranzasService,
  ],
})
export class CarteraModule { }
