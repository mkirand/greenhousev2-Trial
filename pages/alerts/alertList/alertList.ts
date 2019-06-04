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
  public plants = [
    {
      position: 'A1',
      name: "Tomatoes",
      image: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '150kg',
      progress: 5,
      status: 'Seedling'

    },
    {
      position: 'B1',
      name: "Lettuce",
      image: "https://images.unsplash.com/photo-1549736624-81a2ca809ad7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1947&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '40kg',
      progress: 50,
      status: 'Vegetative'
    },
    {
      position: 'A2',
      name: "Potatoes",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '90kg',
      progress: 25,
      status: 'Seedling'
    },
    {
      position: 'B2',
      name: "Pumpkin",
      image: "https://images.unsplash.com/photo-1443464812268-44d8bb5f2df5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '200kg',
      progress: 35,
      status: 'Vegetative'
    },
    {
      position: 'A3',
      name: "S/Berries",
      image: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '150kg',
      progress: 75,
      status: 'Flowering'
    },
    {
      position: 'B3',
      name: "Cabbage",
      image: "https://images.unsplash.com/photo-1545037936-7676f5cdfc88?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '120kg',
      progress: 85,
      status: 'Harvesting'
    },
    {
      position: 'A4',
      name: "G/Beans",
      image: "https://images.unsplash.com/uploads/141143339879512fe9b0d/f72e2c85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '110kg',
      progress: 0,
      status: 'Seed'
    },
    {
      position: 'B4',
      name: "Carrots",
      image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      temp: '45C',
      soil: '150mm',
      humidity: '60%',
      solar: '40 lux',
      plantedArea: '50 m²',
      plantedOn: '2019-05-19',
      expectedHarvestDate: '2019-08-20',
      expectedYeild: '200kg',
      progress: 90,
      status: 'Harvesting'
    }

  ]

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
      // this.getVehicles();
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

  getVehicles(){
    this.currentlyBusy=true;
    this.presentLoading();
    this.dbService.fetchDataV2("SELECT ph.*, ROUND(ph.freemem, 0) AS roundedMem, pu.Client_Name from pi_heartbeats ph, pi_units pu where ph.cpuserial = pu.cpuserial and ph.alertType = 'Video-Alert' and pu.Client_Name = '" + this.myApp.user.Client_Name + "' order by id desc limit 100")
      .map(res => res.json())
      .subscribe(res => {
        this.loading.dismiss();
        this.alerts=res.data;
        this.dummyAlert = this.alerts;
        this
        console.log(this.alerts);

        this.myApp.openCount = 0;
        this.myApp.acceptedCount = 0;
        this.myApp.rejectedCount = 0;
        this.myApp.investigateCount = 0;

        for(let i = 0; i < this.alerts.length; i++ ){
          if(this.alerts[i].status === null){
            this.myApp.openCount = this.myApp.openCount + 1;
            // console.log(this.myApp.openCount); 
          }
          else if(this.alerts[i].status === 'Accepted'){
            this.myApp.acceptedCount = this.myApp.acceptedCount + 1; 
          }
          else if(this.alerts[i].status === 'Rejected'){
            this.myApp.rejectedCount = this.myApp.rejectedCount + 1; 
          }
          else if (this.alerts[i].status === 'Investigate'){
            this.myApp.investigateCount = this.myApp.investigateCount + 1; 
          }
        }
        // console.log("In Json Format: " + res.json())
        this.currentlyBusy=false;
        }, error => {
        this.currentlyBusy=false;
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
//   getGoshalas(){
//     //Create Headers for POST
//       var headers = new Headers();
//       headers.append("Accept", 'application/json');
//       headers.append('Content-Type', 'application/json' );
//       headers.append('Access-Control-Allow-Origin', '*' ); 
//       const requestOptions = new RequestOptions({ headers: headers });

//     //Encyption
//       this.string2encyrpt = '{"sql": "select * from farms", "lock": "krishna108"}'
//       this.key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789xxxxxx");
//       this.iv  = CryptoJS.enc.Hex.parse("yyyyyy9876543210abcdef9876543210");
//       var encrypted = CryptoJS.AES.encrypt(this.string2encyrpt, this.key, {
//                   iv: this.iv  
//                 });
//       this.myencryption = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//       //console.log("Encypted data : " + this.myencryption);

//     //Generate Form to Post
//     let postData = new FormData();
//       postData.append('data',this.myencryption);

//     //Site to post data to 
//     this.http.post("https://dev-x.co.za/MayapurIT/Goshala/cowdb1.php", postData)
//       .map(res => res.json())
//       .subscribe(res => {
//         //console.log(data['_body']);
//         this.goshalas= res.data;
//         console.log(this.goshalas);
//       }, error => {
//         alert("FAILED, to fetch from php : "+ error);
//         this.myreturnvalue = "Error : " + error;
//         console.log(this.myreturnvalue)
//       }); 
//  }



  // getGoshalas(){
  //   this.http.get("https://www.dev-x.co.za/MayapurIT/Goshala/cowdb.php?key=get&mysql=select * from farms")
  //   .map(res => res.json())
  //   .subscribe(res => {
  //     this.goshalas = res.data; 
  //     console.log("Jason data: " + res.data);
  //     console.log("Temple Array : " + this.goshalas);
  //    }, (err) => {
  //      alert("Failed to Load Json data" + err)
  //    });
  // }


  // deleteGoshala(goshala){
  //   this.goshalaProvider.key = "delete";
  //   console.log("INGoshalas : " + "http://localhost/GoshalaRoutes.php?Goshala_ID=" + goshala.Goshala_ID + "&key=" + this.goshalaProvider.key);
  //   this.http.get("http://localhost/GoshalaRoutes.php?Goshala_ID=" + goshala.Goshala_ID + "&key=" + this.goshalaProvider.key)
  //   .map(res => res)
  //   .subscribe(res => {
  //      alert("Deleted" + res);
  //      this.navCtrl.push(GoshalasListPage, {
  //        goshala: this.navParams.get("goshalas")
  //      });
  //    }, (err) => {
  //      alert("Failed to Load Json data" + err)
  //    });
  // }

}
