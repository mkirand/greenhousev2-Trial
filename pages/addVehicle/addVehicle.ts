import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Content} from 'ionic-angular';
// import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
// import * as CryptoJS from 'crypto-js';
import "rxjs/add/operator/map";
import { MysqlService } from '../../services/mysql.service';

import { HomePage } from '../home/home';
import { CapturePhotoPage } from '../capturePhoto/capturePhoto';
// import { VehicleListPage } from '../vehicleList/vehicleList';


@IonicPage()
@Component({
  selector: 'page-addVehicle',
  templateUrl: 'addVehicle.html',
  styleUrls: [ 'addVehicle.scss', '../../theme/variables.scss' ]
})
export class AddVehiclePage {
  // @ViewChild(Content) content: Content;
  fleetDashboard: string = "verify";
  // detailDashboard: string = "head";
  public myreturnvalue;
  // public goshala: any;
  public loading;
  public anArray: any=[];
  data;
  public fleetId;
  public fleetView = {};
  public fleet = {}; 
  public fleetImages;
    // fleet_Name: String,
    // fleet_Gender: String,
    // fleet_Breed: String,
    // fleet_BirthDate: String,
    // fleet_Color: String,
    // fleet_ImagePath: String
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private dbService: MysqlService, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    if(this.navParams.get('fleetDashboard') !== undefined ){
    // this.getfleet();
    this.fleetDashboard = this.navParams.get('fleetDashboard');
    this.fleet = this.navParams.get('fleet');
    } else if(this.navParams.get('imageAdded') !== undefined ) {
      this.fleet = this.navParams.get('fleet');
      this.getfleetImages(this.fleet.id)
    }

    // console.log(this.navParams.get('farmDashboard'));
    // }
    // if(this.navParams.get('fleet') !== undefined ){
    // this.fleet = this.navParams.get("fleet");
    // console.log(this.fleet);
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddfleetPage');
  }

    getfleetImages(fleetId){
    // this.presentLoading()
    this.dbService.fetchDataV2("select * from fleetimages where fleetId = " + fleetId)
      .map(res => res.json())
      .subscribe(res => {
        this.fleetImages=res.data;
        console.log(this.fleetImages)
        // this.getfleetPens();
        this.loading.dismiss();
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

  goToCapturePhotoPage(fleet){
    let type = 'insert'
    let date = new Date().toJSON().slice(0, 19).replace('T', ' ')
    let fleetFilename = fleet.id + "-" + this.fleetView.category + ".jpg"
    let mysql = "insert into fleetimages (fleetId,imageName,category,imageTimeStamp) values (" + fleet.id + ",'" + fleetFilename  + "','" + this.fleetView.category + "','" + date + "')";
     console.log("filename: " + fleetFilename + ", id: " + this.fleetId + ", category: " + this.fleetView.category)
    this.navCtrl.push(CapturePhotoPage, {fleetFilename: fleetFilename, fleet: fleet, mysql: mysql, type: type})
  }
 

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();  
  }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'Fleet Info Updated...',
      duration: 3000
      // showCloseButton: true,
      // closeButtonText: 'Ok'
    });
    toast.present();
    toast.onDidDismiss(() => {
    console.log('Dismissed toast');
    // this.goToHomePage();
    });
  }

    getfleet(){
    this.presentLoading()
    this.dbService.fetchDataV2("select * from fleetverification where id = " + this.fleetId.id)
      .map(res => res.json())
      .subscribe(res => {
        this.fleet=res.data[0];
        console.log(this.fleet)
        // this.getfleetPens();
        this.loading.dismiss();
        this.navCtrl.push(AddVehiclePage, {fleetDashboard: 'condition', fleet: this.fleet});
        this.showToast();
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }


      getfleetId(){
    this.presentLoading()
    this.dbService.fetchDataV2("SELECT MAX( id ) as id FROM fleetverification")
      .map(res => res.json())
      .subscribe(res => {
        this.fleetId=res.data[0];
        console.log(this.fleetId)
        this.getfleet();
        this.loading.dismiss();
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

  addfleet(fleet){
    this.presentLoading();
    this.dbService.fetchDataV2("insert into fleetverification (verifier, verificationDate,assetLocation,GPS,clientRep,regNo,chassis,makeModel,dateOfAcqu,mmCode,modelYear,vehicleCost,bookValue,residualValue,bodyCondition,engineCondition,tyreCondition,windscreenCondition,Ancillaries,comments) value ('" + fleet.verifier + "','" + fleet.verificationDate + "','" + fleet.assetLocation + "','" + fleet.GPS + "','" + fleet.clientRep + "','" + fleet.regNo + "','" + fleet.chassis + "','" + fleet.makeModel + "','" + fleet.dateOfAcqu + "','" + fleet.mmCode + "','" + fleet.modelYear + "','" +  fleet.vehicleCost + "','" +  fleet.bookValue + "','" +  fleet.residualValue + "','" +  fleet.bodyCondition + "','" +  fleet.engineCondition + "','" +  fleet.tyreCondition + "','" +  fleet.windscreenCondition + "','" +  fleet.Ancillaries + "','" +  fleet.comments + "')")
      .map(res => res.json())
      .subscribe(res => {
        console.log(res);
        this.loading.dismiss();
        // this.clearCache();
        this.getfleetId();
        // this.update();
        // this.tables=res.data;

        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
        // this.update();
      });
  }
}
