import { Component } from '@angular/core';
import { NavController, TextInput, IonicPage, ModalController } from 'ionic-angular';
import { ViewChild,ElementRef } from '@angular/core';
import { NgxEchartsService,NgxEchartsModule } from 'ngx-echarts';
import { ContextData } from '../../app/context';

import { SmreportmodalPage } from '../smreportmodal/smreportmodal';

@IonicPage()
@Component({
  selector: 'page-smreport',
  templateUrl: 'smreport.html',
})
export class SmreportPage {

    @ViewChild('clockcontrol') clockctrl:any

    @ViewChild('smpie') smpie:ElementRef;
    @ViewChild('smbar') smbar:ElementRef;

    smpieInstance:any
    smbarInstance:any

    /**
     * 表格数据格式化方法
     */
    GetFormatValue(coldata,i):string{
        if(i==3||i==4||i==-1){
            return (Number.parseFloat(coldata)).toFixed(2).toString()+' %'; 
        }else{
            return Math.round(Number.parseFloat(coldata)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }


  totalsalemnydatas:any = {
    backgroundColor:'#07213a',
    padding: [
        0,  // 上
        0, // 右
        0,  // 下
        0, // 左
    ],
    title : [{
       text: '累计接单金额',
       textAlign: 'center',
       x:'20%',
       y:'0%',
       textStyle: {
           fontSize:30,
            color: '#FFFFFF'
        }},
        {
       text: '累计毛利金额',
       textAlign: 'center',
       x:'50%',
       y:'0%',
       textStyle: {
           fontSize:30,
            color: '#FFFFFF'
        }},
        {
       text: '毛利率',
       textAlign: 'center',
       x:'80%',
       y:'0%',
       textStyle: {
           fontSize:30,
            color: '#FFFFFF'
        }},
        {
       text: 0,
       textStyle:{
           fontSize:38,
           color: '#CCF600'
       },
       textAlign: 'center',
       x:'20%',
       y:'10%'
       },
        {
       text: 0,
       textStyle:{
           fontSize:38,
           color: '#CCF600'
       },
       textAlign: 'center',
       x:'50%',
       y:'10%'
        },
        {
       text: 0,
       textStyle:{
           fontSize:38,
           color: '#CCF600'
       },
       textAlign: 'center',
       x:'80%',
       y:'10%'
       }
    ],

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c}",
    },
    legend: {
        data: [],
        left:5,
        orient: 'vertical',
        top:0,
        padding:0,
        textStyle: {
            color: '#FFFFFF',
            fontSize:20
        }
    },
    series: [
        {
            name:'累计接单金额',
            type:'pie',
            radius: ['0%', '65%'],
            center:['20%','60%'],
            color: ['#8064a2','#4bacc6', '#f79646','#c0504d', '#9bbb59','#59DF97'],
            label: {
                formatter:" {b}\n{c}",
                position:'inner',
                textStyle: {
                    fontSize:20,
                }
            },
            tooltip:{
                formatter:" {b}\n{c}",
            },
            itemStyle: {
                normal: {
                    opacity: 1,
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }
            },
            data:[

            ]
        },
        {
            name:'累计毛利金额',
            type:'pie',
            radius: ['0%', '65%'],
            center:['50%','60%'],
            color: ['#8064a2','#4bacc6', '#f79646','#c0504d', '#9bbb59','#59DF97'],
            label: {
                formatter:" {b}\n{c}",
                position:'inner',
                textStyle: {
                    fontSize:20,
                }
            },
            tooltip:{
                formatter:" {b}\n{c}",
            },
            itemStyle: {
                normal: {
                    opacity: 1,
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }
            },
            data:[

            ]
        },
        {
            name:'毛利率',
            type:'pie',
            radius: ['0%', '65%'],
            center:['80%','60%'],
            color: ['#8064a2','#4bacc6', '#f79646','#c0504d', '#9bbb59','#59DF97'],
            label: {
                formatter:" {b}\n{c} %",
                position:'inner',
                textStyle: {
                    fontSize:20,
                }
            },
            tooltip:{
                formatter:" {b}\n{c} %",
            },
            itemStyle: {
                normal: {
                    opacity: 1,
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }
            },
            data:[

            ]
        }        
    ]
  };


colors:any = ['#c0504d', '#9bbb59', '#8064a2','#4bacc6', '#f79646', '#59DF97'];
profitdatas:any = {
    color: this.colors,

    tooltip: {
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
        data:['销售目标','接单金额','毛利金额','完成率','毛利率'],
        left:'0%',
        padding:0,
        textStyle: {
            color: '#FFFFFF',
            fontSize:18
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
            interval:10000,
            axisLine: {
                show:true,
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
            splitLine:{  
                show:false  
            }  
        }
    ],
    series: [
        {
            name:'销售目标',
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
            name:'接单金额',
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
            name:'毛利金额',
            type:'bar',
            yAxisIndex: 0,
            data:[],
            animation:true,
            itemStyle:{
                color:this.colors[1]
            },
            barGap:'0%'
        },       
        {
            name:'完成率',
            type:'line',
            yAxisIndex: 1,
            data:[],
            animation:true,
            itemStyle:{
                color:this.colors[4]
            },
            barGap:'0%'
        },
        {
            name:'毛利率',
            type:'line',
            yAxisIndex: 1,
            data:[],
            animation:true,
            itemStyle:{
                color:this.colors[5]
            },
            barGap:'0%'
        }
        ]
    };

    tablevalues:any = {
        orderbyratevalues:[

          ],
        orderbymnyvalues:[

          ]
    }

    timevalue:any = (new Date()).toLocaleString();

    contextdata:ContextData;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController,
      private echartsvr:NgxEchartsService,
        ) {
         //初始化上下文
         this.contextdata = ContextData.Create();     
    }

