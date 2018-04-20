import { Component } from '@angular/core';
import { NavController, TextInput, IonicPage, List ,ModalController, AlertController, LoadingController } from 'ionic-angular';
import { ViewChild,ElementRef } from '@angular/core';
import { NgxEchartsService,NgxEchartsModule } from 'ngx-echarts';
import { ContextData } from '../../app/context';
import { deepCopy } from 'ionic-angular/util/util';
import { MfgcountmodelPage } from './mfgcountmodel';
import { SecloginmodelPage } from '../secloginmodel/secloginmodel';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

    public backgroundImage = 'assets/imgs/bg2.jpg';  

    private readonly DEBUG:boolean = false;

    manufacturebarInstance:any

    @ViewChild('manufacturebar') manufacturebar:ElementRef;

    @ViewChild('clockcontrol') clockctrl:any

    OpenGrossModal(datatypename:any) {
        // let modal = this.modalCtrl.create(GrossmodelPage, {datatype:datatypename},{
        //     cssClass: "my-modal"
        // });
        // modal.present();
        // this.expanded = true;
        // this.contracted = !this.expanded;
        // this.showIcon = false;
        // setTimeout(() => {
        //   const modal = this.modalCtrl.create(GrossmodelPage, {datatype:datatypename});
        //   modal.onDidDismiss(data => {
        //     this.expanded = false;
        //     this.contracted = !this.expanded;
        //     setTimeout(() => this.showIcon = true, 330);
        //   });
        //   modal.present();
        // },         200);    
        
        //this.navCtrl.push(GrossmodelPage,{datatype:datatypename});
    }

    /**
     * 打开明细信息
     * @param datarow 
     * @param i 
     */
    OpenDetail(datarow:any,i:number,type:number){

        // const modal2 = this.modalCtrl.create(SecloginmodelPage, {});
        //     modal2.onDidDismiss(data => {
        //         setTimeout(() => {

        //         }, 200);
        //     });
        //     modal2.present();


        let alert = this.alterCtrl.create({
            title: '身份验证',
            message: '请输入安全密码',
            inputs: [
              {
                name: 'password',
                placeholder: '',
                type: 'password',
                handler:input=>{
                    console.log(input);
                }
              },
            ],
            buttons: [
              {
                text: '取消',
                handler: () => {
                  
                }
              },
              {
                text: '确定',
                handler: (data) => {
                    if(data.password==='002489' || this.DEBUG){
                    //进度条控件
                    let loader = this.loadingCtrl.create({
                        content: "正在读取明细数据..."
                    });
                    loader.present();

                    let groups:Array<string> = new Array<string>();
                    let datas:any = {};

                    //设置分类数组
                    if(type===0){
                        //未设转移价
                        groups = ['工厂未接单'];
                    }else if(type===1){
                        //产品分类
                        this.tablevalues.groupbykindvalues.forEach(element => {
                            groups.push(element.kind);
                        });
                    }else if(type===2){
                        //数量区间分组
                        groups = ['10000件以上','5000-10000','1000-5000','200-1000','200件以下'];
                    }

                    let grouptype:any = '';

                    //按照料号 2018年4月20日16:40:41 slyfalcon
                    let orginalData:Array<any> = ContextData.OriginalDatas[ContextData.TableName].DataValue;
                    if (type === 2) {
                        let itemGroupData:any = HomePage.getItemCodeGroupData(orginalData);
                        for (let key in itemGroupData) {
                            let datarows:any = itemGroupData[key];
                            let orderQty:number = 0; //相同料号所有订单数量
                            let assembleData:Array<any> = [];
                            datarows.forEach(datarow => {
                                let selfflag = datarow.SelfFlag; //内部外部
                                let mfgdept = datarow.MFGDept; //生产部门
                                let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
                                let tmp_salemny = tmp_orderqty*Number.parseFloat(datarow.SalePrice)*Number.parseFloat(datarow.ExchangeRate)/10000;
                                let tmp_tranfermny = 0;
                                if(datarow.TransferPrice>0)
                                    tmp_tranfermny = tmp_orderqty*Number.parseFloat(datarow.TransferPrice)/10000;
                                let tmp_gross = tmp_salemny-((Number.parseFloat(datarow.NotConsume)+Number.parseFloat(datarow.DepreciateRate))*tmp_salemny)-tmp_tranfermny;

                                let tmpAssamble:any = {
                                    BusinessDate:datarow.BusinessDate,
                                    MFGCode:datarow.MFGCode,
                                    ItemName:datarow.ItemName,
                                    OrderQty:tmp_orderqty,
                                    SaleMoney:this.GetFormatValue(tmp_salemny,1),
                                    TransferMoney:this.GetFormatValue(tmp_tranfermny,1),
                                    GrossRate:this.GetFormatValue(tmp_gross/tmp_salemny*100,4),
                                    ItemCode:datarow.ItemCode,
                                    MFGDept:datarow.MFGDept
                                };

                                //相同料号数据汇总
                                if(selfflag&&mfgdept) {
                                    orderQty+=tmp_orderqty;
                                    assembleData.push([tmpAssamble]);
                                }
                            });


                            //区间数据分类
                            if(orderQty>10000){
                                grouptype = groups[0];
                            }else if(orderQty<=10000&&orderQty>5000){
                                grouptype = groups[1];
                            }else if(orderQty<=5000&&orderQty>1000){
                                grouptype = groups[2];
                            }else if(orderQty<=1000&&orderQty>200){
                                grouptype = groups[3];
                            }else{
                                grouptype = groups[4];
                            }

                            //数据拼装
                            assembleData.forEach(datarow => {
                                let mfgdept = datarow[0].MFGDept; //生产部门
                                if(!datas[grouptype]){
                                    datas[grouptype] = {
                                        MFGDepts:[mfgdept],
                                        DetailDatas:{}
                                    }
                                }
                                if(!datas[grouptype].DetailDatas[mfgdept]){
                                    datas[grouptype].DetailDatas[mfgdept]=datarow;
                                }else{
                                    let deptidx = datas[grouptype].MFGDepts.indexOf(mfgdept);
                                    if(deptidx<0){
                                        datas[grouptype].MFGDepts.push(mfgdept);
                                        datas[grouptype].DetailDatas[mfgdept]=datarow;
                                    }else{
                                        datas[grouptype].DetailDatas[mfgdept].push(datarow[0]);
                                    }
                                }
                            });
                        } //end

                    } else {
                        orginalData.forEach(datarow => {

                            let selfflag = datarow.SelfFlag; //内部外部
                            let mfgdept = datarow.MFGDept; //生产部门
                            let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
                            let tmp_salemny = tmp_orderqty*Number.parseFloat(datarow.SalePrice)*Number.parseFloat(datarow.ExchangeRate)/10000;
                            let tmp_tranfermny = 0;
                            if(datarow.TransferPrice>0)
                                tmp_tranfermny = tmp_orderqty*Number.parseFloat(datarow.TransferPrice)/10000;
                            let tmp_gross = tmp_salemny-((Number.parseFloat(datarow.NotConsume)+Number.parseFloat(datarow.DepreciateRate))*tmp_salemny)-tmp_tranfermny;
                            // let grouptype:any = '';
                            /*if(type===1){
                                //产品分类数据
                                grouptype = datarow.ItemType;
                            }else if(type===2){
                                //区间数据分类
                                if(tmp_orderqty>10000){
                                    grouptype = groups[0];
                                }else if(tmp_orderqty<=10000&&tmp_orderqty>5000){
                                    grouptype = groups[1];
                                }else if(tmp_orderqty<=5000&&tmp_orderqty>1000){
                                    grouptype = groups[2];
                                }else if(tmp_orderqty<=1000&&tmp_orderqty>200){
                                    grouptype = groups[3];
                                }else{
                                    grouptype = groups[4];
                                }
                            }else if(type==0){
                                //未设转移价数据
                                grouptype = '工厂未接单';
                                mfgdept = grouptype;
                            }*/

                            if(type===1){
                                //产品分类数据
                                grouptype = datarow.ItemType;
                            } else if(type==0){
                                //未设转移价数据
                                grouptype = '工厂未接单';
                                mfgdept = grouptype;
                            }

                            let assembleData:Array<any> = [{
                                BusinessDate:datarow.BusinessDate,
                                MFGCode:datarow.MFGCode,
                                ItemName:datarow.ItemName,
                                OrderQty:tmp_orderqty,
                                SaleMoney:this.GetFormatValue(tmp_salemny,1),
                                TransferMoney:this.GetFormatValue(tmp_tranfermny,1),
                                GrossRate:this.GetFormatValue(tmp_gross/tmp_salemny*100,4),
                                ItemCode:datarow.ItemCode
                            }];

                            //数据拼装
                            if((selfflag&&datarow.MFGDept&&(type===1||type===2))
                                    ||(type===0&&(!datarow.MFGDept))){
                                if(!datas[grouptype]){
                                    datas[grouptype] = {
                                        MFGDepts:[mfgdept],
                                        DetailDatas:{}
                                    }
                                }
                                if(!datas[grouptype].DetailDatas[mfgdept]){
                                    datas[grouptype].DetailDatas[mfgdept]=assembleData;
                                }else{
                                    let deptidx = datas[grouptype].MFGDepts.indexOf(mfgdept);
                                    if(deptidx<0){
                                        datas[grouptype].MFGDepts.push(mfgdept);
                                        datas[grouptype].DetailDatas[mfgdept]=assembleData;
                                    }else{
                                        datas[grouptype].DetailDatas[mfgdept].push(assembleData[0]);
                                    }
                                }
                            }
                        });
                    }
                    //部门排序
                    groups.forEach(g=>{
                        let mfgdeptids:any = ['制造一部','制造二部','制造三部','制造四部','制造五部','制造六部','制造七部','制造九部',
                        '制造十一部','制造十二部','山东永旭','临海市奥特休闲用品制造有限公司','临海市金源工艺品有限公司',
                        '浙江通一休闲家具有限公司','浙江伟峰工艺品有限公司','浙江伊丽特工艺品有限公司','浙江浙佳工艺股份有限公司','工厂未接单'];
                        let depts:any = [];
                        mfgdeptids.forEach(dept=>{
                            if(datas[g].MFGDepts.indexOf(dept)>=0){
                                depts.push(dept);
                            }
                        });
                        datas[g].MFGDepts = depts;
                    });
                    loader.dismiss();   //关闭进度条
                    let expanded:any = true;
                    let showIcon:any = false;
                    let contracted:any = !expanded;
                    setTimeout(() => {
                        const modal = this.modalCtrl.create(MfgcountmodelPage, {
                        groupset:groups,
                        groupdatas:datas,
                        groupindex:i
                        });
                        modal.onDidDismiss(data => {
                            expanded = false;
                            contracted = !expanded;
                            setTimeout(() => showIcon = true, 200);
                        });
                        modal.present();
                    },100);  
                    }else{
                        
                    }
                }
              }
            ]
          });
      
          alert.present();

    }

    tablevalues:any = {
        totalvalues:{
            totalmny:0,
            totalgross:0,
            grossrate:0
        },
        groupvalues:[

        ],
        alertvalues:{
            totalmfgcodecount:0,
            totalunsetpricecount:0,
            totalunsetpricemny:0
        },
        groupbykindvalues:[

        ],
        groupbyareavalues:[
            {
                areaname:'10000件以上',
                areafilter:'>10000',
                areamny:0,
                grossrate:0
            },
            {
                areaname:'5000-10000',
                areafilter:'>10000',
                areamny:0,
                grossrate:0
            },
            {
                areaname:'1000-5000',
                areafilter:'>10000',
                areamny:0,
                grossrate:0
            },
            {
                areaname:'200-1000',
                areafilter:'>10000',
                areamny:0,
                grossrate:0
            },
            {
                areaname:'200件以下',
                areafilter:'>10000',
                areamny:0,
                grossrate:0
            }
        ]
    }

    /**
     * 显示信息
     * 
     */
    ShowMsg(){
        let alert = this.alterCtrl.create({
            title: '程序信息',
            subTitle:'client:'+document.documentElement.clientWidth.toString()+':'+document.documentElement.clientHeight.toString()+'; window:'+window.screen.width.toString()+':'+window.screen.height.toString(),
            buttons:['确定']
            });
        alert.present(); 
    }    


