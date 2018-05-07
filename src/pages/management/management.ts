import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage, ModalController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';  //备注：NgxEchartsModule 不能少

import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { mathHelper } from './../../util/helper/math';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";
/**
 * @desc 经营信息页面
 */
@IonicPage()
@Component({
  selector: 'page-management',
  templateUrl: 'management.html',
})
export class ManagementPage extends Base {

  //选中的年份 默认为今年
  choosedYear: any;
  //涉及的年份 今年 去年 前年
  Years: number[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dateServ: DateService,
    public dataProvider: DatasvrProvider,
    private echartServ: NgxEchartsService,
  ) {
    super();
    const years = this.dateServ.years;
    this.Years = [
      years.currentYear,
      years.lastYear,
      years.blastYear
    ];
    this.choosedYear = years.currentYear;
  }

  ionViewDidLoad() {
    super.showCurrentTime();
    //数据值定时刷新 1 分钟刷新
    setInterval(() => {
      this.update(false);
    }, 60000);
  }

  ionViewWillEnter() {

    //创建并初始化echarts实例
    //TODO
    //首次打开执行数据刷新
    setTimeout(() => {
      this.update(true);
    }, 500);
  }

  /**
   * 更新本页面数据
   */
  update(needUpdate: boolean) {
    //TODO
  }

}
