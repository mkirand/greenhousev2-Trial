import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
  styleUrls: [ 'stats.scss', '../../theme/variables.scss' ]
})
export class StatsPage {

  public sensor = {
    temp: '45C',
    soil: '150mm',
    humidity: '60%',
    solar: '40 lumens'
  }

  constructor(public navCtrl: NavController) {

  }

}
