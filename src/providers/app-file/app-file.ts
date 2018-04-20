import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController, LoadingController, NavController, ToastController} from "ionic-angular";
import {File} from '@ionic-native/file';
import {SimpleGlobal} from "ng2-simple-global";
import {FileTransferObject, FileTransfer} from "@ionic-native/file-transfer";
import {Storage} from '@ionic/storage';
import {AppHttpProvider} from "../app-http/app-http";
import {GlobalUrl} from "../globalUrl";
import {MediaPage} from "../../pages/media/media";


/*
 Generated class for the AppFileProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */


@Injectable()
export class AppFileProvider {
  loader: any;
  private loadingStatus: number;


  constructor(public http: Http,
              private transfer: FileTransfer,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private storage: Storage,
              private global: SimpleGlobal,
              private appService: AppHttpProvider,
              // public navCtrl: NavController,
              public file: File,) {
    this.loader = loadingCtrl.create({
      content: "",
      duration: 10000,
    });
    this.loader.present();
  }

  downloadAudio(item, downURL): Promise<any>  {

    const fileTransfer: FileTransferObject = this.transfer.create();

    if (!item.previewHttpPath) {
      // if (item.financialStatus !== 'FREE') {

      let path = 'Poem/' + item.poemGallery.id + '/Music/';
      let saveUrl = this.file.dataDirectory + path + item.id + '.mp3';

      this.file.checkDir(this.file.dataDirectory + 'Poem', item.poemGallery.id).then(_ => {

      }).catch(_ => {

        this.file.createDir(this.file.dataDirectory + 'Poem', item.poemGallery.id, false);
        this.file.createDir(this.file.dataDirectory + 'Poem/' + item.poemGallery.id, 'Music', false);

      });

      // let headers = new Headers();
      // headers.append('Authorization', this.global['token']);

      // this.file.checkFile(this.file.dataDirectory + 'Poem/' + item.poemGallery.id + '/Music/',item.id + '.mp3').then().catch(_ => {

      let self = this;
      fileTransfer.onProgress(function (progressEvent) {
        // alert(JSON.stringify(item,null,8))
        if (progressEvent.lengthComputable) {
          self.loadingStatus = (progressEvent.lengthComputable) ? Math.round(progressEvent.loaded / progressEvent.total * 100) : -1;
          // self.showToast(item.id+self.loadingStatus);
          self.global[item.id + 'progress'] = self.loadingStatus;
        }

      });


      return fileTransfer.download(downURL, saveUrl, true).then((entry) => {
        return true;
        // this.showToast('آهنگ با موفقیت ذخیره گردید!');
      }).catch(error => {
        return false;

        // alert(JSON.stringify(error,null,8));
        // return false;
        // this.loader.present();
        // this.showAlert('خطا', 'فرایند با خطا مواجه شد! لطفا از اتصال اینترنت اطمینان حاصل کنید.', 'خب');

      });
      // })

      // }

      // else if (item.financialStatus === 'FREE') {
      //
      //     let path = 'Poem/' + item.poemGallery.id + '/Music/';
      //     let saveUrl = this.file.dataDirectory + path + item.id + '.mp3';
      //
      //     this.file.checkDir(this.file.dataDirectory + 'Poem', item.poemGallery.id).then(_ => {
      //
      //     }).catch(_ => {
      //         this.file.createDir(this.file.dataDirectory + 'Poem', item.poemGallery.id, false);
      //         this.file.createDir(this.file.dataDirectory + 'Poem/' + item.poemGallery.id, 'Music', false);
      //
      //     });
      //
      //     // let headers = new Headers();
      //     // headers.append('Authorization', this.global['token']);
      //
      //     return fileTransfer.download(downURL, saveUrl).then((entry) => {
      //         // this.showToast('آهنگ با موفقیت ذخیره گردید!');
      //     }).catch(error => {
      //         this.showAlert('خطا', 'فرایند با خطا مواجه شد! لطفا از اتصال اینترنت اطمینان حاصل کنید.' + '' +
      //             JSON.stringify(error) + '' +
      //             '', 'خب');
      //     });
      // }
    } else {

      let path = 'Music/Beeptunes/' + item.album.id + '/';
      let saveUrl = this.file.dataDirectory + path + item.id + '.mp3';

      this.file.checkDir(this.file.dataDirectory + 'Music/', 'Beeptunes').then(res => {

      }).catch(err => {
        this.file.createDir(this.file.dataDirectory + 'Music/', 'Beeptunes', false);
        this.file.createDir(this.file.dataDirectory + 'Music/Beeptunes/', item.album.id, false);
      });

      // this.file.checkFile(this.file.dataDirectory + 'Music/Beeptunes/' + item.album.id + '/' , item.id + '.mp3').then().catch(_ => {
      let self = this;
      fileTransfer.onProgress(function (progressEvent) {
        if (progressEvent.lengthComputable) {

          self.loadingStatus = (progressEvent.lengthComputable) ? Math.round(progressEvent.loaded / progressEvent.total * 100) : -1;
          // self.showToast(self.loadingStatus);
          self.global[item.id + 'progress'] = self.loadingStatus;

        }
      });

      return fileTransfer.download(downURL, saveUrl).then((entry) => {
        return true;
        // this.showToast('آهنگ با موفقیت ذخیره گردید!');
      }, (error) => {
        // this.loader.present();
        return false;
        // return false;
        // this.showAlert('خطا', 'فرایند با خطا مواجه شد! لطفا از اتصال اینترنت اطمینان حاصل کنید.', 'خب');
      });
      // });

    }

  }


