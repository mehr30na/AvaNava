import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the AvaNavaTeamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ava-nava-team',
  templateUrl: 'ava-nava-team.html',
})
export class AvaNavaTeamPage implements OnInit {
  title: string;
  detail: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaNavaTeamPage');
  }

  ngOnInit() {

  }


}
