import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AlbumPage} from './album';
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // AlbumPage,
  ],
  imports: [
    IonicPageModule.forChild(AlbumPage),
    IonicImageLoader,
  ],
})
export class AlbumPageModule {
}
