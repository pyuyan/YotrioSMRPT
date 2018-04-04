import { Component } from '@angular/core';
import { NavController, TextInput, IonicPage, List ,ModalController, AlertController } from 'ionic-angular';
import { ViewChild,ElementRef } from '@angular/core';
import { NgxEchartsService,NgxEchartsModule } from 'ngx-echarts';
import { ContextData } from '../../app/context';
import { GrossmodelPage } from './grossmodel';
import { deepCopy } from 'ionic-angular/util/util';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    public backgroundImage = 'assets/imgs/bg2.jpg';    

    manufacturebarInstance:any

    @ViewChild('manufacturebar') manufacturebar:ElementRef;

    @ViewChild('clockcontrol') clockctrl:any

    expanded: any;
    contracted: any;
    showIcon = true;
    preload  = true;

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
        
        this.navCtrl.push(GrossmodelPage,{datatype:datatypename});
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
                areaname:'500-1000',
                areafilter:'>10000',
                areamny:0,
                grossrate:0
            },
            {
                areaname:'500件以下',
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
            subTitle:document.documentElement.clientWidth.toString()+':'+document.documentElement.clientHeight.toString(),
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
            data: ['一部','二部','三部','四部','五部','六七部','九部','十一部','十二部','永旭','奥特','金源','通一','伟峰','伊丽特','旭阳','浪人']
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
        let tablename:string = 'TMP_SMTransferData';
        if(ContextData.OriginalDatas[tablename].UpdateFlag['homepage']||immediateflag){
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
                    areaname:'500-1000',
                    areafilter:'500<?<1000',
                    areamny:0,
                    areagross:0,
                    grossrate:0
                },
                {
                    areaname:'500件以下',
                    areafilter:'?<500',
                    areamny:0,
                    areagross:0,
                    grossrate:0
                }
            );
            let typegroupvalues:Array<any> = new Array<any>();
            let typenamevalues:Array<any> = new Array<any>();

            let mfgdeptids:any = ['制造一部','制造二部','制造三部','制造四部','制造五部','制造六部制造七部','制造九部',
    '制造十一部','制造十二部','山东永旭','临海市奥特休闲用品制造有限公司','临海市金源工艺品有限公司',
    '浙江通一休闲家具有限公司','浙江伟峰工艺品有限公司','浙江伊丽特工艺品有限公司','绍兴旭阳伞业有限公司','东阳市浪人工艺品有限公司'];
            let barchartdatas:Array<any> = new Array<any>();
            charts[0].ValueOptions.series.forEach(yaxis => {
                if(yaxis.name=='产值目标')
                    barchartdatas.push({data:[53000 ,31000 ,30000 ,25000 ,15000 ,37000 ,59500 ,10000 ,15000 ,10000,10000 ,10000 ,10000 ,10000 ,10000 ,2000 ,5000]});
                else
                    barchartdatas.push({data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]});
            });

            ContextData.OriginalDatas[tablename].DataValue.forEach(datarow => {
                let selfflag = datarow.SelfFlag; //内部外部
                let mfgdept = datarow.MFGDept; //生产部门
                let tmp_orderqty = Number.parseFloat(datarow.OrderQty);
                let tmp_salemny = tmp_orderqty*Number.parseFloat(datarow.SalePrice)*Number.parseFloat(datarow.ExchangeRate)/10000;
                let tmp_tranfermny = 0;
                if(datarow.TransferPrice>0)
                    tmp_tranfermny = tmp_orderqty*Number.parseFloat(datarow.TransferPrice)/10000;
                let tmp_gross = tmp_salemny-((Number.parseFloat(datarow.NotConsume)+Number.parseFloat(datarow.DepreciateRate))*tmp_salemny)-tmp_tranfermny;

                //alert values
                if(mfgcount.indexOf(datarow.MFGCode)<0)
                    mfgcount.push(datarow.MFGCode);
                if(selfflag&&mfgdept){
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
                let step = Number.parseInt(datarow.step);
                let ceiltotal = Number.parseFloat(datarow.ceiltotal);
                if(step>=20&&ceiltotal>10000){
                    cond1group[0].areamny += tmp_salemny;
                    cond1group[0].areagross += tmp_gross;
                }else if(datarow.step>=10&&ceiltotal>5000){
                    cond1group[1].areamny += tmp_salemny;
                    cond1group[1].areagross += tmp_gross;
                }else if(datarow.step>=2&&ceiltotal>1000){
                    cond1group[2].areamny += tmp_salemny;
                    cond1group[2].areagross += tmp_gross;
                }else if(datarow.step>=1&&ceiltotal>500){
                    cond1group[3].areamny += tmp_salemny;
                    cond1group[3].areagross += tmp_gross;
                }else{
                    cond1group[4].areamny += tmp_salemny;
                    cond1group[4].areagross += tmp_gross;
                }

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
            ContextData.OriginalDatas[tablename].UpdateFlag['homepage'] = false;
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

}
