import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { MfgcountmodelPage } from './mfgcountmodel';

@NgModule({
  declarations: [
    HomePage,
    MfgcountmodelPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    NgxEchartsModule
  ],
  exports:[
    HomePage,
    MfgcountmodelPage
  ],
  entryComponents: [
    MfgcountmodelPage
  ],
})
export class HomePageModule {}
