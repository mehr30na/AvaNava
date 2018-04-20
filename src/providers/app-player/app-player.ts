import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {MediaObject, Media} from "@ionic-native/media";
import {File} from '@ionic-native/file';
import {Storage} from '@ionic/storage';
import {SimpleGlobal} from "ng2-simple-global";

/*
 Generated class for the AppPlayerProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class AppPlayerProvider {
  interval: any;
  timer: any;
  pause: boolean = false;
  public audioFile: MediaObject;

  constructor(public http: Http,
              private media: Media,
              private file: File,
              private storage: Storage,) {

  }

  playAudio(item, playUrl) {

    // alert(playUrl);
    if (!item.previewHttpPath) {

      if (playUrl === 'offlineMode') {
        let path = 'Poem/' + item.poemGallery.id + '/Music/' + item.id + '.mp3';
        item.localUrl = this.file.dataDirectory + path;
        playUrl = this.file.dataDirectory + path;
      }

      if (!this.pause) {
        this.audioFile = this.media.create(playUrl);
      }

      this.audioFile.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
      this.audioFile.onSuccess.subscribe(() => console.log('Action is successful'));
      this.audioFile.onError.subscribe(error => console.log('Error!', error));

      this.storage.set('isPlaying', true);
      this.storage.set('nowPlaying', item);

      return this.audioFile.play();

    }

    else {

      if (playUrl === 'offlineMode') {
        let path = 'Music/Beeptunes/' + item.album.id + '/' + item.id + '.mp3';
        item.localUrl = this.file.dataDirectory + path;
        playUrl = this.file.dataDirectory + path;
      }

      if (!this.pause) {
        this.audioFile = this.media.create(playUrl);
      }

      this.audioFile.onStatusUpdate.subscribe(status => {
        console.log(status)
      }); // fires when file status changes
      this.audioFile.onSuccess.subscribe(() => console.log('Action is successful'));
      this.audioFile.onError.subscribe(error => console.log('Error!', error));


      this.storage.set('isPlaying', true);
      this.storage.set('nowPlaying', item);

      return this.audioFile.play();

    }

  }


  pauseAudio() {
    this.audioFile.pause();
    this.pause = true;
  }

  stopAudio() {
    this.audioFile.stop();
    this.audioFile.release();
    this.pause = false;
  }

  getAudioCurrentPosition(): Promise<any> {
    return this.audioFile.getCurrentPosition().then(position => {
      return position;
    });
  }

  getAudioCurrentTime(): Promise<any> {
    return this.audioFile.getCurrentPosition().then(position => {
      return this.millisecondsToTime((position * 1000).toFixed());
    });
  }

  millisecondsToTime(milli) {
    var seconds = Math.floor((milli / 1000) % 60);
    var minutes = Math.floor((milli / (60 * 1000)) % 60);
    return minutes + ":" + seconds;
  }


  controlVolume(event) {
    let sliderValue = 100 - Number.parseInt(event._barR);
    this.audioFile.setVolume(sliderValue / 100);
  }

  controlPosition(event) {
    let sliderValue = 100 - Number.parseInt(event._barR);
    alert(sliderValue);
    this.audioFile.seekTo(sliderValue);
  }

  controlSeconds(type) {
    this.audioFile.getCurrentPosition().then((position) => {
      var number = Number.parseInt(position) * 1000;
      switch (type) {
        case 'back':
          this.audioFile.seekTo(number - 10000);
          break;
        case 'forward':
          this.audioFile.seekTo(number + 10000);
          break;
      }
    });
  }

}
