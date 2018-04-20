import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {GlobalUrl} from "../../providers/globalUrl";
import {AppPlayerProvider} from "../../providers/app-player/app-player";
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {AppFileProvider} from "../../providers/app-file/app-file";
import {File} from '@ionic-native/file';
import {SimpleGlobal} from "ng2-simple-global";
import {Network} from "@ionic-native/network";
import {FlipView} from "./flipView";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ItemListPage} from "../item-list/item-list";


/**
 * Generated class for the MediaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-media',
  templateUrl: 'media.html',

})

export class MediaPage {
  private hafez: boolean = false;
  private downloadURL: string;
  private musicWishlist: Array<any> = [];
  private financial: any;
  private commentary: string;
  private downloadBeepURL: any;
  private wordMeaning: any;
  private loader: any;
  private star: boolean = false;
  private playerImage: string;
  private flipView: FlipView = null;
  private duration: number;
  private durationShow: string;
  private timer: any;
  private hemistichList: any[] = [];
  private poem: any;
  private isPlaying: boolean;
  private position: any;
  private volume: number = 50;
  private poemId: string;
  private globalUrl = GlobalUrl.serverUrl;
  private trackInfoUrl = GlobalUrl.beeptunesTrackInfoUrl;
  private interval: any;
  private isOnline: boolean = true;
  private source: string;
  private trackDlUrl = GlobalUrl.beeptunesTrackDlUrl;
  private pause: boolean = false;
  private galleryTitle: string;
  private poems: any[] = [];


  constructor(public navParams: NavParams,
              private appService: AppHttpProvider,
              private mPlayer: AppPlayerProvider,
              private appFile: AppFileProvider,
              public file: File,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private network: Network,
              public navCtrl: NavController,
              private global: SimpleGlobal,
              private socialSharing: SocialSharing,
              private storage: Storage,) {

    this.loader = loadingCtrl.create({
      content: "",
      duration: 5000,
    });

    this.loader.present();
    this.flipView = FlipView.HAMESTICH;
    // this.isOnline=navParams.get('isOnline');
    this.poemId = navParams.get('poemId');
    this.source = navParams.get('source');

    // alert(this.source);
    this.financial = navParams.get('financial');

    this.volume = 30;
    this.position = 0;

  }


  ngOnInit() {

    if (this.network.type === 'none') {
      this.isOnline = false;
    }

    if (!this.isOnline) {
      if (this.source !== 'beeptunes') {
        this.loader.dismiss();
        // this.playerImage = this.poem.poemGallery.imageURL;

        this.poem = this.navParams.get('poem');

        this.galleryTitle = this.poem.title;
        if (this.galleryTitle.includes('حافظ')) {
          this.hafez = true;
        }
        if (this.poem.hemistichList) {
          this.hemistichList = this.poem.hemistichList;
        }
        if (this.poem.wordMeaningList) {
          this.wordMeaning = this.poem.wordMeaningList;
        }
        if (this.poem.commentary) {
          this.commentary = this.poem.commentary;
        }

        if (this.hemistichList === null && this.wordMeaning === null) {
          // alert("salam");
          this.flipView = FlipView.PICTURE;
        }
        this.duration = this.poem.duration;
        this.durationShow = this.mPlayer.millisecondsToTime(this.duration * 1000);
        this.storage.get('musicWishlist').then(res => {
          if (res) {
            this.musicWishlist = res;
            if (this.musicWishlist.find(x => x.id === this.poem.id)) {
              this.star = true;
            }
          }

        });
        this.storage.get('nowPlaying').then(res2 => {
          if (res2 && this.isPlaying && (this.poem.serial !== res2.serial )) {
            this.mPlayer.stopAudio();
            this.isPlaying = false;
          } else if (this.isPlaying) {
            this.getPositionTimer();
          }
          if (this.isPlaying && !this.isOnline) {
            this.mPlayer.stopAudio();
            this.isPlaying = false;
          }
        });
      } else {
        this.poem = this.navParams.get('poem');
        this.playerImage = this.poem.image;
        this.duration = this.poem.durationMinutes * 60 + this.poem.durationSeconds;
        this.durationShow = this.mPlayer.millisecondsToTime(this.duration * 1000);
        this.storage.get('musicWishlist').then(res11 => {
          if (res11) {
            this.musicWishlist = res11;
            if (this.musicWishlist.find(x => x.id === this.poem.id)) {
              this.star = true;
            }
          }

        });
        this.storage.get('nowPlaying').then(res6 => {
          if (res6 && this.isPlaying && (this.poem.serial !== res6.serial )) {
            this.mPlayer.stopAudio();
            this.isPlaying = false;
          } else if (this.isPlaying) {
            this.getPositionTimer();
          }
        });
      }
    }
    else {
      this.storage.get('isPlaying').then(res => {
        this.isPlaying = res;

        if (this.source !== 'beeptunes') {
          if (this.financial !== 'FREE') {
            this.appService.readByToken(this.globalUrl + 'poem/' + this.poemId).subscribe(res7 => {
              if (res7) {
                this.poem = res7;
                this.loader.dismiss();
                this.playerImage = res7.poemGallery.imageURL;
                // alert(this.playerImage);
                this.galleryTitle = res7.poemGallery.title;
                if (this.galleryTitle.includes('حافظ')) {
                  this.hafez = true;
                }
                if (res7.hemistichList) {
                  this.hemistichList = res7.hemistichList;
                }
                if (res7.wordMeaningList) {
                  this.wordMeaning = res7.wordMeaningList;
                }
                if (res7.commentary) {
                  this.commentary = res7.commentary;
                }

                // alert(this.hemistichList);
                // alert(this.wordMeaning);
                if (this.hemistichList[0].context.length < 5) {
                  // alert("salam");
                  this.flipView = FlipView.PICTURE;
                }
                this.duration = res7.duration;
                this.durationShow = this.mPlayer.millisecondsToTime(this.duration * 1000);
                this.storage.get('musicWishlist').then(res12 => {
                  if (res12) {
                    this.musicWishlist = res12;
                    if (this.musicWishlist.find(x => x.id === this.poem.id)) {
                      this.star = true;
                    }
                  }

                });
                this.storage.get('nowPlaying').then(res2 => {
                  if (res2 && this.isPlaying && (this.poem.serial !== res2.serial )) {
                    this.mPlayer.stopAudio();
                    this.isPlaying = false;
                  } else if (this.isPlaying) {
                    this.getPositionTimer();
                  }
                });
              }

            });
          }
          if (this.financial === 'FREE') {
            this.appService.read(this.globalUrl + 'poem/free/' + this.poemId).subscribe(res3 => {
              if (res3 !== null) {
                // alert(res3.hemistichList);
                this.poem = res3;
                this.loader.dismiss();
                this.galleryTitle = res3.poemGallery.title;
                if (this.galleryTitle.includes('حافظ')) {
                  this.hafez = true;
                }
                this.playerImage = this.poem.poemGallery.imageURL;
                // alert(this.playerImage);
                if (this.poem.hemistichList) {
                  this.hemistichList = this.poem.hemistichList;
                }
                if (this.poem.wordMeaningList) {
                  this.wordMeaning = this.poem.wordMeaningList;
                }
                if (this.poem.commentary) {
                  this.commentary = this.poem.commentary;
                }


                this.duration = res3.duration;
                // alert(JSON.stringify(this.hemistichList));
                // alert(this.wordMeaning);
                if (this.hemistichList[0].context.length < 5) {
                  // alert(this.playerImage);
                  this.flipView = FlipView.PICTURE;
                }
                this.durationShow = this.mPlayer.millisecondsToTime(this.duration * 1000);
                this.storage.get('musicWishlist').then(res9 => {
                  if (res9) {
                    this.musicWishlist = res9;
                    if (this.musicWishlist.find(x => x.id === this.poem.id)) {
                      this.star = true;
                    }
                  }

                });
                this.storage.get('nowPlaying').then(res4 => {
                  if (res4 && this.isPlaying && (this.poem.serial !== res4.serial )) {
                    this.mPlayer.stopAudio();
                    this.isPlaying = false;
                  } else if (this.isPlaying) {
                    this.getPositionTimer();
                  }
                });
              }
            });
          }
        }
        else {
          let data = 'id=' + this.poemId;
          this.appService.getBeeptunesAlbums(this.trackInfoUrl, data).subscribe(res5 => {
            this.poem = res5;
            this.loader.dismiss();
            this.playerImage = this.poem.image;
            this.duration = res5.durationMinutes * 60 + res5.durationSeconds;
            this.durationShow = this.mPlayer.millisecondsToTime(this.duration * 1000);
            this.storage.get('musicWishlist').then(res11 => {
              if (res11) {
                this.musicWishlist = res11;
                if (this.musicWishlist.find(x => x.id === this.poem.id)) {
                  this.star = true;
                }
              }

            });
            this.storage.get('nowPlaying').then(res6 => {
              if (res6 && this.isPlaying && (this.poem.serial !== res6.serial )) {
                this.mPlayer.stopAudio();
                this.isPlaying = false;
              } else if (this.isPlaying) {
                this.getPositionTimer();
              }
            });
          });
        }
      });
    }


    // this.storage.get('star').then(res7=>{
    //   this.star=res7;
    // })


  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    // if (this.source === 'beeptunes') {
    //
    //   let data = 'track=' + this.poemId;
    //   // alert(data);
    //   this.appService.getBeeptunesAlbums(this.trackDlUrl, data).subscribe(res2 => {
    //     alert(JSON.stringify(res2));
    //     this.downloadBeepURL = res2.lqLink;
    //   });
    //
    // }
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

    if (this.source === 'beeptunes') {

      let data = 'track=' + this.poemId;
      this.appService.getBeeptunesAlbums(this.trackDlUrl, data).subscribe(res2 => {
        this.downloadBeepURL = res2.lqLink;
      });

    } else {
      this.downloadURL = this.globalUrl + '/files/resources/gallery/' + this.poem.poemGallery.id + '/music/' + this.poem.id + '.mp3';
    }

  }

  ionViewWillLeave() {
    if (this.pause) {
      this.mPlayer.stopAudio();
    }
  }

  controlVolume(event) {
    this.mPlayer.controlVolume(event);
  }

  download(poem) {
    if (!poem.previewHttpPath) {
      let path = 'Poem/' + poem.poemGallery.id + '/Music/';
      this.file.checkFile(this.file.dataDirectory + path, poem.id + '.mp3').then(_ => {
        this.showAlert('خطا', 'این فایل قبلا دانلود شده است!', 'خب');
      }).catch(_ => {
        this.appFile.downloadAudio(poem, this.downloadURL).then(_=> {

        }).catch(_=> {
          // this.showAlert('خطای پخش','لطفا از اتصال خود به اینترنت اطمینان حاصل کنید','خب');
          // this.navCtrl.push(ItemListPage, {
          //   galleryId: poem.poemGallery.id,
          //   source: poem.source,
          // });
          // this.navCtrl.push(MediaPage, {
          //   poemId: this.poemId,
          //   source: this.source,
          //   financial: this.financial,
          //   poem: poem
          // });
          // this.navCtrl.remove(this.navCtrl.last().index);
        });
      });
    } else {
      let path = 'Music/Beeptunes/' + poem.album.id + '/';
      this.file.checkFile(this.file.dataDirectory + path, poem.id + '.mp3').then(_ => {
        this.showAlert('خطا', 'این فایل قبلا دانلود شده است!', 'خب');
      }).catch(_ => {
        this.appFile.downloadAudio(poem, this.downloadBeepURL);
      });
    }
  }

  playAudio(poem) {

    if (this.source !== 'beeptunes') {

      let path = 'Poem/' + poem.poemGallery.id + '/Music/';
      this.file.checkFile(this.file.dataDirectory + path, poem.id + '.mp3').then(_ => {

        this.mPlayer.playAudio(poem, 'offlineMode');
        this.isPlaying = true;
        this.getPositionTimer();

      }).catch(_ => {

        this.download(poem);
        this.mPlayer.playAudio(poem, this.downloadURL);
        this.isPlaying = true;
        this.getPositionTimer();


      });
    }
    else {
      let path = 'Music/Beeptunes/' + poem.album.id + '/';
      this.file.checkFile(this.file.dataDirectory + path, poem.id + '.mp3').then(_ => {

        this.mPlayer.playAudio(poem, 'offlineMode');
        this.isPlaying = true;
        this.storage.set('isPlaying', this.isPlaying);
        this.getPositionTimer();

      }).catch(_ => {


        this.mPlayer.playAudio(poem, this.downloadBeepURL);
        this.isPlaying = true;
        this.storage.set('isPlaying', this.isPlaying);
        this.getPositionTimer();
        this.download(poem);

      });
    }
  }


  pauseAudio() {
    this.pause = true;
    this.mPlayer.pauseAudio();
    this.isPlaying = false;
    this.storage.set('isPlaying', this.isPlaying);
    clearInterval(this.interval);
  }

  stopAudio() {
    this.mPlayer.stopAudio();
    this.isPlaying = false;
    this.storage.set('isPlaying', this.isPlaying);
    clearInterval(this.interval);
  }

  getPositionTimer() {
    let self = this;
    this.interval = setInterval(function () {
      self.mPlayer.getAudioCurrentPosition().then(res => {
        self.position = (res * 100 / self.duration);
        if (res >= self.duration - 1) {
          self.stopAudio();
          self.timer = null;
          self.position = null;
        }
        // alert(self.position);
        self.mPlayer.getAudioCurrentTime().then(res2 => {
          self.timer = res2;
        });
      });
    }, 1000);
  }

  controlSeconds(action) {
    switch (action) {
      case 'back':
        this.mPlayer.controlSeconds('back');
        break;
      case 'forward':
        this.mPlayer.controlSeconds('forward');
        break;
    }
  }

  controlPosition(event) {
    this.mPlayer.controlPosition(event);
  }

  flipify(item) {
    this.flipView = item;
  }

  starify(poem) {

    this.storage.get('musicWishlist').then(res => {
      if (res !== null) {
        this.musicWishlist = res;
        this.musicWishlist.push(poem);
        this.storage.set('musicWishlist', this.musicWishlist);
        this.star = !this.star;
        // this.storage.set('star',this.star);
        this.showAlert('اضافه به علاقه مندی ها', 'آهنگ با موفقیت به لیست علاقه مندی ها اضافه گردید', 'خب');
      } else {
        this.musicWishlist.push(poem);
        this.storage.set('musicWishlist', this.musicWishlist);

        this.star = !this.star;
        // this.storage.set('star',this.star);
        this.showAlert('اضافه به علاقه مندی ها', 'آهنگ با موفقیت به لیست علاقه مندی ها اضافه گردید', 'خب');
      }

    });
  }

  share() {
    if (this.source === 'beeptunes') {

      let fal = this.galleryTitle;
      // let path = 'Music/Beeptunes/' + this.poem.album.id + '/' + this.poem.id + '.mp3';
      this.socialSharing.share(fal, 'اپلیکیشن آوا و نوا', null, "برای دریافت برنامه از لینک زیر استفاده کنید"+"\n\n"+'http://avavanava.ir/apk')

    }
    if (this.source !== 'divination') {

      let fal = "";
      for (let item of this.hemistichList) {
        fal += item.context + "\n";
      }
      let final = fal + "\n\n";
      // let path = 'Poem/' + this.poem.poemGallery.id + '/Music/' + this.poem.id + '.mp3';
      this.socialSharing.share(fal, 'اپلیکیشن آوا و نوا', null, "برای دریافت برنامه از لینک زیر استفاده کنید"+"\n\n"+'http://avavanava.ir/apk')

    }
    else {

      let fal = "فال حافظ من" + "\n\n";
      let final = "";
      for (let item of this.hemistichList) {
        fal += item.context + "\n";
      }
      final = fal + "\n" + "تفسیر" + "\n\n" + this.commentary;
      this.socialSharing.share(final, 'اشتراک فال', null, "\n\n" + "برای شنیدن فال خود با صدای خانم ژاله صادقیان اپلیکیشن آوا و نوا را از سایت زیر دانلود کنید: " + "\n\n" + "http://avavanava.ir/apk")


      // let fal = "فال حافظ من" + "\n\n";
      // let final = "";
      // for (let item of this.hemistichList) {
      //     fal += item.context + "\n";
      // }
      // final = fal + "\n" + "تفسیر" + "\n\n" + this.commentary;
      // this.socialSharing.share(final, 'اشتراک فال', null, 'www.avavanava.ir')
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
