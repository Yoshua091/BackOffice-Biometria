import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./template/template.module').then(m => m.TemplateModule)},
  {path: 'session', loadChildren: () => import('./session/session.module').then(m => m.SessionModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
