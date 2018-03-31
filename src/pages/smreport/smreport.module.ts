import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmreportPage } from './smreport';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    SmreportPage,
  ],
  imports: [
    IonicPageModule.forChild(SmreportPage),
    PipesModule,
    NgxEchartsModule
  ],
})
export class SmreportPageModule {}
