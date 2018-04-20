import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MyDownloadsPage} from './my-downloads';
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // MyDownloadsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyDownloadsPage),
    IonicImageLoader,
  ],
})
export class MyDownloadsPageModule {
}
