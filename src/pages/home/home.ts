import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {GlobalUrl} from "../../providers/globalUrl";
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {ItemListPage} from "../item-list/item-list";
import {FalHafezPage} from "../fal-hafez/fal-hafez";
import {AlbumPage} from "../album/album";
import {Network} from "@ionic-native/network";
import {MusicCategoryPage} from "../music-category/music-category";
import {SimpleGlobal} from "ng2-simple-global";
import {ProfilePage} from "../profile/profile";
import {SignupPage} from "../signup/signup";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  timeOut: any;
  albums: any[] = [];
  galleries: any[] = [];
  loader: any;
  slides: any[] = [];
  globalUrl = GlobalUrl.serverUrl;
  albumUrl = GlobalUrl.beeptunesAlbumsUrl;
  isOnline: boolean = true;
  loaded: boolean = false;
  beepLoaded: boolean = false;

  constructor(public navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private network: Network,
              private global: SimpleGlobal,
              private appService: AppHttpProvider,) {

    this.loader = loadingCtrl.create({
      content: "",
      duration: 3000,
    });

    this.loader.present();


  }

  ionViewWillLoad() {

  }

  ngOnInit() {

    this.getSlides();
    this.getGalleries();
    this.getBeeptunesAlbums();


  }

  ionViewDidLoad() {
    this.global['redirectPage'] = null;
  }

  ionViewWillEnter() {

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

  getGalleries() {
    this.appService.read(this.globalUrl + 'poemGallery/free10').subscribe(res => {
      this.galleries = res;
    });
  }

  getSlides() {
    this.appService.read(this.globalUrl + 'slider').subscribe(res => {
      this.slides = res;
    });
  }

  getBeeptunesAlbums() {
    let rand = Math.floor(Math.random() * (281));
    let page = rand;
    let size = 10;
    let data = 'page=' + page + '&size=' + size;
    this.appService.getBeeptunesAlbums(this.albumUrl, data).subscribe(res => {
      this.albums = res.albums;
    });
  }

  openItemList(id, source) {
    this.navCtrl.push(ItemListPage, {
      galleryId: id,
      source: source,
    });
  }

  goToOtherPage(source) {
    if (source !== 'beeptunes') {
      this.navCtrl.push(AlbumPage, {
        albumSource: source
      });
    } else {
      this.navCtrl.push(MusicCategoryPage);
    }
  }

  falOpen() {
    this.navCtrl.push(FalHafezPage);

  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.navCtrl.setRoot(HomePage);
    }, 1000);
  }

  // reload() {
  //     alert('OK');
  //     this.navCtrl.push(ProfilePage);
  // }
}
