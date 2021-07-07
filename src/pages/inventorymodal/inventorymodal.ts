import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-inventorymodal',
  templateUrl: 'inventorymodal.html',
})
export class InventorymodalPage {
  title: string;
  date: string;
  dataset: any[] = [];
  name: any[] = [];
  serise: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    let p = this.navParams;
    this.date = p.get('date');
    this.title = p.get('title');
    this.dataset = p.get('data') || [];
    this.name = p.get('value');
    this.serise = p.get('serise');
  }

  /**
   * 关闭当前的modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
