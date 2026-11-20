import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComunicacionesComponent } from './comunicaciones.component';
import { ListarComunicadoComponent } from './listar-comunicado/listar-comunicado.component';
import { RegistrarComunicadoComponent } from './registrar-comunicado/registrar-comunicado.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'registrarComunicado', component: ListarComunicadoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ComunicacionesRoutingModule { }
