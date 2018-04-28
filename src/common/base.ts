import { NavController, IonicPage, ModalController, LoadingController, AlertController, ToastController, Toast } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';

import { mathHelper } from './../util/helper/math';
import { debugHelper } from './../util/helper/debug';

/**
 * 共用抽象类
 */
export abstract class Base {

    /**
     * 用于时间显示
     */
    timevalue: string = (new Date()).toLocaleString();

    @ViewChild('clockcontrol') clockctrl: any

    constructor() { }

    /**
     * 显示当前时间
     */
    showCurrentTime() {
        if (this.clockctrl) {
            setInterval(function (clock_ctrl) {
                let timevalue: string = (new Date()).toLocaleString();
                if (clock_ctrl) {
                    clock_ctrl.setValue(timevalue);
                }
            }, 1000, this.clockctrl);
        }
    }

    /**
     * 格式化显示，模板调用
     * @param coldata
     * @param i 
     * @returns {string}
     * @memberof Base
     */
    GetFormatValue(coldata, i): string {
        return mathHelper.GetFormatValue(coldata, i);
    }

    /**
     * 共用展示 loading
     * 
     * @protected
     * @param {LoadingController} loadingCtrl 
     * @param {string} message 
     * @returns {Loading} 
     * @memberof Base
     */
    protected showLoading(
        loadingCtrl: LoadingController,
        message: string
    ): any {
        let loader = loadingCtrl.create({
            content: message,
            dismissOnPageChange: true //页面变化的时候自动关闭 loading
        });
        loader.present();
        return loader;
    }

    /**
     * 共用普通 alert
     * 
     * @protected
     * @param {LoadingController} alertCtrl 
     * @param {string} title
     * @param {string} subTitle
     * @param {array} buttons
     * @returns {Alert}
     * @memberof Base
     */
    protected showAlert(
        alertCtrl: AlertController,
        title: string,
        subTitle: string,
        buttons: Array<string> = ['确定']
    ): any {
        let alert = alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: buttons.length > 0 ? buttons : ['确定']
        });
        alert.present();
        return alert;
    }

    /**
     * 调试模式下显示打印的内容
     * @param message 要打印的内容
     * @param type 类型
     */
    protected debug(message: any, type: string = 'log') {
        debugHelper.show(message, type);
    }
}