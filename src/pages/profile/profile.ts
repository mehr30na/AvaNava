import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ProfileEditPage} from "./profile-edit/profile-edit";
// import {Camera, CameraOptions} from '@ionic-native/camera';
import {Storage} from '@ionic/storage';
// import {AndroidPermissions} from "@ionic-native/android-permissions";
import {User} from "../../model/user";
import {ItemListPage} from "../item-list/item-list";
import {MediaPage} from "../media/media";
import {GlobalUrl} from "../../providers/globalUrl";

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
  // providers: [Camera]
})
export class ProfilePage implements OnInit {
  private showInfo: boolean = false;
  private lastName: any;
  private firstName: any;
  private mode: string;
  private tempUser: User = new User();
  private user: User = new User();
  private globalUrl = GlobalUrl.serverUrl;
  // private cameraData: string;
  private wishList: Array<any> = [];
  private myDownloadslist: Array<any> = [];
  private myBeepDownloadslist: Array<any> = [];
  private day: number;
  private month: number;
  private year: number;

  constructor(private popoverCtrl: PopoverController,
              public navCtrl: NavController,
              public navParams: NavParams,
              // private camera: Camera,
              // private androidPermissions: AndroidPermissions,
              private storage: Storage) {
  }


  presentProfilePopover(event) {
    let popover = this.popoverCtrl.create(ProfileEditPage, {}, {cssClass: 'popOver'});
    popover.present({
      ev: event
    });
  }

  ngOnInit() {
    this.storage.get('user').then(res => {
      // this.cameraData = res.image;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.day = res.day;
      this.month = res.month;
      this.year = res.year;
      this.tempUser = res;
    });
    this.storage.get('musicWishlist').then(res => {
      this.wishList = res;
    });


    this.storage.get('myDownloadslist').then(res => {
      this.myDownloadslist = res;
      // alert(JSON.stringify(res));
    });
    this.storage.get('myBeepDownloadslist').then(res2 => {
      this.myBeepDownloadslist = res2;
      // alert(JSON.stringify(res2));
    });
    this.mode = 'info';

  }

  ionViewWillEnter() {
    this.storage.get('myDownloadslist').then(res => {
      this.myDownloadslist = res;
      // alert(JSON.stringify(res));
    });
    this.storage.get('myBeepDownloadslist').then(res2 => {
      this.myBeepDownloadslist = res2;
      // alert(JSON.stringify(res2));
    });
  }


  openItemList(id, source) {
    this.navCtrl.push(ItemListPage, {
      galleryId: id,
      source: source,
    });
  }

  // openCamera() {
  //
  //     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
  //         success => console.log('Permission granted'),
  //         err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.CAMERA)
  //     );
  //
  //     const option: CameraOptions = {
  //         quality: 100,
  //         destinationType: this.camera.DestinationType.DATA_URL,
  //         encodingType: this.camera.EncodingType.JPEG,
  //         mediaType: this.camera.MediaType.PICTURE,
  //         correctOrientation: true
  //         // sourceType: this.camera.PictureSourceType.CAMERA,
  //         // destinationType: this.camera.DestinationType.DATA_URL
  //     };
  //
  //
  //     this.camera.getPicture(option).then((imageData) => {
  //         // this.cameraUrl = imageData;
  //         this.cameraData = 'data:image/jpeg;base64,' + imageData;
  //         this.storage.get('user').then(res => {
  //             this.tempUser = res;
  //             this.tempUser.image = this.cameraData;
  //             this.storage.set('user', this.tempUser);
  //         })
  //     });
  //
  // }

  showPage(mode) {
    this.mode = mode;
    if (mode === 'info') {
      this.showInfo = true;
    }
    else {
      this.showInfo = false;
    }


    this.storage.get('user').then(res => {
      // this.cameraData = res.image;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.day = res.day;
      this.month = res.month;
      this.year = res.year;
      this.tempUser = res;
    });
    this.storage.get('musicWishlist').then(res => {
      this.wishList = res;
    });


    this.storage.get('myDownloadslist').then(res => {
      this.myDownloadslist = res;
      // alert(JSON.stringify(res));
    });
    this.storage.get('myBeepDownloadslist').then(res2 => {
      this.myBeepDownloadslist = res2;
      // alert(JSON.stringify(res2));
    });
  }

  removeWishList(item) {
    this.wishList.splice(this.wishList.indexOf(item), 1);
    this.storage.set('musicWishlist', this.wishList);
  }


  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.navCtrl.push(ProfilePage, {});
      this.navCtrl.remove(this.navCtrl.last().index);
    }, 1000);
  }

  goToOtherPage(id, source, financial) {
    this.navCtrl.push(MediaPage, {
      poemId: id,
      source: source,
      financial: financial
    });
  }

}
