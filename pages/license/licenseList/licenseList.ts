import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import "rxjs/add/operator/map";

import { MysqlService } from '../../../services/mysql.service';
// import { UpdateVehiclePage } from '../updateVehicle/updateVehicle';
import { AddLicensePage } from '../addLicense/addLicense';

@IonicPage()
@Component({
  selector: 'page-licenseList',
  templateUrl: 'licenseList.html',
  styleUrls: [ 'licenseList.scss', '../../../theme/variables.scss' ]

})
export class LicenseListPage {

  public myreturnvalue;
  public loading;
  public licenses: any;
  public fleetImages: any;
  public prompt;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private dbService: MysqlService
  ) {
      // this.initializeItems();
      // this.getLicenses();

  }

  goToAddLicensePage(){
    this.navCtrl.push(AddLicensePage);
  }

  getLicenses(ev: any){
    console.log(ev.target);
    const val = ev.target.value;
    this.presentLoading();
    ;

    this.dbService.fetchDataV2("SELECT fl.*, fi.imageName, fi.imageTimeStamp, fv.regNo, fv.makeModel, fv.chassis, fv.engineNo FROM fleetlicenses fl, fleetimages fi, fleetverification fv WHERE fi.fleetId = fv.id And fv.id = fl.fleetId AND fi.category = 'Front' AND (fv.makeModel LIKE '%" + val + "%' OR fv.regNo LIKE '%" + val + "%' OR fv.chassis LIKE '%" + val + "%' OR fv.engineNo LIKE '%" + val + "%')")
      .map(res => res.json())
      .subscribe(res => {
        this.loading.dismiss();
        this.licenses=res.data;
        if(this.licenses.length === 0 ){
          this.prompt = "No Records Found";
        } 
        console.log(this.licenses.length);
        // console.log("In Json Format: " + res.json())
        
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

  // getVehicleImages(){
  //       this.presentLoading();
  //   this.dbService.fetchDataV2('select * from fleetImages')
  //     .map(res => res.json())
  //     .subscribe(res => {
  //         this.loading.dismiss();
  //       this.fleetImages=res.data;
  //       }, error => {
  //       alert("FAILED, to fetch from php : "+ error);
  //       this.myreturnvalue = "Error : " + error;
  //       console.log(this.myreturnvalue)
  //       this.loading.dismiss();
  //     });
  // }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();  
  }

  // goToUpdateVehiclePage(fleet){
  //   this.navCtrl.push(UpdateVehiclePage, {fleet: fleet})
  // }


}
