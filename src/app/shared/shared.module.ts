import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MenuToggleAnchorDirective, MenuToggleDirective, MenuToggleLinkDirective} from './menu/menu-toggle';
import {CloseSidebar, Sidebar, SidebarContainer} from './ng-sidebar';
import { SvgDirective } from './svg.directive';
import { AlertComponent } from './alert/alert.component';
import {CoreModule} from '../core/core.module';
import { HistorialItemComponent } from './historial-item/historial-item.component';
import { ListaPropuestasComponent } from './lista-propuestas/lista-propuestas.component';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardPropuestaComponent } from './card-propuesta/card-propuesta.component';


@NgModule({
  declarations: [
    MenuToggleAnchorDirective,
    MenuToggleLinkDirective,
    MenuToggleDirective,
    SidebarContainer,
    Sidebar,
    CloseSidebar,
    SvgDirective,
    AlertComponent,
    HistorialItemComponent,
    ListaPropuestasComponent,
    ComentariosComponent,
    CardPropuestaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    MenuToggleAnchorDirective,
    MenuToggleLinkDirective,
    MenuToggleDirective,
    SidebarContainer,
    Sidebar,
    CloseSidebar,
    SvgDirective,
    HistorialItemComponent,
    ListaPropuestasComponent,
    ComentariosComponent,
    ComentariosComponent,
    CardPropuestaComponent,
  ]
})
export class SharedModule { }
