import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TemplateRoutingModule} from './template-routing.module';
import {TemplateComponent} from './template.component';
import {NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {AppDateAdapterFormatter, AppDateParserFormatter} from './template-date-picker-adapter.service';
import {SharedModule} from '../shared/shared.module';
import {HeaderComponent} from './header/header.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {TemplateGuard} from './template-guard.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {Configuracion} from '../core/entities/configuracion';
import {STORAGE_KEYS} from '../core/constants';

export const CONFIGURACIONES: Configuracion = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)) || {};

@NgModule({
  declarations: [TemplateComponent, HeaderComponent, SidebarComponent],
  imports: [
    CommonModule,
    SharedModule,
    TemplateRoutingModule,
    NgxSpinnerModule,
  ],
  providers: [
    TemplateGuard,
    {provide: NgbDateParserFormatter, useClass: AppDateParserFormatter},
    {provide: NgbDateAdapter, useClass: AppDateAdapterFormatter},
    {provide: Configuracion, useValue:  CONFIGURACIONES},
  ]
})
export class TemplateModule {
}
