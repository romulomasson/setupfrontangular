import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'funcionario', loadChildren: () => import('./funcionario/funcionario.module').then(m => m.FuncionarioModule) },
  { path: 'emprestimo', loadChildren: () => import('./emprestimo/emprestimo.module').then(m => m.EmprestimoModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
