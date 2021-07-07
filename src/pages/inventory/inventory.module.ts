import { InventorymodalPageModule } from './../inventorymodal/inventorymodal.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventoryPage } from './inventory';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    InventoryPage,
  ],
  imports: [
    IonicPageModule.forChild(InventoryPage),
    NgxEchartsModule,
    InventorymodalPageModule,
  ],
})
export class InventoryPageModule { }
