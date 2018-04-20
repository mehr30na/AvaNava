import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MusicCategoryPage} from './music-category';
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // MusicCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(MusicCategoryPage),
    IonicImageLoader,
  ],
})
export class MusicCategoryPageModule {
}
