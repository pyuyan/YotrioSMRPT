import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { Params } from './../../app/params';

@IonicPage()
@Component({
  selector: 'page-popmonth',
  templateUrl: 'popmonth.html',
})
export class PopmonthPage {
  //popover标题
  _title: string;
  //popover列表数据
  _data: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public event: Events,
  ) {
    let p = this.navParams;
    this._title = p.get('title') || '';
    this._data = p.get('data') || [];
  }

  ionViewDidLoad() { }

  close(val: any) {
    //发布月份改变事件
    this.event.publish(Params.commonAterMonthChanged, val);
    this.viewCtrl.dismiss();
  }
}
