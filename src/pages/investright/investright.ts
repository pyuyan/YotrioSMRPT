import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Base } from "./../../common/base";

/**
 * Generated class for the InvestrightPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-investright',
  templateUrl: 'investright.html',
})
export class InvestrightPage extends Base {

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
