import { Component } from '@angular/core';
import { NavController, TextInput, IonicPage, List ,ModalController, AlertController } from 'ionic-angular';
import { ViewChild,ElementRef } from '@angular/core';
import { NgxEchartsService,NgxEchartsModule } from 'ngx-echarts';
import { ContextData } from '../../app/context';
import { GrossmodelPage } from './grossmodel';

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
            totalmny:18987,
            totalgross:4215,
            grossrate:0.2220
        },
        groupvalues:[
            {
                groupname:'内部',
                summny:12450,
                sumgross:2976,
                grossrate:0.2391
            },
            {
                groupname:'外部',
                summny:6195,
                sumgross:1240,
                grossrate:0.2002
            },
        ],
        alertvalues:{
            totalmfgcodecount:158,
            totalunsetpricecount:116,
            totalunsetpricemny:5488
        },
        groupbykindvalues:[
            {
                kind:'藤编家具',
                ordermny:4326,
                grossrate:0.2787
            },
            {
                kind:'非编藤家具',
                ordermny:11669,
                grossrate:0.2249
            },
            {
                kind:'秋千',
                ordermny:303,
                grossrate:0.066
            },
            {
                kind:'伞',
                ordermny:554,
                grossrate:0.1848
            },
            {
                kind:'帐篷',
                ordermny:2135,
                grossrate:0.1230
            }
        ],
        groupbyareavalues:[
            {
                areaname:'10000件以上',
                areafilter:'>10000',
                areamny:11044,
                grossrate:0.1861
            },
            {
                areaname:'5000-10000',
                areafilter:'>10000',
                areamny:1314,
                grossrate:0.2558
            },
            {
                areaname:'1000-5000',
                areafilter:'>10000',
                areamny:5595,
                grossrate:0.2819
            },
            {
                areaname:'500-1000',
                areafilter:'>10000',
                areamny:643,
                grossrate:0.2268
            },
            {
                areaname:'500件以下',
                areafilter:'>10000',
                areamny:392,
                grossrate:0.2583
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
            data: ['一部','二部','三部','四部','五部','六七部','九部','十一部','十二部','奥特','金源','通一','伟峰','伊丽特','旭阳','浪人']
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
                    color: '#FFFFFF'
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
                    fontSize:10
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
            data:[53000 ,31000 ,30000 ,25000 ,15000 ,37000 ,59500 ,10000 ,15000 ,10000 ,10000 ,10000 ,10000 ,10000 ,2000 ,5000],
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
            data:[3365 ,176 ,5308 ,112 ,364 ,750 ,2717 ,0 ,0 ,655 ,138 ,30 ,559 ,3685 ,78 ,1050],
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
            data:[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ],
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
            data:[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ],
            animation:true,
            itemStyle:{
                color:this.colors[4]
            },
            barGap:'0%'
        },        
        {
            name:'产值完成率',
            type:'line',
            yAxisIndex: 1,
            data:[6.35,0.57,17.69,0.45,2.42,2.03,4.57,0,0,6.55,1.38,0.3,5.59,18.43,3.91,21.01 ],
            animation:true,
            itemStyle:{
                color:this.colors[5]
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

    chartObjList:Array<any> = new Array<any>();

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
    }

    ionViewDidEnter(){

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
    //     setInterval(function(table_values,charts){
    //         table_values.totalvalues.totalmny=Math.ceil(Math.random()*10000);
    //         table_values.totalvalues.totalgross=Math.ceil(Math.random()*10000);
    //         table_values.totalvalues.grossrate=Math.random();
    //         table_values.groupvalues.forEach(element => {
    //             element.summny=Math.ceil(Math.random()*10000);
    //             element.sumgross=Math.ceil(Math.random()*10000);
    //             element.grossrate=Math.random();
    //         });
    //         //刷新图标
    //         charts.forEach(element => {
    //             element.ValueOptions.series.forEach(seriedata => {
    //                 if(seriedata.name!='产值完成率'&&seriedata.name!='产值目标'){
    //                     seriedata.data = [Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,
    //                         Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,
    //                         Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,
    //                         Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,
    //                         Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,Math.ceil(Math.random()*10000) ,
    //                         Math.ceil(Math.random()*10000)];
    //                 }
    //                 });
    //             element.ChartObj.setOption(element.ValueOptions);
    //         });
    //      },10000,this.tablevalues,this.chartObjList);
    }

    OnManufactureBarClick(params:any){
        console.log(params);
    }

}
