import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagementPage } from './management';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    ManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagementPage),
    NgxEchartsModule,
  ],
})
export class ManagementPageModule { }
