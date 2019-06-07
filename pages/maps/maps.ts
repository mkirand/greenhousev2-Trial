import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
// import { Geolocation } from '@ionic-native/geolocation';
// import {basicdata, company} from './data';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import "rxjs/add/operator/map";
// import { Observable } from 'rxjs';

// import { FarmDashboardPage } from '../farmDashboard/farmDashboard';
// import { ImcpaAppProvider } from '../../providers/imcpaApp/imcpaApp';
import { MysqlService } from '../../services/mysql.service';
import {MyAppProvider} from '../../services/myAppProvider';


declare var google;
let map: any;

    
interface Track{
  region: string;
  team: string;
  incident_date: string;
}

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
  styleUrls: [ 'maps.scss', '../../theme/variables.scss' ]
})
export class MapsPage {
 
  public farms = [];
  // public farms = [
  //   {
  //     locality: '21 Pan Road, Laneria',
  //     name: "Northern Farm",
  //     crops: "Carrots, Green Beans, Lettuce",
  //     image: "https://lh5.googleusercontent.com/p/AF1QipNUgwif_UXUvgVt5AhaLK2tOq6jMoCiSiy1Nq9L=w426-h240-k-no",
  //     temp: '36C',
  //     soil: '140mm',
  //     humidity: '62%',
  //     solar: '45 lux',
  //     gpsLat:'-25.929778',
  //     gpsLong: '27.955159',
  //     status:'Offline(Maintenance)'
  //   },
  //   {
  //     locality: '5 Ashenti Rd, Lanseria',
  //     name: "Monaghan Farm",
  //     crops: "Radish, Green Beans, Lettuce",
  //     image: "https://lh4.googleusercontent.com/proxy/Ok-2zDC5iYLjWdVO4wGQxCUcBEWxSMSd1peC3Gqjqa3SzQplZ8RuHRw3ZKrWToLTO_PKWd5REy-Q2ZynJUVw3f5VETogYfxcFhd2CqjLL41Y6mwkTLlSoKX1NpyaeCJRE9XGy6k1Ky_kOraYsuAgkH3I6izEVRY=w408-h305-k-no",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '59%',
  //     solar: '40 lux',
  //     gpsLat:'-25.915799',
  //     gpsLong: '27.927210',
  //     status: 'Online'
  //   },
  //   {
  //     locality: 'Ptn 130 Farm 489 Hennops River',
  //     name: "Gansbaai Lapa",
  //     crops: "Pepeprs, Radhish, Lettuce",
  //     image: "https://lh5.googleusercontent.com/p/AF1QipMnjR_-yreKQRztvKdARMIHrHC1cYrPKWgiyh9C=w408-h304-k-no",
  //     temp: '45C',
  //     soil: '150mm',
  //     humidity: '61%',
  //     solar: '40 lux',
  //     gpsLat:'-25.834368',
  //     gpsLong: '27.952650',
  //     status:'Online'
  //   },]


 //NGX-DATA TABLE
    data = []
    rows = [];
    monitors = [];
    public myreturnvalue;
    public loading;
    public stats = [];
    public urlstatus = {};
    selected = [];
    columns = [
      { prop: 'name' },
      { name: 'Gender' },
      { name: 'Company', sortable: false }
    ];

  // END NGX DATATABLE

  @ViewChild('map') mapElement: ElementRef;
  zoom: number = 1.5;
  
  // initial center position for the map
  lat: number = 23.4162;
  lng: number = 15.6628;

  tracker: string = "Infrigement";

// public geocodeAddress(geocoder, resultsMap) {
//         var address =  document.getElementById('myAddress').innerHTML;
//         geocoder.geocode({'address': address}, function(results, status) {
//           if (status === 'OK') {
//             resultsMap.setCenter(results[0].geometry.location);
//             var marker = new google.maps.Marker({
//               map: resultsMap,
//               position: results[0].geometry.location
//             });
//           } else {
//             alert('Geocode was not successful for the following reason: ' + status);
//           }
//         });
// }
  constructor(public navCtrl: NavController,  public dbService: MysqlService, public loadingCtrl: LoadingController, private myApp: MyAppProvider) {

    // this.goshalas = this.imcpaAppProvider.getGoshalas();
    
    
    // this.monitors=this.farms;

    this.getFarms();
    // this.getStats();
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();  
  }

