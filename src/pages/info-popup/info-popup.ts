import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalUrl} from "../../providers/globalUrl";

/**
 * Generated class for the InfoPopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-popup',
  templateUrl: 'info-popup.html',
})
export class InfoPopupPage {
  protected image: string;
  private name: string;
  private infoText: string;
  private globalUrl = GlobalUrl.serverUrl;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.infoText = this.navParams.get('infoText');
    this.name = this.navParams.get('name');
    this.image = this.navParams.get('image');
    // alert(this.infoText);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPopupPage');
  }

}
