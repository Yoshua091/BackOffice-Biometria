import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComunicacionesRoutingModule } from './comunicaciones-routing.module';
import { ComunicacionesComponent } from './comunicaciones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDatepickerModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { RegistrarComunicadoComponent } from './registrar-comunicado/registrar-comunicado.component';
import { ListarComunicadoComponent } from './listar-comunicado/listar-comunicado.component';


@NgModule({
  declarations: [
    ComunicacionesComponent,
    RegistrarComunicadoComponent,
    ListarComunicadoComponent],
  imports: [
    CommonModule,
    ComunicacionesRoutingModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    CoreModule,
    NgbNavModule,
    NgbDatepickerModule,
    NgbModule
  ]
})
export class ComunicacionesModule { }
