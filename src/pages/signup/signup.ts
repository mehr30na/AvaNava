import {Component, OnInit} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {User} from "../../model/user";
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {SimpleGlobal} from "ng2-simple-global";
import {Storage} from '@ionic/storage';
import {GlobalUrl} from "../../providers/globalUrl";
import {ServerUser} from "../../model/serverUser";
import {HomePage} from "../home/home";
import {File} from '@ionic-native/file';
import {ItemListPage} from "../item-list/item-list";
import {FormBuilder, Validators} from "@angular/forms";
import {AppFileProvider} from "../../providers/app-file/app-file";
import {SocialSharing} from "@ionic-native/social-sharing";

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare let keyboard: any;

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage implements OnInit {
  smsCode: number;
  lineNumber: any;
  private newPassword: string;
  private confirmPassword: string;
  private equal: boolean = false;
  private mode: string;
  private trackDlUrl = GlobalUrl.beeptunesTrackDlUrl;


  twice: boolean = false;
  timer: number;
  interval: any;
  startTime: boolean = false;
  loader: any;
  user = new User();
  smsConfirmation: boolean;
  smsConfirm: string;
  globalUrl = GlobalUrl.serverUrl;
  private albumTracksUrl = GlobalUrl.beeptunesAlbumTracksUrl;
  private albumInfoUrl = GlobalUrl.beeptunesAlbumInfo;
  pages: Array<{ title: string, component: any }>;
  endTime: boolean = false;
  smsSended: boolean = false;
  tryCount: number = 0;
  restart: boolean = false;
  private getPassword: boolean = false;

  constructor(public navCtrl: NavController,
              private appService: AppHttpProvider,
              private platform: Platform,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private global: SimpleGlobal,
              private storage: Storage,
              private appFile: AppFileProvider,
              public file: File,
              public navParams: NavParams,
              private socialSharing: SocialSharing,
              public formBuilder: FormBuilder) {
    this.loader = loadingCtrl.create({
      content: "",
      duration: 10000,
    });
    this.loader.present();


  }

  ionViewWillLoad() {

  }


  // myForm = this.formBuilder.group({
  //     username: ['', Validators.compose([Validators.maxLength(11),Validators.minLength(11), Validators.pattern('[0-9]*'), Validators.required])],
  //     password: ['', Validators.compose([Validators.maxLength(10),Validators.minLength(5), Validators.pattern('[a-zA-Z0-9]*'), Validators.required])],
  // });


  ionViewDidEnter() {
    this.loader.dismiss();
  }

  ngOnInit() {

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page);
  }

  // getComfirmSms(user) {
  //
  //
  //
  //     this.loader.present();
  //     let serverUser = new ServerUser();
  //     serverUser.username = user.username;
  //     serverUser.phoneNumber = user.username;
  //     this.appService.create(this.globalUrl + 'userManagement/sms', serverUser).subscribe(res => {
  //         // alert(res);
  //         //         alert(res);
  //         if (res === true) {
  //             this.timer = 30;
  //             this.startTime = true;
  //             let self = this;
  //             this.interval = setInterval(function () {
  //                 self.timer -= 1;
  //                 if (self.timer === 0) {
  //                     clearInterval(self.interval);
  //                     self.twice = !self.twice;
  //                     self.endTime = !self.endTime;
  //                 }
  //             }, 1000);
  //
  //
  //
  //
  //
  //
  //             this.smsConfirmation = true;
  //             this.loader.dismiss();
  //             this.showToast('درخواست ارسال گردید لطفا منتظر کد تایید باشید!');
  //         }
  //         else {
  //             if (res === 1) {
  //                 // alert("1");
  //                 this.tryCount += 1;
  //
  //                 this.timer = 30;
  //                 let self = this;
  //                 this.interval = setInterval(function () {
  //                     // alert("2");
  //                     self.timer -= 1;
  //                     if (self.timer === 0) {
  //                         clearInterval(self.interval);
  //                         self.restart=true;
  //                     }
  //                 }, 1000);
  //
  //
  //                 if (this.tryCount == 3) {
  //                     // alert("3");
  //                     this.smsSended = true;
  //
  //                     this.appService.readCode(this.globalUrl + 'userManagement/getSmsCode/' + serverUser.username).subscribe(res => {
  //                         this.lineNumber = res[0];
  //                         this.smsCode = res[1];
  //                     });
  //                 }
  //             } else {
  //                 this.loader.dismiss();
  //                 this.showToast('مشکل در برقراری اتصال با سرور!');
  //             }
  //         }
  //     });
  //     // alert(this.sms);
  // }


  // doSignup(user) {
  //     this.loader.present();
  //
  //     let serverUser = new ServerUser();
  //     serverUser.username = user.username;
  //     serverUser.phoneNumber = user.username;
  //     this.user.username = user.username;
  //
  //     this.appService.create(this.globalUrl + 'userManagement/signUp/' + user.smsConfirm, serverUser).subscribe(res => {
  //         if (res.password !== 'Code Not Match') {
  //             this.user.password = res.password;
  //
  //             this.appService.create(this.globalUrl + 'auth', this.user).subscribe(res2 => {
  //                 this.user.token = res2.token;
  //                 this.global['token'] = res2.token;
  //                 this.storage.set('user', this.user);
  //                 this.showToast('ثبت نام شما با موفقیت انجام گردید. اکنون وارد برنامه میشوید!');
  //                 this.loader.dismiss();
  //                 // alert(this.global['redirectPage']);
  //
  //                 this.appService.readByToken(this.globalUrl + 'poemGallery/purchased/' + user.username).subscribe(res4 => {
  //                     // alert(res4.poemGalleryList);
  //                     this.storage.set('myDownloadslist', res4.poemGalleryList);
  //                     this.storage.set('myBeepDownloadslist', res4.beepTunesAlbumList);
  //
  //                 });
  //
  //
  //                 if (this.global['redirectPage'] !== null) {
  //
  //
  //
  //
  //                     // alert(this.global['redirectPage']);
  //                     let page = this.global['redirectPage'];
  //                     this.navCtrl.push(this.global['redirectPage']);
  //                 }
  //                 else {
  //                     this.navCtrl.setRoot(HomePage);
  //                 }
  //             });
  //
  //         } else {
  //             this.showAlert('ثبت نام ناموفق', 'کد وارد شده صحیح نمی باشد لطفا دوباره تلاش کنید!', 'خب');
  //         }
  //     });
  //
  // }

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

  // sended(user) {
  //     this.appService.createByConfirmSms(this.globalUrl + 'userManagement/getConfirmSms/' + user.username).subscribe(res1 => {
  //         if (res1) {
  //
  //
  //             let serverUser = new ServerUser();
  //             serverUser.username = user.username;
  //             serverUser.phoneNumber = user.username;
  //             this.user.username = user.username;
  //
  //             this.appService.create(this.globalUrl + 'userManagement/signUp/' + this.smsCode, serverUser).subscribe(res => {
  //                 if (res.password !== 'Code Not Match') {
  //                     this.user.password = res.password;
  //
  //                     this.appService.create(this.globalUrl + 'auth', this.user).subscribe(res2 => {
  //                         this.user.token = res2.token;
  //                         this.global['token'] = res2.token;
  //                         this.storage.set('user', this.user);
  //                         this.showToast('ثبت نام شما با موفقیت انجام گردید. اکنون وارد برنامه میشوید!');
  //                         this.loader.dismiss();
  //                         // alert(this.global['redirectPage']);
  //
  //                         this.appService.readByToken(this.globalUrl + 'poemGallery/purchased/' + user.username).subscribe(res4 => {
  //                             // alert(res4.poemGalleryList);
  //                             this.storage.set('myDownloadslist', res4.poemGalleryList);
  //                             this.storage.set('myBeepDownloadslist', res4.beepTunesAlbumList);
  //
  //                         });
  //
  //                         if (this.global['redirectPage'] !== null) {
  //                             // alert(this.global['redirectPage']);
  //                             let page = this.global['redirectPage'];
  //                             this.navCtrl.push(this.global['redirectPage']);
  //                         }
  //                         else {
  //                             this.navCtrl.setRoot(HomePage);
  //                         }
  //                     });
  //
  //                 }
  //             });
  //
  //         }
  //             else if(res1===1){
  //                 this.showAlert('خطا','کد ارسال شده صحیح نمی باشد ','خب ')
  //             }
  //          else {
  //             this.showAlert('ثبت نام ناموفق', 'کد وارد شده صحیح نمی باشد لطفا دوباره تلاش کنید!', 'خب');
  //         }
  //     });
  // }

  //


  // onChange(){
  //     if(this.newPassword===this.confirmPassword){
  //         this.equal=true;
  //     }
  //     else{
  //         this.equal=false;
  //     }
  // }

  onSignup() {

    // if (this.user.password === this.confirmPassword) {
    //   this.equal = true;
    // }
    //
    // else {
    //   this.equal = false;
    // }

    this.equal = true;

    if (this.equal) {
      this.user.phoneNumber = this.user.username;
      this.user.password = '12345';
      this.appService.createUser(this.globalUrl + 'userManagement/userSignUp', this.user).subscribe(res => {
          // alert(res);

          if (res === 1) {
            this.appService.create(this.globalUrl + 'auth', this.user).subscribe(res2 => {
              this.user.token = res2.token;
              this.global['token'] = res2.token;
              this.storage.set('user', this.user);

              this.loader.dismiss();

              // this.appService.readByToken(this.globalUrl + 'poemGallery/purchased/' + this.user.username).subscribe(res4 => {
              //     // alert(res4.poemGalleryList);
              //     this.storage.set('myDownloadslist', res4.poemGalleryList);
              //     this.storage.set('myBeepDownloadslist', res4.beepTunesAlbumList);
              //
              // });

              if (this.global['redirectPage'] !== null) {
                // alert(this.global['redirectPage']);
                let page = this.global['redirectPage'];
                this.navCtrl.push(page);
              }
              else {
                this.navCtrl.setRoot(HomePage);
              }

              this.showToast('ثبت نام شما با موفقیت انجام گردید. اکنون وارد برنامه میشوید!');
            });


          } else if (res === 0) {
            this.mode = 'login';
            this.showAlert('خطا', 'شما با این شماره قبلا ثبت نام کرده اید', 'خب')
          }
          else if (res === 2) {
            this.showAlert('خطا', 'خطا در ارتباط با سرور دوباره تلاش کنید', 'خب')
          }

        }
      )
    } else {
      this.showAlert("خطا", "اطلاعات به صورت صحیح وارد نشده اند", "خب")
    }
  }


  onLogin() {

    this.user.password = '12345';

    this.appService.create(this.globalUrl + 'auth', this.user).subscribe(res2 => {
        if (res2.token.length > 0) {
          this.user.token = res2.token;
          this.user.userType = res2.userType;
          this.global['token'] = res2.token;
          this.storage.set('user', this.user);
          this.showToast('ورود موفق! اکنون وارد برنامه میشوید!');
          this.loader.dismiss();
          if (!this.global['redirectPage'] !== null) {
            this.navCtrl.setRoot(HomePage);
          }
          else {
            let page = this.global['redirectPage'];
            this.navCtrl.push(page);

          }

          let tempArray: any[] = [];
          this.appService.readByToken(this.globalUrl + 'poemGallery/purchased/' + this.user.username).subscribe(res3 => {
            // alert(res4.poemGalleryList);
            this.storage.set('myDownloadslist', res3.poemGalleryList);

            // ***********************************************************************
            // for (let dlItem of  res3.poemGalleryList) {
            //     for (let item of dlItem.poemList) {
            //
            //         let downloadURL = '';
            //         downloadURL = this.globalUrl + 'files/resources/gallery/' + item.poemGallery.id + '/music/' + item.id + '.mp3';                                    // } else {
            //
            //         let path = 'Poem/' + item.poemGallery.id + '/Music/';
            //         this.file.checkFile(this.file.dataDirectory + path, item.id + '.mp3').then(_ => {
            //             // alert(item.id+' HAST');
            //         }).catch(_ => {
            //             // alert(item.id+' NIST');
            //             this.appFile.downloadAudio(item, downloadURL);
            //         });
            //     }
            // }
            // ***********************************************************************

            for (let item of res3.beepTunesAlbumList) {
              let data = 'album=' + item.id;
              this.appService.getBeeptunesAlbums(this.albumTracksUrl, data).subscribe(res4 => {
                item.poemList = res4;
                // ***********************************************************************
                // for (let bDlitem of res4) {
                //     let data = 'track=' + bDlitem.id;
                //     this.appService.getBeeptunesAlbums(this.trackDlUrl, data).subscribe(res9 => {
                //         let downloadBeepURL = '';
                //         downloadBeepURL = res9.lqLink;
                //
                //         let path = 'Music/Beeptunes/' + bDlitem.album.id + '/';
                //         this.file.checkFile(this.file.dataDirectory + path, bDlitem.id + '.mp3').then(_ => {
                //             // alert(item.id+' HAST');
                //         }).catch(_ => {
                //             // alert(item.id+' NIST');
                //             this.appFile.downloadAudio(bDlitem, downloadBeepURL);
                //         });
                //     });
                // }
                // ***********************************************************************
                let albumInfo = 'id=' + item.id;
                this.appService.getBeeptunesAlbums(this.albumInfoUrl, albumInfo).subscribe(res5 => {
                  item.galleryTitle = res5.name;
                  item.beepPrice = res5.finalPrice;
                  item.description = res5.description;
                  this.storage.get('myBeepDownloadslist').then(res6 => {
                    if (res6) {
                      tempArray = res6;
                      tempArray.push(item);
                      this.storage.set('myBeepDownloadslist', tempArray);
                    } else {
                      tempArray.push(item);
                      this.storage.set('myBeepDownloadslist', tempArray);
                    }
                  });
                });
              });
            }


            // for (let dlItemB of  res3.beepTunesAlbumList) {
            //
            //     let data1 = 'album=' + dlItemB.id;
            //     this.appService.getBeeptunesAlbums(this.albumTracksUrl, data1).subscribe(res8 => {

            //     });
            // }
            // **********************************************************************************


            // alert(JSON.stringify(res4.beepTunesAlbumList,null,7));
            // this.appService.getBeepPoemList().then(res5=> {
            //     alert(JSON.stringify(res5));
            // });
            // alert(JSON.stringify(res,null,7));
            // alert(JSON.stringify(tempArray,null,7));
            // alert(JSON.stringify(res4.beepTunesAlbumList,null,7));
            // this.appService.downloadBeepPoemList();
            // this.downloadPoemGalleryList = res4.poemGalleryList.find(x => x.id === this.galleryId);
          });
          // alert(this.global['redirectPage']);

        } else {
          this.showToast('ورود ناموفق! اکنون نمی توانید وارد برنامه شوید!');
        }
      }, err => {
        this.showAlert('خطا', 'شما با این شماره ثبت نام نکرده اید!', 'خب');
      }
    );


  }

  showPage(mode) {

    this.mode = mode;

  }

  showConfirm() {

    let confirm = this.alertCtrl.create({
      title: 'انتخاب اپراتور',
      message: 'لطفا یکی از موارد زیر را انتخاب کنید.',
      buttons: [
        {
          text: 'همراه اولی هستم',
          handler: () => {
            let confirm2 = this.alertCtrl.create({
              title: 'ارسال پیام',
              message: 'برای ثبت نام باید عدد یک را به سر شماره ۳۰۷۵۳۵ ارسال کنید. با زدن دکمه برنامه پیامک برای شما باز خواهد شد.',
              buttons: [
                {
                  text: 'ارسال پیام',
                  handler: () => {
                    this.socialSharing.shareViaSMS('1', '+98307535').then(res => {

                    }).catch(err => {

                    })
                  }
                }
              ]
            });
            confirm2.present();
          }
        },
        {
          text: 'همراه اولی نیستم',
          handler: () => {
            this.showPage('signUp');
          }
        }
      ]
    });
    confirm.present();
  }

  // forgetPass() {
  //     this.showAlert('دریافت رمز عبور جدید', 'برای دریافت رمز عبور جدید با شماره ای که ثبت نام کرده اید کد 1 را شماره       ارسال نمایید و پس از ارسال دکمه دریافت رمز را بفشارید!', 'خب')
  //     this.getPassword = true;
  // }


}
