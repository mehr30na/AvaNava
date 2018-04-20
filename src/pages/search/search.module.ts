import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SearchPage} from './search';
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    IonicImageLoader,
  ],
})
export class SearchPageModule {
}
