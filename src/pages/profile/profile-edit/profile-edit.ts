import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {User} from "../../../model/user";

/**
 * Generated class for the ProfileEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage implements OnInit {
  // private equal: boolean;
  user: User = new User();
  private tempUser: User;

  // private confirmPassword:string="";
  // private newPassword:string="";
  // private changePassword:boolean=false;
  // private birthDate:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private storage: Storage) {
  }

  ngOnInit() {
    this.storage.get('user').then(res => {
      this.user = res;
    });
    // if(this.newPassword==="" && this.confirmPassword===""){
    //     this.equal=true;
    // }
  }


  onSubmit() {
    // if(this.equal===true){
    this.storage.get('user').then(res => {
      this.tempUser = res;
      this.tempUser.firstName = this.user.firstName;
      this.tempUser.lastName = this.user.lastName;
      this.tempUser.email = this.user.email;
      this.tempUser.day = this.user.day;
      this.tempUser.month = this.user.month;
      this.tempUser.year = this.user.year;
      this.storage.set('user', this.tempUser);
      this.showAlert('ویرایش اطلاعات', 'اطلاعات شما با موفقیت ذخیره گردید.', 'خب');
      // if(this.changePassword===true) {
      //     if (this.newPassword !== "") {
      //         this.tempUser.password = this.newPassword;
      //     }
      //     else {
      //         this.showAlert('خطا', 'رمز عبور نمیتواند خالی باشد', 'خب')
      //     }
      // }
      // else {
      //
      //     this.tempUser.password = this.user.password;
      //     this.storage.set('user', this.tempUser);
      //     this.showAlert('ویرایش اطلاعات', 'اطلاعات شما با موفقیت ذخیره گردید.', 'خب')
      // }
    })
    // }
    // else{
    //     this.showAlert('خطا','رمز های عبور جدید با هم مطابقت ندارند','خب')
    // }

  }

  showAlert(title, subtitle, button) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }

  // onChange(){
  //
  //         if (this.newPassword === this.confirmPassword) {
  //             this.equal = true;
  //         }
  //         else {
  //             this.equal = false;
  //         }
  //
  //
  // }
  // changePass(event){
  //     if(event.target.checked===true) {
  //         this.changePassword = true;
  //     }
  //     else{
  //         this.changePassword = false;
  //     }
  // }
}

