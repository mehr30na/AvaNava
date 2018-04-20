import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AlertController, App, Keyboard, LoadingController, Nav, Platform,
  ToastController
} from 'ionic-angular';
import {File} from '@ionic-native/file';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from '../pages/home/home';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {SignupPage} from "../pages/signup/signup";
import {Page} from "../model/page";
import {AppHttpProvider} from "../providers/app-http/app-http";
import {GlobalUrl} from "../providers/globalUrl";
import {Storage} from '@ionic/storage';
import {User} from "../model/user";
import {SimpleGlobal} from "ng2-simple-global";
import {Network} from "@ionic-native/network";
import {Device} from "@ionic-native/device";
import {AppFileProvider} from "../providers/app-file/app-file";
import {FalHafezPage} from "../pages/fal-hafez/fal-hafez";
import {MusicWishlistPage} from "../pages/music-wishlist/music-wishlist";
import {MyDownloadsPage} from "../pages/my-downloads/my-downloads";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {ProfilePage} from "../pages/profile/profile";
import {AboutUsPage} from "../pages/about-us/about-us";
import {AvaNavaTeamPage} from "../pages/ava-nava-team/ava-nava-team";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {FileOpener} from "@ionic-native/file-opener";
import {AppPlayerProvider} from "../providers/app-player/app-player";
import {GuidePage} from "../pages/guide/guide";


