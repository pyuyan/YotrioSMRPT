import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-taxmodal',
  templateUrl: 'taxmodal.html',
})
export class TaxmodalPage {

  title: string;
  tax: string;
  dataset: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    let p = this.navParams;
    this.title = p.get('title');
    this.tax = p.get('tax');
    this.dataset = p.get('data') || [];
  }

  /**
   * 关闭当前的modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
