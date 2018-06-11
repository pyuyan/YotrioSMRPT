import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NgxPaginationModule } from "ngx-pagination";

/**
 * Generated class for the SmreportmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-smreportmodal',
  templateUrl: 'smreportmodal.html',
})
export class SmreportmodalPage {

  pagesize = 10;
  p: number = 1;
  collection: any[] = [];


  public dataset: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.dataset = this.navParams.get('data') || [];
    this.collection = this.dataset;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SmreportmodalPage');
  }

  /**
   * 关闭当前的modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
