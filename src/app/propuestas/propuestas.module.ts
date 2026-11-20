import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {PropuestasRoutingModule} from './propuestas-routing.module';
import {PropuestasComponent} from './propuestas.component';
import {ListadoPropuestasComponent} from './listado/listado-propuestas.component';
import {DetallePropuestaComponent} from './detalle/detalle-propuesta.component';
import {ValidarDocsModalComponent} from './modales/validar-docs-modal/validar-docs-modal.component';
import {RechazarDocsModalComponent} from './modales/rechazar-docs-modal/rechazar-docs-modal.component';
import {BuscarPropHeaderComponent} from './buscar/buscar-prop-header.component';
import {FiltrarPropHeaderComponent} from './filtrar/filtrar-prop-header.component';
import {CoreModule} from '../core/core.module';
import { ConfirmarRefComponent } from './modales/confirmar-ref/confirmar-ref.component';
import { AjustarMontosComponent } from './modales/ajustar-montos/ajustar-montos.component';
import { ValidarOtpComponent } from './modales/validar-otp/validar-otp.component';
import {SharedModule} from '../shared/shared.module';
import { HistorialComponent } from './modales/historial/historial.component';
import { EdicionCamposModalComponent } from './modales/edicion-campos-modal/edicion-campos-modal.component';
import { SolicitudesModalLogComponent } from './modales/solicitudes-modal-log/solicitudes-modal-log.component';
import { DetalleMetodosComponent } from './modales/detalle-metodos/detalle-metodos.component';
import { CausalRechazoDevolucionComponent } from './modales/causal-rechazo-devolucion/causal-rechazo-devolucion.component';
import { DetalleMontosComponent } from './modales/detalle-montos/detalle-montos.component';
import { CreditosClienteComponent } from './modales/creditos-cliente/creditos-cliente.component';
import { AsignarComiteComponent } from './modales/asignar-comite/asignar-comite.component';
import { CausalDevolucionComponent } from './modales/causal-devolucion/causal-devolucion.component';
import { DistanciaFotosModalComponent } from './modales/distancia-fotos-modal/distancia-fotos-modal.component';
import { MotivosRechazoAltairComponent } from './modales/motivos-rechazo-altair/motivos-rechazo-altair.component';
import { ModificarDatosClienteComponent } from './modales/modificar-datos-cliente/modificar-datos-cliente.component';
import { LogSiifModalComponent } from './modales/log-siif-modal/log-siif-modal.component';
import { ValidarSegurosModalComponent } from './modales/validar-seguros-modal/validar-seguros-modal.component';
import { CargosFijosComponent } from './modales/cargos-fijos/cargos-fijos.component';
import { EdicionDesembolsoComponent } from './modales/edicion-desembolso/edicion-desembolso.component';
import { VentaSegurosComponent } from './modales/venta-seguros/venta-seguros.component';
import { OtpComponent } from './modales/venta-seguros/otp/otp.component';
import { BeneficiariosComponent } from './modales/venta-seguros/beneficiarios/beneficiarios.component';
import { AseguradosComponent } from './modales/venta-seguros/asegurados/asegurados.component';
import { BeneficiariosAccidentesPersonlaesComponent } from './modales/venta-seguros/beneficiarios-accidentes-personlaes/beneficiarios-accidentes-personlaes.component';
import { GenerarPreguntasComponent } from './modales/generar-preguntas/generar-preguntas.component';
import { MipymeComponent } from './modales/venta-seguros/mipyme/mipyme.component';
import { BuscarCoincidenciasModalComponent } from './modales/buscar-coincidencias-modal/buscar-coincidencias-modal.component';

@NgModule({
  declarations: [
    PropuestasComponent,
    ListadoPropuestasComponent,
    DetallePropuestaComponent,
    ValidarDocsModalComponent,
    RechazarDocsModalComponent,
    FiltrarPropHeaderComponent,
    BuscarPropHeaderComponent,
    ConfirmarRefComponent,
    AjustarMontosComponent,
    ValidarOtpComponent,
    HistorialComponent,
    EdicionCamposModalComponent,
    SolicitudesModalLogComponent,
    DetalleMetodosComponent,
    CausalRechazoDevolucionComponent,
    DetalleMontosComponent,
    CreditosClienteComponent,
    AsignarComiteComponent,
    CausalDevolucionComponent,
    DistanciaFotosModalComponent,
    MotivosRechazoAltairComponent,
    ModificarDatosClienteComponent,
    LogSiifModalComponent,
    ValidarSegurosModalComponent,
    CargosFijosComponent,
    EdicionDesembolsoComponent,
    VentaSegurosComponent,
    BeneficiariosComponent,
    AseguradosComponent,
    BeneficiariosAccidentesPersonlaesComponent,
    OtpComponent,
    GenerarPreguntasComponent,
    MipymeComponent,
    BuscarCoincidenciasModalComponent
  ],
  imports: [
    PropuestasRoutingModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FormsModule
  ]
})
export class PropuestasModule {
}
