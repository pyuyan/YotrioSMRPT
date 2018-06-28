import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController } from 'ionic-angular';
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

import { eventParams } from './../params/event';
import { urlParams } from "./../params/url";
import { ReportPage } from '../pages/report/report';

@Component({
  templateUrl: 'app.html'
})
export class YotrioSMRPT {
  @ViewChild(Nav) nav: Nav;

  //登陆后的事件主题
  private readonly eventTopicLogin = eventParams.common.after.login;

  rootPage: any = LoginPage;

  contextdata: ContextData;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public screenOrientation: ScreenOrientation,
    public loadingCtl: LoadingController,
    private datasvr: DatasvrProvider,
    private event: Events,
  ) {
    //初始化
    this.init();
    //触发事件
    this.fireEvent();
    //注册更新函数
    this.registerFunc();
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
    this.nav.setRoot(page.component);
  }

  private init() {

    this.contextdata = ContextData.Create();

    this.contextdata.SetESBPortal(urlParams.ESBPortal);
    //初始化上下文
    if (ContextData.inited === false) {
      ContextData.InitContextData();
    }

    this.initializeApp();

    this.pages = [
      // ******总经办******
      // { title: '制造数据中心', component: HomePage },
      // { title: '营销数据中心', component: SmreportPage },
      // { title: '税务数据中心', component: TaxPage },
      // { title: '库存数据中心', component: InventoryPage },
      // { title: '经营数据中心', component: ManagementPage },
      // { title: '股票投资数据', component: InveststockPage },
      // { title: '股权投资数据', component: InvestrightPage },
      // { title: '投资简报数据', component: ReportPage },

      // ******制造中心******
      // { title: '返工数据中心', component: ReworkPage },
    ];
  }

  private fireEvent() {
    this.event.subscribe(this.eventTopicLogin, data => {
      const loading = this.loadingCtl.create({
        duration: 1000,
        content: '登录中...',
      });
      loading.present();

      ContextData.currentUser = data;

      loading.onDidDismiss(() => {
        this.pages = data.accountData.workground;
        this.nav.setRoot(this.pages[0].component);
      });
    });
  }

  private registerFunc() {
    let TMPDataRefresh = function (datasvrprovider: DatasvrProvider) {
      datasvrprovider.IsNeedUpdate('TMP_SMTransferData').then(flag => {
        if (flag) {
          datasvrprovider.GetKeyDepts().then(result => { });
          //获取今年时间 截取末两位数字 e.g. 2018 为：18 note：实际为 今年+1 表示实际接单数据
          const currentYear = (Number((new Date).getFullYear().toString().slice(-2)) + 1).toString();
          datasvrprovider.SyncLastSMReportData(currentYear).then(result => { });
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
          //制造部门的返工数据
          datasvrprovider.syncReworkData();
        }
      });
    };

    let GetKeyDepts = function (datasvrprovider: DatasvrProvider) {
      datasvrprovider.GetKeyDepts().then(result => { });
    };

    setTimeout(TMPDataRefresh, 500, this.datasvr);

    setInterval(TMPDataRefresh, 300000, this.datasvr);
  }
}
