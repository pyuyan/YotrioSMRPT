import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { MfgcountmodelPageModule } from './mfgcountmodel.module';
import { SecloginmodelPageModule } from '../secloginmodel/secloginmodel.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    NgxEchartsModule,
    SecloginmodelPageModule,
    MfgcountmodelPageModule
  ],
  exports: [
    HomePage,
  ],
})
export class HomePageModule { }
