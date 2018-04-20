import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MediaPage} from './media';
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // MediaPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaPage),
    IonicImageLoader,
  ],
})
export class MediaPageModule {
}
