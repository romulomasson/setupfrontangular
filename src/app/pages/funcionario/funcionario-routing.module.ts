import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from "./list/list.component"; 
import { EditComponent } from "./edit/edit.component"; 
import { UploadComponent } from "./upload/upload.component"; 

const routes: Routes = [
   {
    path:"list",
    component:ListComponent
   },
   {
    path: 'edit',
    component: EditComponent
    },
    {
        path: 'upload',
        component: UploadComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FuncionarioRoutingModule {}
