import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MusicWishlistPage} from './music-wishlist';
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // MusicWishlistPage,
  ],
  imports: [
    IonicPageModule.forChild(MusicWishlistPage),
    IonicImageLoader,
  ],
})
export class MusicWishlistPageModule {
}
