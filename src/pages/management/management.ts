import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';

import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';  //备注：NgxEchartsModule 不能少

import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { mathHelper } from './../../util/helper/math';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";
import { totalData } from "./../../interface/base";
import { eventParams } from "../../params/event";
import { PopperiodPage } from './../popperiod/popperiod';

// import * as util from 'ionic-angular/util/util';

/**
 * @desc 经营信息页面
 */
@IonicPage()
@Component({
  selector: 'page-management',
  templateUrl: 'management.html',
})
export class ManagementPage extends Base {
  //用于发布主题
  private readonly _periodTopic = eventParams.management.after.periodChanged;
  //涉及的颜色
  private colors: string[] = ["#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646", "#59DF97"];
  //bar legend
  private barAreaTypeMap: any[] = [
    { col: "revenue", name: "销售收入" },
    { col: "gross_profit", name: "毛利额" },
    { col: "three_fee", name: "费用" },
    { col: "net_profit", name: "净利润" },
    { col: "gross_rate", name: "毛利率" },
  ];

  //行业排序
  private groupOrder: string[] = ['户外家居', '房地产', '北京联拓', '东都节能', '永强投资', '西克曼', '其他'];

  @ViewChild('midBar') midBarEle: ElementRef;
  midBarInstance: any;

  //第一个card的小计数据
  totalData: totalData[] = [];

  //选中的年份 默认为今年
  choosedYear: any;
  //涉及的年份 今年 去年 前年
  Years: number[];

  //涉及的时间
  period: any[] = [];
  //今年
  currentYear: any;
  //选择的时间
  choosedPeriod: string;
  //经营业绩接口数据
  managementData: any[] = [];
  //合并数据
  mergeData: any[] = [];
  //按照产业分组的数据
  groupByIndustryData: any = { industry: '', data: [] };;

