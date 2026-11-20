import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CoreModule} from './core/core.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './core/auth.interceptor';
import {AlertsInterceptor} from './alerts.interceptor';
import { AtribucionesComponent } from './atribuciones/atribuciones.component';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    NgbModule,
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    [
      {provide: HTTP_INTERCEPTORS, useClass: AlertsInterceptor, multi: true},
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
    ],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