  // downloadSaveAudio(item, downURL) {
  //
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //
  //   if (!item.previewHttpPath) {
  //
  //     let path = 'Poem/' + item.poemGallery.id + '/Music/';
  //     let saveUrl = this.file.externalDataDirectory + path + item.id + '.mp3';
  //
  //     this.file.checkDir(this.file.externalDataDirectory + 'Poem', item.poemGallery.id).then(_ => {
  //
  //     }).catch(_ => {
  //
  //       this.file.createDir(this.file.externalDataDirectory + 'Poem', item.poemGallery.id, false);
  //       this.file.createDir(this.file.externalDataDirectory + 'Poem/' + item.poemGallery.id, 'Music', false);
  //
  //     });
  //
  //     let self = this;
  //     fileTransfer.onProgress(function (progressEvent) {
  //
  //       if (progressEvent.lengthComputable) {
  //         self.loadingStatus = (progressEvent.lengthComputable) ? Math.round(progressEvent.loaded / progressEvent.total * 100) : -1;
  //         self.global[item.id + 'progress'] = self.loadingStatus;
  //       }
  //
  //     });
  //
  //
  //     return fileTransfer.download(downURL, saveUrl, true).then((entry) => {
  //       this.showToast('آهنگ با موفقیت ذخیره گردید!');
  //     }).catch(error => {
  //       this.showAlert('خطا', 'فرایند با خطا مواجه شد! لطفا از اتصال اینترنت اطمینان حاصل کنید.' + '' +
  //         JSON.stringify(error) + '' +
  //         '', 'خب');
  //     });
  //
  //   } else {
  //
  //     let path = 'Music/Beeptunes/' + item.album.id + '/';
  //     let saveUrl = this.file.externalDataDirectory + path + item.id + '.mp3';
  //
  //     this.file.checkDir(this.file.externalDataDirectory + 'Music/', 'Beeptunes').then(res => {
  //
  //     }).catch(err => {
  //       this.file.createDir(this.file.externalDataDirectory + 'Music/', 'Beeptunes', false);
  //       this.file.createDir(this.file.externalDataDirectory + 'Music/Beeptunes/', item.album.id, false);
  //     });
  //
  //     let self = this;
  //     fileTransfer.onProgress(function (progressEvent) {
  //       if (progressEvent.lengthComputable) {
  //         self.loadingStatus = (progressEvent.lengthComputable) ? Math.round(progressEvent.loaded / progressEvent.total * 100) : -1;
  //         self.global[item.id + 'progress'] = self.loadingStatus;
  //       }
  //     });
  //
  //     return fileTransfer.download(downURL, saveUrl).then((entry) => {
  //       this.showToast('آهنگ با موفقیت ذخیره گردید!');
  //     }, (error) => {
  //
  //       this.showAlert('خطا', 'فرایند با خطا مواجه شد! لطفا از اتصال اینترنت اطمینان حاصل کنید.' + '' +
  //         JSON.stringify(error) + '' + '', 'خب');
  //     });
  //
  //   }
  // }


  makeAppDirectories() {

    // this.storage.set('user','');
    // this.storage.set('isPlaying','');
    // this.storage.set('nowPlaying','');
    // this.storage.set('musicWishlist','');
    // this.storage.set('myDownloadslist','');
    // this.storage.set('myBeepDownloadslist','');

    this.file.checkDir(this.file.dataDirectory, 'Poem').then(res => {
      // alert('Poem bood');
    }).catch(err => {
      this.file.createDir(this.file.dataDirectory, 'Poem', false);
      // alert('Poem sakht');
    });

    this.file.checkDir(this.file.dataDirectory, 'Music').then(res => {
      // alert('Music bood');
    }).catch(err => {
      this.file.createDir(this.file.dataDirectory, 'Music', false);
      // alert('Music sakht');
    });

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
      position: 'button',

    });
    toast.present();
  }


}
