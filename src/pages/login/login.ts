import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginsvrProvider } from '../../providers/loginsvr/loginsvr';
import { ContextData } from '../../app/context';
import { SmreportPage } from '../smreport/smreport';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: any;
  public backgroundImage = 'assets/imgs/mountin.jpeg';

  logindata:any = {
    UserCode:'00100001',
    UserName:'',
    OrgID:-1,
    OrgCode:'',
    OrgName:'',
    UserPass:'123456',
    DeptID:'',
    DeptCode:'',
    DeptName:'',
    Location:'',
    LocationName:'',
    Token:'',
    SaveFlag:true
  }

  contextdata:ContextData;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loginSvrTool:LoginsvrProvider,
  ) {
        //初始化上下文
        this.contextdata = ContextData.Create();
   }

  login() {
    const loading = this.loadingCtrl.create({
      duration: 500
    });

    loading.onDidDismiss(() => {
      this.navCtrl.setRoot(HomePage);
    });

    loading.present();

  }

  ionViewDidLoad(){
    let viewport = document.querySelector("meta[name=viewport]");
    let content:string = 'viewport-fit=cover, width=device-width, initial-scale='+
    // Math.pow(document.documentElement.clientWidth/2380,1).toString()
    1
    +', minimum-scale=0.2, maximum-scale=3.0, user-scalable=no';
    viewport.setAttribute('content',content);
  }

  goToSignup() {
    // this.navCtrl.push(SignupPage);
  }

  goToResetPassword() {
    // this.navCtrl.push(ResetPasswordPage);
  }
}
