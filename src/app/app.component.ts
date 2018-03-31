import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ContextData } from './context';
import { SmreportPage } from '../pages/smreport/smreport';


@Component({
  templateUrl: 'app.html'
})
export class YotrioSMRPT {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  contextdata:ContextData;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public screenOrientation:ScreenOrientation) {

      this.contextdata = ContextData.Create();
      //初始化上下文
      if(ContextData.inited === false){
        ContextData.InitContextData();
      }      

      this.initializeApp();

      //screenOrientation.lock('landscape-primary');
      // used for an example of ngFor and navigation
      this.pages = [
        { title: '制造数据中心', component: HomePage },
      { title: '营销数据中心', component: SmreportPage },
        //{ title: '', component: SOCountPage }
      ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        setTimeout(()=>{
          this.splashScreen.hide();
        },100);      
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
