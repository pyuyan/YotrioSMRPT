import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';

import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';  //备注：NgxEchartsModule 不能少
import { Params } from './../../app/params';
import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { mathHelper } from './../../util/helper/math';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";
import { PopperiodPage } from './../popperiod/popperiod';
import { eventParams } from "../../params/event";

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

  //用于发布主题
  private readonly _periodTopic = eventParams.investRight.after.periodChanged;

  @ViewChild('topBar') topBarEle: ElementRef;
  @ViewChild('midPie') midPieEle: ElementRef;
  @ViewChild('bottomBar') bottomBarEle: ElementRef;

  topBarInstance: any;
  midPieInstance: any;
  bottomBarInstance: any;

  totalMap: any = {
    InvMoney: { title: '累计投资金额', color: '#f79646' },
    InvIncoming: { title: '累计投资收益', color: '#9bbb59' },
    InvBalance: { title: '累计投资余额', color: '#24b3da' }
  }

  //第一个card的小计数据
  totalData: totalData[] = [];

  headers: string[] = ['被投资单位', '投资金额', '投资时间', '持股比例', '投资收益', '投资余额'];

  //股权投资接口数据
  investRightData: any[] = [];

  //涉及的时间
  period: any[] = [];
  //今年
  currentYear: any;
  //选择的时间
  choosedPeriod: string;

  //涉及用到的颜色
  colors: string[] = ['#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#59DF97', '#0fded6'];//#e00c6c

  topBarData: any = {
    // color: this.colors[1],
    color: 'rgb(46,199,201)',
    title: {
      text: '投资金额前5',
      textAlign: 'center',
      textStyle: {
        fontSize: 25,
        color: '#ffffff'
      },
      x: 'right'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['投资金额'],
      left: '0%',
      top: 0,
      padding: 0,
      textStyle: {
        color: '#FFFFFF',
        fontSize: 16
      },
      x: 'left',
    },
    calculable: true,
    xAxis: [
      {
        splitLine: { show: false },//去除网格线
        splitArea: {
          show: false,
          color: [
            'rgba(250,250,250,0.1)',
            'rgba(200,200,200,0.1)'
          ]
        },//保留网格区域
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLine: {
          lineStyle: {
            color: "#FFFFFF",
            fontSize: 18
          }
        },
        axisLabel: {
          interval: 0,
          rotate: -30,
          fontSize: 16
        },
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: [],
        axisLine: {
          show: false,
          lineStyle: {
            color: "#FFFFFF",
            fontSize: 16
          }
        },
        axisLabel: {
          interval: 0,
          rotate: -30,
          fontSize: 16
        },
      }
    ],
    series: [
      {
        name: '投资金额',
        type: 'bar',
        data: []
      }
    ]
  };

  midPieData: any = {
    color: this.colors,
    title: {
      text: '投资收益前5',
      textAlign: 'center',
      textStyle: {
        fontSize: 25,
        color: '#ffffff'
      },
      x: 'right'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      textStyle: {
        fontSize: 13,
        color: '#ffffff'
      },
      data: []
    },
    calculable: true,
    series: [
      {
        name: '投资收益',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          }
        },
        data: []
      }
    ]
  };

  bottomBarData: any = {
    color: this.colors[4],
    title: {
      text: '股权占比前10',
      textAlign: 'center',
      textStyle: {
        fontSize: 25,
        color: '#ffffff'
      },
      x: 'right'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['股权占比'],
      x: 'left',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 16
      },
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: "#FFFFFF",
            fontSize: 14
          }
        },
        axisLabel: {
          interval: 0,
          rotate: -30,
          fontSize: 14
        },
        data: []
      }
    ],
    yAxis: [
      {
        splitLine: { show: false },//去除网格线
        splitArea: {
          show: false,
          color: [
            'rgba(250,250,250,0.1)',
            'rgba(200,200,200,0.1)'
          ]
        },//保留网格区域
        type: 'value',
        axisLine: {
          lineStyle: {
            color: "#FFFFFF",
            fontSize: 14
          }
        },
        axisLabel: {
          interval: 0,
          rotate: -30,
          fontSize: 14
        },
      }
    ],
    series: [
      {
        name: '股权占比',
        type: 'bar',
        data: [],
        // markPoint: {
        //   data: [
        //     { type: 'max', name: '最大值' },
        //     { type: 'min', name: '最小值' }
        //   ]
        // },
        // markLine: {
        //   data: [
        //     { type: 'average', name: '平均值' }
        //   ]
        // }
      },
    ]
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private echartServ: NgxEchartsService,
    public popoverCtrl: PopoverController,
    public event: Events,
    public dateServ: DateService,
    public dataProvider: DatasvrProvider,
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
    this.topBarInstance = this.echartServ.echarts.init(this.topBarEle.nativeElement.querySelector('div'));
    this.topBarInstance.setOption(this.topBarData);

    this.midPieInstance = this.echartServ.echarts.init(this.midPieEle.nativeElement.querySelector('div'));
    this.midPieInstance.setOption(this.midPieData);

    this.bottomBarInstance = this.echartServ.echarts.init(this.bottomBarEle.nativeElement.querySelector('div'));
    this.bottomBarInstance.setOption(this.bottomBarData);

    //首次打开执行数据刷新
    setTimeout(() => {
      this.update(true);
    }, 500);
  }

  ionViewDidLeave() {
    // this.event.unsubscribe(this._periodTopic);
  }

  update(needUpdate: boolean) {
    //刷新依据 根据入口出注册的函数更新为主
    let investsRightData: Array<any> = ContextData.InvestsRight[ContextData.TableName].DataValue;
    let updateFlag: boolean = ContextData.InvestsRight[ContextData.TableName].UpdateFlag;

    if (needUpdate || updateFlag) {
      this.totalData = [];
      this.investRightData = [];
      this.investRightData = investsRightData;
      //数据清洗
      this.cleanData();
      //合计数据
      this.calcTotalData();
      //图表数据更新
      this.updateTopBarData().updateMidPieData().updateBottomBarData();
      //数据按照收益排序
      // this.investRightData = this.orderBy(this.investRightData, 'InvIncoming');
      //按照投资时间增序
      this.investRightData = this.orderByInvDate(this.investRightData);

      ContextData.InvestsRight[ContextData.TableName].UpdateFlag = false;
    }

    super.debug('investRightData');
    super.debug(this.investRightData);
  }

  private updateMidPieData() {
    let top5: any[] = this.getTopData(this.investRightData, 'InvIncoming');

    this.midPieData.legend.data = arrayHelper._column(top5, 'OrgName');
    this.midPieData.series[0].data = [];

    top5.forEach(el => {
      this.midPieData.series[0].data.push({ name: el.OrgName, value: el.InvIncoming });
    });
    this.midPieInstance.setOption(this.midPieData);
    return this;
  }

  private updateTopBarData() {
    const type: string = 'InvMoney';
    let top5: any[] = this.getTopData(this.investRightData, type);

    this.topBarData.yAxis[0].data = arrayHelper._column(top5, 'OrgName');
    this.topBarData.series[0].data = arrayHelper._column(top5, type);

    this.topBarInstance.setOption(this.topBarData);
    return this;
  }

  private updateBottomBarData() {
    const type: string = 'InvHoldingRate';
    let top10: any[] = this.getTopData(this.investRightData, type, 10);

    this.bottomBarData.xAxis[0].data = arrayHelper._column(top10, 'OrgName');
    this.bottomBarData.series[0].data = arrayHelper._column(top10, type);

    this.bottomBarInstance.setOption(this.bottomBarData);
    return this;
  }

  private calcTotalData(): void {
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
    let tmpInvestData: any[] = [];
    this.investRightData.forEach(el => {
      //排除接口的空数据
      if (el.OrgName !== '' && el.InvDate !== '' && el.UpdateTime !== '') {
        el.OrgName = el.OrgName.replace('股份有限公司', '');
        if (el.OrgName.indexOf('有限公司') > 0) {
          el.OrgName = el.OrgName.replace('有限公司', '');
        }
        el.InvMoney = Math.round(el.InvMoney);
        el.InvIncoming = Math.round(el.InvIncoming);
        el.InvBalance = Math.round(el.InvBalance);
        el.InvHoldingRate = Number.parseFloat(el.InvHoldingRate).toFixed(2);
        tmpInvestData.push(el);
      }
    });
    this.investRightData = tmpInvestData;
    return this;
  }

  private processDateRange() {
    //设置时间场景
    this.dateServ.setScene(DateScene.INVRIGHT);
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

  private orderByInvDate(data) {
    data.sort((a, b) => {
      return Number(a['InvDate'].replace('年', '').replace('月', '').trim()) > Number(b['InvDate'].replace('年', '').replace('月', '').trim()) ? 1 : -1;
    });
    return data;
  }

  /**
   * 改变时间刷新数据
   */
  choosePeriod(val: any = '') {
    if (this.choosedPeriod.indexOf('年度') > -1) {
      let year = Number(this.choosedPeriod.replace('年度', '').trim());
      this.dateServ.setDateRange(year, 12, year, 12);
    } else {
      let month = Number(this.choosedPeriod.split('年')[1].replace('月', '').trim());
      this.dateServ.setDateRange(this.currentYear, month, this.currentYear, month);
    }
    this.dataProvider.syncInvRightData().add(() => {
      setTimeout(() => {
        this.update(true);
      }, 100);
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopperiodPage, {
      title: '选择时间',
      data: this.period,
      topic: this._periodTopic
    });
    popover.present({
      ev: event
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
}
