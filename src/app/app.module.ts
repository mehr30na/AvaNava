import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Device} from "@ionic-native/device";
import {File} from "@ionic-native/file";
import {FileTransferObject, FileTransfer} from "@ionic-native/file-transfer";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Network} from "@ionic-native/network";
import {IonicStorageModule} from "@ionic/storage";
import {AppHeaderComponent} from '../components/app-header/app-header';
import {AppHttpProvider} from '../providers/app-http/app-http';
import {HttpModule} from "@angular/http";
import {SimpleGlobal} from "ng2-simple-global";
import {ItemListPage} from "../pages/item-list/item-list";
import {SignupPage} from "../pages/signup/signup";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {MediaPage} from "../pages/media/media";
import {AppFileProvider} from '../providers/app-file/app-file';
import {Media} from "@ionic-native/media";
import {AppPlayerProvider} from "../providers/app-player/app-player";
import {FalHafezPage} from "../pages/fal-hafez/fal-hafez";
import {AlbumPage} from "../pages/album/album";
import {SocialSharing} from "@ionic-native/social-sharing";
import {MusicCategoryPage} from "../pages/music-category/music-category";
import {MusicWishlistPage} from "../pages/music-wishlist/music-wishlist";
import {SearchPage} from "../pages/search/search";
import {InfoPopupPage} from "../pages/info-popup/info-popup";
import {MyDownloadsPage} from "../pages/my-downloads/my-downloads";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {PurchasePopupPage} from "../pages/purchase-popup/purchase-popup";
import {ProfilePage} from "../pages/profile/profile";
import {ProfileEditPage} from "../pages/profile/profile-edit/profile-edit";
import {AboutUsPage} from "../pages/about-us/about-us";
import {AvaNavaTeamPage} from "../pages/ava-nava-team/ava-nava-team";
import {FileOpener} from "@ionic-native/file-opener";
import {IonicImageLoader} from "ionic-image-loader";
import {GuidePage} from "../pages/guide/guide";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    MediaPage,
    MusicWishlistPage,
    MyDownloadsPage,
    FalHafezPage,
    AlbumPage,
    MusicCategoryPage,
    AppHeaderComponent,
    ItemListPage,
    SearchPage,
    InfoPopupPage,
    PurchasePopupPage,
    ProfilePage,
    ProfileEditPage,
    AboutUsPage,
    AvaNavaTeamPage,
    GuidePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageLoader.forRoot(),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    MediaPage,
    MusicWishlistPage,
    MyDownloadsPage,
    FalHafezPage,
    AlbumPage,
    MusicCategoryPage,
    ItemListPage,
    SearchPage,
    InfoPopupPage,
    PurchasePopupPage,
    ProfilePage,
    ProfileEditPage,
    AboutUsPage,
    AvaNavaTeamPage,
    GuidePage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    {provide: ErrorHandler, useClass: IonicErrorHandler},

    Device,
    ScreenOrientation,

    File,
    FileTransfer,
    FileTransferObject,

    InAppBrowser,

    Media,

    Network,
    SimpleGlobal,
    AppHttpProvider,
    AppFileProvider,
    AppPlayerProvider,
    FileOpener,
    SocialSharing,
    AndroidPermissions,

  ]
})
export class AppModule {
}
