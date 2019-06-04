import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
// import { Storage } from '@ionic/storage';

import { AgmCoreModule } from '@agm/core';
import {WebcamModule} from 'ngx-webcam';
import { FileHelpersModule } from 'ngx-file-helpers';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileDropzoneComponent } from '../components/file-dropzone/file-dropzone';
import { SideMenuContentComponent } from '../shared/side-menu-content/side-menu-content.component';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { ExcelService } from '../services/excel.services';
import {MysqlService} from '../services/mysql.service';
import {EncryptionService} from '../services/encryption.service';
import {MyAppProvider} from '../services/myAppProvider';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { StatsPage } from '../pages/stats/stats';
import { MapsPage } from '../pages/maps/maps';
import { ReportsPage } from '../pages/reports/reports';

import { AlertListPage } from '../pages/alerts/alertList/alertList';
import { AlertModalPage } from '../pages/alerts/alertModal/alertModal';

import { MonitorListPage } from '../pages/monitors/monitorList/monitorList';
import { MonitorModalPage } from '../pages/monitors/monitorModal/monitorModal';

import { UpdateVehiclePage } from '../pages/updateVehicle/updateVehicle';
import { AddVehiclePage } from '../pages/addVehicle/addVehicle';
import { CapturePhotoPage } from '../pages/capturePhoto/capturePhoto';

import { LicenseListPage } from '../pages/license/licenseList/licenseList';
import { AddLicensePage } from '../pages/license/addLicense/addLicense';

// import { IonTextAvatar } from 'ionic-text-avatar';

// videogular
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import {SingleMediaPlayer} from 'single-media-player';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    DashboardPage,
    StatsPage,
    MapsPage,
    ReportsPage,

    AlertListPage,
    AlertModalPage,

    MonitorListPage,
    MonitorModalPage,

    UpdateVehiclePage,
    AddVehiclePage,
    CapturePhotoPage,

    LicenseListPage,
    AddLicensePage,

    FileDropzoneComponent,
    SideMenuContentComponent
  ],
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    BrowserModule,
    HttpModule,
    WebcamModule,
    FileHelpersModule,
    ImageCropperModule,
    IonicModule.forRoot(MyApp),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyBAAwcL0UHj5ONipvHzP_LrVHesfrw5i6g'
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    DashboardPage,
    StatsPage, 
    MapsPage,
    ReportsPage,

    AlertListPage,
    AlertModalPage,

    MonitorModalPage,
    MonitorListPage,

    UpdateVehiclePage,
    AddVehiclePage,
    CapturePhotoPage,

    LicenseListPage,
    AddLicensePage

  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ExcelService, 
    MysqlService,
    EncryptionService,
    MyAppProvider
  ]
})
export class AppModule {}
