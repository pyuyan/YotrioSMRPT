import { TaxmodalPage } from './../taxmodal/taxmodal';
import { PopperiodPage } from './../popperiod/popperiod';
import { Component, ViewChild, ElementRef, group } from '@angular/core';
import { NavController, IonicPage, ModalController, AlertController, LoadingController, NavParams, PopoverController, Events } from 'ionic-angular';

import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';  //备注：NgxEchartsModule 不能少

import { ContextData } from '../../app/context';
import { Base } from "./../../common/base";
import { arrayHelper } from './../../util/helper/array';
import { mathHelper } from './../../util/helper/math';
import { DateScene, DateService } from './../../service/date';
import { DatasvrProvider } from "./../../providers/datasvr/datasvr";
import { eventParams } from "../../params/event";
/**
 * @desc 税收报表信息页面 2018年4月28日09:09:45
 */
@IonicPage()
@Component({
  selector: 'page-tax',
  templateUrl: 'tax.html',
})
export class TaxPage extends Base {

  //用于发布主题
  private readonly _topic = eventParams.tax.after.yearChanged;

  @ViewChild('taxPie') taxPieEle: ElementRef;
  @ViewChild('taxBar') taxBarEle: ElementRef;

  taxPieInstance: any
  taxBarInstance: any

  //要求的排序 hardcode note 这里数据源经常变动
  // pieDataSort: string[] = [/*'户外家居'*/'户外休闲家具', /*'北京联拓'*/'旅游机票', /*'永强投资'*/'投资', '房地产', '其他'];
  // 财务那边要求改为以下。。2018年6月20日11:12:09 
  pieDataSort: string[] = ['户外休闲家具', '北京联拓', '永强投资', '房地产', '其他'];
  barDataSort: string[] = ['临海', '黄岩', '宁波', '山东', '上海', '北京', '合肥', '境外'];

  //是否显示合计的条目bar
  showTotalBar: boolean = true;

  //选中的年份
  choosedYear: string;
  //税收涉及的年份 今年 去年 前年
  Years: string[];

  //涉及的时间
  period: any[] = [];
  //今年
  currentYear: any;
  //选择的时间
  choosedPeriod: string;

  //税收数据按 地区分类
  taxDataGroupByArea: any = {};
  //税收数据按 产业分类
  taxDataGroupByIndustry: any = {};
  //税种
  taxType: string[] = ['增值税', '所得税', '其他税费'];
  //过滤后的数据
  filterData: any = [];

  //按行业分组的饼图数据结构
  taxPieTitleColor: string[] = ['#FFFFFF', '#CCF600'];
  taxPieSeriesColor: string[] = ['#c0504d', '#9bbb59', '#4bacc6', '#f79646'];
  taxPieData: any = {
    backgroundColor: '#07213a',
    padding: [0, 0, 0, 0],
    title: [],

    tooltip: {
      show: true,
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c}",
    },