colors:any = ['#c0504d', '#9bbb59', '#8064a2','#4bacc6', '#f79646', '#59DF97'];
ManufactureDatas:any = {
    color: this.colors,

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
    },
    grid: {
        left: '3%',
        right: '0%',
        bottom: '3%',
        containLabel: true,
        y2:140
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: true},
            restore: {show: false},
            saveAsImage: {show: true},
            magicType: {
                type: ['line', 'bar'],
                seriesIndex:{
                    line:[0,1,2,3,4,5],
                    bar:[0,1,2,3]
                }
            }
        }
    },
    legend: {
        data:['产值目标','接单产值','完工产值','完工产值盈亏','产值完成'],
        left:'0%',
        padding:0,
        textStyle: {
            color: '#FFFFFF',
            fontSize:23
        }
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero:true,
                onZeroAxisIndex:1,
                lineStyle: {
                    color: '#FFFFFF'
                }
            },
            axisLabel:{
                show:false,
                interval:0,
                rotate:-30,
                fontSize:16
            },
            data: ['一部','二部','三部','四部','五部','六七部','九部','十一部','十二部','永旭','奥特','金源','通一','伟峰','伊丽特','浙佳']
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '金额',
            min: 0,
            max: 60000,
            position: 'left',
            interval:10000,
            axisLine: {
                lineStyle: {
                    color: '#FFFFFF',
                    fontSize:14
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
            interval:20,
            boundaryGap:false,
            axisLine: {
                show:true,
                lineStyle: {
                    color: '#FFFFFF',
                    fontSize:14
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
            name:'产值目标',
            type:'bar',
            yAxisIndex: 0,
            data:[],
            animation:true,
            itemStyle:{
                color:this.colors[3]
            },
            barGap:'0%'
        },
        {
            name:'接单产值',
            type:'bar',
            yAxisIndex: 0,
            data:[],
            animation:true,
            itemStyle:{
                color:this.colors[0]
            },
            barGap:'0%'
        },
        {
            name:'完工产值',
            type:'bar',
            yAxisIndex: 0,
            data:[ ],
            animation:true,
            itemStyle:{
                color:this.colors[1]
            },
            barGap:'0%'
        },
        {
            name:'完工产值盈亏',
            type:'bar',
            yAxisIndex: 0,
            data:[ ],
            animation:true,
            itemStyle:{
                color:this.colors[4],
            },
            barGap:'0%'
        },        
        {
            name:'产值完成率',
            type:'line',
            yAxisIndex: 1,
            data:[ ],
            animation:true,
            itemStyle:{
                color:this.colors[5],
            },
            barGap:'0%'
        }
        ]
    };

    timevalue:any = (new Date()).toLocaleString();

    contextdata:ContextData;

    constructor(public navCtrl: NavController,
      private echartsvr:NgxEchartsService,
      public modalCtrl: ModalController,
      private alterCtrl:AlertController,
      private loadingCtrl: LoadingController,
        ) {
         //初始化上下文
         this.contextdata = ContextData.Create();     
    }

    /**
     * 表格数据格式化方法
     */
    GetFormatValue(coldata,i):string{
        if(i==4){
            return (Number.parseFloat(coldata)).toFixed(2).toString()+' %'; 
        }else{
            return Math.round(Number.parseFloat(coldata)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    chartObjList:Array<any> = new Array<any>();

    //数据更新函数
    updateFunction = function(table_values,charts,immediateflag){
        if(ContextData.OriginalDatas[ContextData.TableName].UpdateFlag['homepage']||immediateflag){
            //数据有更新，开始刷新窗体后台数据
            let totalmny = 0;
            let totalgross = 0;
            let groupvalues:Array<any> = new Array<any>();
            let groupnamevalues:Array<any> = new Array<any>();
            let mfgcount:Array<any> = new Array<any>();
            let mfgcountwithnotransfer:Array<any> = new Array<any>();
            let totalmnywithnotransfer = 0;
            let cond1group:Array<any> = new Array<any>(
                {
                    areaname:'10000件以上',
                    areafilter:'>10000',
                    areamny:0,
                    areagross:0,
                    grossrate:0
                },
                {
                    areaname:'5000-10000',
                    areafilter:'5000<?<10000',
                    areamny:0,
                    areagross:0,
                    grossrate:0
                },
                {
                    areaname:'1000-5000',
                    areafilter:'1000<?<5000',
                    areamny:0,
                    areagross:0,
                    grossrate:0
                },
                {
                    areaname:'200-1000',
                    areafilter:'200<?<1000',
                    areamny:0,
                    areagross:0,
                    grossrate:0
                },
                {
                    areaname:'200件以下',
                    areafilter:'?<200',
                    areamny:0,
                    areagross:0,
                    grossrate:0
                }
            );
            let typegroupvalues:Array<any> = new Array<any>();
            let typenamevalues:Array<any> = new Array<any>();

            let mfgdeptids:any = ['制造一部','制造二部','制造三部','制造四部','制造五部','制造六部制造七部','制造九部',
    '制造十一部','制造十二部','山东永旭','临海市奥特休闲用品制造有限公司','临海市金源工艺品有限公司',
    '浙江通一休闲家具有限公司','浙江伟峰工艺品有限公司','浙江伊丽特工艺品有限公司','浙江浙佳工艺股份有限公司'];
            let barchartdatas:Array<any> = new Array<any>();
            charts[0].ValueOptions.series.forEach(yaxis => {
                if(yaxis.name=='产值目标')
                    barchartdatas.push({data:[53000 ,32000 ,29000 ,25000 ,15000 ,37000 ,59500 ,15000 ,10000 ,5000,10000 ,8000 ,10000 ,9000 ,13000 ,5000]});
                else
                    barchartdatas.push({data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
            });

            //重新按照ItemCode料号组装数据 2018年4月20日16:01:17 slyfalcon
            let orginalData:Array<any> = ContextData.OriginalDatas[ContextData.TableName].DataValue;
            cond1group = HomePage.dataByItemCode(orginalData, cond1group);
            //end

            orginalData.forEach(datarow => {
                let selfflag = datarow.SelfFlag; //内部外部
                let mfgdept = datarow.MFGDept; //生产部门
                let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
                let tmp_salemny = tmp_orderqty*Number.parseFloat(datarow.SalePrice)*Number.parseFloat(datarow.ExchangeRate)/10000;
                let tmp_tranfermny = 0;
                if(datarow.TransferPrice>0)
                    tmp_tranfermny = tmp_orderqty*Number.parseFloat(datarow.TransferPrice)/10000;
                let tmp_gross = tmp_salemny-((Number.parseFloat(datarow.NotConsume)+Number.parseFloat(datarow.DepreciateRate))*tmp_salemny)-tmp_tranfermny;

                //alert values
                if(selfflag&&mfgdept){
                    if(mfgcount.indexOf(datarow.MFGCode)<0)
                        mfgcount.push(datarow.MFGCode); //合规制造令统计

                    totalmny += tmp_salemny;
                    totalgross += tmp_gross;

                //barchartdata
                let deptidx = mfgdeptids.indexOf(mfgdept);
                if('制造六部制造七部'.indexOf(mfgdept)>=0){
                    deptidx = mfgdeptids.indexOf('制造六部制造七部');
                }
                if(deptidx>=0){
                    barchartdatas[1].data[deptidx] += tmp_tranfermny;
                    //barchartdatas[2].data[deptidx] += tmp_tranfermny;
                    //barchartdatas[3].data[deptidx] += tmp_gross;
                }

                //groupbytype
                let tmp_type = datarow.ItemType;
                let typeidx = typenamevalues.indexOf(tmp_type);
                if(typeidx<0){
                    //没有加入数组，新增数组元素
                    typenamevalues.push(tmp_type);
                    typegroupvalues.push({
                        kind:tmp_type,
                        ordermny:tmp_salemny,
                        grossmny:tmp_gross,
                        grossrate:0
                    });
                    //groupidx = groupnamevalues.indexOf(selfflag);
                }else{
                    typegroupvalues[typeidx].ordermny += tmp_salemny;
                    typegroupvalues[typeidx].grossmny += tmp_gross;
                }

                //groupbyvalue
                // let step = Number.parseInt(datarow.step);
                // let ceiltotal = tmp_orderqty;//Number.parseFloat(datarow.ceiltotal);
                // if(ceiltotal>10000){
                //     cond1group[0].areamny += tmp_salemny;
                //     cond1group[0].areagross += tmp_gross;
                // }else if(ceiltotal<=10000&&ceiltotal>5000){
                //     cond1group[1].areamny += tmp_salemny;
                //     cond1group[1].areagross += tmp_gross;
                // }else if(ceiltotal<=5000&&ceiltotal>1000){
                //     cond1group[2].areamny += tmp_salemny;
                //     cond1group[2].areagross += tmp_gross;
                // }else if(ceiltotal<=1000&&ceiltotal>200){
                //     cond1group[3].areamny += tmp_salemny;
                //     cond1group[3].areagross += tmp_gross;
                // }else{
                //     cond1group[4].areamny += tmp_salemny;
                //     cond1group[4].areagross += tmp_gross;
                // }

                //group values
                let groupidx = groupnamevalues.indexOf(selfflag);
                if(groupidx<0){
                    //没有加入数组，新增数组元素
                    groupnamevalues.push(selfflag);
                    groupvalues.push({
                        groupname:selfflag,
                        summny:tmp_salemny,
                        sumgross:tmp_gross,
                        grossrate:0
                    });
                    //groupidx = groupnamevalues.indexOf(selfflag);
                }else{
                    groupvalues[groupidx].summny += tmp_salemny;
                    groupvalues[groupidx].sumgross += tmp_gross;
                }   
                }else{
                    if(mfgcountwithnotransfer.indexOf(datarow.MFGCode)<0){
                        mfgcountwithnotransfer.push(datarow.MFGCode);
                        totalmnywithnotransfer += tmp_salemny;
                    }
                }

            });
            //接单分组合计统计
            table_values.groupvalues.length=0;
            groupvalues.forEach(grouprow=>{
                grouprow.grossrate = grouprow.sumgross/grouprow.summny;
                table_values.groupvalues.push(grouprow);
            });


            //groupbytype合计统计
            table_values.groupbykindvalues.length=0;
            typegroupvalues.forEach(groupvalue=>{
                if(groupvalue.ordermny>0)
                    groupvalue.grossrate = groupvalue.grossmny/groupvalue.ordermny;
                else
                    groupvalue.grossrate=0;

                table_values.groupbykindvalues.push(groupvalue);
            });
            table_values.groupbykindvalues.sort(function(a, b){
                if(Number.parseFloat(a.ordermny) > Number.parseFloat(b.ordermny)){
                    return -1;
                }
                else if( Number.parseFloat(a.ordermny) < Number.parseFloat(b.ordermny)){
                    return 1;
                }
                else{
                    return 0;
                }
            });

            //groupbyareavalues更新
            table_values.groupbyareavalues.length=0;
            cond1group.forEach(groupvalue=>{
                if(groupvalue.areamny>0)
                    groupvalue.grossrate = groupvalue.areagross/groupvalue.areamny;
                else
                    groupvalue.grossrate = 0;

                table_values.groupbyareavalues.push(groupvalue);
            });

            //接单合计值统计
            table_values.totalvalues.totalmny=totalmny;
            table_values.totalvalues.totalgross=totalgross;
            table_values.totalvalues.grossrate=totalgross/totalmny;

            //累计制造令信息
            table_values.alertvalues.totalmfgcodecount = mfgcount.length;
            table_values.alertvalues.totalunsetpricecount = mfgcountwithnotransfer.length;
            table_values.alertvalues.totalunsetpricemny = totalmnywithnotransfer;

            //刷新图表
            for(let i=0;i<barchartdatas[1].data.length;i++){
                barchartdatas[1].data[i] = Math.round(Number.parseFloat(barchartdatas[1].data[i])); //取整
            }
            charts.forEach(element => {
                for(let i=0;i<element.ValueOptions.series.length;i++){
                    element.ValueOptions.series[i].data = barchartdatas[i].data;
                }

                for(var i=0;i<element.ValueOptions.series[0].data.length;i++){
                    if(element.ValueOptions.series[0].data[i]>0)
                        element.ValueOptions.series[4].data[i] = (element.ValueOptions.series[1].data[i]/element.ValueOptions.series[0].data[i]*100).toFixed(2);
                }

                element.ChartObj.setOption(element.ValueOptions);
            });

            //数据刷新完毕，重置标志
            ContextData.OriginalDatas[ContextData.TableName].UpdateFlag['homepage'] = false;
        }
    }    

    ionViewWillEnter(){
        //图表控件对象获取
        this.manufacturebarInstance = this.echartsvr.echarts.init(this.manufacturebar.nativeElement.querySelector('div'));
        this.manufacturebarInstance.setOption(this.ManufactureDatas);
        if(this.manufacturebarInstance){
            this.chartObjList.push(
                {
                    ChartObj:this.manufacturebarInstance,
                    ValueOptions:this.ManufactureDatas
                }
            )
        }

        //首次打开执行数据刷新
        if(this.tablevalues.alertvalues.totalmfgcodecount==0){
            setTimeout(this.updateFunction,500,this.tablevalues,this.chartObjList,true);
        }
    }

    /**
     * 页面加载前执行
     */
    ionViewDidEnter(){
         
    }

    /**
     * 页面首次加载后
     */
    ionViewDidLoad(){
        //时钟刷新
        if(this.clockctrl){
            setInterval(function(clock_ctrl){
                let timevalue = (new Date()).toLocaleString();
                if(clock_ctrl){
                    clock_ctrl.setValue(timevalue);
                }
             },1000,this.clockctrl);
         }

        //数据值定时刷新 1 分钟刷新
        setInterval(this.updateFunction,60000,this.tablevalues,this.chartObjList,false);             
    }

    OnManufactureBarClick(params:any){
        console.log(params);
    }

    /**
     * 按照相同料号统计数量
     * @param  {Array<any>} dataSet [原始接口数据]
     * @return {Array<any>}         [返回后的组装数据]
     */
    private static dataByItemCode(dataSet:Array<any>, gourpData:Array<any>): Array<any> {
        
        let filteredData:any = HomePage.getItemCodeGroupData(dataSet);
        for (let key in filteredData) {
            let datarows:any = filteredData[key];
            let orderQty:number = 0; //相同料号所有订单数量
            let saleSum:number = 0;  //相同料号所有销售金额
            let goss:number = 0;  //相同料号所有毛利总和

            datarows.forEach(datarow => {
                let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
                let tmp_salemny = tmp_orderqty*Number.parseFloat(datarow.SalePrice)*Number.parseFloat(datarow.ExchangeRate)/10000;
                let tmp_tranfermny = 0;
                if(datarow.TransferPrice>0)
                    tmp_tranfermny = tmp_orderqty*Number.parseFloat(datarow.TransferPrice)/10000;
                let tmp_gross = tmp_salemny-((Number.parseFloat(datarow.NotConsume)+Number.parseFloat(datarow.DepreciateRate))*tmp_salemny)-tmp_tranfermny;

                //相同料号数据汇总
                orderQty+=tmp_orderqty;
                saleSum+=tmp_salemny;
                goss+=tmp_gross;
            });

            let averageGoss = goss/Number.parseFloat(datarows.length);    //平均毛利

            if(orderQty>10000){
                gourpData[0].areamny += saleSum;
                gourpData[0].areagross += averageGoss;
            }else if(orderQty<=10000&&orderQty>5000){
                gourpData[1].areamny += saleSum;
                gourpData[1].areagross += averageGoss;
            }else if(orderQty<=5000&&orderQty>1000){
                gourpData[2].areamny += saleSum;
                gourpData[2].areagross += averageGoss;
            }else if(orderQty<=1000&&orderQty>200){
                gourpData[3].areamny += saleSum;
                gourpData[3].areagross += averageGoss;
            }else{
                gourpData[4].areamny += saleSum;
                gourpData[4].areagross += averageGoss;
            }
        }

        return gourpData;
    }

    /**
     * 获取相同料号对象集合
     * @param  {Array<any>} dataSet [原始接口数据]
     * @return {Array<any>}
     */
    private static getItemCodeGroupData(dataSet:Array<any>): any {
        //这里按照相同料号组装一个对象数据
        let filteredData:any = {};
        dataSet.forEach(datarow => {
            let itemCode:string = datarow.ItemCode;
            if (!filteredData[itemCode]) {
                filteredData[itemCode] = [datarow];
            } else {
                filteredData[itemCode].push(datarow);
            }
        });
        return filteredData;
    }
}
