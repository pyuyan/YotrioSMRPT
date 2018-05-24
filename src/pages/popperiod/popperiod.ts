import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { Params } from './../../app/params';

/**
 * 包含年以及月份的混合选择
 *
 */

@IonicPage()
@Component({
  selector: 'page-popperiod',
  templateUrl: 'popperiod.html',
})
export class PopperiodPage {
  //popover标题
  _title: string;
  //popover列表数据
  _data: any[];
  //popover主题
  _topic: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public event: Events, ) {
    let p = this.navParams;
    this._title = p.get('title') || '';
    this._data = p.get('data') || [];
    this._topic = p.get('topic');
  }

  ionViewDidLoad() { }

  close(val: any) {
    //发布指定事件
    this.event.publish(this._topic, val);
    this.viewCtrl.dismiss();
  }
}
