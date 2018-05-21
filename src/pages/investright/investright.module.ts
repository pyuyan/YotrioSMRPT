import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvestrightPage } from './investright';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    InvestrightPage,
  ],
  imports: [
    IonicPageModule.forChild(InvestrightPage),
    NgxEchartsModule,
  ],
})
export class InvestrightPageModule {}
