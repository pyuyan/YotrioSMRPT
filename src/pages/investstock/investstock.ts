import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';

import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';  //备注：NgxEchartsModule 不能少
import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { mathHelper } from './../../util/helper/math';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";
import { PopperiodPage } from './../popperiod/popperiod';
import { eventParams } from "../../params/event";
import { totalData } from "./../../interface/base";

@IonicPage()
@Component({
  selector: 'page-investstock',
  templateUrl: 'investstock.html',
})
export class InveststockPage extends Base {
  //用于发布主题
  private readonly _periodTopic = eventParams.investStock.after.periodChanged;

  @ViewChild('topBar') topBarEle: ElementRef;
  @ViewChild('midPie') midPieEle: ElementRef;
  @ViewChild('bottomBar') bottomBarEle: ElementRef;
  @ViewChild('bottomCur') bottomCurEle: ElementRef;

  topBarInstance: any;
  midPieInstance: any;
  bottomBarInstance: any;
  bottomCurInstance: any;

  totalMap: any = {
    StockKind: { title: '持股总支数', color: '#f79646' },
    StockNum: { title: '持股总股数', color: '#9bbb59' },
    StockValueCurrent: { title: '持股总市值', color: '#4bacc6' },
    StockIncome: { title: '持股总盈利', color: '#c0504d' },
  }

  //第一个card的小计数据
  totalData: totalData[] = [];

  // headers: string[] = ['股票名称', '股票代码', '持股成本', '持股股数', '收盘价', '持股市值', '持股盈亏'];
  headers: any[] = [
    { col: '', name: '股票名称' },
    { col: '', name: '股票代码' },
    { col: 'StockValueInit', name: '持股成本' },
    { col: 'StockNum', name: '持股股数' },
    { col: 'StockBuyVal', name: '买入价' },
    { col: 'ClosePrice', name: '收盘价' },
    { col: 'StockValueCurrent', name: '持股市值' },
    { col: 'StockProfit', name: '持股盈亏' },
  ];
  //用于排序的字段
  orderByCol: string;
  orderByFlow: string = '';  //asc 升序 desc 降序

