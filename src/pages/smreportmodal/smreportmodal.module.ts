import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmreportmodalPage } from './smreportmodal';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    SmreportmodalPage,
  ],
  imports: [
    IonicPageModule.forChild(SmreportmodalPage),
    NgxPaginationModule
  ],
})
export class SmreportmodalPageModule { }
