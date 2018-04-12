import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { GrossmodelPage } from './grossmodel';
import { MfgcountmodelPage } from './mfgcountmodel';

@NgModule({
  declarations: [
    HomePage,
    GrossmodelPage,
    MfgcountmodelPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    NgxEchartsModule
  ],
  exports:[
    HomePage,
    GrossmodelPage,
    MfgcountmodelPage
  ],
  entryComponents: [
    GrossmodelPage,
    MfgcountmodelPage
  ],
})
export class HomePageModule {}
