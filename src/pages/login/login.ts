import { arrayHelper } from './../../util/helper/array';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginsvrProvider } from '../../providers/loginsvr/loginsvr';
import { ContextData } from '../../app/context';

import { accountParams } from './../../params/account';
import { eventParams } from './../../params/event';
import { debugParams as debug } from './../../params/debug';

import { Base } from "./../../common/base";
//检查更新service
import { UpdateService } from "./../../service/update";
import { MacService } from './../../service/mac';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends Base {

  private readonly eventTopicLogin = eventParams.common.after.login;

  public loginForm: any;
  public backgroundImage = 'assets/imgs/mountin.jpeg';

  logindata: any = {
    UserCode: debug.activeDebug ? '003001' : '001001',
    UserName: '',
    OrgID: -1,
    OrgCode: '',
    OrgName: '',
    UserPass: '',
    DeptID: '',
    DeptCode: '',
    DeptName: '',
    Location: '',
    LocationName: '',
    Token: '',
    SaveFlag: true
  }

  contextdata: ContextData;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private event: Events,
    private loginSvrTool: LoginsvrProvider,
    private updateServ: UpdateService,
    private macServ: MacService,
  ) {
    super();
    //更改viewport
    this.changeViewPort();
    //初始化上下文
    this.contextdata = ContextData.Create();
    //这里做 更新检测
    this.updateServ.checkUpdate();
    //获取设备硬件信息信息
    this.macServ.sendMacData();
    //根据mac自动登录
    if (!debug.activeDebug && this.macServ.platformIsAndroid() && !this.updateServ.isUpdating) {
      this.autoLogin();
    }
  }

  login() {
    //这里有两套登录策略，1、根据mac地址可以自动登录 2、账号密码登录 3、还需要考虑web端的登录

    this.doLogin();

    // const loading = this.loadingCtrl.create({
    //   duration: 500
    // });

    // loading.onDidDismiss(() => {
    //   this.navCtrl.setRoot(HomePage);
    // });

    // loading.present();

  }

  ionViewDidLoad() {

  }

  changeViewPort() {
    const windowWidth = window.screen.width.toString();
    const windowHeight = window.screen.height.toString();

    let perfectWidth: number = 2380;

    if (windowWidth == '1280' && windowHeight == '720') {
      //这款是 MAXHUB
      perfectWidth = 2300;
    } else if (windowWidth == '1920' && windowHeight == '1080') {
      //这款是 杂牌
      perfectWidth = 2380;
    } else {
      //其他的
      perfectWidth = 2560;
    }

    // let viewport = document.querySelector("meta[name=viewport]");
    // let content:string = 'viewport-fit=cover, width=device-width, initial-scale='+
    // Math.pow(document.documentElement.clientWidth/2380,1).toString()
    // Math.pow(window.screen.width/document.documentElement.clientWidth, 1).toString()
    // +', minimum-scale=0.2, maximum-scale=3.0, user-scalable=no';
    // viewport.setAttribute('content',content);   

    let viewport = document.querySelector("meta[name=viewport]");
    let content: string = 'viewport-fit=cover, width=device-width, initial-scale=' + Math.pow(document.documentElement.clientWidth / perfectWidth, 1).toString() + ', minimum-scale=0.2, maximum-scale=3.0, user-scalable=no';
    viewport.setAttribute('content', content);
  }

  goToSignup() {
    // this.navCtrl.push(SignupPage);
  }

  goToResetPassword() {
    // this.navCtrl.push(ResetPasswordPage);
  }

  private autoLogin() {
    let accountObj = this.macServ.getAccountByMac();
    if (Object.keys(accountObj).length == 0) {
      return this.showAlert(this.alertCtrl, '自动登录失败，请您输入密码，手动登录！');
    }
    this.logindata.UserCode = accountObj['account'];
    this.event.publish(this.eventTopicLogin, { loginData: this.logindata, accountData: accountObj });
  }

  private doLogin() {
    const accounts = accountParams.accounts;
    const userCodes = arrayHelper._column(accountParams.accounts, 'account');

    let userData = this.logindata, accountObj: any = {};;

    const userCode = userData.UserCode;
    const userPass = userData.UserPass;

    try {
      if (!userCodes.includes(userCode)) throw "账号不存在！";
      accountObj = accounts[userCodes.indexOf(userCode)];
      if (accountObj.password != userPass) throw '密码错误！';
      this.logindata.UserCode = userCode;
      this.event.publish(this.eventTopicLogin, { loginData: this.logindata, accountData: accountObj });
    } catch (error) {
      return this.showAlert(this.alertCtrl, error);
    }
  }
}
