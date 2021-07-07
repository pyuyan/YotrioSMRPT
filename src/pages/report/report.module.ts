import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportPage } from './report';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    PdfViewerModule
  ],
})
export class ReportPageModule { }
