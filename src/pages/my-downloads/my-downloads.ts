import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ItemListPage} from "../item-list/item-list";
import {Network} from "@ionic-native/network";
import {GlobalUrl} from "../../providers/globalUrl";
import {SimpleGlobal} from "ng2-simple-global";

/**
 * Generated class for the MyDownloadsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-downloads',
  templateUrl: 'my-downloads.html',
})
export class MyDownloadsPage implements OnInit {
  private loader: any;
  private myDownloadslist: Array<any> = [];
  private myBeepDownloadslist: Array<any> = [];
  private isOnline: boolean = true;
  globalUrl = GlobalUrl.serverUrl;

  constructor(public navCtrl: NavController,
              private storage: Storage,
              private loadingCtrl: LoadingController,
              private network: Network,
              private global: SimpleGlobal,
              public navParams: NavParams) {
    this.loader = loadingCtrl.create({
      content: "",
      duration: 10000,
    });
    this.loader.present();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MyDownloadsPage');
    this.storage.get('myDownloadslist').then(res => {
      this.myDownloadslist = res;
      // alert(JSON.stringify(res));
    });
    this.storage.get('myBeepDownloadslist').then(res2 => {
      this.myBeepDownloadslist = res2;
      // alert(JSON.stringify(res2));
    });
  }

  ionViewWillEnter() {
    // this.storage.get('myDownloadslist').then(res => {
    //     this.myDownloadslist = res;
    //     alert(JSON.stringify(res));
    // });
    // this.storage.get('myBeepDownloadslist').then(res2 => {
    //     this.myBeepDownloadslist = res2;
    //     alert(JSON.stringify(res2));
    // });
  }

  ngOnInit() {
    // this.storage.get('myDownloadslist').then(res => {
    //     this.myDownloadslist = res;
    //     // alert(JSON.stringify(res));
    // });
    // this.storage.get('myBeepDownloadslist').then(res2 => {
    //     this.myBeepDownloadslist = res2;
    //     // alert(JSON.stringify(res2));
    // });

  }

  ionViewDidEnter() {
    this.loader.dismiss();
    if (this.network.type === 'none') {
      this.isOnline = false;
    }
    this.network.onDisconnect().subscribe(_ => {
      this.isOnline = false;
    });
    this.network.onConnect().subscribe(_ => {
      this.isOnline = true;
    });
  }

  openItemList(id, source) {
    this.navCtrl.push(ItemListPage, {
      galleryId: id,
      source: source,
    });
  }


  doRefresh(refresher) {

    setTimeout(() => {
      refresher.complete();
      this.navCtrl.push(MyDownloadsPage, {});
      this.navCtrl.remove(this.navCtrl.last().index);
    }, 1000);
  }

}
