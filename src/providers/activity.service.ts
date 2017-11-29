import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Activity} from "../models/activity";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ActivityService {
  //private readonly url: string = 'http://localhost:8080/api/';
  private readonly url: string = 'http://timetracker.cfapps.io/api/';

  constructor(public http: HttpClient) {
  }

  get() {
    return this.http.get(`${this.url}/activities`).map((activities: Array<Activity>) => {
      return activities;
    }).catch(this.handleError);
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw(error);
  }
}
