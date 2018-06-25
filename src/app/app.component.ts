import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ContextData } from './context';
import { SmreportPage } from '../pages/smreport/smreport';
import { TaxPage } from '../pages/tax/tax';
import { InventoryPage } from '../pages/inventory/inventory';
import { ManagementPage } from '../pages/management/management';
import { InveststockPage } from './../pages/investstock/investstock';
import { InvestrightPage } from './../pages/investright/investright';
import { ReworkPage } from './../pages/rework/rework';
import { DatasvrProvider } from '../providers/datasvr/datasvr';

import { urlParams } from "./../params/url";
import { ReportPage } from '../pages/report/report';

@Component({
  templateUrl: 'app.html'
})
export class YotrioSMRPT {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  contextdata: ContextData;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public screenOrientation: ScreenOrientation,
    private datasvr: DatasvrProvider,
    private event: Events,
  ) {

    this.contextdata = ContextData.Create();

    this.contextdata.SetESBPortal(urlParams.ESBPortal);
    //初始化上下文
    if (ContextData.inited === false) {
      ContextData.InitContextData();
    }

    this.initializeApp();

    //screenOrientation.lock('landscape-primary');
    // used for an example of ngFor and navigation
    this.pages = [
      // ******总经办******
      { title: '制造数据中心', component: HomePage },
      { title: '营销数据中心', component: SmreportPage },
      { title: '税务数据中心', component: TaxPage },
      { title: '库存数据中心', component: InventoryPage },
      { title: '经营数据中心', component: ManagementPage },
      { title: '股票投资数据', component: InveststockPage },
      { title: '股权投资数据', component: InvestrightPage },
      // { title: '投资简报数据', component: ReportPage },

      // ******制造中心******
      // { title: '返工数据中心', component: ReworkPage },


      //{ title: '', component: SOCountPage }
    ];

    let TMPDataRefresh = function (datasvrprovider: DatasvrProvider) {
      datasvrprovider.IsNeedUpdate('TMP_SMTransferData').then(flag => {
        if (flag) {
          datasvrprovider.GetKeyDepts().then(result => {

          });
          //获取今年时间 截取末两位数字 e.g. 2018 为：18 note：实际为 今年+1 表示实际接单数据
          const currentYear = (Number((new Date).getFullYear().toString().slice(-2)) + 1).toString();
          datasvrprovider.SyncLastSMReportData(currentYear).then(result => {
            console.log(ContextData.OriginalDatas['TMP_SMTransferData'].UpdateFlag);
          });
          //年度税务数据
          datasvrprovider.syncYearTaxData();
          //库存情况数据
          datasvrprovider.syncYearInventoryData();
          //股票投资数据
          datasvrprovider.syncInvStockData();
          //股权投资数据
          datasvrprovider.syncInvRightData();
          //经营业绩数据
          datasvrprovider.syncBizProfitData();

        }
      });
    };

    let GetKeyDepts = function (datasvrprovider: DatasvrProvider) {
      datasvrprovider.GetKeyDepts().then(result => {

      })
    };

    setTimeout(TMPDataRefresh, 500, this.datasvr);
    //setTimeout(GetKeyDepts,1000,this.datasvr);

    setInterval(TMPDataRefresh, 300000, this.datasvr);
    //setInterval(GetKeyDepts,3600000,this.datasvr);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
