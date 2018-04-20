import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {GlobalUrl} from "../../providers/globalUrl";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {SignupPage} from "../signup/signup";
import {SimpleGlobal} from "ng2-simple-global";
import {ItemListPage} from "../item-list/item-list";
import {AppFileProvider} from "../../providers/app-file/app-file";
import {HomePage} from "../home/home";

/**
 * Generated class for the PurchasePopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-purchase-popup',
  templateUrl: 'purchase-popup.html',
})
export class PurchasePopupPage {
  private downBeepAlbum: any;
  private source: string;
  private myDownloads: Array<any> = [];
  private poems: Array<any> = [];
  private album: any;
  private globalUrl = GlobalUrl.serverUrl;
  private albumTracksUrl = GlobalUrl.beeptunesAlbumTracksUrl;
  private trackDlUrl = GlobalUrl.beeptunesTrackDlUrl;
  private albumInfoUrl = GlobalUrl.beeptunesAlbumInfo;
  private galleryId: number;
  private transactionType: string;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private alertCtrl: AlertController,
              private global: SimpleGlobal,
              private appService: AppHttpProvider,
              public toastCtrl: ToastController,
              private appFile: AppFileProvider,
              private iab: InAppBrowser) {

    this.galleryId = this.navParams.get('galleryId');
    this.source = this.navParams.get('source');
    this.album = this.navParams.get('album');

  }

  purchase() {
    if (this.source !== 'beeptunes') {
      this.transactionType = "POEM_GALLERY";
    }
    else {
      this.transactionType = "BEEPTUNES";
    }
    if (!this.global['token']) {
      let page = {id: this.galleryId, source: this.source};
      this.global['redirectPage'] = page;
      this.showAlert('خطا', 'شما وارد برنامه نشده اید!', 'خب');
      this.navCtrl.push(SignupPage);
    }
    else {
      this.storage.get('user').then(res => {

        let data = 'username=' + res.username + '&transactionType=' + this.transactionType + '&productId=' + this.galleryId;
        this.appService.readByTokenEncoded(this.globalUrl + 'pay', data).subscribe(res2 => {
          if (res2.url) {
            const browser = this.iab.create(res2.url);
            browser.on('exit').subscribe(_ => {
              this.appService.readByTokenEncoded(this.globalUrl + 'pay/isPurchased/', data).subscribe(res3 => {
                if (res3 === true) {

                  let tempArray: any[] = [];

                  if (this.source !== 'beeptunes') {
                    this.storage.get('user').then(ress3 => {
                      this.appService.readByToken(this.globalUrl + 'poemGallery/purchased/' + ress3.username).subscribe(res3 => {
                        // alert(res4.poemGalleryList);
                        this.storage.set('myDownloadslist', res3.poemGalleryList);

                      });
                    });
                  }

                  else {

                    let data = 'album=' + this.album.id;
                    this.appService.getBeeptunesAlbums(this.albumTracksUrl, data).subscribe(res4 => {
                      this.album.poemList = res4;
                      let albumInfo = 'id=' + this.album.id;
                      this.appService.getBeeptunesAlbums(this.albumInfoUrl, albumInfo).subscribe(res5 => {
                        this.album.galleryTitle = res5.name;
                        this.album.beepPrice = res5.finalPrice;
                        this.album.description = res5.description;
                        this.storage.get('myBeepDownloadslist').then(res6 => {
                          if (res6) {
                            tempArray = res6;
                            tempArray.push(this.album);
                            this.storage.set('myBeepDownloadslist', tempArray);
                          } else {
                            tempArray.push(this.album);
                            this.storage.set('myBeepDownloadslist', tempArray);
                          }
                        });
                      });
                    });
                  }

                  //ADD TO STORAGE


                  // this.showAlert('خرید موفق', 'آلبوم به دانلودهای من اضافه گردید!', 'خب');

                  this.showToast('خرید موفق. آلبوم به دانلودهای من اضافه گردید!');

// **********************************************************FULL DOWNLOAD*********************************************************

                  this.appService.readByTokenEncoded(this.globalUrl + 'pay/isActive', data).subscribe(res2 => {
                    if (res2 !== true) {
                      if (this.source !== 'beeptunes') {

                        this.appService.read(this.globalUrl + 'poem/free/parent/' + this.galleryId).subscribe(res5 => {
                          for (let item of res5) {
                            let downloadURL = '';
                            downloadURL = this.globalUrl + 'files/resources/gallery/' + this.galleryId + '/music/' + '/' + item.id + '.mp3';
                            this.appFile.downloadAudio(item, downloadURL);
                          }
                        });
                      }
                      else {

                        let data1 = 'album=' + this.galleryId;
                        this.appService.getBeeptunesAlbums(this.albumTracksUrl, data1).subscribe(res5 => {
                          for (let item of res5) {
                            let downloadBeepURL = '';
                            let data = 'track=' + item.id;
                            this.appService.getBeeptunesAlbums(this.trackDlUrl, data).subscribe(res6 => {
                              downloadBeepURL = res6.lqLink;
                              this.appFile.downloadAudio(item, downloadBeepURL);
                            });
                          }
                        });
                      }
                    }
                  });


// **********************************************************FULL DOWNLOAD*********************************************************


                  let self = this;
                  setTimeout(function () {
                    self.showToast('آلبوم در حال دانلود می باشد لطفا اتصال خود را قطع نکنید!');
                  }, 1000);

                  // this.showAlert('در حال دانلود!', 'با تشکر از خرید شما. لطفا تا دانلود شدن کلیه آهنگها اتصال خود را از اینترنت قطع نفرمایید.', 'بستن');

                  // this.navCtrl.remove(this.navCtrl.last().index);

                  this.navCtrl.push(ItemListPage, {
                    galleryId: this.galleryId,
                    source: this.source,
                  });
                  this.navCtrl.remove(this.navCtrl.last().index);

                } else {

                }
              });
            });

            // this.storage.get('user').then(_ => {
            //     this.appService.readByTokenEncoded(this.globalUrl + 'pay/isPurchased/', data).subscribe(res4 => {
            //         // alert(res2);
            //         if (res4 === true) {
            //
            //         } else {
            //             this.showAlert('خرید ناموفق!', 'فرایند خرید شما با خطا مواجه شد', 'بستن');
            //         }
            //     });
            // });

            //         }
            //         else if (res3.status === 'unsuccess') {
            //             this.showAlert('خرید ناموفق!', 'فرایند خرید شما با خطا مواجه شد', 'بستن');
            //         } else if (res3.err === 'Payment Canceled') {
            //             this.showAlert('خرید ناتمام!', 'فرایند خرید متوقف شد', 'بستن');
            //         }
            //     });
            // });

          } else if (res2.err === 'Already Purchased') {
            this.showAlert('خطا', 'این گالری قبلا خریداری شده است', 'بستن');
          } else if (res2.err === 'PaymentGateway Error') {
            this.showAlert('خطا', 'خطای اتصال به درگاه پرداخت لطفا دوباره تلاش کنید.', 'بستن');
          }
        });
      }).catch();
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

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'button'
    });
    toast.present();
  }

}
