import { Platform, AlertController, LoadingController, Content } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { mathHelper } from "./../util/helper/math";

import { Params } from "./../app/params";


@Injectable()
export class UpdateService {

    /**
     * 当前的版本号
     */
    versionNumber: string = '0.0.0';

    /**
     * apk下载地址
     */
    apkUrl: string = '';
    /**
     * ios跳转的地址
     */
    ipaUrl: string = '';
    /**
     * 升级描述
     */
    updateDesc: string = '';

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(
        private appVersion: AppVersion,
        private file: File,
        private fileOpener: FileOpener,
        private transfer: FileTransfer,
        public platform: Platform,
        public alertCtrl: AlertController,
        public http: HttpClient,
        public loadingCtrl: LoadingController
    ) {
        if (this.platformCouldUpdate()) {
            this.appVersion.getVersionNumber().then(v => {
                this.versionNumber = v;
            });
        }
    }

    /**
     * 检查当前平台是否可以更新，这里我们只更新 安卓 的版本
     */
    platformCouldUpdate(): boolean {
        return this.platform.is('android');
    }

    checkUpdate(updateCheckUrl: string = Params.AppUpdateCheckUrl) {
        if (!this.platformCouldUpdate()) return;
        this.http.get(updateCheckUrl, { headers: this.headers }).toPromise()
            .then(res => {
                console.log('服务器的版本数据:');
                console.log(res)
                //TODO 考虑到没有写入权限时候的弹窗提示 2018年4月26日17:04:01
                let currentVer = this.versionNumber;
                let targetVer = res['version'];
                if (mathHelper.versionCompare(targetVer, currentVer)) {
                    console.log(targetVer)
                    if (res['app_url_android']) {
                        this.apkUrl = res['app_url_android'];
                        this.updateDesc = res['desc'] || '';
                        this.doUpdate();
                    } else {
                        console.log('服务器获取版本数据成功，无安卓版本下载地址')
                    }
                }
            })
            .catch(err => {
                console.log('请求失败！' + err)
            });

    }

    doUpdate(force: boolean = true) {

        if (force) {
            return this.downloadApp();
        }
        this.alertCtrl.create({
            title: '发现新版本,是否升级？',
            subTitle: this.updateDesc,
            buttons: [{
                text: '取消'
            }, {
                text: '确定',
                handler: () => {
                    this.downloadApp();
                }
            }]
        }).present();
    }

    downloadApp() {
        const desc = "系统版本升级中，请勿关机......下载进度：";
        // let alert = this.alertCtrl.create({
        //     title: '下载进度：0%',
        //     enableBackdropDismiss: false,
        //     buttons: ['后台下载']
        // });
        // alert.present();
        let loading = this.loadingCtrl.create({
            content: desc + '0%',
            dismissOnPageChange: false
        });
        loading.present();

        const fileTransfer: FileTransferObject = this.transfer.create();
        const apk = this.file.externalRootDirectory + 'Yotiro.apk'; //apk保存的目录

        fileTransfer.download(this.apkUrl, apk).then(() => {
            this.fileOpener.open(apk, 'application/vnd.android.package-archive').then(() => {
                console.log('File is opened')
            }).catch(e => {
                console.log('Error openening file', e)
            });
        });
        fileTransfer.onProgress((event: ProgressEvent) => {
            let num = Math.floor(event.loaded / event.total * 100);
            if (num === 100) {
                // alert.dismiss();
                loading.dismiss();
            } else {
                // let title = document.getElementsByClassName('alert-title')[0];
                // title && (title.innerHTML = '下载进度：' + num + '%');
                loading.setContent(desc + num + '%');
            }
        });
    }

}