import { Component, ViewChild, ElementRef, group } from '@angular/core';
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

@IonicPage()
@Component({
  selector: 'page-rework',
  templateUrl: 'rework.html',
})
export class ReworkPage extends Base {
  //用于发布主题
  private readonly _periodTopic = eventParams.rework.after.periodChanged;
  //涉及的颜色
  private colors: string[] = ["#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646", "#59DF97"];
  //y轴指标最大值
  private yAxisMax: number;
  private yAxisInterval: number;

  //涉及的时间
  period: any[] = [];
  //今年
  currentYear: any;
  //选择的时间
  choosedPeriod: string;

  @ViewChild('midBar') midBarEle: ElementRef;
  @ViewChild('midPie') midPieEle: ElementRef;
  midBarInstance: any;
  midPieInstance: any;


  //bar legend
  private reworkTypeMap: any[] = [
    { col: 'totalNum', title: '返工总笔数' },
    { col: 'RcvQty', title: '返工接收数量' },
    { col: 'CompletedQty', title: '返工完工数量' },
    { col: 'WaistedQty', title: '返工报废数量' },
  ];

  //合计数据
  totalData: totalData[] = [];

  groupByDepData: any[] = [];

  //右侧详细数据
  groupData: any = { dep: '', data: [] };

  //柱状图数据
  barData: any = {
    backgroundColor: '#07213a',
    color: this.colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    title: {
      show: false,
      x: 'center',
      y: 'top',
      text: '各生产线返工数据',
      textAlign: 'center',
      textStyle: {
        fontSize: 22,
        color: '#ffffff'
      },
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
      data: arrayHelper._column(this.reworkTypeMap, 'title'),
      x: 'center',
      y: 'top',
      bottom: '1%',
      top: 0,
      padding: 0,
      textStyle: {
        color: '#FFFFFF',
        fontSize: 18
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
      name: "数量",
      min: 0,
      max: 5000,
      position: "left",
      interval: 500,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#FFFFFF",
          fontSize: 18
        }
      },
      axisLabel: {
        // formatter: "{value} ￥"
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

  midPieData: any = {
    color: this.colors,
    title: {
      show: false,
      text: '返工原因',
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
        fontSize: 16,
        color: '#ffffff'
      },
      data: []
    },
    calculable: true,
    series: [
      {
        name: '返工笔数',
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

    this.midPieInstance = this.echartServ.echarts.init(this.midPieEle.nativeElement.querySelector('div'));
    this.midPieInstance.setOption(this.midPieData);

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
    let ReworkData: Array<any> = ContextData.Rework[ContextData.TableName].DataValue;
    let UpdateFlag: boolean = ContextData.Rework[ContextData.TableName].UpdateFlag;

    //数据清洗
    this.cleanData(ReworkData);

    if (forceUpdate || UpdateFlag) {
      //初始化
      this.initData();
      //合计数据
      this.calcTotal(ReworkData);
      //数据分组
      this.groupByDepData = arrayHelper._group(ReworkData, 'DeptName');
      //右侧明细数据
      this.changeGroup(Object.keys(this.groupByDepData)[0]);
      //图表更新
      this.updateMidBarData();
      this.updateMidPieData(ReworkData);

      ContextData.Rework[ContextData.TableName].UpdateFlag = false;
    }

    //页面切换后，显示真实选择的时间
    this.choosedPeriod = ReworkData[0].period_end.substr(0, 4) + '年' + ReworkData[0].period_end.substr(-2).replace('0', '') + '月';
  }

  changeGroup(dep: string) {
    const keys = Object.keys(this.groupByDepData);
    const index = keys.findIndex(v => v == dep);
    this.groupData = {
      dep: keys[index],
      data: this.groupByDepData[keys[index]],
    };
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

  private cleanData(data: any) {
    data.map(v => {
      v['RequestQty'] = Math.round(v['RequestQty']);
      v['RcvQty'] = Math.round(v['RcvQty']);
      v['CompletedQty'] = Math.round(v['CompletedQty']);
      v['WaistedQty'] = Math.round(v['WaistedQty']);
      v['InStoreQty'] = Math.round(v['InStoreQty']);
      v['InStoreWaistQty'] = Math.round(v['InStoreWaistQty']);
    });
  }

  private initData() {
    this.totalData = [];
    this.groupData = {};
    this.yAxisMax = 10000;
    this.yAxisInterval = 1000;
  }

  private calcTotal(data: Array<any>) {
    const totalObj = [
      { col: 'totalNum', title: '返工总笔数', color: this.colors[1] },
      { col: 'RcvQty', title: '返工接收数量', color: this.colors[3] },
      { col: 'CompletedQty', title: '返工完工数量', color: this.colors[4] },
      { col: 'WaistedQty', title: '返工报废数量', color: this.colors[0] },
    ];
    totalObj.forEach(el => {
      this.totalData.push({
        title: el['title'],
        num: el['col'] === 'totalNum' ? data.length : arrayHelper._sum(arrayHelper._column(data, el['col']), 0),
        fontcolor: el['color']
      });
    });
  }

  private updateMidBarData() {
    let i = 0;
    const groupData = this.groupByDepData;

    this.barData.series = [];
    this.barData.xAxis[0].data = Object.keys(groupData);

    this.reworkTypeMap.forEach(el => {
      let tmpData: any[] = [];
      Object.keys(groupData).forEach(v => {
        let val = el.col == 'totalNum' ? groupData[v].length : arrayHelper._sum(arrayHelper._column(groupData[v], el.col), 0);
        tmpData.push(val);
      });
      this.barData.series.push({
        name: el.title,
        type: 'bar',
        yAxisIndex: 0,
        data: tmpData,
        animation: true,
        itemStyle: {
          color: this.colors[i]
        },
        barGap: "0%"
      });
      tmpData = [];
      i++;
    });

    this.changeBarYAxisMax();
    this.barData.yAxis[0].max = this.yAxisMax;
    this.barData.yAxis[0].interval = this.yAxisInterval;

    this.midBarInstance.setOption(this.barData);
  }

  private updateMidPieData(data: Array<any>) {

    const groupByReason: Array<any> = arrayHelper._group(data, 'RtnReason');
    const reasons: Array<any> = Object.keys(groupByReason);
    this.midPieData.legend.data = reasons;
    this.midPieData.series[0].data = [];

    reasons.forEach(el => {
      this.midPieData.series[0].data.push({ name: el, value: groupByReason[el].length });
    });
    this.midPieInstance.setOption(this.midPieData);
    return this;
  }

  /**
   * @desc 主要是优化显示效果
   */
  private changeBarYAxisMax() {
    const data = this.barData.series[1].data;
    let max = Math.max(...data);
    if (max <= 1000) {
      max += 100;
    } else if (max <= 10000) {
      max += 1000;
    } else if (max <= 30000) {
      max += 3000;
    } else if (max <= 50000) {
      max += 5000;
    } else if (max <= 100000) {
      max += 10000;
    }
    this.yAxisMax = max;
    this.yAxisInterval = Math.round(max / 5);
  }

  private processDateRange() {
    //设置时间场景
    this.dateServ.setScene(DateScene.REWORK);
    let years = this.dateServ.years;
    this.currentYear = years.currentYear;

    let month = this.dateServ.currentMonth - 1;

    if (month == 0) {
      this.choosedPeriod = years.lastYear + '   年度';
    } else {
      this.choosedPeriod = this.currentYear + '年' + month + '月';
    }

    //这里是组织用于popover的时间数据
    // let tmpYears: any = [];
    // for (let index = 2; index >= 1; index--) {
    //   let year = (this.currentYear - index) + '   年度';
    //   tmpYears.push(year);
    // }

    let tmpMonth: any = [];
    for (let m = 1; m <= this.dateServ.currentMonth; m++) {
      let month = this.currentYear + ' 年 ' + m + '月';
      tmpMonth.push(month);
    }

    // this.period = tmpYears.concat(tmpMonth);
    this.period = tmpMonth;
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
    this.dataProvider.syncReworkData().add(() => {
      setTimeout(() => {
        this.update(true);
      }, 100);
    });
  }

  private fireEvent() {
    //监听月份改变事件 2018年5月16日
    this.event.subscribe(this._periodTopic, (period) => {
      super.debug("时间：" + period);
      this.choosedPeriod = period;
      this.choosePeriod();
    });
  }


}
