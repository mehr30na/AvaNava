import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {ItemListPage} from "../item-list/item-list";
import {GlobalUrl} from "../../providers/globalUrl";
import {AlbumPage} from "../album/album";
import {Network} from "@ionic-native/network";

/**
 * Generated class for the MusicCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-music-category',
  templateUrl: 'music-category.html',
})
export class MusicCategoryPage implements OnInit {

  private loader: any;
  private categories: Array<any> = [];
  private globalUrl = GlobalUrl.serverUrl;
  private loaded: boolean = false;
  private isOnline: boolean = true;


  constructor(public navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private appService: AppHttpProvider,
              private network: Network,
              public navParams: NavParams) {
    this.loader = loadingCtrl.create({
      content: "",
      duration: 20000,
    });
    this.loader.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MusicCategoryPage');
  }

  ionViewDidEnter() {

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

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.appService.read(this.globalUrl + 'beepTunes/getParent').subscribe(res => {
      this.categories = res;
      this.loader.dismiss();
    });
  }

  openItemList(category, source) {
    this.navCtrl.push(AlbumPage, {
      albumSource: source,
      category: category
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.navCtrl.push(MusicCategoryPage, {});
      this.navCtrl.remove(this.navCtrl.last().index);
    }, 1000);
  }


}