  //柱状图数据
  barData: any = {
    backgroundColor: '#07213a',
    color: this.colors,//["#c0504d", "#9bbb59", "#4bacc6", "#f79646", "#59DF97"],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '5%',
      right: '0%',
      bottom: '1%',
      containLabel: true,
      // width:'100%',
      height: '550px',
      y1: 140,
      y2: 140
    },
    legend: {
      data: arrayHelper._column(this.barAreaTypeMap, 'name'),
      right: '0%',
      // orient: 'vertical',
      top: 0,
      padding: 0,
      textStyle: {
        color: '#FFFFFF',
        fontSize: 20
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      x: 'center',
      y: 'center',
      // feature: {
      //   mark: { show: true },
      //   dataView: { show: true, readOnly: false },
      //   magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      //   restore: { show: true },
      //   saveAsImage: { show: true }
      // }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: [], //e.g. ['ODM/OEM'，'上海优享', 'MWH']
        axisLine: {
          show: false,
          lineStyle: {
            color: "#FFFFFF",
            fontSize: 20
          }
        },
        axisLabel: {
          show: false,
          interval: 0,
          rotate: -30,
          fontSize: 16
        },
      }
    ],
    yAxis: [{
      type: "value",
      name: "金额",
      min: 0,
      max: 200000,
      position: "left",
      interval: 10000,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#FFFFFF",
          fontSize: 18
        }
      },
      axisLabel: {
        formatter: "{value} ￥"
      },
      splitLine: {
        show: false
      }
    }, {
      type: "value",
      name: "百分比",
      min: 0,
      max: 100,
      position: "right",
      interval: 20,
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#FFFFFF",
          fontSize: 18
        }
      },
      axisLabel: {
        formatter: "{value} %"
      },
      splitLine: {
        show: false
      }
    }],
    series: []
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dateServ: DateService,
    public dataProvider: DatasvrProvider,
    private echartServ: NgxEchartsService,
    private event: Events,
    private popoverCtrl: PopoverController,
  ) {
    super();
    //设置时间场景
    this.processDateRange();
    //触发事件
    this.fireEvent();
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
    this.midBarInstance = this.echartServ.echarts.init(this.midBarEle.nativeElement.querySelector('div'));
    this.midBarInstance.setOption(this.barData);

    //首次打开执行数据刷新
    if (super.couldUpdate()) {
      setTimeout(() => {
        this.update(true);
      }, 500);
    }
  }

  /**
   * 更新本页面数据
   */
  update(forceUpdate: boolean) {
    //刷新依据 根据入口出注册的函数更新为主
    let BizData: Array<any> = ContextData.ManagementDatas[ContextData.TableName].DataValue;
    let UpdateFlag: boolean = ContextData.ManagementDatas[ContextData.TableName].UpdateFlag;

    //BizData清洗
    this.cleanData(BizData);

    if (forceUpdate || UpdateFlag) {
      this.initData();
      this.managementData = BizData;
      this.mergeData = this.exractMergeData(BizData);
      //合计数据
      this.calcTotalData();
      //右侧行业详细数据
      this.groupByIndustryData = this.exractGroupData(BizData, this.groupOrder[0]);
      //图表数据更新
      this.updateMidBarData();

      ContextData.ManagementDatas[ContextData.TableName].UpdateFlag = false;
    }

    super.debug('ManagementDatas');
    super.debug(this.managementData);

    //页面切换后，显示真实选择的时间
    this.choosedPeriod = this.managementData[0].period_begin.substr(0, 4) + '年' + this.managementData[0].period_begin.substr(-2).replace('0', '') + '月';

  }

  private initData() {
    this.totalData = [];
    this.managementData = [];
    this.mergeData = [];
    this.groupByIndustryData = [];
  }

  private calcTotalData() {
    const totalObj = [
      { col: 'revenue', title: '累计销售收入', color: this.colors[3] },
      { col: 'gross_profit', title: '累计毛利额', color: this.colors[4] },
      { col: 'net_profit', title: '累计净利润', color: this.colors[0] }
    ];
    totalObj.forEach(el => {
      this.totalData.push({
        title: el['title'],
        num: arrayHelper._sum(arrayHelper._column(this.mergeData, el['col']), 0),
        fontcolor: el['color']
      });
    });
    super.debug('mergeData');
    super.debug(this.mergeData);
  }

  private updateMidBarData() {
    let i = 0;
    this.barData.series = [];
    this.barData.xAxis[0].data = arrayHelper._column(this.mergeData, 'industry');
    this.barAreaTypeMap.forEach(el => {
      this.barData.series.push({
        name: el.name,
        type: el.name == '毛利率' ? 'line' : 'bar',
        yAxisIndex: el.name == '毛利率' ? 1 : 0,
        data: arrayHelper._column(this.mergeData, el.col),
        animation: true,
        itemStyle: {
          color: this.colors[i]
        },
        barGap: "0%"
      });
      i++;
    });
    this.midBarInstance.setOption(this.barData);
    super.debug('bardata');
    super.debug(this.mergeData);
    super.debug(this.barData);
  }

  private exractMergeData(data: any, is_merge: string = '是'): any {
    let res: any = [], orderedData: any = [];
    res = data.filter(el => el['is_merge'] === is_merge);

    this.groupOrder.forEach(el => {
      res.forEach(v => {
        if (v['industry'] == el) {
          orderedData.push(v);
        }
      });
    });
    return orderedData;
  }

  private exractGroupData(data: any, field: string) {
    let res: any = { industry: field, data: [] };
    res.data = data.filter(el => el['is_merge'] == '否' && el['industry'] == field);
    return res;
  }

  private cleanData(data: any) {
    const regx = /有限公司|有限责任公司|合伙企业（有限合伙）/;
    if (!Array.isArray(data)) return [];
    data.map((v) => {
      v['company'] = v['company'].replace(regx, '');
      v['revenue'] = Math.round(v['revenue']);
      v['gross_profit'] = Math.round(v['gross_profit']);
      v['three_fee'] = Math.round(v['three_fee']);
      v['net_profit'] = Math.round(v['net_profit']);
    });
  }

  private processDateRange() {
    //设置时间场景
    this.dateServ.setScene(DateScene.MANAGEMENT);
    let years = this.dateServ.years;
    this.currentYear = years.currentYear;

    let month = this.dateServ.currentMonth - 1;

    if (month == 0) {
      this.choosedPeriod = years.lastYear + '   年度';
    } else {
      this.choosedPeriod = this.currentYear + '年' + month + '月';
    }

    //这里是组织用于popover的时间数据
    let tmpYears: any = [];
    for (let index = 2; index >= 1; index--) {
      let year = (this.currentYear - index) + '   年度';
      tmpYears.push(year);
    }

    let tmpMonth: any = [];
    for (let m = 1; m < this.dateServ.currentMonth; m++) {
      let month = this.currentYear + ' 年 ' + m + '月';
      tmpMonth.push(month);
    }

    this.period = tmpYears.concat(tmpMonth);
  }

  changeGroup(industry: string) {
    this.groupByIndustryData = this.exractGroupData(this.managementData, industry);
  }

  /**
   * 改变时间刷新数据
   */
  choosePeriod(val: any = '') {

    //防止重复刷新
    super.addUpdateCount();

    if (this.choosedPeriod.indexOf('年度') > -1) {
      let year = Number(this.choosedPeriod.replace('年度', '').trim());
      this.dateServ.setDateRange(year, 12, year, 12);
    } else {
      let month = Number(this.choosedPeriod.split('年')[1].replace('月', '').trim());
      this.dateServ.setDateRange(this.currentYear, month, this.currentYear, month);
    }
    this.dataProvider.syncBizProfitData().add(() => {
      setTimeout(() => {
        this.update(true);
      }, 100);
    });
  }

  fireEvent() {
    //监听月份改变事件 2018年5月16日
    this.event.subscribe(this._periodTopic, (period) => {
      super.debug("时间：" + period);
      this.choosedPeriod = period;
      this.choosePeriod();
    });
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(PopperiodPage, {
      title: '选择时间',
      data: this.period,
      topic: this._periodTopic
    });
    popover.present({
      ev: event
    });
  }
}
