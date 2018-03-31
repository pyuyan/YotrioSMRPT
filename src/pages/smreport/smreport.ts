import { Component } from '@angular/core';
import { NavController, TextInput, IonicPage } from 'ionic-angular';
import { ViewChild,ElementRef } from '@angular/core';
import { NgxEchartsService,NgxEchartsModule } from 'ngx-echarts';
import { ContextData } from '../../app/context';

@IonicPage()
@Component({
  selector: 'page-smreport',
  templateUrl: 'smreport.html',
})
export class SmreportPage {

    @ViewChild('clockcontrol') clockctrl:any

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
       text: '18,987',
       textStyle:{
           fontSize:38,
           color: '#CCF600'
       },
       textAlign: 'center',
       x:'20%',
       y:'10%'
       },
        {
       text: '4,215',
       textStyle:{
           fontSize:38,
           color: '#CCF600'
       },
       textAlign: 'center',
       x:'50%',
       y:'10%'
        },
        {
       text: '22.20%',
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
        data: ['北美区','欧洲区','其他区'],
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
            color: ['#8064a2','#4bacc6', '#f79646'],
            label: {
                formatter:" {b}\n{c}",
                position:'inner',
                textStyle: {
                    fontSize:20,
                }
            },
            itemStyle: {
                normal: {
                    opacity: 1,
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }
            },
            data:[
                {value:11582, name:'北美区'},
                {value:5433, name:'欧洲区'},
                {value:4331, name:'其他区'}
            ]
        },
        {
            name:'累计毛利金额',
            type:'pie',
            radius: ['0%', '65%'],
            center:['50%','60%'],
            color: ['#8064a2','#4bacc6', '#f79646'],
            label: {
                formatter:" {b}\n{c}",
                position:'inner',
                textStyle: {
                    fontSize:20,
                }
            },
            itemStyle: {
                normal: {
                    opacity: 1,
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }
            },
            data:[
                {value:1922, name:'北美区'},
                {value:1922, name:'欧洲区'},
                {value:1240, name:'其他区'}
            ]
        },
        {
            name:'毛利率',
            type:'pie',
            radius: ['0%', '65%'],
            center:['80%','60%'],
            color: ['#8064a2','#4bacc6', '#f79646'],
            label: {
                formatter:" {b}\n{c}",
                position:'inner',
                textStyle: {
                    fontSize:20,
                }
            },
            itemStyle: {
                normal: {
                    opacity: 1,
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }
            },
            data:[
                {value:16.60, name:'北美区'},
                {value:16.60, name:'欧洲区'},
                {value:20.02, name:'其他区'}
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
            data: ['英国组','西班牙澳新组','荷比卢组','法国组','JJA组','TEST组','德瑞奥组','MWH组','家得宝组','塔吉特组','柯尔组','劳氏组','COS组','沃尔玛组','北美高端组']
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
            max: 80,
            position: 'right',
            interval:10,
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
            data:[27621 ,15000 ,10342 ,16599 ,16995 ,10000 ,73260 ,8533 ,41197 ,21120 ,16104 ,47444 ,9711 ,18480 ,36300],
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
            data:[334 ,5076 ,0 ,2490 ,0 ,0 ,134 ,0 ,5302 ,0 ,0 ,0 ,0 ,0 ,5308],
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
            data:[30 ,881 ,0 ,431 ,0 ,0 ,24 ,0 ,1246 ,0 ,0 ,0 ,0 ,0 ,1605],
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
            data:[1.21 ,33.84 ,0.00 ,15.00 ,0.00 ,0.00 ,0.18 ,0.00 ,12.87 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00,0.00],
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
            data:[8.91 ,17.35 ,0.00 ,17.33 ,0.00 ,0.00 ,17.75 ,0.00 ,23.51 ,0.00 ,0.00 ,0.00 ,0.00 ,0.00,0.00],
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
            {
              "Customer": "SODIMAC",
              "OrderMoney": 3318.2530943999986,
              "GrossRate": 0.10065498684041553
            },
            {
              "Customer": "JJA DEPARTMENT TRADING",
              "OrderMoney": 2107.5412,
              "GrossRate": 0.17471464965904343
            },
            {
              "Customer": "Bunnings",
              "OrderMoney": 1757.8012088,
              "GrossRate": 0.3110057057095818
            },
            {
              "Customer": "CASTORAMA\\KINGFISHER",
              "OrderMoney": 334.4776,
              "GrossRate": 0.089114654852821232
            },
            {
              "Customer": "BRICORAMA",
              "OrderMoney": 304.792,
              "GrossRate": 0.12975537021969083
            },
            {
              "Customer": "Toptip (Euro-group Far East LTD)",
              "OrderMoney": 134.18784000000002,
              "GrossRate": 0.17754506168368162
            },
            {
              "Customer": "Creador",
              "OrderMoney": 45.26,
              "GrossRate": 0.25370000000000004
            },
            {
              "Customer": "Carrefour",
              "OrderMoney": 32.669436799999993,
              "GrossRate": 0.3734687011806706
            }
          ],
        orderbymnyvalues:[
            {
              "Customer": "永强(香港)有限公司",
              "OrderMoney": 5308.3908588,
              "GrossRate": 0.30230645121952604
            },
            {
              "Customer": "Creador",
              "OrderMoney": 45.26,
              "GrossRate": 0.25370000000000004
            },
            {
              "Customer": "YOTRIO CORPORATION",
              "OrderMoney": 5301.6406522,
              "GrossRate": 0.23505994486873949
            },
            {
              "Customer": "Toptip (Euro-group Far East LTD)",
              "OrderMoney": 134.18784000000002,
              "GrossRate": 0.17754506168368162
            },
            {
              "Customer": "JJA DEPARTMENT TRADING",
              "OrderMoney": 2107.5412,
              "GrossRate": 0.17471464965904343
            },
            {
              "Customer": "BRICORAMA",
              "OrderMoney": 304.792,
              "GrossRate": 0.12975537021969083
            },
            {
              "Customer": "SODIMAC",
              "OrderMoney": 3318.2530943999986,
              "GrossRate": 0.10065498684041553
            },
            {
              "Customer": "CASTORAMA\\KINGFISHER",
              "OrderMoney": 334.4776,
              "GrossRate": 0.089114654852821232
            }
          ]
    }

    timevalue:any = (new Date()).toLocaleString();

    contextdata:ContextData;

    constructor(public navCtrl: NavController,
      private echartsvr:NgxEchartsService,
        ) {
         //初始化上下文
         this.contextdata = ContextData.Create();     
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
    }

    onProfitbarClick(params:any){
        console.log(params);
    }

    onManufacturepieClick(params:any){
        console.log(params);
    }
}
