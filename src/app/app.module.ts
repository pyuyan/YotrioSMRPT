import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { YotrioSMRPT } from './app.component';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { NgxEchartsModule } from 'ngx-echarts';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoginsvrProvider } from '../providers/loginsvr/loginsvr';
import { DatasvrProvider } from '../providers/datasvr/datasvr';
import { UpdateService } from '../service/update';
import { CacheService } from '../service/cache';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';

import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { HttpClientModule } from '@angular/common/http';
import { SmreportPage } from '../pages/smreport/smreport';
import { PipesModule } from '../pipes/pipes.module';
import { PercentPipe } from '@angular/common';
import { ThousandsPipe } from '../pipes/thousands/thousands';
import { HomePageModule } from '../pages/home/home.module';
import { SmreportPageModule } from '../pages/smreport/smreport.module';
import { SecloginmodelPageModule } from '../pages/secloginmodel/secloginmodel.module';
import { SmreportmodalPageModule } from '../pages/smreportmodal/smreportmodal.module';

@NgModule({
  declarations: [
    YotrioSMRPT,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(YotrioSMRPT),
    IonicStorageModule.forRoot(),
    HomePageModule,
    SmreportPageModule,
    SecloginmodelPageModule,
    SmreportmodalPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    YotrioSMRPT,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion, File, FileOpener, FileTransfer, FileTransferObject,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ScreenOrientation,
    LoginsvrProvider,
    DatasvrProvider,
    UpdateService, CacheService
  ],
})
export class AppModule {}
