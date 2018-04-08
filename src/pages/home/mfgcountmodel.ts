import { Component } from '@angular/core';

import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-mfgcountmodel',
  templateUrl: 'mfgcountmodel.html',

}
)
export class MfgcountmodelPage {

    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController
    ){

    }

}