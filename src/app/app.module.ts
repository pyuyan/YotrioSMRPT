import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { YotrioSMRPT } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoginsvrProvider } from '../providers/loginsvr/loginsvr';
import { DatasvrProvider } from '../providers/datasvr/datasvr';
import { UpdateService } from '../service/update';
import { CacheService } from '../service/cache';
import { HttpService } from '../service/http';
import { DateService } from '../service/date';
import { FTPService } from '../service/ftp';
import { MacService } from './../service/mac';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FTP } from "@ionic-native/ftp";
import { Uid } from "@ionic-native/uid";
import { AndroidPermissions } from "@ionic-native/android-permissions";


import { HttpClientModule } from '@angular/common/http';
import { HomePageModule } from '../pages/home/home.module';
import { SmreportPageModule } from '../pages/smreport/smreport.module';
import { TaxPageModule } from '../pages/tax/tax.module';
import { InventoryPageModule } from '../pages/inventory/inventory.module';
import { ManagementPageModule } from '../pages/management/management.module';
import { InveststockPageModule } from './../pages/investstock/investstock.module';
import { InvestrightPageModule } from './../pages/investright/investright.module';
import { ReportPageModule } from './../pages/report/report.module';
import { ReworkPageModule } from './../pages/rework/rework.module';

@NgModule({
  declarations: [
    YotrioSMRPT,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgxEchartsModule,
    HttpClientModule,
    IonicModule.forRoot(YotrioSMRPT),
    IonicStorageModule.forRoot(),
    HomePageModule,
    SmreportPageModule,
    TaxPageModule,
    InventoryPageModule,
    ManagementPageModule,
    InveststockPageModule,
    InvestrightPageModule,
    ReportPageModule,
    ReworkPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    YotrioSMRPT,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion, File, FileOpener, FileTransfer, FileTransferObject, DocumentViewer, FTP, Uid, AndroidPermissions,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ScreenOrientation,
    LoginsvrProvider,
    DatasvrProvider,
    UpdateService, CacheService, HttpService, DateService, FTPService, MacService
  ],
})
export class AppModule { }
