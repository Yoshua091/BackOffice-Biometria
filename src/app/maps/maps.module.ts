import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [MapsComponent],
  imports: [
    CommonModule,
    MapsRoutingModule,
    GoogleMapsModule,
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLR8xn_lwuF1taf_oWTD5GVffCefpEMrQ&libraries=places', // Reemplaza con tu clave de API
    }),
  ]
})
export class MapsModule { }
