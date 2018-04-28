import { Component } from '@angular/core';
import { NavController, IonicPage, ModalController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';

import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';

/**
 * @desc 税收报表信息页面 2018年4月28日09:09:45
 */
@IonicPage()
@Component({
  selector: 'page-tax',
  templateUrl: 'tax.html',
})
export class TaxPage extends Base {

  //税收涉及的所有的地区
  taxArea: Array<any> = [];
  //税收涉及的数据按照地区分类
  taxDataGroupByArea: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    super();
  }

  ionViewDidLoad() {
    super.showCurrentTime();
    //数据值定时刷新 1 分钟刷新
    setInterval(() => {
      this.update(false);
    }, 60000);
  }

  ionViewWillEnter() {
    //首次打开执行数据刷新
    setTimeout(() => {
      this.update(true);
    }, 500);
  }

  /**
   * 更新本页面数据
   */
  update(needUpdate: boolean) {

    //刷新依据 根据入口出注册的函数更新为主
    let taxData: Array<any> = ContextData.TaxDatas[ContextData.TableName].DataValue;
    let taxUpdateFlag: boolean = ContextData.TaxDatas[ContextData.TableName].UpdateFlag;

    if (needUpdate || taxUpdateFlag) {

      this.taxDataGroupByArea = {};

      this.taxArea = arrayHelper._unique(arrayHelper._column(taxData, 'AreaType'));

      taxData.forEach(tax => {
        let areaName = tax['AreaType'];
        if (!this.taxDataGroupByArea[areaName]) {
          this.taxDataGroupByArea[areaName] = [tax];
        } else {
          this.taxDataGroupByArea[areaName].push(tax);
        }
      });

      ContextData.TaxDatas[ContextData.TableName].UpdateFlag = false;
      super.debug(this.taxDataGroupByArea)
    }

  }

}
