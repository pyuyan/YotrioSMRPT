import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController, Events } from 'ionic-angular';
import { Params } from '../../app/params';
/**
 * Generated class for the TaxpopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-taxpopover',
  templateUrl: 'taxpopover.html',
})
export class TaxpopoverPage {

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
    //发布年份改变事件
    this.event.publish(Params.taxAterYearChanged, val);
    this.viewCtrl.dismiss();
  }


}
