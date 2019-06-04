import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Http, Headers, Request } from '@angular/http';
import {HttpRequest, HttpEventType} from '@angular/common/http';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { DataURIToBlob } from '../../helpers/DataURIToBlob';
import 'rxjs/add/operator/toPromise'

import { MysqlService } from '../../services/mysql.service';
import {MyAppProvider} from '../../services/myAppProvider';

// import {HomePage} from '../home/home';
import {TabsPage} from '../tabs/tabs';
import {AddVehiclePage} from '../addVehicle/addVehicle';
import {UpdateVehiclePage} from '../updateVehicle/updateVehicle';
import {EncryptionService} from '../../services/encryption.service';

@Component({
  selector: 'page-capturePhoto',
  templateUrl: 'capturePhoto.html',
  styleUrls: [ 'capturePhoto.scss', '../../theme/variables.scss' ]
})
export class CapturePhotoPage {


  public photoMethod;
  public selectedImage: string;
  public croppedImage: string = '';
  public cow = {};
  public filename;
  public mysql;
  public type;
  public user = {};
  public sentData: any;
  public loading;
  public myreturnvalue;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();


  constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public encryptme: EncryptionService, private dbService: MysqlService, private myApp: MyAppProvider,) {

    this.filename = this.navParams.get("filename");
    this.user = this.navParams.get("user");
    this.mysql = this.navParams.get("mysql");
    this.type = this.navParams.get("type");

  }

  choosePhotoType(method){
    this.photoMethod = method;
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Uploading Your Image. Please wait...',
    });
    return await this.loading.present();
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  triggerSnapshot(): void {
    this.trigger.next();
    console.log(this.webcamImage.imageAsDataUrl);
  }

  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  imageCropped(image: string) {
      console.log("Image : "+image);
      this.croppedImage = image;

  }

  goToHomePage(){
    // let farmDashboard: string = "cows";
    if(this.type === 'insert'){
      let imageAdded = 'added'
    this.navCtrl.push(AddVehiclePage, {fleet: this.fleet, imageAdded: imageAdded});
    } else {
      this.navCtrl.push(UpdateVehiclePage, {fleet: this.fleet});
    }
  }

  getUser(){
    // this.presentLoading();
    this.dbService.fetchDataV2("SELECT * from access_control where id = " + this.user.id)
      .map(res => res.json())
      .subscribe(res => {
        
        this.myApp.user = res.data[0];
        this.loading.dismiss();
        // console.log(this.monitors);
        // console.log("In Json Format: " + res.json())
        
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

  showToastWithCloseButton() {
    const toast = this.toastCtrl.create({
      message: 'Your Image was successfully uploaded.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
    toast.onDidDismiss(() => {
    console.log('Dismissed toast');
    // this.getUser()
    this.navCtrl.setRoot(TabsPage)
    });
  }

  async send() {
    this.presentLoading();
    const file = DataURIToBlob(this.croppedImage)
    const formData = new FormData()
    // console.log("filename: " + this.fleetFilename + ", id: " + this.fleet.id + ", pic: " + this.pic)
    // let date = new Date().toJSON().slice(0, 19).replace('T', ' ')
    // let mysql = "update fleetimages set imageTimeStamp = '" + date + "', imageName = '" + this.fleetFilename + "' where fleetId= " + this.fleet.id;
    formData.append('data',this.encryptme.encrytme(this.mysql));
    formData.append('file', file, this.filename);
    // formData.append('id', this.fleet.id);
    // formData.append('pic', this.pic);
    
    const res = await (this.http.post('https://www.dev-x.co.za/Projects/PhoenixInstruments/BirdScanner/webApp/birdUpload.php', formData).toPromise())
    
    // const req = new HttpRequest('POST', 'https://www.dev-x.co.za/MayapurIT/Goshala/uploadGoshala.php', formData, {reportProgress: true,})


    // this.http.request(req).subscribe(event => {

    //   if(event.type === HttpEventType.UploadProgress)
    //   {
    //     console.log(event.loaded);
    //   }
    // })
    
    this.sentData = res;
    console.log(this.sentData.status);
    this.getUser()
    // this.loading.dismiss();
    this.showToastWithCloseButton()
    console.log('res', res)
  }

  reloadPage(cow){
    this.navCtrl.push(CapturePhotoPage, {cow: cow})
  }

}