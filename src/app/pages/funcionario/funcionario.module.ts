import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { UIModule } from '../../shared/ui/ui.module';

import {FuncionarioRoutingModule} from "./funcionario-routing.module";
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { UploadComponent } from './upload/upload.component';
import { IdService } from './id.service';


import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

// dropzone
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropzoneModule } from 'ngx-dropzone-wrapper';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    FuncionarioRoutingModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropzoneModule
  ],
  providers: [provideNgxMask(),
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ,IdService]
})

export class FuncionarioModule { }
