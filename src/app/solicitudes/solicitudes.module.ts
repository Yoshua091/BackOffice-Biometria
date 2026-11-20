import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudesRoutingModule } from './solicitudes-routing.module';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { EnviarSolicitudModalComponent } from './modales/enviar-solicitud-modal/enviar-solicitud-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferirSolicitudesComponent } from './transferir-solicitudes/transferir-solicitudes.component';
import { DesembolsosComponent } from './desembolsos/desembolsos.component';
import { ListaSolicitudesComponent } from './lista-solicitudes/lista-solicitudes.component';
import { CardDesembolsosComponent } from './card-desembolsos/card-desembolsos.component';


@NgModule({
  declarations: [SolicitudesComponent, EnviarSolicitudModalComponent, TransferirSolicitudesComponent, DesembolsosComponent, ListaSolicitudesComponent, CardDesembolsosComponent],
  imports: [
    CommonModule,
    SolicitudesRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    NgbModule
  ]
})
export class SolicitudesModule { }
