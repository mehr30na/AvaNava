import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {ItemListPage} from "../item-list/item-list";
import {GlobalUrl} from "../../providers/globalUrl";
import {Network} from "@ionic-native/network";

/**
 * Generated class for the AlbumPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-album',
  templateUrl: 'album.html',
})
export class AlbumPage {
  private infiniteStop: boolean = false;
  private galleries: any[] = [];
  private category: any;
  private loader: any;
  private globalUrl = GlobalUrl.serverUrl;
  private albums: any[] = [];
  private albumSource: string;
  private isOnline: boolean = true;
  private basePage: number = 1;
  private loaded: boolean = false;

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
    this.albumSource = this.navParams.get('albumSource');
    this.category = this.navParams.get('category');
    // alert(JSON.stringify(this.category));
  }

  ionViewWillLoad() {

  }

  ngOnInit() {

  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    if (this.albumSource !== 'beeptunes') {
      this.getGalleries();
    } else if (this.albumSource === 'beeptunes') {
      this.getBeepAlbums(this.category);
    }
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

  getGalleries() {
    this.appService.read(this.globalUrl + 'poemGallery/free').subscribe(res => {
      this.galleries = res;
      this.loader.dismiss();
    });
  }

  getBeepAlbums(category) {
    this.appService.create(this.globalUrl + 'beepTunes/getAlbumByGenres/' + this.basePage, category).subscribe(res => {
      this.albums = res;
      this.loader.dismiss();
      // alert(JSON.stringify(this.albums,null,10));
    });
  }

  openItemList(id, source) {
    // alert([id,source]);
    this.navCtrl.push(ItemListPage, {
      galleryId: id,
      source: source,
    });
  }

  doInfinite(infiniteScroll): Promise<any> {
    this.loader.present();
    this.basePage = this.basePage + 1;

    return new Promise((resolve) => {
      setTimeout(() => {

        if (this.albumSource === 'beeptunes') {
          this.appService.create(this.globalUrl + 'beepTunes/getAlbumByGenres/' + this.basePage, this.category).subscribe(res => {
            for (let i = 0; i < 15; i++) {
              if (res[i] !== undefined && !this.infiniteStop) {
                this.albums.push(res[i]);
                this.loader.dismiss();
              } else {
                this.infiniteStop = true;
                // alert(this.infiniteStop );
              }
            }
          });
        }

        resolve();
      }, 500);
    })


    // this.loader.present();
    // let rand = Math.floor(Math.random() * (116));
    // let page = rand;
    // let size = 10;
    // let data = 'page=' + page + '&size=' + size;
    // this.appService.read(this.albumUrl, data).subscribe(res => {
    //   for (let item of res.albums) {
    //     this.albums.push(item);
    //   }
    //   this.loader.dismiss();
    //   // alert(JSON.stringify(res));
    // });
  }

  goToOtherPage(c) {
    this.navCtrl.push(ItemListPage, {
      itemlist: c
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.navCtrl.push(AlbumPage, {
        albumSource: this.albumSource,
        category: this.category
      });
      this.navCtrl.remove(this.navCtrl.last().index);
    }, 1000);
  }

}
