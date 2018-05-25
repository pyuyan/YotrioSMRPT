import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InveststockPage } from './investstock';
import { NgxEchartsModule } from 'ngx-echarts';
import { PopperiodPageModule } from './../popperiod/popperiod.module';

@NgModule({
  declarations: [
    InveststockPage,
  ],
  imports: [
    IonicPageModule.forChild(InveststockPage),
    NgxEchartsModule,
    PopperiodPageModule
  ],
})
export class InveststockPageModule { }