    legend: {
      data: [],
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
  //按地区分组的坐标数据结构
  taxBarData: any = {
    backgroundColor: '#07213a',
    color: this.taxPieSeriesColor,//["#c0504d", "#9bbb59", "#4bacc6", "#f79646", "#59DF97"],
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
      data: this.taxType,
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
        data: [], //e.g. ['临海'，'上海', '北京']
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
        splitLine: {
          show: false
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

  taxBarxAxisAppend: any;
  taxBarSeriesAppend: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public event: Events,
    public dateServ: DateService,
    public dataProvider: DatasvrProvider,
    public modalCtrl: ModalController,
    private echartServ: NgxEchartsService,
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
    this.taxPieInstance = this.echartServ.echarts.init(this.taxPieEle.nativeElement.querySelector('div'));
    this.taxPieInstance.setOption(this.taxPieData);

    this.taxPieInstance.on('click', (params => {
      this.presentModal(params);
    }));

    this.taxBarInstance = this.echartServ.echarts.init(this.taxBarEle.nativeElement.querySelector('div'));
    this.taxBarInstance.setOption(this.taxBarData);

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
  update(needUpdate: boolean) {

    //刷新依据 根据入口出注册的函数更新为主
    let taxData: Array<any> = ContextData.TaxDatas[ContextData.TableName].DataValue;
    let taxUpdateFlag: boolean = ContextData.TaxDatas[ContextData.TableName].UpdateFlag;

    super.debug(arrayHelper._unique(arrayHelper._column(taxData, 'Industry')))

    //taxData清洗
    this.cleanData(taxData);
    this.filterData = taxData;

    if (needUpdate || taxUpdateFlag) {

      this.taxDataGroupByArea = {};
      this.taxDataGroupByIndustry = {};
      this.taxBarxAxisAppend = [];
      this.taxBarSeriesAppend = [];

      this.updatePieData(taxData);
      this.updateBarData(taxData);

      ContextData.TaxDatas[ContextData.TableName].UpdateFlag = false;
    }

    //页面切换后，显示真实选择的时间
    // this.choosedYear = taxData[0].BEGINPERIOD.substr(0, 4) + '年';
    //页面切换后，显示真实选择的时间
    // console.log(taxData);
    this.choosedPeriod = taxData[0].ENDPERIOD.substr(0, 4) + '年' + taxData[0].ENDPERIOD.substr(4, 2)+'月';
  }

  private updatePieData(data) {

    const firstData = ['出口退税'];

    let newPieData = arrayHelper._group(data, 'Industry');

    //按要求重新排序
    this.pieDataSort.forEach(name => {
      this.taxDataGroupByIndustry[name] = newPieData[name] || [];
    });

    this.taxPieData.legend.data = firstData.concat(this.taxType);

    let pieDistance: number = 15.5;
    let IndustryNames = firstData.concat(Object.keys(this.taxDataGroupByIndustry));
    //出口退税总额
    let ExpDrawbackTaxTotal = arrayHelper._sum(arrayHelper._column(data, 'ExpDrawbackTax'), 0);
    //定义数据
    let titleData: any[] = [], seriesData: any[] = [], i = 0;

    IndustryNames.forEach(industryName => {
      let distance = i * pieDistance;
      titleData.push({
        text: industryName,
        textAlign: 'center',
        x: 15 + distance + '%',
        y: '0%',
        textStyle: {
          fontSize: 30,
          color: this.taxPieTitleColor[0]
        }
      });
      i++;
    }); i = 0;

    titleData.push({
      text: ExpDrawbackTaxTotal,
      textAlign: 'center',
      x: '15%',
      y: '10%',
      textStyle: {
        fontSize: 30,
        color: this.taxPieTitleColor[1]
      }
    });

    seriesData.push({
      name: firstData[0],
      type: "pie",
      radius: ["0%", "65%"],
      center: ["15%", "60%"],
      color: this.taxPieSeriesColor,
      // label: {
      //   formatter: " {b}\n{c} ",
      //   position: "inner",
      //   textStyle: {
      //     fontSize: 20
      //   }
      // },
      label: {
        // show:false,
        formatter: " {c}",
        // position: 'inner',
        textStyle: {
          fontSize: 16,
        }
      },
      tooltip: {
        show: true,
        formatter: " {b}\n{c} ",
        textStyle: {
          fontSize: 26,
        }
      },
      itemStyle: {
        normal: {
          opacity: 1,
          borderWidth: 3,
          borderColor: "#FFFFFF"
        }
      },
      data: [{
        value: ExpDrawbackTaxTotal,
        name: firstData[0],
      }]
    });

    //pie内数据
    for (let key in this.taxDataGroupByIndustry) {
      let distance = i * pieDistance;
      let _data = this.taxDataGroupByIndustry[key];

      //增值税
      let VATax = arrayHelper._sum(arrayHelper._column(_data, 'VATax'), 0);
      //企业所得税
      let IncomeTax = arrayHelper._sum(arrayHelper._column(_data, 'IncomeTax'), 0);
      //其他税
      // let OtherTax = arrayHelper._sum(arrayHelper._column(_data, 'OtherTax'), 0);
      //其他税费
      let OtherTax = arrayHelper._sum(arrayHelper._column(_data, 'OtherTax'), 0);
      //其他经费
      let OtherFee = arrayHelper._sum(arrayHelper._column(_data, 'OtherFee'), 0);
      //其他税费 = 其他税费 + 其他经费
      let OtherTotal = arrayHelper._sum([OtherTax, OtherFee], 0);
      //总税费
      let totalTax = arrayHelper._sum([VATax, IncomeTax, OtherTotal], 0);

      titleData.push({
        text: totalTax,
        textAlign: 'center',
        x: 30 + distance + '%',
        y: '10%',
        textStyle: {
          fontSize: 30,
          color: this.taxPieTitleColor[1]
        }
      });

      seriesData.push({
        name: key,
        type: "pie",
        radius: ["0%", "65%"],
        center: [30 + distance + '%', "60%"],
        color: this.taxPieSeriesColor,
        // label: {
        //   formatter: " {b}\n{c} ",
        //   position: "inner",
        //   textStyle: {
        //     fontSize: 20
        //   }
        // },
        label: {
          // show:false,
          formatter: " {c}",
          // position: 'inner',
          textStyle: {
            fontSize: 16,
          }
        },
        tooltip: {
          show: true,
          formatter: " {b}\n{c} ",
          textStyle: {
            fontSize: 26,
          }
        },
        itemStyle: {
          normal: {
            opacity: 1,
            borderWidth: 2,
            borderColor: "#FFFFFF"
          }
        },
        data: [
          {
            value: VATax,
            name: this.taxPieData.legend.data[1],
          },
          {
            value: IncomeTax,
            name: this.taxPieData.legend.data[2],
          },
          {
            value: OtherTotal,
            name: this.taxPieData.legend.data[3],
          },
        ]
      });

      i++;
    } //pie title数据, pie serise数据组装完毕

    this.taxPieData.title = titleData;
    this.taxPieData.series = seriesData;

    this.taxPieInstance.setOption(this.taxPieData);
  }

  private updateBarData(data) {
    // this.taxDataGroupByArea = arrayHelper._group(data, 'Area');

    let newBarData = arrayHelper._group(data, 'Area');

    //按要求重新排序
    this.barDataSort.forEach(name => {
      this.taxDataGroupByArea[name] = newBarData[name] || [];
    });


    let areas = Object.keys(this.taxDataGroupByArea);
    let barSeriseData: any[] = [];
    let VATaxData: any[] = [];
    let IncomeTaxData: any[] = [];
    let OtherTaxData: any[] = [];
    let totalTaxData: any[] = [];

    for (let key in this.taxDataGroupByArea) {
      let _data = this.taxDataGroupByArea[key];
      //增值税
      let vatax = arrayHelper._sum(arrayHelper._column(_data, 'VATax'), 0);
      VATaxData.push(vatax);
      //企业所得税
      let incometax = arrayHelper._sum(arrayHelper._column(_data, 'IncomeTax'), 0);
      IncomeTaxData.push(incometax);
      //其他税
      // let othertax = arrayHelper._sum(arrayHelper._column(_data, 'OtherTax'), 0);
      //其他税费
      let OtherTax = arrayHelper._sum(arrayHelper._column(_data, 'OtherTax'), 0);
      //其他经费
      let OtherFee = arrayHelper._sum(arrayHelper._column(_data, 'OtherFee'), 0);
      //其他税费 = 其他税费 + 其他经费
      let OtherTotal = arrayHelper._sum([OtherTax, OtherFee], 0);

      OtherTaxData.push(OtherTotal);
      //总税费
      let total = arrayHelper._sum([vatax, incometax, OtherTotal], 0);
      totalTaxData.push(total);
    }

    this.taxType.forEach(t => {
      let tmpData: any[] = t == '增值税' ? VATaxData : (t == '所得税' ? IncomeTaxData : OtherTaxData);
      let tmpSeriseData = {
        name: t,
        type: 'bar',
        stack: '税务小计',
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
        this.taxBarSeriesAppend.push({ name: t, data: tmpData });
      } else {
        this.taxBarSeriesAppend.push({ name: t, data: tmpData.concat([tmpSum]) });
      }
    });

    this.taxBarData.xAxis[0].data = areas;
    this.taxBarData.series = barSeriseData;

    //处理小计部分
    let tmpSum = arrayHelper._sum(totalTaxData, 0);
    totalTaxData.push(tmpSum);
    this.taxBarxAxisAppend = areas.concat(['合计']);
    this.taxBarSeriesAppend.push({ name: '合计', data: totalTaxData })

    super.debug(this.taxBarData)
    this.taxBarInstance.setOption(this.taxBarData);
  }

  private cleanData(data: any) {
    const regx = /有限公司|有限责任公司|合伙企业（有限合伙）/;
    if (!Array.isArray(data)) return [];
    data.map((v) => {
      v['Org'] = v['Org'].replace(regx, '');
      //增值税
      v['VATax'] = Math.round(v['VATax']);
      //企业所得税
      v['IncomeTax'] = Math.round(v['IncomeTax']);
      //其他税费
      v['OtherTax'] = Math.round(v['OtherTax']);
      //其他经费
      v['OtherFee'] = Math.round(v['OtherFee']);
      //出口退税总额
      v['ExpDrawbackTax'] = Math.round(v['ExpDrawbackTax']);
    });
  }

  private getTaxGroupData(industry: string) {
    let res: any = [];
    Object.keys(this.taxDataGroupByIndustry).forEach(el => {
      if (el == industry) res = this.taxDataGroupByIndustry[el];
    });
    return res;
  }

  private getModalData(event) {
    const taxTypeMap: any = [
      { taxName: '增值税', col: 'VATax' },
      { taxName: '所得税', col: 'IncomeTax' },
      { taxName: '其他税费', col: 'OtherTax' }, //这个特殊 OtherTax+OtherFee
      { taxName: '出口退税', col: 'ExpDrawbackTax' },
    ];

    let taxs: any = [];
    taxs = arrayHelper._column(taxTypeMap, 'taxName');

    let seriseName: string = event.seriesName, taxName: string = event.name;
    let realTaxCol = taxTypeMap[taxs.findIndex(el => el == taxName)].col;
    let res: any = [];

    if (seriseName != '出口退税') {
      let groupData = this.getTaxGroupData(seriseName);

      if (taxName == '其他税费') {
        groupData.forEach(el => {
          let totalOther = Number(arrayHelper._sum([el['OtherTax'], el['OtherFee']], 0));
          if (totalOther > 0) {
            res.push({
              company: el['Org'],
              showValue: totalOther
            });
          }
        });
      } else {
        groupData.filter(v => Number(v[realTaxCol]) > 0).map(v => {
          res.push({
            company: v['Org'],
            showValue: v[realTaxCol]
          })
        });
      }
    } else {
      this.filterData.filter(v => Number(v[realTaxCol]) > 0).map(el => {
        res.push({
          company: el['Org'],
          showValue: el[realTaxCol]
        })
      });
    }

    //递减排序
    res = arrayHelper._sortNum(res, 'showValue', 'desc');

    return {
      title: seriseName,
      tax: taxName,
      data: res,
    };
  }

  /**
   * 改变年份刷新数据
   */
  chooseYear(val: any = '') {

    //防止重复刷新
    super.addUpdateCount();

    //e.g. this.Years = [2018 年, 2017 年, 2016 年] [今年，去年，前年]
    let yearIndex = this.Years.indexOf(this.choosedYear);
    switch (yearIndex) {
      case 1:
        this.dateServ.setLastYear();
        break;
      case 2:
        this.dateServ.setBeforeLastYear();
        break;
      default:
        this.dateServ.setCurrentYear()
        break;
    }
    this.dataProvider.syncYearTaxData().add(() => {
      setTimeout(() => {
        this.update(true);
      }, 100);
    });
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
    this.dataProvider.syncYearTaxData().add(() => {
      setTimeout(() => {
        this.update(true);
      }, 100);
    });
  }

  presentModal(event) {
    let expanded: boolean = true;
    let showIcon: boolean = false;
    let contracted: boolean = !expanded;
    const modal = this.modalCtrl.create(TaxmodalPage, this.getModalData(event));
    modal.onDidDismiss(data => {
      expanded = false;
      contracted = !expanded;
      setTimeout(() => showIcon = true, 200);
    });
    modal.present();
  }

  /**
   * 使用自定义组件popover
   */
  presentPopover(event) {
    /* let popover = this.popoverCtrl.create(PopperiodPage, {
      title: '选择年份',
      data: this.Years,
      topic: this._topic,
    });
    popover.present({
      ev: event
    }); */

    let popover = this.popoverCtrl.create(PopperiodPage, {
      title: '选择时间',
      data: this.period,
      topic: this._topic
    });
    popover.present({
      ev: event
    });
  }

  /* processDateRange() {
    //设置时间场景
    this.dateServ.setScene(DateScene.TAX);

    const years = this.dateServ.years;
    //ugly
    this.Years = [
      years.currentYear + ' 年',
      years.lastYear + ' 年',
      years.blastYear + ' 年',
    ];

    this.choosedYear = this.Years[0];
  } */

  private processDateRange() {
    //设置时间场景
    this.dateServ.setScene(DateScene.TAX);
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

  fireEvent() {
    //监听年份改变事件 2018年5月14日
    /* this.event.subscribe(this._topic, (year) => {
      super.debug("event 年份：" + year)
      this.choosedYear = year;
      setTimeout(() => {
        this.chooseYear();
      }, 10);
    }); */

    //按照月份去选
    this.event.subscribe(this._topic, (period) => {
      super.debug("时间：" + period);
      this.choosedPeriod = period;
      this.choosePeriod();
    });
  }
}
