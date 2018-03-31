import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { GrossmodelPage } from './grossmodel';

@NgModule({
  declarations: [
    HomePage,
    GrossmodelPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    NgxEchartsModule
  ],
  exports:[
    HomePage,
    GrossmodelPage
  ],
  entryComponents: [
    GrossmodelPage
  ],
})
export class HomePageModule {}
