import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxPage } from './tax';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    TaxPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxPage),
    //用到其他的库，比如：echarts 一定要导入！
    NgxEchartsModule,
  ],
})
export class TaxPageModule { }
