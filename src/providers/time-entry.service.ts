import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {TimeEntry} from "../models/time-entry";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class TimeEntryService {
  //private readonly url: string = 'http://localhost:8080/api/';
  private readonly url: string = 'http://timetracker.cfapps.io/api/';

  constructor(public http: HttpClient) {
  }

  create(timeEntry: TimeEntry) {
    return this.http.post(`${this.url}/time`, timeEntry).map((timeEntry: TimeEntry) => {
      return timeEntry;
    }).catch(this.handleError);
  }

  update(timeEntry: TimeEntry) {
    return this.http.put(`${this.url}/time/${timeEntry.id}`, timeEntry).map((timeEntry: TimeEntry) => {
      return timeEntry;
    }).catch(this.handleError);
  }

  delete(timeEntry: TimeEntry) {
    return this.http.delete(`${this.url}/time/${timeEntry.id}`).map((timeEntry: TimeEntry) => {
      return timeEntry;
    }).catch(this.handleError);
  }

  get() {
    return this.http.get(`${this.url}/time`).map((timeEntries: Array<TimeEntry>) => {
      return timeEntries;
    }).catch(this.handleError);
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw(error);
  }
}
