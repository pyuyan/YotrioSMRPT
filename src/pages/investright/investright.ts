import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Params } from './../../app/params';
import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { mathHelper } from './../../util/helper/math';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";


export interface totalData {
  title: string;
  num: any;
  fontcolor: string;
}

@IonicPage()
@Component({
  selector: 'page-investright',
  templateUrl: 'investright.html',
})
export class InvestrightPage extends Base {

  totalMap: any = {
    InvMoney: { title: '累计投资金额', color: '#f79646' },
    InvIncoming: { title: '累计投资收益', color: '#9bbb59' },
    InvBalance: { title: '累计投资余额', color: '#24b3da' }
  }

  //第一个card的小计数据
  totalData: totalData[] = [];

  headers: string[] = ['被投资单位', '投资金额', '投资时间', '持股比例', '投资收益', '投资余额'];

  investRightData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
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

  update(needUpdate: boolean) {
    //刷新依据 根据入口出注册的函数更新为主
    let investsRightData: Array<any> = ContextData.InvestsRight[ContextData.TableName].DataValue;
    let updateFlag: boolean = ContextData.InvestsRight[ContextData.TableName].UpdateFlag;

    if (needUpdate || updateFlag) {

      this.investRightData = [];
      this.investRightData = investsRightData;

      this.cleanData().orderBy('InvIncoming');

      // this.updatePieData();
      // this.updateBarData();

      //合计数据
      this.totalData = [];
      this.calcTotalData();

      ContextData.InvestsRight[ContextData.TableName].UpdateFlag = false;
    }

    super.debug(this.investRightData)
  }

  choosePeriod() {
    //TODO 选择年份月份 今年就是月份，去年前年就是年份
  }

  private updatePieData() {
    //TODO
  }

  private updateBarData() {
    //TODO
  }

  private calcTotalData() {
    Object.keys(this.totalMap).forEach(key => {
      let el = this.totalMap[key];
      this.totalData.push({
        title: el['title'],
        num: arrayHelper._sum(arrayHelper._column(this.investRightData, key), 0),
        fontcolor: el['color']
      });
    });

    super.debug(this.totalData);
  }

  private cleanData() {
    if (!this.investRightData || this.investRightData.length == 0) return;
    this.investRightData.forEach(el => {
      el.OrgName = el.OrgName.replace('股份有限公司', '');
      if (el.OrgName.indexOf('有限公司') > 0) {
        el.OrgName = el.OrgName.replace('有限公司', '');
      }
      el.InvMoney = Math.round(el.InvMoney);
      el.InvIncoming = Math.round(el.InvIncoming);
      el.InvBalance = Math.round(el.InvBalance);
      el.InvHoldingRate = Number.parseFloat(el.InvHoldingRate).toFixed(2);
    });
    return this;
  }

  private orderBy(col: string, type: string = 'desc') {
    return arrayHelper._sortNum(this.investRightData, col, type);
  }
}
