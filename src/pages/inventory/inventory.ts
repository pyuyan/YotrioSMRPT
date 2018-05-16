import { Params } from './../../app/params';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage, ModalController, AlertController, LoadingController, NavParams, PopoverController, Events } from 'ionic-angular';
import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';  //备注：NgxEchartsModule 不能少

import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { dateHelper } from './../../util/helper/date';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";
import { PopmonthPage } from './../popmonth/popmonth';

/**
 * @desc 库存信息页面
 */
@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage extends Base {

  @ViewChild('inventoryPie') inventoryPieEle: ElementRef;
  @ViewChild('inventoryBar') inventoryBarEle: ElementRef;
  inventoryPieInstance: any
  inventoryBarInstance: any

  //选中的年份 默认为今年
  choosedMonth: any;
  //涉及的月份
  months: any[] = [];
  //今年
  currentYear: any;

  //库存数据 按时间分类
  inventoryDataGroupByTime: any = {};
  //库存数据 按模块分类
  inventoryDataGroupByModal: any = {};

  //是否显示合计的条目bar
  showTotalBar: boolean = true;
  //pie的时间map
  pieYearMap: any = { lt_one_year: '1年以内', lt_two_year: '1-2年', lt_three_year: '2-3年', gt_three_year: '3年以上' };
  //bar的库存存放地
  barAreaType: string[] = ['国内', '国外'];
  //国外地区
  abroadArea: string[] = ["美国尚唯拉", "德国永强", "美国永强", "美国皇家庭院"];//['MWH', '尚唯拉', '美国公司', '皇家庭院'];

  //colors 所有的颜色 分类就是7种颜色
  colors: string[] = ['#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#59DF97', '#0fded6'];//#e00c6c

  //按时间分组的饼图数据结构
  inventoryPieTitleColor: string[] = ['#FFFFFF', '#CCF600'];
  inventoryPieSeriesColor: string[] = this.colors;
  inventoryPieData: any = {
    backgroundColor: '#07213a',
    padding: [0, 0, 0, 0],
    title: [],

    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c}",
    },

    legend: {
      data: this.barAreaType,
      left: '0%',
      orient: 'vertical',
      top: 0,
      padding: 0,
      textStyle: {
        color: '#FFFFFF',
        fontSize: 24
      }
    },

    series: []
  };
  //按模块分组的坐标数据结构
  inventoryBarData: any = {
    backgroundColor: '#07213a',
    color: ['#9bbb59', '#c0504d'],//this.colors,//["#c0504d", "#9bbb59", "#4bacc6", "#f79646", "#59DF97"],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    // grid: {
    //   left: '3%',
    //   right: '0%',
    //   bottom: '3%',
    //   containLabel: true,
    //   y2: 140
    // },
    legend: {
      data: this.barAreaType,
      // left: '0%',
      // orient: 'vertical',
      top: 0,
      padding: 0,
      textStyle: {
        color: '#FFFFFF',
        fontSize: 24
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      x: 'right',
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
            fontSize: 18
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
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: "#FFFFFF",
            fontSize: 16
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          fontSize: 16
        }
      }
    ],
    series: []
  };

  inventoryBarxAxisAppend: any;
  inventoryBarSeriesAppend: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public event: Events,
    public dateServ: DateService,
    public dataProvider: DatasvrProvider,
    private echartServ: NgxEchartsService,
  ) {
    super();
    //设置时间场景
    this.dateServ.setScene(DateScene.INVENTORY);
    this.currentYear = this.dateServ.years.currentYear;
    //这里实际是延期一个月，就是这个月的数据是下个月财务部门上传；目前处理是 统计到今年到这个月为止的数据
    this.choosedMonth = this.dateServ.currentMonth;

    for (let m = 1; m <= this.dateServ.currentMonth; m++) {
      this.months.push(m);
    }

    //监听年份改变事件 2018年5月16日
    event.subscribe(Params.commonAterMonthChanged, (month) => {
      super.debug("common event 月份：" + month);
      this.choosedMonth = month;
      setTimeout(() => {
        this.chooseMonth();
      }, 10);
    });
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
    this.inventoryPieInstance = this.echartServ.echarts.init(this.inventoryPieEle.nativeElement.querySelector('div'));
    this.inventoryPieInstance.setOption(this.inventoryPieData);

    this.inventoryBarInstance = this.echartServ.echarts.init(this.inventoryBarEle.nativeElement.querySelector('div'));
    this.inventoryBarInstance.setOption(this.inventoryBarData);

    setTimeout(() => {
      this.update(true);
    }, 500);
  }

  /**
   * 更新本页面数据
   */
  update(needUpdate: boolean) {

    //刷新依据 根据入口出注册的函数更新为主
    let inventoryData: Array<any> = ContextData.InventoryDatas[ContextData.TableName].DataValue;
    let inventoryUpdateFlag: boolean = ContextData.InventoryDatas[ContextData.TableName].UpdateFlag;

    if (needUpdate || inventoryUpdateFlag) {

      this.inventoryDataGroupByTime = {};
      this.inventoryDataGroupByModal = {};
      this.inventoryBarxAxisAppend = [];
      this.inventoryBarSeriesAppend = [];

      //按照模块分类
      let newPieData = arrayHelper._group(inventoryData, 'modal');

      this.updatePieData(newPieData);
      this.updateBarData(newPieData);

      ContextData.InventoryDatas[ContextData.TableName].UpdateFlag = false;
    }
  }

  private updatePieData(data) {
    //定义数据
    let titleData: any[] = [], seriesData: any[] = [], i = 0, pieDistance: number = 25;
    let yearData: any[] = [], yearName: string, distance: any;
    for (let key in this.pieYearMap) {
      yearName = this.pieYearMap[key];
      distance = i * pieDistance;

      titleData.push({
        text: yearName,
        textAlign: 'center',
        x: 15 + distance + '%',
        y: '0%',
        textStyle: {
          fontSize: 30,
          color: this.inventoryPieTitleColor[0]
        }
      });

      for (let modal in data) {
        yearData.push({ name: modal, value: arrayHelper._sum(arrayHelper._column(data[modal], key), 0) });
      }

      seriesData.push({
        name: yearName,
        type: "pie",
        radius: ["0%", "65%"],
        center: [15 + distance + '%', "60%"],
        color: this.colors,
        label: {
          formatter: " {b}\n{c} ",
          position: "inner",
          textStyle: {
            fontSize: 20
          }
        },
        tooltip: {
          formatter: " {b}\n{c} "
        },
        itemStyle: {
          normal: {
            opacity: 1,
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }
        },
        data: yearData
      });

      titleData.push({
        text: arrayHelper._sum(arrayHelper._column(yearData, 'value'), 0),
        textAlign: 'center',
        x: 15 + distance + '%',
        y: '10%',
        textStyle: {
          fontSize: 30,
          color: this.inventoryPieTitleColor[1]
        }
      });

      yearData = [];

      i++;
    }
    this.inventoryPieData.legend.data = Object.keys(data);
    this.inventoryPieData.title = titleData;
    this.inventoryPieData.series = seriesData;

    this.inventoryPieInstance.setOption(this.inventoryPieData);
  }

  private updateBarData(data) {
    let modals = Object.keys(data);
    let barSeriseData: any[] = [];
    let mainlandData: any[] = [];
    let abroadData: any[] = [];
    let totalData: any[] = [];
    let mainlandTotal: any = 0;
    let abroadTotal: any = 0;

    for (let key in data) {
      let _data = data[key];

      //国内的数据
      _data.forEach(modal => {
        let tmp_total = arrayHelper._sum([modal['lt_one_year'], modal['lt_two_year'], modal['lt_three_year'], modal['gt_three_year']]);
        if (this.abroadArea.indexOf(modal['company']) > -1) {
          mainlandTotal = arrayHelper._sum([mainlandTotal, tmp_total], 0);
        } else {
          abroadTotal = arrayHelper._sum([abroadTotal, tmp_total], 0);
        }
      });

      abroadData.push(abroadTotal);
      mainlandData.push(mainlandTotal);

      //总和
      let total = arrayHelper._sum([mainlandTotal, abroadTotal], 0);
      totalData.push(total);

      mainlandTotal = 0;
      abroadTotal = 0
    }

    this.barAreaType.forEach(t => {
      let tmpData: any[] = t == '国内' ? mainlandData : abroadData;
      let tmpSeriseData = {
        name: t,
        type: 'bar',
        stack: '地区分块',
        itemStyle: {
          normal: {
            opacity: 1,
            borderWidth: 0.5,
            borderColor: '#FFFFFF'
          }
        },
        data: tmpData
      };
      barSeriseData.push(tmpSeriseData);
      //处理小计部分
      let tmpSum = arrayHelper._sum(tmpData, 0);
      //是否显示合计的bar
      if (this.showTotalBar) {
        tmpData.push(tmpSum);
        this.inventoryBarSeriesAppend.push({ name: t, data: tmpData });
      } else {
        this.inventoryBarSeriesAppend.push({ name: t, data: tmpData.concat([tmpSum]) });
      }
    });

    this.inventoryBarData.xAxis[0].data = modals;
    this.inventoryBarData.series = barSeriseData;

    //处理小计部分
    let tmpSum = arrayHelper._sum(totalData, 0);
    totalData.push(tmpSum);
    this.inventoryBarxAxisAppend = modals.concat(['合计']);
    this.inventoryBarSeriesAppend.push({ name: '合计', data: totalData })

    this.inventoryBarInstance.setOption(this.inventoryBarData);
  }

  /**
   * 改变月刷新数据
   */
  chooseMonth(val: any = '') {

    super.debug(this.choosedMonth);
    //如果选择是本月，就统计今年1月到本月的数据，因为数据是延迟一个月，本月是没有数据的
    if (this.choosedMonth == this.dateServ.currentMonth) {
      this.dateServ.setDateRange(this.currentYear, 1, this.currentYear, this.choosedMonth);
    } else {
      this.dateServ.setDateRange(this.currentYear, this.choosedMonth, this.currentYear, this.choosedMonth);
    }
    this.dataProvider.syncYearInventoryData().add(() => {
      setTimeout(() => {
        this.update(true);
      }, 100);
    });
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopmonthPage, {
      title: '选择月份',
      data: this.months,
    });
    popover.present({
      ev: event
    });
  }
}