import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController  } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { MysqlService } from '../../../services/mysql.service';
import {MyAppProvider} from '../../../services/myAppProvider';

declare var google;
let map: any;

interface Track{
  region: string;
  team: string;
  incident_date: string;
}

@Component({
  selector: 'page-monitorModal',
  templateUrl: 'monitorModal.html',
  styleUrls: ['monitorModal.scss', '../../../theme/variables.scss']
})
export class MonitorModalPage {

@ViewChild('map') mapElement: ElementRef;
  zoom: number = 10;
  
  // initial center position for the map
  // lat: number = -28.356138;
  // lng: number = 153.31907;

  tracker: string = "Infrigement";

  monitorDashboard: string = "map";
  public monitor = {};
  public parameter = [];
  public loading;
  public myreturnvalue;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public loadingCtrl: LoadingController, private dbService: MysqlService, private myApp: MyAppProvider) {
    this.monitor = this.navParams.get("monitor");
    this.getParameters();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();  
  }

  getParameters(){
    this.presentLoading();
    this.dbService.fetchDataV2("SELECT * from pi_parameters pp where pp.cpuserialno = '" + this.monitor.cpuserial + "'")
      .map(res => res.json())
      .subscribe(res => {
        this.loading.dismiss();
        this.parameter=res.data[0];
        console.log(this.parameter);
        // console.log("In Json Format: " + res.json())
        
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

// We not Updating CMode, SendMovementMail, Email,  
  updateParams(parameter){
    this.presentLoading();
    this.dbService.fetchDataV2("update pi_parameters pp set pp.unit_name = '" + parameter.unit_name + "', FPS = '" + parameter.FPS + "', pp.RecordingLength = '" + parameter.RecordingLength + "', pp.IncidentDelay = '" + parameter.IncidentDelay + "', pp.CameraSensitivity = '" + parameter.CameraSensitivity + "', pp.Reset = '" + parameter.Reset + "', pp.Show = '" + parameter.Show + "', pp.Track = '" + parameter.Track + "', pp.HDMIOff = '" + parameter.HDMIOff + "', pp.Vibration = '" + parameter.Vibration + "', pp.VibrationCutOff = '" + parameter.VibrationCutOff + "', pp.MotionCutOff = " + parameter.MotionCutOff + ", pp.TimeDelay = " + parameter.TimeDelay + ", pp.PMaxPixelArea = " + parameter.PMaxPixelArea + ", pp.PContourNos = '" + parameter.PContourNos + "', pp.cmdFetchDelay = '" + parameter.cmdFetchDelay + "', pp.RulesMotionMax = '" + parameter.RulesMotionMax + "', pp.RulesVibrationMax = '" + parameter.RulesVibrationMax + "', pp.RulesDurationMax = '" + parameter.RulesDurationMax + "' where pp.cpuserialno = '" + this.monitor.cpuserial + "'")
      .map(res => res.json())
      .subscribe(res => {
        // let farmDashboard: string = "paraparameters";
        this.loading.dismiss();
        // this.clearCache();
        // this.getparaparameter();
        // // this.update();

        // this.navCtrl.push(UpdateVehiclePage, {paraparameterDashboard: this.paraparameterDashboard,parameter: this.paraparameter});
        // this.showToast();
          
        // this.tables=res.data;

        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
        // this.update();
      });
  }

 markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

  seeValue(display){
    console.log(display);
  }

}