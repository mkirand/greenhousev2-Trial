import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
// import "rxjs/add/operator/map";

@Injectable()
export class MyAppProvider {
  
  public user = {};

  public openCount = 0;
  public acceptedCount = 0;
  public rejectedCount = 0;
  public investigateCount = 0;

  constructor(public http: Http) {

    
  }




}
