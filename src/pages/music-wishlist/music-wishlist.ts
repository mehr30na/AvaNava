import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {MediaPage} from "../media/media";
import {GlobalUrl} from "../../providers/globalUrl";

/**
 * Generated class for the MusicWishlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-music-wishlist',
  templateUrl: 'music-wishlist.html',
})
export class MusicWishlistPage implements OnInit {

  private wishList: Array<any> = [];
  private globalUrl = GlobalUrl.serverUrl;

  constructor(public navCtrl: NavController,
              private storage: Storage,
              public navParams: NavParams) {
  }


  ngOnInit() {
    this.storage.get('musicWishlist').then(res => {
      this.wishList = res;
      // alert(JSON.stringify(res[0]));
    })
  }

  goToOtherPage(id, source, financial) {
    this.navCtrl.push(MediaPage, {
      poemId: id,
      source: source,
      financial: financial
    });
  }

  removeWishList(item) {
    this.wishList.splice(this.wishList.indexOf(item), 1);
    this.storage.set('musicWishlist', this.wishList);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.navCtrl.push(MusicWishlistPage, {});
      this.navCtrl.remove(this.navCtrl.last().index);
    }, 1000);
  }
}
