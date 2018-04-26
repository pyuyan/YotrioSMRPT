import { NavController, IonicPage, ModalController, LoadingController, AlertController, ToastController, Toast } from 'ionic-angular';

import { mathHelper } from './../util/helper/math';

/**
 * 共用抽象类
 */
export abstract class Base {

    constructor() { }

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
    ): Loading {
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
    ): Alert {
        let alert = alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: buttons.length > 0 ? buttons : ['确定']
        });
        alert.present();
        return alert;
    }
}