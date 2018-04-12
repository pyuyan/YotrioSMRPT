import { Component, ViewChild } from '@angular/core';

import { ModalController, Platform, NavParams, ViewController, Segment, Toolbar } from 'ionic-angular';

@Component({
  selector: 'page-mfgcountmodel',
  templateUrl: 'mfgcountmodel.html',

}
)
export class MfgcountmodelPage {

    @ViewChild('toolbar') toolbar:Toolbar;

    groupvalues:Array<any>  = ['DEMO1','DEMO2','DEMO3'];
    dataset:any = {
        DEMO1:[
            {
                display:'AAAAA1',
                showvalue:10000,
            },
            {
                display:'AAAAA1',
                showvalue:10000,
            },
            {
                display:'AAAAA1',
                showvalue:10000,
            },
            {
                display:'AAAAA1',
                showvalue:10000,
            },
            {
                display:'AAAAA1',
                showvalue:10000,
            },
        ],
        DEMO2:[
            {
                display:'BBBB1',
                showvalue:10000,
            },
            {
                display:'BBBB1',
                showvalue:10000,
            },
            {
                display:'BBBB1',
                showvalue:10000,
            },
            {
                display:'BBBB1',
                showvalue:10000,
            },
            {
                display:'BBBB1',
                showvalue:10000,
            },
        ],
        DEMO3:[
            {
                display:'CCCCC1',
                showvalue:10000,
            },
            {
                display:'CCCCC1',
                showvalue:10000,
            },
            {
                display:'CCCCC1',
                showvalue:10000,
            },
            {
                display:'CCCCC1',
                showvalue:10000,
            },
            {
                display:'CCCCC1',
                showvalue:10000,
            },
        ]
    }

    groupidx:number = 2;
    group:string = '';

    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController
    ){

    }

    /**
     * 关闭动作
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }


    /**
     * 页面加载后预处理
     */
    ionViewDidEnter(){
        this.group = this.groupvalues[0];
    }
}