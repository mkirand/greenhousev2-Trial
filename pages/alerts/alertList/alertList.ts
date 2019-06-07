import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import "rxjs/add/operator/map";

import {MyAppProvider} from '../../../services/myAppProvider';
import { MysqlService } from '../../../services/mysql.service';

import { AlertModalPage } from '../alertModal/alertModal';
import { UpdateVehiclePage } from '../../updateVehicle/updateVehicle';
import { AddVehiclePage } from '../../addVehicle/addVehicle';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';

@IonicPage()
@Component({
  selector: 'page-alertList',
  templateUrl: 'alertList.html',
  styleUrls: [ 'alertList.scss', '../../../theme/variables.scss' ]

})
export class AlertListPage {

  alertDashboard: string = "open";
  public myreturnvalue;
  public loading;
  public alerts = [];
  public fleetImages: any;
  public dummyAlert = [];
  public rows = [1,2,3,4];
  public cols = ['A','B'];
  public date = new Date();
  public plants = [];
  // public plants = [
  //   {
  //     position: 'A1',
  //     name: "Tomatoes",
  //     image: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '150kg',
  //     progress: 5,
  //     status: 'Seedling'

  //   },
  //   {
  //     position: 'B1',
  //     name: "Lettuce",
  //     image: "https://images.unsplash.com/photo-1549736624-81a2ca809ad7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1947&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '40kg',
  //     progress: 50,
  //     status: 'Vegetative'
  //   },
  //   {
  //     position: 'A2',
  //     name: "Potatoes",
  //     image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '90kg',
  //     progress: 25,
  //     status: 'Seedling'
  //   },
  //   {
  //     position: 'B2',
  //     name: "Pumpkin",
  //     image: "https://images.unsplash.com/photo-1443464812268-44d8bb5f2df5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '200kg',
  //     progress: 35,
  //     status: 'Vegetative'
  //   },
  //   {
  //     position: 'A3',
  //     name: "S/Berries",
  //     image: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '150kg',
  //     progress: 75,
  //     status: 'Flowering'
  //   },
  //   {
  //     position: 'B3',
  //     name: "Cabbage",
  //     image: "https://images.unsplash.com/photo-1545037936-7676f5cdfc88?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '120kg',
  //     progress: 85,
  //     status: 'Harvesting'
  //   },
  //   {
  //     position: 'A4',
  //     name: "G/Beans",
  //     image: "https://images.unsplash.com/uploads/141143339879512fe9b0d/f72e2c85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '110kg',
  //     progress: 0,
  //     status: 'Seed'
  //   },
  //   {
  //     position: 'B4',
  //     name: "Carrots",
  //     image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     plantedArea: '50 m²',
  //     plantedOn: '2019-05-19',
  //     expectedHarvestDate: '2019-08-20',
  //     expectedYeild: '200kg',
  //     progress: 90,
  //     status: 'Harvesting'
  //   }

  // ]

  countDown;
  currentlyBusy = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private dbService: MysqlService,
    private myApp: MyAppProvider
  ) {
    console.log(this.date)
      // this.presentLoading();
      // this.initializeItems();
      this.getPlants();
      // this.goshalas = this.goshalaProvider.getGoshalas();

  //  this.myTimer();   

  }

  // goToFarmDashboardPage(goshala){
  //   this.navCtrl.push(FarmDashboardPage, {
  //     goshala: goshala
  //   });
  // }


myTimer() {
   
   console.log("Fetch Latest Data");
    this.countDown = Observable.timer(0, 60000)
      .subscribe(x => {

        if(!this.currentlyBusy){
        this.getVehicles();
        }
      });

  }

  goToAddVehiclePage(){
    this.navCtrl.push(AddVehiclePage);
  }

  goToAlertModal(plant) {
    const modal = this.modalCtrl.create(AlertModalPage, {plant: plant});
    modal.onDidDismiss(() => {
      // this.getVehicles();
    });
    modal.present();
  }

 ionViewDidEnter(){
   
  //  console.log("ionViewDidEnter")
  //  if (!this.currentlyBusy){
  //    this.getVehicles();
  //   }
 }

  getPlants(){
    // this.currentlyBusy=true;
    this.presentLoading();
    this.dbService.fetchDataV2("select * from crops where farmId = 2")
      .map(res => res.json())
      .subscribe(res => {
        this.loading.dismiss();
        this.plants=res.data;
        this.dummyAlert = this.plants;
        this
        console.log(this.plants);
        }, error => {
        // this.currentlyBusy=false;
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

  goToUpdateVehiclePage(fleet){
    this.navCtrl.push(UpdateVehiclePage, {fleet: fleet})
  }

}
