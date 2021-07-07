import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReworkPage } from './rework';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    ReworkPage,
  ],
  imports: [
    IonicPageModule.forChild(ReworkPage),
    NgxEchartsModule,
  ],
})
export class ReworkPageModule {}
