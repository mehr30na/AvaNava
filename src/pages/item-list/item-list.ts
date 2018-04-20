import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {GlobalUrl} from "../../providers/globalUrl";
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {SimpleGlobal} from "ng2-simple-global";
import {MediaPage} from "../media/media";
import {Storage} from '@ionic/storage';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {SignupPage} from "../signup/signup";
import {InfoPopupPage} from "../info-popup/info-popup";
import {File} from '@ionic-native/file';
import {Network} from "@ionic-native/network";
import {AppPlayerProvider} from "../../providers/app-player/app-player";
import {PurchasePopupPage} from "../purchase-popup/purchase-popup";
import {UserType} from "../../model/UserType";

/**
 * Generated class for the ItemListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-item-list',
  templateUrl: 'item-list.html',
})
export class ItemListPage {
  private transactionType: string;
  private purchased: boolean = false;
  private nowPlaying: any;
  private authorImage: string;
  private authorName: string;
  private biography: string;
  private description: string;
  private beepGalleryImage: any;
  private galleryTitle: any;
  private slides: any[] = [];
  private beepPrice: any;
  private galleryImage: any;
  private price: any;
  private poems: any[] = [];
  private source: string;
  private galleryId: number;
  private loader: any;
  private globalUrl = GlobalUrl.serverUrl;
  private albumTracksUrl = GlobalUrl.beeptunesAlbumTracksUrl;
  private albumInfoUrl = GlobalUrl.beeptunesAlbumInfo;
  private isOnline: boolean = true;
  private isPlaying: boolean = false;
  private album: any;
  private myDownloads: Array<any> = [];
  private progress: Array<number> = [];

  constructor(public navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private appService: AppHttpProvider,
              private alertCtrl: AlertController,
              private global: SimpleGlobal,
              private storage: Storage,
              private iab: InAppBrowser,
              private popoverCtrl: PopoverController,
              private network: Network,
              public file: File,
              private mPlayer: AppPlayerProvider,
              public navParams: NavParams) {
    this.loader = loadingCtrl.create({
      content: "",
      duration: 15000,
    });
    this.loader.present();

    this.galleryId = navParams.get('galleryId');
    this.source = navParams.get('source');
    if (this.source === '') {
      this.transactionType = "POEM_GALLERY";
    } else if (this.source === 'beeptunes') {
      this.transactionType = "BEEPTUNES";
    }
  }


  ionViewWillLoad() {

  }

  ngOnInit() {
    if (this.network.type === 'none') {
      this.isOnline = false;
    }
    if (!this.isOnline) {
      if (this.source !== 'beeptunes') {
        this.storage.get('myDownloadslist').then(res => {
          this.album = res.find(x => x.id === this.galleryId);
          this.poems = this.album.poemList;
          this.authorName = this.album.poemList[0].author.fullName;
          this.authorImage = this.album.poemList[0].author.imageURL;
          this.biography = this.album.poemList[0].author.biography;
          this.price = this.album.price;
          this.galleryTitle = this.album.title;
          this.description = this.album.description;
        });
      }
      else {
        this.storage.get('myBeepDownloadslist').then(res2 => {
          // alert(JSON.stringify(res2,null,7));
          this.album = res2.find(x => x.id === this.galleryId);
          this.poems = this.album.poemList;
          this.galleryTitle = this.album.name;
          this.description = this.album.description;
          // alert(JSON.stringify(this.album.poemList,null,7));
          //OFLINE BEEPTUNES
        });
      }
    }
    else {
      this.storage.get('user').then(res => {
        let data = 'username=' + res.username + '&transactionType=' + this.transactionType + '&productId=' + this.galleryId;
        // alert(data);
        this.appService.readByTokenEncoded(this.globalUrl + 'pay/isPurchased', data).subscribe(res2 => {
          if (res2 === true) {
            this.purchased = true;

          } else {
            this.purchased = false;
          }
        });
      }).catch();
      this.getPoems(this.galleryId, this.source);
    }
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.storage.get('nowPlaying').then(res => {
      this.nowPlaying = res;
    })
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

  ionViewWillLeave() {
    if (this.isPlaying) {
      this.pausePreview();
    }
  }

  presentPopover(myEvent, name, image, item) {
    // alert(item);
    // alert(image);

    if (item !== "undefined") {

      let popover = this.popoverCtrl.create(InfoPopupPage, {name: name, image: image, infoText: item}, {
        cssClass: 'popOver',
      });
      popover.present({
        ev: myEvent
      });
    }
    else {
      this.showAlert('سلام', 'اطلاعاتی برای نمایش وجود ندارد', 'خب')
    }
  }

  getPoems(id, source) {
    if (source !== 'beeptunes') {
      this.appService.read(this.globalUrl + 'poem/free/parent/' + id).subscribe(res => {

        this.album = res[0].poemGallery;
        this.poems = res;
        this.authorName = res[0].author.fullName;
        this.authorImage = res[0].author.imageURL;
        this.biography = res[0].author.biography;
        this.price = res[0].poemGallery.price;
        this.galleryTitle = res[0].poemGallery.title;
        this.galleryImage = res[0].poemGallery.imageURL;
        this.description = res[0].poemGallery.description;
        let self = this;
        setTimeout(function () {
          self.loader.dismiss();
        },5000);

        for (let item of this.poems) {
          let path = 'Poem/' + item.poemGallery.id + '/Music/';
          this.file.checkFile(this.file.dataDirectory + path, item.id + '.mp3').then(_ => {
          }).catch(_ => {
            let self = this;
            setInterval(function () {
              self.progress[item.id] = self.global[item.id + 'progress'];
            }, 500);
          });
        }

      });
    } else {
      let data = 'album=' + id;
      this.appService.getBeeptunesAlbums(this.albumTracksUrl, data).subscribe(res2 => {
        this.poems = res2;
        let albumInfo = 'id=' + id;
        this.appService.getBeeptunesAlbums(this.albumInfoUrl, albumInfo).subscribe(res3 => {
          this.album = res3;
          this.galleryTitle = res3.name;
          this.beepPrice = res3.finalPrice;
          this.beepGalleryImage = res3.primaryImage;
          this.description = res3.description;
          let self = this;
          setTimeout(function () {
            self.loader.dismiss();
          },5000);
        });

        for (let item of this.poems) {
          let path = 'Music/Beeptunes/' + item.album.id + '/';
          this.file.checkFile(this.file.dataDirectory + path, item.id + '.mp3').then(_ => {
          }).catch(_ => {
            let self = this;
            setInterval(function () {
              self.progress[item.id] = self.global[item.id + 'progress'];
            }, 500);
          });
        }
      })
    }

  }


  presentPurchasePopover(myEvent) {
    let popover = this.popoverCtrl.create(PurchasePopupPage, {
      galleryId: this.galleryId,
      source: this.source,
      album: this.album
    }, {cssClass: 'popOver'});
    popover.present({
      ev: myEvent
    });
  }


  goToOtherPage(id, source, financial, poem) {
    if (source !== 'beeptunes') {
      if (!this.isOnline) {
        // alert(JSON.stringify(poem,null,7));
        this.storage.get('myDownloadslist').then(res => {
          this.album = res.find(x => x.id === this.galleryId);

          if (this.album !== null) {
            this.navCtrl.push(MediaPage, {
              poemId: id,
              source: source,
              financial: financial,
              poem: poem

            });
          }
          else {
            // OFFLINE BEEPTUNES
          }
        });
      } else {
        if (!this.global['token'] && financial !== 'FREE') {
          let page = {id: this.galleryId, source: this.source};
          this.global['redirectPage'] = page;
          this.loader.dismiss();
          this.showAlert('خطا', 'شما وارد برنامه نشده اید!', 'خب');
          this.navCtrl.push(SignupPage);
          this.navCtrl.remove(this.navCtrl.last().index);
          return false;

        } else if (financial === 'FREE') {
          this.navCtrl.push(MediaPage, {
            poemId: id,
            source: source,
            financial: financial,
          });
        } else if (this.global['token'] && financial !== 'FREE') {
          this.storage.get('user').then(res => {
            switch (res.userType) {
              case UserType.MCI_CLIENT:
                let data = 'username=' + res.username;
                this.appService.readByTokenEncoded(this.globalUrl + 'pay/isActive', data).subscribe(res2 => {
                  if (res2 === true) {
                    this.navCtrl.push(MediaPage, {
                      poemId: id,
                      source: source,
                      financial: financial
                    });
                  } else {
                    data = 'username=' + res.username + '&transactionType=' + this.transactionType + '&productId=' + this.galleryId;
                    // alert(JSON.stringify(data));
                    this.appService.readByTokenEncoded(this.globalUrl + 'pay/isPurchased', data).subscribe(res2 => {
                      if (res2 === true) {
                        this.navCtrl.push(MediaPage, {
                          poemId: id,
                          source: source,
                          financial: financial
                        });
                      } else {
                        this.showAlert('خطا', 'شما این محصول را خریداری نکرده اید. برای دسترسی به محصول عدد ۱ را به سرشماره ۳۰۷۵۳۵ ارسال کنید یا با استفاده از دکمه خرید اقدام به خرید فرمایید.', 'خب')
                      }
                    });
                  }
                });
                break;
              case UserType.OTHER_CLIENT:
                data = 'username=' + res.username + '&transactionType=' + this.transactionType + '&productId=' + this.galleryId;
                // alert(JSON.stringify(data));
                this.appService.readByTokenEncoded(this.globalUrl + 'pay/isPurchased', data).subscribe(res2 => {
                  if (res2 === true) {
                    this.navCtrl.push(MediaPage, {
                      poemId: id,
                      source: source,
                      financial: financial
                    });
                  } else {
                    this.showAlert('خطا', 'شما این محصول را خریداری نکرده اید. لطفا با استفاده از دکمه دانلود اقدام به خرید فرمایید.', 'خب')
                  }
                });

            }

          }).catch();
        }
      }

    } else {
      if (!this.isOnline) {
        this.storage.get('myBeepDownloadslist').then(res => {
          this.album = res.find(x => x.id === this.galleryId);

          if (this.album !== null) {
            this.navCtrl.push(MediaPage, {

              poemId: id,
              source: source,
              financial: financial,
              poem: poem

            });
          }
        });

      } else {
        if (!this.global['token']) {
          let page = {id: this.galleryId, source: this.source};
          this.global['redirectPage'] = page;
          this.loader.dismiss();
          this.showAlert('خطا', 'شما وارد برنامه نشده اید!', 'خب');
          this.navCtrl.push(SignupPage);
          this.navCtrl.remove(this.navCtrl.last().index);

          return false;
        } else if (this.global['token']) {
          this.storage.get('user').then(res => {
            let data = 'username=' + res.username + '&transactionType=' + this.transactionType + '&productId=' + this.galleryId;
            // alert(JSON.stringify(data));
            this.appService.readByTokenEncoded(this.globalUrl + 'pay/isPurchased', data).subscribe(res2 => {
              if (res2 === true) {
                this.navCtrl.push(MediaPage, {
                  poemId: id,
                  source: source,
                  financial: financial
                });
              } else {
                this.showAlert('خطا', 'شما این محصول را خریداری نکرده اید. لطفا با استفاده از دکمه دانلود اقدام به خرید فرمایید.', 'خب')
              }
            });
          }).catch();
        }
      }

    }
  }

  playPreview(poem) {
    this.storage.get('isPlaying').then(res => {
      if (res) {
        // alert("salam");
        this.mPlayer.stopAudio();
        this.pausePreview();
      }
      this.mPlayer.playAudio(poem, poem.previewHttpPath);
      this.isPlaying = true;
      this.nowPlaying = poem;
    });
    this.storage.set('isPlaying', this.isPlaying);
  }

  pausePreview() {
    this.mPlayer.stopAudio();
    this.isPlaying = false;
    this.storage.set('isPlaying', false);
  }


  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.navCtrl.push(ItemListPage, {
        galleryId: this.galleryId,
        source: this.source,
      });
      this.navCtrl.remove(this.navCtrl.last().index);
    }, 1000);
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
