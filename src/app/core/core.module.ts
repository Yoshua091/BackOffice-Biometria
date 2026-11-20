import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {EstadoSolicitudPipe} from './pipes/estado-solicitud.pipe';
import {DataSolicitudPipe} from './pipes/data-solicitud.pipe';
import { SumaKeysPipe } from './pipes/suma-keys.pipe';
import { BooleanPipe } from './pipes/boolean.pipe';
import {AgePipe} from './pipes/age.pipe';
import { EstadoFechaPipe } from './pipes/estado-fecha.pipe';
import { DataCarteraPipe } from './pipes/data-cartera.pipe';
import {ConfirmarPipe} from './pipes/confirmar.pipe';
import { FinDeSemanaPipe } from './pipes/fin-de-semana.pipe';
import {DetalleMetodosPipe, MostrarDetalleMetodosPipe} from './pipes/detalle-metodos.pipe';
import {InvalidControlPipe} from './pipes/valid-control.pipe';
import {BuscarClientePipe} from './pipes/buscar-cliente.pipe';
import { TooltipDirective } from './directives/tooltip.directive';


@NgModule({
  declarations: [
    EstadoSolicitudPipe,
    DataSolicitudPipe,
    SumaKeysPipe,
    BooleanPipe,
    AgePipe,
    EstadoFechaPipe,
    DataCarteraPipe,
    ConfirmarPipe,
    FinDeSemanaPipe,
    DetalleMetodosPipe,
    MostrarDetalleMetodosPipe,
    InvalidControlPipe,
    BuscarClientePipe,
    TooltipDirective,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [],
  exports: [
    EstadoSolicitudPipe,
    DataSolicitudPipe,
    SumaKeysPipe,
    BooleanPipe,
    AgePipe,
    EstadoFechaPipe,
    DataCarteraPipe,
    ConfirmarPipe,
    FinDeSemanaPipe,
    DetalleMetodosPipe,
    MostrarDetalleMetodosPipe,
    InvalidControlPipe,
    BuscarClientePipe,
    TooltipDirective
  ]
})
export class CoreModule {
}
