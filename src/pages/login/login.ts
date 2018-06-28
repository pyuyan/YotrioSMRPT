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

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends Base {

  private readonly eventTopicLogin = eventParams.common.after.login;

  public loginForm: any;
  public backgroundImage = 'assets/imgs/mountin.jpeg';

  logindata: any = {
    UserCode: debug.activeDebug ? '00300001' : '00100001',
    UserName: '',
    OrgID: -1,
    OrgCode: '',
    OrgName: '',
    UserPass: '123456',
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
    private updateServ: UpdateService
  ) {
    super();
    //初始化上下文
    this.contextdata = ContextData.Create();
    //这里做 更新检测
    this.updateServ.checkUpdate();
    //TODO 获取设备信息, IP信息
  }

  login() {

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

  ionViewWillEnter() {
    //首页已经写死
    // let viewport = document.querySelector("meta[name=viewport]");
    // let content:string = 'viewport-fit=cover, width=device-width, initial-scale='+
    // Math.pow(document.documentElement.clientWidth/2380,1).toString()
    // Math.pow(window.screen.width/document.documentElement.clientWidth, 1).toString()
    // +', minimum-scale=0.2, maximum-scale=3.0, user-scalable=no';
    // viewport.setAttribute('content',content);   
  }

  goToSignup() {
    // this.navCtrl.push(SignupPage);
  }

  goToResetPassword() {
    // this.navCtrl.push(ResetPasswordPage);
  }

  private doLogin() {
    //这里有两套登录策略，1、根据mac地址可以自动登录 2、账号密码登录 3、还需要考虑web端的登录
    const accounts = accountParams.accounts;
    const userCodes = arrayHelper._column(accountParams.accounts, 'account');

    let userData = this.logindata, accountObj: any = {};;

    const userCode = userData.UserCode;
    const userPass = userData.UserPass;

    let errMsg: string = '';
    if (!userCodes.includes(userCode)) {
      errMsg = '账号不存在！';
    } else {
      accountObj = accounts[userCodes.indexOf(userCode)];
      if (accountObj.password != userPass) {
        errMsg = '密码错误！';
      }
    }

    if (errMsg.length) {
      return this.showAlert(this.alertCtrl, errMsg);
    } else {
      this.logindata.UserCode = userCode;
      this.event.publish(this.eventTopicLogin, { loginData: this.logindata, accountData: accountObj });
    }
  }
}