declare let cordova: any;
declare let keyboard: any;
declare let FirebasePlugin: any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  lastBack: any;
  user: User;
  loader: any;
  globalUrl = GlobalUrl.serverUrl;
  private albumTracksUrl = GlobalUrl.beeptunesAlbumTracksUrl;
  private trackDlUrl = GlobalUrl.beeptunesTrackDlUrl;

  @ViewChild(Nav) nav: Nav;

  rootPage: any = SignupPage;

  pagesRegistered1: Array<Page>;
  pagesRegistered2: Array<Page>;
  pagesRegistered3: Array<Page>;
  pagesUnregistered1: Array<Page>;
  pagesUnregistered2: Array<Page>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public loadingCtrl: LoadingController,
              public file: File,
              private storage: Storage,
              private alertCtrl: AlertController,
              private appService: AppHttpProvider,
              private global: SimpleGlobal,
              private network: Network,
              private device: Device,
              private appFile: AppFileProvider,
              private fileOpener: FileOpener,
              private app: App,
              private transfer: FileTransfer,
              public toastCtrl: ToastController,
              private androidPermissions: AndroidPermissions,
              private screenOrientation: ScreenOrientation,
              private mPlayer: AppPlayerProvider,
              private iab: InAppBrowser) {

    this.loader = this.loadingCtrl.create({
      content: "",
      duration: 20000,
      dismissOnPageChange: true
    });
    this.initializeApp();
    this.pagesUnregistered1 = [
      {title: 'خانه', component: HomePage, icon: 'home'},
      {title: 'ورود به برنامه', component: SignupPage, icon: 'log-in'},

    ];
    this.pagesUnregistered2 = [
      {title: 'درباره ما', component: AboutUsPage, icon: 'information-circle'},
      {title: 'تیم آوا و نوا', component: AvaNavaTeamPage, icon: 'people'},
      {title: 'راهنمای برنامه', component: GuidePage, icon: 'information-circle'},

    ];

    this.pagesRegistered1 = [
      {title: 'خانه', component: HomePage, icon: 'home'},
      {title: 'فال حافظ', component: FalHafezPage, icon: 'book'},
      {title: 'راهنمای برنامه', component: GuidePage, icon: 'information-circle'},

    ];

    this.pagesRegistered2 = [

      {title: 'دانلود های من', component: MyDownloadsPage, icon: 'cloud-download'},
      {title: 'آهنگ های مورد علاقه', component: MusicWishlistPage, icon: 'star'},
      {title: 'پروفایل من', component: ProfilePage, icon: 'contact'},
      {title: 'خروج از حساب', component: HomePage, icon: 'exit'}
    ];

    this.pagesRegistered3 = [
      {title: 'درباره ما', component: AboutUsPage, icon: 'information-circle'},
      {title: 'تیم آوا و نوا', component: AvaNavaTeamPage, icon: 'people'},
    ];

  }

  ngOnInit() {
    this.loader.present();
    this.storage.get('user').then(res => {
      this.user = res;
      if (res.token) {
        this.appService.create(this.globalUrl + 'auth', this.user).subscribe(res2 => {
          if (res2.token.length > 0) {
            this.user.token = res2.token;
            this.user.userType = res2.userType;
            this.global['token'] = res2.token;
            this.storage.set('user', this.user);
            this.rootPage = HomePage;
          }
        });

      } else if (!this.global['token']) {
        this.rootPage = SignupPage;
      }
      else if (res.username && res.password) {
        this.appService.create(this.globalUrl + 'auth', this.user).subscribe(res => {
          this.user.token = res.token;
          this.global['token'] = res.token;
          this.storage.set('user', this.user);
          this.rootPage = HomePage;
        });
      }

    }).catch();


  }

  initializeApp() {

    this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.statusBar.styleDefault();

      this.splashScreen.hide();
      this.appFile.makeAppDirectories();
      this.storage.set('isPlaying', false);
      this.loader.dismiss();
      if (this.network.type === 'none') {
        let confirm = this.alertCtrl.create({
          title: 'خطای اتصال!',
          message: 'دستگاه شما به اینترنت متصل نیست. لطفا از اتصال خود اطمینان حاصل کنید.',
          buttons: [
            {
              text: 'ادامه',
              handler: () => {
                // this.platform.exitApp();
              }
            },
            {
              text: 'خروج از برنامه',
              handler: () => {
                this.platform.exitApp();
              }
            }
          ]
        });
        confirm.present();
      }

      if (parseInt(this.device.version) < 5) {
        let confirm = this.alertCtrl.create({
          title: 'خطا!',
          message: 'دستگاه شما از برنامه پشتیبانی نمیکند. لطفا نسخه اندروید خود را ارتقا دهید!',
          buttons: [
            {
              text: 'باشه',
              handler: () => {
                this.platform.exitApp();
              }
            },
            {
              text: 'کنسل',
              handler: () => {
                this.platform.exitApp();
              }
            }
          ]
        });
        confirm.present();
      }
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.NOTIFICATION).then(
        success => console.log('Permission granted'),
        err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.NOTIFICATION)
      );


      // (<any>window).FirebasePlugin.getToken(function (token) {
      //
      //
      // }, function (error) {
      //     alert(error);
      // });

      (<any>window).FirebasePlugin.onTokenRefresh(function (notification) {

        console.log(notification);
      }, function (error) {
        alert(error);
      });

      // ****************************NOTOFICATION*******************************

      let self = this;
      (<any>window).FirebasePlugin.onNotificationOpen(function (notification) {
        // alert("salam1");
        // alert(JSON.stringify(notification,null,10));
        // alert(notification.update);
        // const browser = self.iab.create(notification.update);
        const fileTransfer: FileTransferObject = self.transfer.create();


        fileTransfer.download(notification.update, self.file.externalDataDirectory + 'update.apk', true).then(_ => {
          // alert('download complete: ' + _.toURL());

          self.fileOpener.open(_.toURL(), 'application/vnd.android.package-archive').then(_ => {
            // alert("shod");

          }).catch(_ => {
            // alert("natonet va kone")
          });
        });

        // self.appService.read(notification.update).subscribe(_ => {
        // });

      }, function (error) {
        alert(error);
      });

      // ****************************NOTOFICATION*******************************


      // this.storage.get('myDownloadslist').then(res2 => {
      //     if (res2) {
      //         for (let dlItem of  res2.poemList) {
      //             let downloadURL = '';
      //             downloadURL = this.globalUrl + 'files/resources/gallery/' + dlItem.id + '/music/' + '/' + dlItem.id + '.mp3';
      //             let path = 'Poem/' + dlItem.poemGallery.id + '/Music/';
      //             this.file.checkFile(this.file.dataDirectory + path, dlItem.id + '.mp3').then(_ => {
      //                 alert(dlItem.id+' HAST');
      //             }).catch(_ => {
      //                 this.appFile.downloadAudio(dlItem, downloadURL);
      //             });
      //         }
      //     }
      // }).catch();
      //
      // this.storage.get('myBeepDownloadslist').then(res3 => {
      //     if(res3){
      //         for (let dlItemB of  res3) {
      //
      //             let data1 = 'album=' + dlItemB.id;
      //             this.appService.getBeeptunesAlbums(this.albumTracksUrl, data1).subscribe(res8 => {
      //                 for (let item of res8) {
      //                     let data = 'track=' + item.id;
      //                     this.appService.getBeeptunesAlbums(this.trackDlUrl, data).subscribe(res9 => {
      //                         let downloadBeepURL = '';
      //                         downloadBeepURL = res9.lqLink;
      //
      //                         let path = 'Music/Beeptunes/' + item.album.id + '/';
      //                         this.file.checkFile(this.file.dataDirectory + path, item.id + '.mp3').then(_ => {
      //                             alert(item.id+' HAST');
      //                         }).catch(_ => {
      //                             this.appFile.downloadAudio(item, downloadBeepURL);
      //                         });
      //
      //                     });
      //                 }
      //             });
      //         }
      //     }
      // }).catch();


      // alert(JSON.stringify(this.global, null, 8));



    });

    this.platform.registerBackButtonAction(() => {
      const overlayView = this.app._appRoot._overlayPortal.getActive();
      const nav = this.app.getActiveNav();

      if (overlayView && overlayView.dismiss) {
        overlayView.dismiss();
        return;
      }
      if (nav.canGoBack()) {
        nav.pop();
        return;
      }
      if (!nav.canGoBack()) {
        this.showToast('برای خروج یک بار دیگر دکمه را بزنید.');
      }
      if (Date.now() - this.lastBack < 1500) {
        this.platform.exitApp();
      }
      this.lastBack = Date.now();
    });

  }


  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'button'
    });
    toast.present();
  }


  openPage(page) {

    if (page.title === 'خروج از حساب') {
      let confirm = this.alertCtrl.create({
        title: 'خروج از حساب کاربری!',
        message: 'آیا از خروج از حساب کاربری اطمینان دارید؟',
        buttons: [
          {
            text: 'بله',
            handler: () => {
              this.storage.clear();
              this.global['token'] = '';
              this.nav.setRoot(SignupPage);
            }
          },
          {
            text: 'خیر',
            handler: () => {

            }
          }
        ]
      });
      confirm.present();
    } else if (page.title === 'فال حافظ') {
      this.nav.push(page.component);
    }
    else if (page.title === 'دانلود های من') {
      this.nav.push(MyDownloadsPage);
    }
    else if (page.title === 'آهنگ های مورد علاقه') {
      this.nav.push(page.component);
    }
    else if (page.title === 'پروفایل من') {
      this.nav.push(page.component);
    }
    else if (page.title === 'درباره ما') {
      this.nav.push(page.component);
    }
    else if (page.title === 'تیم آوا و نوا') {
      this.nav.push(page.component);
    }
    else if (page.title === 'ورود به برنامه') {
      this.nav.push(page.component);
    }
    else if (page.title === 'راهنمای برنامه') {
      this.nav.push(page.component);
    }

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    else {
      this.nav.setRoot(page.component);
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
