import { NgModule } from '@angular/core';
import { MfgcountmodelPage } from "./mfgcountmodel";
import { PipesModule } from '../../pipes/pipes.module';
import { IonicPageModule } from 'ionic-angular';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    declarations: [
        MfgcountmodelPage,
    ],
    imports: [
        IonicPageModule.forChild(MfgcountmodelPage),
        NgxPaginationModule,
        PipesModule,
    ],
})
export class MfgcountmodelPageModule { }
