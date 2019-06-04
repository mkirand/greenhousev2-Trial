import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Content} from 'ionic-angular';
// import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
// import * as CryptoJS from 'crypto-js';
import "rxjs/add/operator/map";
import { MysqlService } from '../../services/mysql.service';

import { HomePage } from '../home/home';
import { CapturePhotoPage } from '../capturePhoto/capturePhoto';


@IonicPage()
@Component({
  selector: 'page-updateVehicle',
  templateUrl: 'updateVehicle.html',
  styleUrls: [ 'updateVehicle.scss', '../../theme/variables.scss' ]
})
export class UpdateVehiclePage {
  @ViewChild(Content) content: Content;
  fleetDashboard: string = "verify";
  // detailDashboard: string = "head";
  public myreturnvalue;
  // public goshala: any;
  public loading;
  public anArray: any=[];
  data;
  public fleetImages = [];
  public fleetid;
  public fleet = {
    // fleet_Name: String,
    // fleet_Gender: String,
    // fleet_Breed: String,
    // fleet_BirthDate: String,
    // fleet_Color: String,
    // fleet_ImagePath: String
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private dbService: MysqlService, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    if(this.navParams.get('fleetDashboard') !== undefined ){
    this.fleet = this.navParams.get('fleet');
    this.getfleet();
    this.fleetDashboard = this.navParams.get('fleetDashboard');
    // this.detailDashboard = this.navParams.get('detailDashboard');
    
    // console.log(this.navParams.get('farmDashboard'));
    }
    if(this.navParams.get('fleet') !== undefined ){
    this.fleet = this.navParams.get("fleet");
    this.presentLoading();
    this.getfleetImages();
    console.log(this.fleet);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddfleetPage');
  }

  goToCapturePhotoPage(imageName,fleet,category){
   
    let date = new Date().toJSON().slice(0, 19).replace('T', ' ')
    let mysql = "update fleetimages set imageTimeStamp = '" + date + "', imageName = '" + imageName + "' where fleetId = " + this.fleet.id + " and category = '" + category + "'";
     console.log("filename: " + imageName + ", id: " + this.fleet.id + ", category: " + category)
    this.navCtrl.push(CapturePhotoPage, {fleetFilename: imageName, fleet: fleet, mysql: mysql})
  }

  // addNewfleet(fleet){
  //   this.imcpaAppProvider.addfleet(fleet);
  //   this.navCtrl.push(FarmDashboardPage, {goshala: this.goshala});
  // }

// detectChanges() {
//     this.cdr.detectChanges();
//   }

// clearCache(){
//       this.cache.clear();
//       localStorage.clear();
//     }

  update(){
        this.content.resize();
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
    this.dbService.fetchDataV2("select * from fleetverification where id = " + this.fleet.id)
      .map(res => res.json())
      .subscribe(res => {
        this.fleet=res.data[0];
        console.log(this.fleet)
        // this.getfleetPens();
        this.getfleetImages()
        this.loading.dismiss();
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

    getfleetImages(){
    // this.presentLoading()
    this.dbService.fetchDataV2("select * from fleetimages where fleetId = " + this.fleet.id)
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


  updatefleet(fleet){
    this.presentLoading();
    this.dbService.fetchDataV2("update fleetverification set verifier = '" + fleet.verifier + "', verificationDate = '" + fleet.verificationDate + "', assetLocation = '" + fleet.assetLocation + "', GPS = '" + fleet.GPS + "', clientRep = '" + fleet.clientRep + "', regNo = '" + fleet.regNo + "', chassis = '" + fleet.chassis + "', makeModel = '" + fleet.makeModel + "', dateOfAcqu = '" + fleet.dateOfAcqu + "', mmCode = '" + fleet.mmCode + "', modelYear = '" + fleet.modelYear + "', vehicleCost = " +  fleet.vehicleCost + ", bookValue = " +  fleet.bookValue + ", residualValue = " +  fleet.residualValue + ", bodyCondition = '" +  fleet.bodyCondition + "', engineCondition = '" +  fleet.engineCondition + "', tyreCondition = '" +  fleet.tyreCondition + "', windscreenCondition = '" +  fleet.windscreenCondition + "', Ancillaries = '" +  fleet.Ancillaries + "', comments = '" +  fleet.comments + "', pic1 = '" +  fleet.pic1 + "', pic2 = '" +  fleet.pic2 + "' where id = " + fleet.id)
      .map(res => res.json())
      .subscribe(res => {
        let farmDashboard: string = "fleets";
        this.loading.dismiss();
        // this.clearCache();
        this.getfleet();
        // this.update();

        this.navCtrl.push(UpdateVehiclePage, {fleetDashboard: this.fleetDashboard, fleet: this.fleet});
        this.showToast();
          
        // this.tables=res.data;

        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
        // this.update();
      });
  }

  addFeilds(){
    var container = document.getElementById("container");
    // Clear previous contents of the container
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    container.appendChild(document.createTextNode("Member"));
    var input = document.createElement("ion-input");
    input.type = "text";
    input.name = "member";
    container.appendChild(input);
    // Append a line break 
    container.appendChild(document.createElement("br"));
  }

   goTo(){
   console.log('this.anArray',this.anArray);
   this.data=true;
   }
   Add(){
   this.anArray.push({'value':''});
   }
}
