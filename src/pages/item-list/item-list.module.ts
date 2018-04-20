import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ItemListPage} from "./item-list";
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    // ItemListPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemListPage),
    IonicImageLoader,
  ],
})
export class ItemListPageModule {
}