  markerType(status){
                         
       this.urlstatus = {url: "https://cdn3.iconfinder.com/data/icons/facebook-ui-flat/48/Facebook_UI-07-256.png', scaledSize: {height: 40,width: 40}, labelOrigin:{x:15,y:50}"};

       return this.urlstatus;

     console.log(status);
     if(status === 'Online'){
       this.urlstatus = {url: 'https://www.dev-x.co.za/Projects/PhoenixInstruments/BirdScanner/appImages/green-marker.png'}
       return this.urlstatus;
     }
     else if(status === 'Offline'){
       this.urlstatus = {url: 'https://www.dev-x.co.za/Projects/PhoenixInstruments/BirdScanner/appImages/amber-marker.png'}
       return this.urlstatus;
     }
     else if(status === 'Maintenance'){
       this.urlstatus = {url: 'https://www.dev-x.co.za/Projects/PhoenixInstruments/BirdScanner/appImages/default-marker.png'}
       return this.urlstatus;
     }

  }

  getFarms(){
    this.presentLoading();
    this.dbService.fetchDataV2("SELECT * from farms")
      .map(res => res.json())
      .subscribe(res => {
        this.loading.dismiss();
        this.farms=res.data;
        console.log(this.monitors);
        // console.log("In Json Format: " + res.json())
        
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

      getStats(){
    this.dbService.fetchDataV2("SELECT count(*) as 'totalFarms' from farms union SELECT sum(totalCows) as 'totalCows' from farms union select sum(totalBulls) as 'totalBulls' from farms union SELECT COUNT(DISTINCT region) AS 'totalRegions' FROM farms;")
      .map(res => res.json())
      .subscribe(res => {
          
        this.stats=res.data;
        console.log(this.stats[0].totalFarms)
        this.loading.dismiss();
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }


ionViewDidLoad() {
        //var map = new google.maps.Map(this.mapElement);
         
        //, {
        //  zoom: 8,
        //  center: {lat: -34.397, lng: 150.644}
      //  });

console.log("Getting parti address");
        var geocoder = new google.maps.Geocoder();

console.log("Getting parti address");

        //document.getElementById('submit').addEventListener('click', function() {
          
        //geocodeAddress(geocoder, map);
        var address =  "14 Rockfern Gardens, Rockford, Phoenix, South Africa" ; //document.getElementById('myAddress').value;

        // geocoder.geocode({'address': address}, function(results, status) {
        //   if (status === 'OK') {
        //     this.mapElement.setCenter(results[0].geometry.location);
        //     var marker = new google.maps.Marker({ 
        //       map: this.mapElement,
        //       position: results[0].geometry.location
        //     });
        //   } else {
        //     alert('Geocode was not successful for the following reason: ' + status);
        //   }
        // });

}


onMouseOver(infoWindow, gm) {

        if (gm.lastOpen != null) {
            gm.lastOpen.close();
        }

        gm.lastOpen = infoWindow;

        infoWindow.open();
    }

clickedMarker(g, i) {

  
    // this.navCtrl.push(FarmDashboardPage, {goshala: g})
  // var clickOn = 
  // var goshalaData = this.goshalas.find(x=>x.name = label) 

    // console.log(`clicked the marker: ${label || index}`)
  }
  
  // mapClicked($event: MouseEvent) {
  //   this.markers.push({
  //     lat: $event.coords.lat,
  //     lng: $event.coords.lng,
  //     draggable: true
  //   });
  // }
  
  // markerDragEnd(m: marker, $event: MouseEvent) {
  //   console.log('dragEnd', m, $event);
  // }
  
  // markers: marker[] = [
	//   {
	// 	  lat: -28.356138,
	// 	  lng: 153.31907,
	// 	  label: 'New Govardhan Farm',
	// 	  // draggable: true
	//   },
  //   {
	// 	  lat: 40.494236,
	// 	  lng: -77.464173,
	// 	  label: 'Gita Nagari Farm',
	// 	  draggable: true
	//   },
  //   {
	// 	  lat: 51.665168, 
	// 	  lng: -0.338344,
	// 	  label: 'New Gokul Farm',
	// 	  draggable: true
	//   }
  // ]
}

// just an interface for type safety.
// interface marker {
// 	lat: number;
// 	lng: number;
// 	label?: string;
// 	draggable: boolean;
// }




