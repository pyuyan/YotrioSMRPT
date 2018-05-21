import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InveststockPage } from './investstock';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    InveststockPage,
  ],
  imports: [
    IonicPageModule.forChild(InveststockPage),
    NgxEchartsModule,
  ],
})
export class InveststockPageModule {}
