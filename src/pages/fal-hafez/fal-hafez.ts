import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AppHttpProvider} from "../../providers/app-http/app-http";
import {GlobalUrl} from "../../providers/globalUrl";
import {MediaPage} from "../media/media";
import {Storage} from '@ionic/storage';
import {Network} from "@ionic-native/network";
import {HomePage} from "../home/home";
import {SignupPage} from "../signup/signup";
import {SimpleGlobal} from "ng2-simple-global";
import {SocialSharing} from "@ionic-native/social-sharing";


/**
 * Generated class for the FalHafezPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fal-hafez',
  templateUrl: 'fal-hafez.html',
})
export class FalHafezPage {
  private isOnline: boolean = true;
  falLoadingShow: boolean = false;
  private loader: any;
  private globalUrl = GlobalUrl.serverUrl;

  constructor(public navCtrl: NavController,
              private appService: AppHttpProvider,
              private storage: Storage,
              private network: Network,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private socialSharing: SocialSharing,
              private global: SimpleGlobal,
              public navParams: NavParams) {

    this.loader = loadingCtrl.create({
      content: "",
      duration: 10000,
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FalHafezPage');
  }

  ionViewWillLoad() {
    if (this.network.type === 'none') {
      this.isOnline = false;
    }
    if (this.isOnline === false) {
      let confirm = this.alertCtrl.create({
        title: 'خطای اتصال!',
        message: 'دستگاه شما به اینترنت متصل نیست. لطفا از اتصال خود اطمینان حاصل کنید.',
        buttons: [
          {
            text: 'خب',
            handler: () => {
              this.navCtrl.setRoot(HomePage);
            }
          }]
      })
      confirm.present();
    }
  }

  fal() {
    if (!this.global['token']) {

      this.loader.dismiss();
      this.showAlert('خطا', 'شما وارد برنامه نشده اید!', 'خب');
      this.navCtrl.push(SignupPage);
      this.navCtrl.remove(this.navCtrl.last().index);

    } else {
      this.falLoadingShow = true;
      let self = this;
      setTimeout(function () {
        self.appService.read(self.globalUrl + 'divination').subscribe(res2 => {
          // alert(JSON.stringify(res2));
          self.loader.dismiss();
          setTimeout(function () {
            self.navCtrl.push(MediaPage, {
              poemId: res2.id,
              source: 'divination'
            });
            self.navCtrl.remove(self.navCtrl.last().index)
          },2000)
        });
      }, 3000)
    }

  }

  fal2() {
    if (!this.global['token']) {

      this.loader.dismiss();
      this.showAlert('خطا', 'شما وارد برنامه نشده اید!', 'خب');
      this.navCtrl.push(SignupPage);
      this.navCtrl.remove(this.navCtrl.last().index);

    } else {
      this.falLoadingShow = true;
      let self = this;
      setTimeout(function () {
        self.appService.read(self.globalUrl + 'divination').subscribe(res2 => {
          // alert(JSON.stringify(res2));
          self.loader.dismiss();

          let fal = "فال حافظ شما" + "\n\n";
          let final = "";
          for (let item of res2.hemistichList) {
            fal += item.context + "\n";
          }
          final = fal + "\n" + "تفسیر" + "\n\n" + res2.commentary;
          self.socialSharing.share(final, 'اشتراک فال', null, "\n\n" + "برای شنیدن فال خود با صدای خانم ژاله صادقیان اپلیکیشن آوا و نوا را از لینک زیر دانلود کنید: " + "\n\n" + "https://avavanava.ir/apk")
          // self.navCtrl.push(MediaPage, {
          //     poemId: res2.id,
          //     source: 'divination'
          // });
          self.navCtrl.remove(self.navCtrl.last().index);
        });
      }, 3000)
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
