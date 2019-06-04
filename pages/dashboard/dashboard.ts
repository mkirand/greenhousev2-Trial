import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AlertListPage } from '../alerts/alertList/alertList';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: [ 'dashboard.scss', '../../theme/variables.scss' ]
})
export class DashboardPage {

  public date = new Date().toJSON().slice(0, 19).replace('T', ' ');

  constructor(public navCtrl: NavController, public app: App) {
    console.log(this.date);
  }

  goToLoginPage(){
    this.app.getRootNavs()[0].setRoot(LoginPage);
    // this.navCtrl.setRoot(LoginPage)
  }

  goToVehicleListPage(){
    this.navCtrl.setRoot(AlertListPage);
  }

}
