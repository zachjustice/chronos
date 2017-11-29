import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {TimeEntry} from "../../models/time-entry";
import {TimeEntryService} from "../../providers/time-entry.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivityService} from "../../providers/activity.service";
import {Activity} from "../../models/activity";

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import * as moment from 'moment-timezone';

@Component({
  selector: 'page-new-time-entry',
  templateUrl: 'new-time-entry.html'
})
export class NewTimeEntryPage {
  public timeEntry: TimeEntry = {};
  public timeEntries: Array<TimeEntry> = [];
  public timeEntryForm: FormGroup;
  public saveText: string = "Save";
  public activities: Array<Activity>;
  public started: string = '';
  public ended: string = '';

  private readonly timestampFormat: string = 'YYYY-MM-DD HH:mm:ss';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timeEntryService: TimeEntryService,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public activityService: ActivityService
  ) {
      // If we navigated to this page, we will have an item available as a nav param
      this.timeEntryForm = formBuilder.group({
        comment: ['', Validators.required],
        activity: ['', Validators.required],
        started: [''],
        ended: [''],
      });

      this.timeEntries = this.navParams.get('timeEntries');

      let timeEntry = this.navParams.get('timeEntry');
      if(timeEntry) {
        this.timeEntry = timeEntry;
        this.timeEntryForm.controls['comment'].setValue(this.timeEntry.comment);
        this.timeEntryForm.controls['activity'].setValue(this.timeEntry.activity.id);
        this.timeEntryForm.controls['started'].setValue(this.timeEntry.started);
        this.timeEntryForm.controls['ended'].setValue(this.timeEntry.ended);
        this.started = this.timeEntry.started;
        this.ended = this.timeEntry.ended;
      }
  }

  ionViewDidLoad() {
    this.getTimeEntries().subscribe((timeEntries) => {
      if(!this.timeEntry || !this.timeEntry.started) {
        this.setStart(timeEntries);
      }
    });

    this.activityService.get().subscribe((activities) => {
        this.activities = activities;
      },
      error => {
        console.error(error);
        const toast = this.toastController.create({
          //title: 'Error!',
          message: 'Couldn\'t load activities',
          duration: 3000,
          position: 'bottom'
        });

        toast.present(toast);
      })
  }

  getTimeEntries() {
    let s = new Subject();
    this.timeEntryService.get().subscribe((timeEntries) => {
      this.timeEntries = timeEntries;
      s.next(this.timeEntries);
      s.complete();
    }, error => {
      const toast = this.toastController.create({
        //title: 'Error!',
        message: 'Could not load time entries, so now that "set time" button will not work and we can\'t set the start time to the last entry\'s end time :(',
        duration: 3000,
        position: 'bottom'
      });

      toast.present(toast);
      Observable.throw(error);
    });

    return s.asObservable();
  }

  setStart(timeEntries) {
    let currIndex = -1;
    // get the previous time entry
    if(this.timeEntry.started) {
      for(let i = 0; i < this.timeEntries.length; i++) {
        if(this.timeEntry.id == this.timeEntries[i].id) {
          currIndex = i;
        }
      }
    }

    // set start time to the previous time entry's end time
    // if there's no previous time entry, use the most recent time entry
    currIndex += 1;
    let endTime = timeEntries[currIndex].ended;
    if(endTime) {
      let mDate = moment.tz(endTime, 'GMT').tz('America/New_York');
      this.started = mDate.format();
    }
  }

  submit() {
    if (!this.timeEntryForm.valid) {
      console.error("Invalid form", this.timeEntryForm);
      const toast = this.toastController.create({
        //title: 'Error!',
        message: 'Invalid time entry',
        duration: 3000,
        position: 'bottom'
      });

      toast.present(toast);
    }

    let activityId = this.timeEntryForm.controls['activity'].value;
    let comment    = this.timeEntryForm.controls['comment'].value;
    let started    = this.timeEntryForm.controls['started'].value;
    let ended      = this.timeEntryForm.controls['ended'].value;

    // all timestamps converted GMT for db
    started = moment(started).tz('GMT').format(this.timestampFormat);
    ended = moment(ended).tz('GMT').format(this.timestampFormat);

    let activity: Activity = this.activities.find((activity: Activity) => {
      return activity.id == activityId;
    });

    this.timeEntry.comment = comment;
    this.timeEntry.started = started;
    this.timeEntry.ended = ended;
    this.timeEntry.activity = activity;

    this.timeEntryService.create(this.timeEntry)
      .subscribe((timeEntry: TimeEntry) => {
          this.saveText = "Saved!";
          const toast = this.toastController.create({
            //title: 'Error!',
            message: 'Saved!',
            duration: 3000,
            position: 'bottom'
          });

          toast.present(toast);
        },
        (error) => {
          console.error(error);
          const toast = this.toastController.create({
            //title: 'Error!',
            message: 'Failed to save time',
            duration: 3000,
            position: 'bottom'
          });

          toast.present(toast);
        });
  }

  delete() {
    this.timeEntryService.delete(this.timeEntry)
    .subscribe((timeEntry: TimeEntry) => {
      this.timeEntry.id = null;
      const toast = this.toastController.create({
        //title: 'Error!',
        message: 'Deleted!',
        duration: 3000,
        position: 'bottom'
      });

      toast.present(toast);
    },
    (error) => {
      console.error(error);
      const toast = this.toastController.create({
        //title: 'Error!',
        message: 'Failed to delete entry',
        duration: 3000,
        position: 'bottom'
      });

      toast.present(toast);
    });
  }
}