    //数据更新函数
    updateFunction = function(table_values,charts,immediateflag){
        let tablename:string = 'TMP_SMTransferData';
        if(ContextData.OriginalDatas[tablename].UpdateFlag['smreportpage']||immediateflag){
            
            
            let customerarray:Array<any> = new Array<any>();
            let topgroupvalues:Array<any> = new Array<any>();
            let areanames:Array<any> = new Array<any>();
            let areamoneys:Array<any> = new Array<any>();
            let areagrosses:Array<any> = new Array<any>();
            let totalmoney = 0;
            let totalgross = 0;
            let keydeptdata:any = ContextData.GetKeyDepts();
            let keydeptmoneys:Array<any> = new Array<any>();
            let keydeptgrosses:Array<any> = new Array<any>();
            keydeptdata.DeptNames.forEach(dept => {
                keydeptmoneys.push(0);
                keydeptgrosses.push(0);
            });
            ContextData.OriginalDatas[tablename].DataValue.forEach(datarow => {
                let selfflag = datarow.SelfFlag; //内部外部
                let areatype = datarow.AreaType; //区域分类
                let customer = datarow.Customer; //客户
                let keydept = datarow.SaleDept; //业务指标部门
                if(Number.parseFloat(datarow.TransferPrice)>0){
                    let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
                    let tmp_salemny = tmp_orderqty*Number.parseFloat(datarow.SalePrice)*Number.parseFloat(datarow.ExchangeRate)/10000;
                    let tmp_tranfermny = 0;
                    if(datarow.TransferPrice>0)
                        tmp_tranfermny = tmp_orderqty*Number.parseFloat(datarow.TransferPrice)/10000;
                    let tmp_gross = tmp_salemny-((Number.parseFloat(datarow.NotConsume)+Number.parseFloat(datarow.DepreciateRate))*tmp_salemny)-tmp_tranfermny;

                    //接单统计饼图数据收集
                    totalmoney += tmp_salemny;
                    totalgross += tmp_gross;
                    let areaidx = areanames.indexOf(areatype);
                    if(areaidx<0){
                        //新增
                        areanames.push(areatype);
                        areamoneys.push(tmp_salemny);
                        areagrosses.push(tmp_gross);
                    }else{
                        areamoneys[areaidx] += tmp_salemny;
                        areagrosses[areaidx] += tmp_gross;
                    }                    
                    
                    if(customer!='国内市场部客户'){
                        //业务组接单数据收集
                        let deptidx = keydeptdata.DeptNames.indexOf(keydept);
                        if(deptidx>0){
                            keydeptmoneys[deptidx] += tmp_salemny;
                            keydeptgrosses[deptidx] += tmp_gross;
                        }
    
                        //TOP10表格数据收集
                        if(datarow.InnerOrg=='False'){
                            let custidx = customerarray.indexOf(customer);
                            if(custidx<0){
                                customerarray.push(customer);
                                //tablevalues.orderbyratevalues
                                topgroupvalues.push({
                                    Customer: customer,
                                    OrderMoney: tmp_salemny,
                                    GrossMoney: tmp_gross,
                                    GrossRate: 0
                                });
                            }else{
                                topgroupvalues[custidx].OrderMoney += tmp_salemny;
                                topgroupvalues[custidx].GrossMoney += tmp_gross;
                            }
                        }
                    }
                }
            });

            //业务组分析数据更新
            charts[0].ValueOptions.xAxis[0].data = keydeptdata.DeptNames;
            charts[0].ValueOptions.series[0].data = keydeptdata.DeptSalingTarget;
            charts[0].ValueOptions.series[1].data.length=0;
            charts[0].ValueOptions.series[2].data.length=0;
            charts[0].ValueOptions.series[3].data.length=0;
            charts[0].ValueOptions.series[4].data.length=0;
            for(let i=0;i<keydeptdata.DeptNames.length;i++){
                charts[0].ValueOptions.series[1].data.push(Math.round(keydeptmoneys[i]));
                charts[0].ValueOptions.series[2].data.push(Math.round(keydeptgrosses[i]));
                if(charts[0].ValueOptions.series[0].data[i]==0){
                    charts[0].ValueOptions.series[3].data.push('0.00');
                }else{
                    charts[0].ValueOptions.series[3].data.push((charts[0].ValueOptions.series[1].data[i]/charts[0].ValueOptions.series[0].data[i]*100).toFixed(2));
                }
                if(charts[0].ValueOptions.series[1].data[i]==0){
                    charts[0].ValueOptions.series[4].data.push('0.00');
                }else{
                    charts[0].ValueOptions.series[4].data.push((charts[0].ValueOptions.series[2].data[i]/charts[0].ValueOptions.series[1].data[i]*100).toFixed(2));
                }
            };
            charts[0].ChartObj.setOption(charts[0].ValueOptions);


            //接单饼图数据更新
            charts[1].ValueOptions.legend.data = areanames; //图例
            charts[1].ValueOptions.title[3].text = Math.round(totalmoney).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //总金额
            charts[1].ValueOptions.title[4].text = Math.round(totalgross).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //总毛利
            charts[1].ValueOptions.title[5].text = (totalgross/totalmoney*100).toFixed(2)+' %'; //毛利率
            charts[1].ValueOptions.series[0].data.length=0;
            charts[1].ValueOptions.series[1].data.length=0;
            charts[1].ValueOptions.series[2].data.length=0;
            for(let i=0;i<areanames.length;i++){
                charts[1].ValueOptions.series[0].data.push(
                    {
                        value:Math.round(areamoneys[i]),
                        name:areanames[i]
                    }
                );
                charts[1].ValueOptions.series[1].data.push(
                    {
                        value:Math.round(areagrosses[i]),
                        name:areanames[i]
                    }
                );
                charts[1].ValueOptions.series[2].data.push(
                    {
                        value:(Math.round(areagrosses[i])/Math.round(areamoneys[i])*100).toFixed(2),
                        name:areanames[i]
                    }
                );
            }
            charts[1].ChartObj.setOption(charts[1].ValueOptions);

            //前10毛利率数据刷新
            topgroupvalues.forEach(groupvalue=>{
                if(groupvalue.OrderMoney==0){
                    groupvalue.GrossRate = 0;
                }else{
                    groupvalue.GrossRate = groupvalue.GrossMoney/groupvalue.OrderMoney;
                }
            });
            topgroupvalues.sort(function(a,b){
                if(Number.parseFloat(a.GrossRate) > Number.parseFloat(b.GrossRate)){
                    return -1;
                }
                else if( Number.parseFloat(a.GrossRate) < Number.parseFloat(b.GrossRate)){
                    return 1;
                }
                else{
                    return 0;
                }                
            });            
            table_values.orderbyratevalues.length=0;
            for(var i=0;i<10;i++){
                table_values.orderbyratevalues.push(topgroupvalues[i]);
            }

            //前10销售金额数据刷新
            topgroupvalues.sort(function(a,b){
                if(Number.parseFloat(a.OrderMoney) > Number.parseFloat(b.OrderMoney)){
                    return -1;
                }
                else if( Number.parseFloat(a.OrderMoney) < Number.parseFloat(b.OrderMoney)){
                    return 1;
                }
                else{
                    return 0;
                }
            });            
            table_values.orderbymnyvalues.length=0;
            for(var i=0;i<10;i++){
                table_values.orderbymnyvalues.push(topgroupvalues[i]);
            }            

            ContextData.OriginalDatas[tablename].UpdateFlag['smreportpage'] = false;
        }
    }    

