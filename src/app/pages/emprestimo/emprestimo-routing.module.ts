import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimularComponent } from "./simular/simular.component"; 
import { ContratarComponent } from "./contratar/contratar.component"; 
import { ListComponent } from "./list/list.component"; 

const routes: Routes = [
   {
    path:"simular",
    component:SimularComponent
   },
   {
    path:"contratar",
    component:ContratarComponent
   },
   {
    path:"list",
    component:ListComponent
   }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmprestimoRoutingModule {}
