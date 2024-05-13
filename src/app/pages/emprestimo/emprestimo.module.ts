import { NgModule } from '@angular/core';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { UIModule } from '../../shared/ui/ui.module';

import { EmprestimoRoutingModule } from './emprestimo-routing.module';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SimularComponent } from './simular/simular.component';
import { ContratarComponent } from './contratar/contratar.component';
import { ListComponent } from './list/list.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [SimularComponent
    , ContratarComponent
   , ListComponent],
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    UIModule,
    EmprestimoRoutingModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxSliderModule
  ],
  providers: [provideNgxMask(),TabsetConfig, DatePipe],
})
export class EmprestimoModule {}
