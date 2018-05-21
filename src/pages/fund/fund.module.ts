import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FundPage } from './fund';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    FundPage,
  ],
  imports: [
    IonicPageModule.forChild(FundPage),
    NgxEchartsModule,
  ],
})
export class FundPageModule { }