    chartObjList:Array<any> = new Array<any>();

    ionViewWillEnter(){
        //图表控件对象获取
        this.smbarInstance = this.echartsvr.echarts.init(this.smbar.nativeElement.querySelector('div'));
        this.smbarInstance.setOption(this.profitdatas);
        if(this.smbarInstance){
            this.chartObjList.push(
                {
                    ChartObj:this.smbarInstance,
                    ValueOptions:this.profitdatas
                }
            )
        }
        this.smpieInstance = this.echartsvr.echarts.init(this.smpie.nativeElement.querySelector('div'));
        this.smpieInstance.setOption(this.totalsalemnydatas);
        if(this.smpieInstance){
            this.chartObjList.push(
                {
                    ChartObj:this.smpieInstance,
                    ValueOptions:this.totalsalemnydatas
                }
            )
        }        

        //首次打开执行数据刷新
        if(this.tablevalues.orderbymnyvalues.length==0){
            setTimeout(this.updateFunction,500,this.tablevalues,this.chartObjList,true);
        }
    }

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
   

    onProfitbarClick(params:any){
        console.log(params);
    }

    onManufacturepieClick(params:any){
        console.log(params);
    }

    /**
     * 营销数据中心点击毛利显示详情事件
     */
    showDetail() {
        //对数据进行处理，主要是计算 产值，毛利率
        let datas: any[] = [];
        ContextData.OriginalDatas[ContextData.TableName].DataValue.forEach(datarow => {
            let tmp_orderqty = Number.parseFloat(datarow.OrderQty);//订单数量
            let tmp_salemny  = tmp_orderqty*Number.parseFloat(datarow.SalePrice)*Number.parseFloat(datarow.ExchangeRate)/10000;
            let tmp_tranfermny = 0;
            if(datarow.TransferPrice>0)
                tmp_tranfermny = tmp_orderqty*Number.parseFloat(datarow.TransferPrice)/10000;
            let tmp_gross = tmp_salemny-((Number.parseFloat(datarow.NotConsume)+Number.parseFloat(datarow.DepreciateRate))*tmp_salemny)-tmp_tranfermny;
            let tmp_data = {
                                BusinessDate:datarow.BusinessDate,
                                Customer:datarow.Customer,
                                ItemCode:datarow.ItemCode,
                                MFGCode:datarow.MFGCode,
                                ItemName:datarow.ItemName,
                                OrderQty:tmp_orderqty,
                                SaleMoney:this.GetFormatValue(tmp_salemny,1),
                                TransferMoney:this.GetFormatValue(tmp_tranfermny,1),
                                GrossRate:this.GetFormatValue(tmp_gross/tmp_salemny*100,4)
                            };
            datas.push(tmp_data);
        });

        let expanded:any = true;
        let showIcon:any = false;
        let contracted:any = !expanded;
        setTimeout(() => {
            const modal = this.modalCtrl.create(SmreportmodalPage, {
                data:datas
            });
            modal.onDidDismiss(data => {
                expanded   = false;
                contracted = !expanded;
                setTimeout(() => showIcon = true, 200);
            });
            modal.present();
        }, 100);  
    }
}
