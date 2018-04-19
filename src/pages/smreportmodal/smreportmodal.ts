import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  
  public dataset:any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.dataset = this.navParams.get('data') || [];
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SmreportmodalPage');
  }

  /**
   * 关闭当前的modal
   */
  dismiss(){
  	this.viewCtrl.dismiss();
  }

}
