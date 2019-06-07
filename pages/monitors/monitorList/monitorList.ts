import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import Swal from 'sweetalert2';

import { MysqlService } from '../../../services/mysql.service';
import {MyAppProvider} from '../../../services/myAppProvider';

import { MonitorModalPage } from '../monitorModal/monitorModal';

@Component({
  selector: 'page-monitorList',
  templateUrl: 'monitorList.html',
  styleUrls: [ 'monitorList.scss', '../../../theme/variables.scss' ]
})
export class MonitorListPage {

  public loading;
  public monitors = [];
  public myreturnvalue;
  public farms = [];
  // public farms = [
  //   {
  //     address: '21 Pan Road, Lanseria',
  //     name: "Northern Farm",
  //     crops: "Carrots, Green Beans, Lettuce",
  //     image: "https://lh5.googleusercontent.com/p/AF1QipNUgwif_UXUvgVt5AhaLK2tOq6jMoCiSiy1Nq9L=w426-h240-k-no",
  //     temp: '36C',
  //     soil: '140mm',
  //     humidity: '60%',
  //     solar: '45 lux',
  //     gpsLat:'-25.929778',
  //     gpsLong: '27.955159',
  //     status:'Offline (Maintenance)'
  //   },
  //   {
  //     address: '5 Ashenti Rd, Lanseria',
  //     name: "Monaghan Farm",
  //     crops: "Radish, Green Beans, Lettuce",
  //     image: "https://lh4.googleusercontent.com/proxy/Ok-2zDC5iYLjWdVO4wGQxCUcBEWxSMSd1peC3Gqjqa3SzQplZ8RuHRw3ZKrWToLTO_PKWd5REy-Q2ZynJUVw3f5VETogYfxcFhd2CqjLL41Y6mwkTLlSoKX1NpyaeCJRE9XGy6k1Ky_kOraYsuAgkH3I6izEVRY=w408-h305-k-no",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     gpsLat:'-25.915799',
  //     gpsLong: '27.927210',
  //     status: 'Online'
  //   },
  //   {
  //     address: 'Ptn 130 Farm 489 Hennops River',
  //     name: "Gansbaai Lapa",
  //     crops: "Pepeprs, Radhish, Lettuce",
  //     image: "https://lh5.googleusercontent.com/p/AF1QipMnjR_-yreKQRztvKdARMIHrHC1cYrPKWgiyh9C=w408-h304-k-no",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '60%',
  //     solar: '40 lux',
  //     gpsLat:'-25.834368',
  //     gpsLong: '27.952650',
  //     status:'Online'
  //   },]

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    // public goshalaProvider: ImcpaAppProvider,
    private dbService: MysqlService, private myApp: MyAppProvider, public modalCtrl: ModalController) {
      this.getFarms();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();  
  }

  goToAlertModal(monitor) {
    const modal = this.modalCtrl.create(MonitorModalPage, {monitor: monitor});
    modal.present();
  }

  getFarms(){
    this.presentLoading();
    this.dbService.fetchDataV2("SELECT * from farms")
      .map(res => res.json())
      .subscribe(res => {
        this.loading.dismiss();
        this.farms=res.data;
        console.log(this.farms);
        // console.log("In Json Format: " + res.json())
        
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

  activateCommand(monitor, command){
    this.presentLoading();
    this.dbService.fetchDataV2("INSERT INTO pi_commands (unit_name,cpuserialno,createDatetime,command,flag) VALUE ('" + monitor.unit_name + "','" + monitor.cpuserial + "',NOW(),'" + command + "','NEW')")
      .map(res => res.json())
      .subscribe(res => {
        console.log(res);
        Swal.fire({
          title: 'Succes',
          text: 'The Comand has been sent!',
          type: 'success',
          confirmButtonText: 'Close'
        });
        this.loading.dismiss();
        // this.clearCache();
        // this.update();
        // this.tables=res.data;

        }, error => {
        Swal.fire({
          title: 'Error!',
          text: "FAILED, to fetch from php : "+ error,
          type: 'error',
          confirmButtonText: 'Close'
        });
        // alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
        // this.update();
      });
  }



}
