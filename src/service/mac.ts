import { arrayHelper } from './../util/helper/array';
import { accountParams } from './../params/account';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Platform } from "ionic-angular";
import { Injectable } from "@angular/core";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Uid } from "@ionic-native/uid";

@Injectable()
export class MacService {

  private readonly postUrl: string = 'http://192.168.0.197:2222/index.php';
  // private readonly hiddenKey: string = '__SMRPT__';
  private readonly hiddenVal: string = 'Yotrio';

  sendData: any;

  constructor(
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private http: HttpClient,
  ) { }

  /**
   * 发送本机信息到服务器
   */
  sendMacData() {

    if (!this.platformIsAndroid()) return;
    this.checkPermission();

    let data: any = {
      MAC: this.uid.MAC,
      IMEI: this.uid.IMEI,
      UUID: this.uid.UUID,
      ICCID: this.uid.ICCID,
      IMSI: this.uid.IMSI,
      VIEWPORT: document.querySelector("meta[name=viewport]").getAttribute('content')
    };

    this.http.post(this.postUrl, { data: data, __SMRPT__: this.hiddenVal }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(re => console.log(re), err => console.log('出错了：' + err.toString()));
  }

  platformIsAndroid(): boolean {
    return this.platform.is('android');
  }

  getAccountByMac() {
    const localMac: string = this.uid.MAC;
    const accountMacs: Array<string> = arrayHelper._column(accountParams.accounts, 'mac');
    const accountIndex: any = accountMacs.findIndex(mac => mac === localMac);

    if (accountIndex > -1) {
      return accountParams.accounts[accountIndex];
    } else {
      return {};
    }
  }

  private checkPermission() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
      .then(
        result => console.log("Has permission?", result.hasPermission),
        err =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.READ_PHONE_STATE
          )
      );
  }



}
