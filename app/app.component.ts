import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
// RxJS
import { ReplaySubject } from "rxjs/ReplaySubject";
import { ArrayObservable } from "rxjs/observable/ArrayObservable";

// Ionic
import { Nav, Platform, MenuController, AlertController, App,} from 'ionic-angular';

// Models
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content.component';
import { SideMenuSettings } from './../shared/side-menu-content/models/side-menu-settings';
import { MenuOptionModel } from './../shared/side-menu-content/models/menu-option-model';

import { MyAppProvider } from '../services/myAppProvider';

import { LoginPage } from '../pages/login/login';
import { CapturePhotoPage } from '../pages/capturePhoto/capturePhoto';

import { TabsPage } from '../pages/tabs/tabs';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AlertListPage } from '../pages/alerts/alertList/alertList';
import { MonitorListPage } from '../pages/monitors/monitorList/monitorList';
import { StatsPage } from '../pages/stats/stats';
import { MapsPage } from '../pages/maps/maps';
import { ReportsPage } from '../pages/reports/reports';



@Component({
  templateUrl: 'app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

	// Get the instance to call the public methods
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

	public rootPage: any = LoginPage;

	// Options to show in the SideMenuComponent
	public options: Array<MenuOptionModel>;

	// Settings for the SideMenuComponent
	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: true,
		selectedOptionClass: 'my-selected-option',
    subOptionIndentation: {
      md: '56px',
      ios: '64px',
      wp: '56px'
    }
	};

  // public user = {};

  private unreadCountObservable: any = new ReplaySubject<number>(0);

  constructor(private platform: Platform,
				      private alertCtrl: AlertController,
				      private menuCtrl: MenuController,
              public myApp: MyAppProvider,
              public app: App) {
    // this.user = this.myApp.user;
    // console.log(this.myApp.user)
		this.initializeApp();
    // console.log(this.myApp.user[0].full_name);
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Initialize some options
			this.initializeOptions();
		});
    // Change the value for the batch every 5 seconds
		setInterval(() => {
			this.unreadCountObservable.next(Math.floor(Math.random() * 10));
		}, 5000);
	}

  goToCapturePhotoPage(){
    let date = new Date().toJSON().slice(0, 19).replace('T', ' ')
    let filename = this.myApp.user.id + "BEProfile.jpg"
    let mysql = "update access_control set u_imageTimeStamp = '" + date + "', profilepic = '" + filename + "' where id = " + this.myApp.user.id;
    this.menuCtrl.close().then(() => {
    this.navCtrl.push(CapturePhotoPage, {user: this.myApp.user, mysql: mysql, filename: filename });
    });
  }

	private initializeOptions(): void {
		this.options = [{
			iconName: 'apps',
			displayName: 'Dashboard',
			component: DashboardPage,
			index: 0,
			// This option is already selected
			selected: true
		},
    {
			iconName: 'ios-nutrition',
			displayName: 'Crops',
      // badge: sdfdfljdsf,
			component: AlertListPage,
      
      index: 1,
		},
    {
			iconName: 'md-home',
			displayName: 'Farms',
			component: MonitorListPage,
      index: 2,
		},
    {
			iconName: 'stats',
			displayName: 'Stats',
			component: StatsPage,
      index: 3
		},
    {
			iconName: 'md-globe',
			displayName: 'Maps',
			component: MapsPage,
      index: 4
		},
    {
			iconName: 'clipboard',
			displayName: 'Seed Bank',
			component: ReportsPage,
      index: 5
		},

    // {
		// 	displayName: 'Asset Management',
		// 	subItems: [
		// 		{
		// 			iconName: 'basket',
		// 			displayName: 'Stock',
		// 			component: DetailsPage
		// 		},
		// 		{
		// 			iconName: 'bookmark',
		// 			displayName: 'License',
		// 			component: LicenseListPage,
    //       index: undefined
		// 		},
    //     {
		// 			iconName: 'bug',
		// 			displayName: 'contract',
		// 			// badge: this.unreadCountObservable,
		// 			component: DetailsPage
		// 		},
		// 		{
		// 			iconName: 'bookmark',
		// 			displayName: 'Fines',
		// 			component: DetailsPage
		// 		},
		// 	]
		// },

    // {
		// 	iconName: 'apps',
		// 	displayName: 'Asset Management',
		// 	component: DetailsPage
		// },
    // {
		// 	iconName: 'bowtie',
		// 	displayName: 'dkjflsjka',
		// 	badge: ArrayObservable.of('NEW'),
		// 	component: DetailsPage
		// },
    ,{
			displayName: 'Log Out',
			subItems: [
				// {
				// 	iconName: 'log-in',
				// 	displayName: 'Login',
				// 	custom: {
				// 		isLogin: true
				// 	}
				// },
				{
					iconName: 'log-out',
					displayName: 'Logout',
					custom: {
						isLogout: true
					}
				},
				// {
				// 	iconName: 'globe',
				// 	displayName: 'Open Google',
				// 	custom: {
				// 		isExternalLink: true,
				// 		externalUrl: 'http://www.google.com'
				// 	}
				// }
			]
		}]
	}
  public selectOption(option: MenuOptionModel): void {
		this.menuCtrl.close().then(() => {

			if (option.custom && option.custom.isLogin) {
				this.presentAlert('You\'ve clicked the login option!');
			} else if (option.custom && option.custom.isLogout) {
				this.presentAlert('You\'ve clicked the logout option!');
			} else if(option.custom && option.custom.isExternalLink) {
				let url = option.custom.externalUrl;
				window.open(url, '_blank');
			} else if(this.navCtrl.getActiveChildNavs() && option.index != undefined){
        this.navCtrl.getActiveChildNavs()[0].select(option.index);
      } 
      // else if(!option.index) {
			// 	// Redirect to the selected page
			// 	this.app.getActiveNavs()[0].setRoot(DetailsPage, { 'title': option.displayName });
			// } 
      else {
        this.app.getActiveNavs()[0].setRoot(option.component, { tabIndex: option.index, 'title': option.displayName });
      }
		});
	}

	public collapseMenuOptions(): void {
		// Collapse all the options
		this.sideMenu.collapseAllOptions();
	}

	public presentAlert(message: string): void {
		let alert = this.alertCtrl.create({
			title: 'LogOut',
			message: 'Are Sure You Want to Log Out',
			buttons: [ {
          text: 'Cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.setRoot(LoginPage)
          }
        }]
		});
		alert.present();
	}
}
