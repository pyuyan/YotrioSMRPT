import { debugHelper } from './../../util/helper/debug';
import { arrayHelper } from './../../util/helper/array';
import { dataHelper } from './../../util/helper/data';
import { CacheService } from './../../service/cache';

import { passwordParams } from "./../../params/password";
import { debugParams } from "./../../params/debug";
import { Base } from './../../common/base';

import { Component } from '@angular/core';
import { NavController, TextInput, IonicPage, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { ViewChild, ElementRef } from '@angular/core';
import { NgxEchartsService, NgxEchartsModule } from 'ngx-echarts';
import { ContextData } from '../../app/context';

import { SmreportmodalPage } from '../smreportmodal/smreportmodal';
import { MfgcountmodelPage } from '../home/mfgcountmodel';

/**
 * 定义显示的类型
 */
export enum DetailType {
    GROUP = 'Group',
    RATE = 'Rate'
}

@IonicPage()
@Component({
    selector: 'page-smreport',
    templateUrl: 'smreport.html',
})
export class SmreportPage extends Base {

    @ViewChild('clockcontrol') clockctrl: any

    @ViewChild('smpie') smpie: ElementRef;
    @ViewChild('smbar') smbar: ElementRef;

    smpieInstance: any
    smbarInstance: any

    //所有的颜色
    colors: string[] = ['#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#59DF97', '#607D8B', '#795548'];

    totalsalemnydatas: any = {
        backgroundColor: '#07213a',
        padding: [
            0,  // 上
            0, // 右
            0,  // 下
            0, // 左
        ],
        title: [
            {
                text: '累计接单金额',
                textAlign: 'center',
                x: '20%',
                y: '0%',
                textStyle: {
                    fontSize: 30,
                    color: '#FFFFFF'
                }
            },
            {
                text: '累计毛利金额',
                textAlign: 'center',
                x: '50%',
                y: '0%',
                textStyle: {
                    fontSize: 30,
                    color: '#FFFFFF'
                }
            },
            {
                text: '毛利率',
                textAlign: 'center',
                x: '80%',
                y: '0%',
                textStyle: {
                    fontSize: 30,
                    color: '#FFFFFF'
                }
            },
            {
                text: 0,
                textStyle: {
                    fontSize: 38,
                    color: '#CCF600'
                },
                textAlign: 'center',
                x: '20%',
                y: '10%'
            },
            {
                text: 0,
                textStyle: {
                    fontSize: 38,
                    color: '#CCF600'
                },
                textAlign: 'center',
                x: '50%',
                y: '10%'
            },
            {
                text: 0,
                textStyle: {
                    fontSize: 38,
                    color: '#CCF600'
                },
                textAlign: 'center',
                x: '80%',
                y: '10%'
            }
        ],

        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}",
            textStyle: {
                fontSize: 26,
            }
        },
        legend: {
            data: [],
            left: 5,
            orient: 'vertical',
            top: 0,
            padding: 0,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 20
            }
        },
        series: [
            {
                name: '累计接单金额',
                type: 'pie',
                radius: ['0%', '65%'],
                center: ['20%', '60%'],
                color: this.colors,
                label: {
                    // show:false,
                    formatter: " {c}",
                    // position: 'inner',
                    textStyle: {
                        fontSize: 16,
                    }
                },
                tooltip: {
                    formatter: " {b}\n{c}",
                },
                itemStyle: {
                    normal: {
                        opacity: 1,
                        borderWidth: 3,
                        borderColor: '#FFFFFF'
                    }
                },
                data: [

                ]
            },
            {
                name: '累计毛利金额',
                type: 'pie',
                radius: ['0%', '65%'],
                center: ['50%', '60%'],
                color: this.colors,
                // label: {
                //     formatter: " {b}\n{c}",
                //     position: 'inner',
                //     textStyle: {
                //         fontSize: 20,
                //     }
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
                    formatter: " {b}\n{c}",
                },
                itemStyle: {
                    normal: {
                        opacity: 1,
                        borderWidth: 3,
                        borderColor: '#FFFFFF'
                    }
                },
                data: [

                ]
            },
            {
                name: '毛利率',
                type: 'pie',
                radius: ['0%', '65%'],
                center: ['80%', '60%'],
                color: this.colors,
                // label: {
                //     formatter: " {b}\n{c} %",
                //     position: 'inner',
                //     textStyle: {
                //         fontSize: 20,
                //     }
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
                    formatter: " {b}\n{c} %",
                },
                itemStyle: {
                    normal: {
                        opacity: 1,
                        borderWidth: 3,
                        borderColor: '#FFFFFF'
                    }
                },
                data: [

                ]
            }
        ]
    };


    profitdatas: any = {
        color: this.colors,

        tooltip: {
            show: false,
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            left: '3%',
            right: '0%',
            bottom: '3%',
            containLabel: true,
            y2: 140
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: true },
                restore: { show: false },
                saveAsImage: { show: true },
                magicType: {
                    type: ['line', 'bar'],
                    seriesIndex: {
                        line: [0, 1, 2, 3, 4, 5],
                        bar: [0, 1, 2, 3]
                    }
                }
            }
        },
        legend: {
            data: ['销售目标', '接单金额', '毛利金额', '完成率', '毛利率'],
            left: '0%',
            padding: 0,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 18
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: true,
                    onZeroAxisIndex: 1,
                    lineStyle: {
                        color: '#FFFFFF'
                    }
                },
                axisLabel: {
                    show: false,
                    interval: 0,
                    rotate: -30,
                    fontSize: 16
                },
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '金额',
                min: 0,
                max: 80000,
                position: 'left',
                interval: 10000,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#FFFFFF',
                        fontSize: 14
                    }
                },
                axisLabel: {
                    formatter: '{value} ￥'
                },
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                name: '百分比',
                min: 0,
                max: 100,
                position: 'right',
                interval: 20,
                boundaryGap: false,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#FFFFFF',
                        fontSize: 14
                    }
                },
                axisLabel: {
                    formatter: '{value} %'
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: '销售目标',
                type: 'bar',
                yAxisIndex: 0,
                data: [],
                animation: true,
                itemStyle: {
                    color: this.colors[3]
                },
                barGap: '0%'
            },
            {
                name: '接单金额',
                type: 'bar',
                yAxisIndex: 0,
                data: [],
                animation: true,
                itemStyle: {
                    color: this.colors[0]
                },
                barGap: '0%'
            },
            {
                name: '毛利金额',
                type: 'bar',
                yAxisIndex: 0,
                data: [],
                animation: true,
                itemStyle: {
                    color: this.colors[1]
                },
                barGap: '0%'
            },
            {
                name: '完成率',
                type: 'line',
                yAxisIndex: 1,
                data: [],
                animation: true,
                itemStyle: {
                    color: this.colors[4]
                },
                barGap: '0%'
            },
            {
                name: '毛利率',
                type: 'line',
                yAxisIndex: 1,
                data: [],
                animation: true,
                itemStyle: {
                    color: this.colors[5]
                },
                barGap: '0%'
            }
        ]
    };

    tablevalues: any = {
        orderbyratevalues: [

        ],
        orderbymnyvalues: [

        ]
    }

    contextdata: ContextData;

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private alterCtrl: AlertController,
        private echartsvr: NgxEchartsService,
        private cacheServ: CacheService
    ) {
        super();
        //初始化上下文
        this.contextdata = ContextData.Create();
    }

    //数据更新函数
    updateFunction = function (table_values, charts, immediateflag) {
        if (ContextData.OriginalDatas[ContextData.TableName].UpdateFlag['smreportpage'] || immediateflag) {
            let customerarray: Array<any> = new Array<any>();
            let topgroupvalues: Array<any> = new Array<any>();
            let areanames: Array<any> = new Array<any>();
            let areamoneys: Array<any> = new Array<any>();
            let areagrosses: Array<any> = new Array<any>();
            let totalmoney = 0;
            let totalgross = 0;
            let keydeptdata: any = ContextData.GetKeyDepts();
            let keydeptmoneys: Array<any> = new Array<any>();
            let keydeptgrosses: Array<any> = new Array<any>();
            keydeptdata.DeptNames.forEach(dept => {
                keydeptmoneys.push(0);
                keydeptgrosses.push(0);
            });
            //统计国内累计接单金额
            let inlandSum = 0;
            ContextData.OriginalDatas[ContextData.TableName].DataValue.forEach(datarow => {
                let selfflag = datarow.SelfFlag; //内部外部
                let areatype = datarow.AreaType; //区域分类
                let customer = datarow.Customer; //客户
                let keydept = datarow.SaleDept; //业务指标部门
                if (Number.parseFloat(datarow.TransferPrice) > 0) {
                    let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
                    let tmp_salemny = tmp_orderqty * Number.parseFloat(datarow.SalePrice) * Number.parseFloat(datarow.ExchangeRate) / 10000;
                    let tmp_tranfermny = 0;
                    if (datarow.TransferPrice > 0)
                        tmp_tranfermny = tmp_orderqty * Number.parseFloat(datarow.TransferPrice) / 10000;
                    let tmp_gross = tmp_salemny - ((Number.parseFloat(datarow.NotConsume) + Number.parseFloat(datarow.DepreciateRate)) * tmp_salemny) - tmp_tranfermny;

                    //接单统计饼图数据收集
                    totalmoney += tmp_salemny;
                    totalgross += tmp_gross;
                    let areaidx = areanames.indexOf(areatype);
                    if (areaidx < 0) {
                        //新增
                        areanames.push(areatype);
                        areamoneys.push(tmp_salemny);
                        areagrosses.push(tmp_gross);
                    } else {
                        areamoneys[areaidx] += tmp_salemny;
                        areagrosses[areaidx] += tmp_gross;
                    }

                    if (customer != '国内市场部客户' && keydept) {
                        //2018年5月11日16:07:15 这里截取到 "组" 做匹配，有些组名变动，e.g. TEST组 -> TEST组(失效)
                        let v_keydept = keydept.substr(0, keydept.indexOf("组") + 1);
                        //业务组接单数据收集
                        // let deptidx = keydeptdata.DeptNames.indexOf(keydept);
                        let deptidx = keydeptdata.DeptNames.indexOf(v_keydept);

                        if (deptidx >= 0) {
                            keydeptmoneys[deptidx] += tmp_salemny;
                            keydeptgrosses[deptidx] += tmp_gross;
                        }

                        //TOP10表格数据收集
                        // if(datarow.InnerOrg=='False'){
                        let custidx = customerarray.indexOf(customer);
                        if (custidx < 0) {
                            customerarray.push(customer);
                            //tablevalues.orderbyratevalues
                            topgroupvalues.push({
                                Customer: customer,
                                OrderMoney: tmp_salemny,
                                GrossMoney: tmp_gross,
                                GrossRate: 0
                            });
                        } else {
                            topgroupvalues[custidx].OrderMoney += tmp_salemny;
                            topgroupvalues[custidx].GrossMoney += tmp_gross;
                        }
                        // }
                    }

                    //计算国内市场部，主要是为了debug
                    if (keydept == '国内市场部') {
                        inlandSum += tmp_salemny;
                    }
                }
            });

            //业务组分析数据更新
            charts[0].ValueOptions.xAxis[0].data = keydeptdata.DeptNames;
            charts[0].ValueOptions.series[0].data = keydeptdata.DeptSalingTarget;
            charts[0].ValueOptions.series[1].data.length = 0;
            charts[0].ValueOptions.series[2].data.length = 0;
            charts[0].ValueOptions.series[3].data.length = 0;
            charts[0].ValueOptions.series[4].data.length = 0;
            for (let i = 0; i < keydeptdata.DeptNames.length; i++) {
                charts[0].ValueOptions.series[1].data.push(Math.round(keydeptmoneys[i]));
                charts[0].ValueOptions.series[2].data.push(Math.round(keydeptgrosses[i]));
                if (charts[0].ValueOptions.series[0].data[i] == 0) {
                    charts[0].ValueOptions.series[3].data.push('0.00');
                } else {
                    charts[0].ValueOptions.series[3].data.push((charts[0].ValueOptions.series[1].data[i] / charts[0].ValueOptions.series[0].data[i] * 100).toFixed(2));
                }
                if (charts[0].ValueOptions.series[1].data[i] == 0) {
                    charts[0].ValueOptions.series[4].data.push('0.00');
                } else {
                    charts[0].ValueOptions.series[4].data.push((charts[0].ValueOptions.series[2].data[i] / charts[0].ValueOptions.series[1].data[i] * 100).toFixed(2));
                }
            };

            charts[0].ChartObj.setOption(charts[0].ValueOptions);

            //接单饼图数据更新
            charts[1].ValueOptions.legend.data = areanames; //图例
            charts[1].ValueOptions.title[3].text = Math.round(totalmoney).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //总金额
            charts[1].ValueOptions.title[4].text = Math.round(totalgross).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //总毛利
            charts[1].ValueOptions.title[5].text = (totalgross / totalmoney * 100).toFixed(2) + ' %'; //毛利率
            charts[1].ValueOptions.series[0].data.length = 0;
            charts[1].ValueOptions.series[1].data.length = 0;
            charts[1].ValueOptions.series[2].data.length = 0;
            for (let i = 0; i < areanames.length; i++) {
                charts[1].ValueOptions.series[0].data.push(
                    {
                        value: Math.round(areamoneys[i]),
                        name: areanames[i]
                    }
                );
                charts[1].ValueOptions.series[1].data.push(
                    {
                        value: Math.round(areagrosses[i]),
                        name: areanames[i]
                    }
                );
                charts[1].ValueOptions.series[2].data.push(
                    {
                        value: (Math.round(areagrosses[i]) / Math.round(areamoneys[i]) * 100).toFixed(2),
                        name: areanames[i]
                    }
                );
            }
            charts[1].ChartObj.setOption(charts[1].ValueOptions);

            debugHelper.log('按地区累计接单金额：' + arrayHelper._sum(arrayHelper._column(charts[1].ValueOptions.series[0].data, 'value'), 0))
            debugHelper.log('按业务组累计接单金额：' + arrayHelper._sum(charts[0].ValueOptions.series[1].data, 0))
            debugHelper.log('国内市场部累计接单金额：' + arrayHelper._sum([inlandSum], 0))

            //前10毛利率数据刷新
            topgroupvalues.forEach(groupvalue => {
                if (groupvalue.OrderMoney == 0) {
                    groupvalue.GrossRate = 0;
                } else {
                    groupvalue.GrossRate = groupvalue.GrossMoney / groupvalue.OrderMoney;
                }
            });
            //毛利率递减排序
            topgroupvalues.sort(function (a, b) {
                return Number.parseFloat(a.GrossRate) > Number.parseFloat(b.GrossRate) ? -1 : 1;
            });
            table_values.orderbyratevalues.length = 0;
            for (let i = 0; i < 10; i++) {
                table_values.orderbyratevalues.push(topgroupvalues[i]);
            }

            //前10销售金额数据刷新 订单金额递减
            topgroupvalues.sort(function (a, b) {
                return Number.parseFloat(a.OrderMoney) > Number.parseFloat(b.OrderMoney) ? -1 : 1;
            });
            table_values.orderbymnyvalues.length = 0;
            for (let i = 0; i < 10; i++) {
                table_values.orderbymnyvalues.push(topgroupvalues[i]);
            }

            ContextData.OriginalDatas[ContextData.TableName].UpdateFlag['smreportpage'] = false;
        }
    }

    chartObjList: Array<any> = new Array<any>();

    ionViewWillEnter() {
        //图表控件对象获取
        this.smbarInstance = this.echartsvr.echarts.init(this.smbar.nativeElement.querySelector('div'));
        this.smbarInstance.setOption(this.profitdatas);
        if (this.smbarInstance) {
            this.chartObjList.push(
                {
                    ChartObj: this.smbarInstance,
                    ValueOptions: this.profitdatas
                }
            )
        }
        this.smpieInstance = this.echartsvr.echarts.init(this.smpie.nativeElement.querySelector('div'));
        this.smpieInstance.setOption(this.totalsalemnydatas);
        if (this.smpieInstance) {
            this.chartObjList.push(
                {
                    ChartObj: this.smpieInstance,
                    ValueOptions: this.totalsalemnydatas
                }
            )
        }

        //增加点击事件 2018年6月11日11:29:00
        this.smpieInstance.on('click', (params => {

            super.debug(this.getCurrentClassName() + 'pie 点击事件');
            super.debug(params);

            this.showDetail('Rate');
        }));

        //首次打开执行数据刷新
        if (this.tablevalues.orderbymnyvalues.length == 0) {
            setTimeout(this.updateFunction, 500, this.tablevalues, this.chartObjList, true);
        }
    }

    /**
     * 页面首次加载后
     */
    ionViewDidLoad() {
        //时钟刷新
        super.showCurrentTime();

        //数据值定时刷新 1 分钟刷新
        setInterval(this.updateFunction, 60000, this.tablevalues, this.chartObjList, false);
    }


    onProfitbarClick(params: any) {
        super.debug(params);
    }

    onManufacturepieClick(params: any) {
        super.debug(params);
    }

    /**
     * 营销数据中心点击显示详情事件入口
     */
    showDetail(type: string, args?: any) {

        //点击时候就进行异步数据运算，并且保存到缓存中，实际16ms+后处理
        setTimeout(() => {
            if (type === DetailType.RATE) {
                this.preProcessDetail();
            } else if (type === DetailType.GROUP) {
                this.preProcessGroup(args);
            }
        }, 10); //end 这里可以考虑多态优化下

        let alert = this.alterCtrl.create({
            title: '身份验证',
            message: '请输入安全密码',
            inputs: [
                {
                    name: 'password',
                    placeholder: '',
                    type: 'password',
                    handler: input => {
                        super.debug(input);
                    }
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: () => { }
                },
                {
                    text: '确定',
                    handler: (data) => {
                        let errMsg: any = null;
                        if (data.password === passwordParams.defaultPWD || debugParams.activeDebug) {

                            if (type === DetailType.RATE) {
                                this._showRateDetail();
                            } else if (type === DetailType.GROUP) {
                                this._showGroupDetail(args);
                            } else {
                                errMsg = '类型错误';
                            }

                        } else {
                            errMsg = '密码错误';
                        }

                        if (errMsg) {
                            super.showAlert(this.alterCtrl, errMsg, errMsg);
                        }
                    }
                }
            ],
        });
        alert.present();
    }

    private _showRateDetail() {
        //对数据进行处理，主要是计算 产值，毛利率
        let loader = super.showLoading(this.loadingCtrl, "正在读取数据...");

        this.cacheServ.getData(DetailType.RATE).then(datas => {
            super.debug('_showRateDetail 缓存获取数据')
            super.debug(datas)
            if (datas == null || datas === null) {
                super.debug('_showRateDetail 缓存未命中')
                datas = this.preProcessDetail();
            }
            loader.dismiss();

            if (!Object.keys(datas).length) {
                super.showAlert(this.alterCtrl, '暂无数据', '暂无数据');
                return;
            }

            let expanded: any = true;
            let showIcon: any = false;
            let contracted: any = !expanded;
            const modal = this.modalCtrl.create(SmreportmodalPage, {
                data: datas
            });
            modal.onDidDismiss(data => {
                expanded = false;
                contracted = !expanded;
                setTimeout(() => showIcon = true, 200);
            });
            modal.present();
        }).catch(err => { super.debug('cache 获取数据失败' + err) });;
    }

    private _showGroupDetail(params: any) {
        let loader = super.showLoading(this.loadingCtrl, "正在读取明细数据...");

        this.cacheServ.getData(DetailType.GROUP + params).then(res => {
            super.debug('_showGroupDetail 缓存获取数据')
            super.debug(res)
            if (res == null || res === null) {
                super.debug('_showGroupDetail 缓存未命中')
                res = this.preProcessGroup(params);
            }
            loader.dismiss();

            if (!Object.keys(res.groupdatas).length) {
                super.showAlert(this.alterCtrl, '暂无数据', '暂无数据');
                return;
            }

            let expanded: any = true;
            let showIcon: any = false;
            let contracted: any = !expanded;
            const modal = this.modalCtrl.create(MfgcountmodelPage, res);
            modal.onDidDismiss(data => {
                expanded = false;
                contracted = !expanded;
                setTimeout(() => showIcon = true, 200);
            });
            modal.present();
        }).catch(err => { super.debug('cache 获取数据失败' + err) });
    }

    private preProcessDetail() {
        let datas: any[] = [];
        ContextData.OriginalDatas[ContextData.TableName].DataValue.forEach(datarow => {
            datas.push(dataHelper.assemble(datarow));
        });

        //按照毛利递增排序
        datas.sort((a: any, b: any) => {
            return a.RealGrossRate > b.RealGrossRate ? 1 : -1;
        });

        this.cacheServ.setData(DetailType.RATE, datas);
        return datas;
    }

    private preProcessGroup(dept) {
        let saleDept = dept;
        let groups: Array<string> = [saleDept];
        let datas: any = {};
        let grouptype: any = '';

        let keydeptdata: any = ContextData.GetKeyDepts();
        let orginalData: Array<any> = ContextData.OriginalDatas[ContextData.TableName].DataValue;

        orginalData.forEach(datarow => {

            let selfflag = datarow.SelfFlag; //内部外部
            let customer = datarow.Customer; //客户
            let tmp_saleDept = datarow.SaleDept; //组

            //只要指定的制造部数据
            if (selfflag &&
                customer &&
                keydeptdata.DeptNames.indexOf(tmp_saleDept) > -1 &&
                tmp_saleDept.indexOf(saleDept) > -1) {

                if (!datas[saleDept]) {
                    datas[saleDept] = {
                        MFGDepts: [customer],   //所有客户
                        DetailDatas: {}
                    }
                }

                let assembleData: Array<any> = [dataHelper.assemble(datarow)];

                if (!datas[saleDept].DetailDatas[customer]) {
                    datas[saleDept].DetailDatas[customer] = assembleData;
                } else {
                    let deptidx = datas[saleDept].MFGDepts.indexOf(customer);
                    if (deptidx < 0) {
                        datas[saleDept].MFGDepts.push(customer);
                        datas[saleDept].DetailDatas[customer] = assembleData;
                    } else {
                        datas[saleDept].DetailDatas[customer].push(assembleData[0]);
                    }
                }
            }
        });

        let res = {
            groupset: groups,
            groupdatas: datas,
            groupindex: 0
        };
        this.cacheServ.setData(DetailType.GROUP + saleDept, res);
        return res;
    }
}
