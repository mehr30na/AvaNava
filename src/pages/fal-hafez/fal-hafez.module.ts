import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FalHafezPage} from './fal-hafez';
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // FalHafezPage,
  ],
  imports: [
    IonicPageModule.forChild(FalHafezPage),
    IonicImageLoader,
  ],
})
export class FalHafezPageModule {
}
