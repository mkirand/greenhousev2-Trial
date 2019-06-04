import { Component } from '@angular/core';

import { DashboardPage } from '../dashboard/dashboard';
import { AlertListPage } from '../alerts/alertList/alertList';
import { MonitorListPage } from '../monitors/monitorList/monitorList';
import { StatsPage } from '../stats/stats';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';


@Component({
  // selector: 'page-tabs',
  templateUrl: 'tabs.html',
  // styleUrls: [ 'tabs.scss', '../../theme/variables.scss' ]
})
export class TabsPage {

  tab1Root = DashboardPage;
  tab2Root = StatsPage;
  tab3Root = AlertListPage;
  tab4Root = MonitorListPage;
  tab5Root = MapsPage;
  tab6Root = ReportsPage;
  

  constructor() {

  }
}
