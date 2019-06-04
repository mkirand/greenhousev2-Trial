import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';

import { MysqlService } from '../../services/mysql.service';
import {MyAppProvider} from '../../services/myAppProvider';

// import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: [ 'login.scss', '../../theme/variables.scss' ]
})
export class LoginPage {

  public user = {};
  public access = [];
  public loading;
  // public toast;
  public myreturnvalue;

  constructor(public navCtrl: NavController, public dbService: MysqlService, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private myApp: MyAppProvider) {
    // this.getAccess();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();
  }

  presentToast(type) {
    if(type === "success"){
    const toast = this.toastCtrl.create({
      
      message: "Welcome " + this.access.full_name + " " + this.access.surname + "!",
      duration: 1000,
      position: 'top',
      cssClass: 'yourClass'
      
    });
    toast.present();
    }
    else if(type === "failure"){
    const toast = this.toastCtrl.create({
      
      message: "Invalid Username Or Password!",
      duration: 3000,
      position: 'top',
      cssClass: 'yourClass'
      
    });
    toast.present();
    }
    
  }

  handleLogin(user){
    this.presentLoading();
    this.dbService.fetchDataV2("select * from access_control where u_name = '" + user.username + "' and u_password = '" + user.password + "'")
      .map(res => res.json())
      .subscribe(res => {
        this.access=res.data[0];
        this.myApp.user = this.access;
        console.log(this.myApp.user);
        if(res.data.length === 0){
          this.loading.dismiss();
          this.presentToast("failure")
          // alert("Invalid Username Or Password!"); 
        } else {
        this.loading.dismiss();
        
        // alert("Welcome " + this.access.full_name + " " + this.access.surname + "!");
        this.navCtrl.push(TabsPage);
        this.presentToast("success")
        }
        }, error => {
        this.loading.dismiss();
        alert("Invalid Username Or Password");
        this.myreturnvalue = "Error1 : " + error;
        console.log(this.myreturnvalue)
        
      });
  }



}
