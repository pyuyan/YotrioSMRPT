import { Component, ViewChild } from '@angular/core';

import { ModalController, Platform, NavParams, ViewController, Segment, Toolbar } from 'ionic-angular';

@Component({
  selector: 'page-mfgcountmodel',
  templateUrl: 'mfgcountmodel.html',

}
)
export class MfgcountmodelPage {

    @ViewChild('toolbar') toolbar:Toolbar;

    deptidx:number = 0;

    deptname:string = '';

    /**
     * 选择部门
     * @param idx 
     */
    ChooseDeptment(idx:number){
        this.deptidx = idx;
        this.deptname = this.dataset[this.group].MFGDepts[this.deptidx];
    }

    groupvalues:Array<any>  = [];
    dataset:any = {

    }

    groupidx:number = -1;
    group:string = '';

    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController
    ){
        this.groupvalues = this.params.get('groupset');
        this.dataset = this.params.get('groupdatas');


        if(this.groupvalues.length>0)
            this.group = this.groupvalues[Number.parseInt(this.params.get('groupindex'))];
        this.deptname = this.dataset[this.group].MFGDepts[0];    
    }

    /**
     * 关闭动作
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }

    /**
     * 工具栏页卡切换
     */
    segmentChanged(event:any){
        this.deptidx = 0;
        this.deptname = this.dataset[this.group].MFGDepts[0];
    }


    /**
     * 页面加载后预处理
     */
    ionViewDidEnter(){

    }
}