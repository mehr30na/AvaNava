import {Component, OnInit} from '@angular/core';
import {SearchPage} from "../../pages/search/search";
import {NavController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {AppPlayerProvider} from "../../providers/app-player/app-player";

/**
 * Generated class for the AppHeaderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-header',
  templateUrl: 'app-header.html'
})
export class AppHeaderComponent implements OnInit {

  text: string;
  isPlaying: boolean = false;
  private interval: any;

  constructor(public navCtrl: NavController,
              private storage: Storage,
              private mPlayer: AppPlayerProvider,) {

  }

  ngOnInit() {
    let self = this;
    this.interval = setInterval(function () {
      self.storage.get('isPlaying').then(res => {
        self.isPlaying = res;
        // alert(res);
      }).catch()
    }, 1000);
  }

  playAudio() {
    this.storage.get('nowPlaying').then(res => {
      // alert(JSON.stringify(res));
      this.mPlayer.playAudio(res, 'offlineMode');
      this.isPlaying = true;
      this.storage.set('isPlaying', true);
    }).catch()
  }

  pauseAudio() {
    this.mPlayer.stopAudio();
    this.isPlaying = false;
    this.storage.set('isPlaying', false);
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

}