  //股票投资接口数据
  invesStockData: any[] = [];

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
      text: '投资金额前3',
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
          rotate: -45,
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
      text: '持股股数3',
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
        name: '持股股数',
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
          // emphasis: {
          //   label: {
          //     show: true,
          //     position: 'center',
          //     textStyle: {
          //       fontSize: '30',
          //       fontWeight: 'bold'
          //     }
          //   }
          // }
        },
        data: []
      }
    ]
  };

  bottomBarData: any = {
    color: this.colors[4],
    title: {
      text: '股票收益前3',
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
      data: ['股票'],
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
        name: '股票',
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

  bottomCurData: any = {
    color: ['rgb(142,139,252)', 'rgb(24,222,207)', 'rgb(249,107,145)'],
    title: {
      text: '股票投资收益折线图',
      textAlign: 'center',
      textStyle: {
        fontSize: 30,
        color: '#ffffff'
      },
      x: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      textStyle: {
        fontSize: 16,
        color: '#ffffff'
      },
      data: ['股票投资金额', '股票市值', '股票收益']
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
        type: 'category',
        boundaryGap: false,
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
        data: [], //股票名称
      }
    ],
    yAxis: [
      {
        splitLine: { show: false },//去除网格线
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
        name: '股票投资金额',
        type: 'line',
        data: [],
      },
      {
        name: '股票市值',
        type: 'line',
        data: [],
      },
      {
        name: '股票收益',
        type: 'line',
        data: [],
      }
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

    // this.bottomBarInstance = this.echartServ.echarts.init(this.bottomBarEle.nativeElement.querySelector('div'));
    // this.bottomBarInstance.setOption(this.bottomBarData);

    this.bottomCurInstance = this.echartServ.echarts.init(this.bottomCurEle.nativeElement.querySelector('div'));
    this.bottomCurInstance.setOption(this.bottomCurData);

    //首次打开执行数据刷新
    if (super.couldUpdate()) {
      setTimeout(() => {
        this.update(true);
      }, 500);
    }

  }

  ionViewDidLeave() {
    this.event.unsubscribe(this._periodTopic);
    // this.dateServ.clean(DateScene.INVSTOCK);
  }

  update(forceUpdate: boolean) {
    //刷新依据 根据入口出注册的函数更新为主
    let investsStockData: Array<any> = ContextData.InvestsStock[ContextData.TableName].DataValue;
    let updateFlag: boolean = ContextData.InvestsStock[ContextData.TableName].UpdateFlag;

    this.cleanData(investsStockData);

    if (forceUpdate || updateFlag) {
      this.totalData = [];
      this.invesStockData = [];
      this.invesStockData = investsStockData;
      //合计数据
      this.calcTotalData();
      //图表数据更新
      this.updateTopBarData().updateMidPieData().updateBottomCurData();

      ContextData.InvestsStock[ContextData.TableName].UpdateFlag = false;
    }

    super.debug('invesStockData');
    super.debug(this.invesStockData);

    //页面切换后，显示真实选择的时间
    this.choosedPeriod = this.invesStockData[0].UpdateTime.split("-").splice(0, 2).join('年') + '月';

    //刷新数据后重置排序
    this.orderByCol = '';
    this.orderByFlow = '';
  }

  private updateMidPieData() {
    let top3: any[] = this.getTopData(this.invesStockData, 'StockNum', 3);

    this.midPieData.legend.data = arrayHelper._column(top3, 'StockName');
    this.midPieData.series[0].data = [];

    top3.forEach(el => {
      this.midPieData.series[0].data.push({ name: el.StockName, value: el.StockNum });
    });
    this.midPieInstance.setOption(this.midPieData);
    return this;
  }

  private updateTopBarData() {
    const type: string = 'StockValueInit';
    let top3: any[] = this.getTopData(this.invesStockData, type, 3);

    this.topBarData.yAxis[0].data = arrayHelper._column(top3, 'StockName');
    this.topBarData.series[0].data = arrayHelper._column(top3, type);

    super.debug(this.topBarData);
    this.topBarInstance.setOption(this.topBarData);
    return this;
  }

  private updateBottomBarData() {
    // const type: string = 'InvHoldingRate';
    // let top10: any[] = this.getTopData(this.invesStockData, type, 3);

    // this.bottomBarData.xAxis[0].data = arrayHelper._column(top10, 'OrgName');
    // this.bottomBarData.series[0].data = arrayHelper._column(top10, type);

    // this.bottomBarInstance.setOption(this.bottomBarData);
    return this;
  }

  private updateBottomCurData() {

    let i: number = 0;
    this.bottomCurData.xAxis[0].data = arrayHelper._column(this.invesStockData, 'StockName');
    ['StockValueInit', 'StockValueCurrent', 'StockProfit'].forEach(el => {
      this.bottomCurData.series[i].data = arrayHelper._column(this.invesStockData, el);
      i++;
    });
    this.bottomCurInstance.setOption(this.bottomCurData);

    super.debug('updateBottomCurData');
    super.debug(this.bottomCurData);
    return this;
  }

  private calcTotalData() {
    let num: any, el: any;
    Object.keys(this.totalMap).forEach(key => {
      el = this.totalMap[key];
      if (key == 'StockKind') {
        num = this.invesStockData.length;
      } else if (key == 'StockIncome') {
        let num_1 = arrayHelper._sum(arrayHelper._column(this.invesStockData, 'StockValueInit'), 0);
        let num_2 = arrayHelper._sum(arrayHelper._column(this.invesStockData, 'StockValueCurrent'), 0);
        num = arrayHelper._sum([Number(num_2), -Number(num_1)], 0);
      } else {
        num = arrayHelper._sum(arrayHelper._column(this.invesStockData, key), 0);
      }
      this.totalData.push({
        title: el['title'],
        num: num,
        fontcolor: el['color']
      });
    });

    super.debug('investStokc total:');
    super.debug(this.totalData);
  }

  private cleanData(res: any) {
    if (Array.isArray(res) && res.length) {
      res.filter(v => Number(v.StockValueInit) > 0).map(v => {
        v.StockBuyVal = (Number(v.StockValueInit) / Number(v.StockNum)).toFixed(2);
        v.StockValueInit = Number.parseFloat((v.StockValueInit / 10000).toString()).toFixed(1);
        v.StockValueCurrent = Number.parseFloat((v.StockValueCurrent / 10000).toString()).toFixed(1);
        v.StockNum = Math.round(v.StockNum);
        v.StockProfit = arrayHelper._sum([
          Number(v.StockValueCurrent),
          -Number(v.StockValueInit)
        ], 1);
      });
    }
  }

  private processDateRange() {
    //设置时间场景
    this.dateServ.setScene(DateScene.INVSTOCK);
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
    this.dataProvider.syncInvStockData().add(() => {
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

  //根据传值排序
  _orderBy(column: string, flow: string = '') {
    flow = this.orderByFlow == '' ? 'desc' : (this.orderByFlow == 'asc' ? 'desc' : 'asc');
    if (column != '') {
      this.orderByCol = column;
      this.orderByFlow = flow;
      this.invesStockData = super.orderBy(this.invesStockData, column, flow);
    }
  }
}
