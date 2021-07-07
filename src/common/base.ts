import { ContextData } from './../app/context';
import { NavController, IonicPage, ModalController, LoadingController, AlertController, ToastController, Toast } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';

import { mathHelper } from './../util/helper/math';
import { debugHelper } from './../util/helper/debug';
import { arrayHelper } from './../util/helper/array';

import { debugParams } from "./../params/debug";

/**
 * 共用抽象类
 */
export abstract class Base {

    //用于记录同一个页面的刷新请求数
    private updateCount: number = 0;

    /**
     * 用于时间显示
     */
    timevalue: string = (new Date()).toLocaleString();

    @ViewChild('clockcontrol') clockctrl: any


    constructor() {
        this.updateCount = 0;
        //TODO web 直接更改 hash 访问
        // this.checkPermission();
    }

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
        message: string,
        duration?: number
    ): any {
        duration = Number(duration) > 0 ? duration : 1000;
        let loader = loadingCtrl.create({
            duration: duration,
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
        subTitle?: string,
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
     * 获取一维数组top 数据
     * @param arr 
     * @param col 
     * @param top 
     * @param flow 
     */
    protected getTopData(arr: any[], col: string, top: number = 5, flow: string = 'desc'): Array<any> {
        return arrayHelper._top(arr, col, top, flow);
    }

    /**
     * 一维数组排序
     * @param arr 
     * @param col 
     * @param flow 
     */
    protected orderBy(arr: Array<any>, col: string, flow: string = 'desc') {
        return arrayHelper._sortNum(arr, col, flow);
    }

    /**
     * @name 更新计数累加
     */
    protected addUpdateCount() {
        this.updateCount++;
        this.debug(this.getCurrentClassName() + ' 页面更新次数：' + this.updateCount);
    }

    /**
     * @name 获取页面更新次数
     */
    protected getUpdateCount() {
        return this.updateCount;
    }

    /**
     * @name 是否能更新
     */
    protected couldUpdate(): boolean {
        return this.updateCount == 0;
    }

    /**
     * @name 获取当前实例的类名
     */
    protected getCurrentClassName() {
        return this.constructor.name;
    }

    /**
     * 调试模式下显示打印的内容
     * @param message 要打印的内容
     * @param type 类型
     */
    protected debug(message: any, type: string = 'log') {
        debugParams.activeDebug && debugHelper.show(message, type);
    }

    /**
     * @desc 权限控制
     */
    private accessValid(): boolean {
        // const user = ContextData.currentUser;
        // if (!Array.isArray(Object.keys(user.accountData))) {
        //     return false;
        // }
        return false;
        // const pages = arrayHelper._column(user.accountData.workground, 'component');
        // return pages.includes(this.getCurrentClassName());
    }

    /**
     * @desc 权限检测
     */
    private checkPermission() {
        if (!this.accessValid()) {
            // console.log('无权限');
        }
    }
}