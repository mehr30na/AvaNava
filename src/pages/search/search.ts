import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {MediaPage} from "../media/media";
import {ItemListPage} from "../item-list/item-list";
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {GlobalUrl} from "../../providers/globalUrl";

declare let cordova: any;
declare let keyboard: any;

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage implements OnInit {

  private poemSearchResults: Array<any> = [];
  private gallerySearchResults: Array<any> = [];
  private globalUrl = GlobalUrl.serverUrl;
  private searchTerm: any;
  private musicSearchResults: Array<any> = [];
  private loader: any;

  constructor(public navCtrl: NavController,
              public platform: Platform,
              private loadingCtrl: LoadingController,
              private appService: AppHttpProvider,
              private alertCtrl: AlertController,
              public navParams: NavParams) {

    this.platform.ready().then(_ => {

      cordova.plugins.keyboard.disableScroll(true);

    });

  }

  ionViewWillEnter() {

  }

  ngOnInit() {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  doSearch() {
    this.loader = this.loadingCtrl.create({
      content: "",
      duration: 10000,
    });
    this.loader.present();

    this.gallerySearchResults = [];
    this.poemSearchResults = [];
    this.musicSearchResults = [];

    let term = {
      "searchTerm": this.searchTerm
    };

    this.appService.create(this.globalUrl + '/search/', term).subscribe(res => {
      if (res.poemGalleryList.length > 0 || res.poemList.length > 0 || res.beepTunesAlbumList.length > 0) {
        this.gallerySearchResults = res.poemGalleryList;
        this.poemSearchResults = res.poemList;
        this.musicSearchResults = res.beepTunesAlbumList;
        this.loader.dismiss();
      }
      else {
        this.showAlert('خطا', 'نتیجه ای یافت نشد!', 'خب');
        this.loader.dismiss();
      }

    });

  }

  goToOtherPage(item, type, source) {

    if (type === 'gallery') {
      this.navCtrl.push(ItemListPage, {
        galleryId: item,
        source: source

      });
    }
    if (type === 'poem') {
      this.navCtrl.push(MediaPage, {
        poemId: item
      });
    }
  }

  showAlert(title, subtitle, button) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
}
