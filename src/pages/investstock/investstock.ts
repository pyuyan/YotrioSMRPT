import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Base } from "./../../common/base";

/**
 * Generated class for the InveststockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-investstock',
  templateUrl: 'investstock.html',
})
export class InveststockPage extends Base {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super();
  }

  ionViewDidLoad() {
    super.showCurrentTime();
  }

  ionViewWillEnter() {

  }

}
