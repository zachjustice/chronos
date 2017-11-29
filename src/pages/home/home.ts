import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {TimeEntry} from "../../models/time-entry";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TimeEntryService} from "../../providers/time-entry.service";
import {Activity} from "../../models/activity";
import {ActivityService} from "../../providers/activity.service";
import { NewTimeEntryPage } from '../new-time-entry/new-time-entry';

import {Subject} from "rxjs/Subject";
import * as moment from 'moment-timezone';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public timeEntry: TimeEntry = {};
  public activities: Array<Activity>;
  public timeEntryForm: FormGroup;
  public timeEntries: Array<TimeEntry> = [];

  private readonly timestampFormat: string = 'YYYY-MM-DD HH:mm:ss';

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public timeEntryService: TimeEntryService,
    public activityService: ActivityService
  ) {
    this.timeEntryForm = formBuilder.group({
      comment: ['', Validators.required],
      activity: ['', Validators.required]
    });
  }

  doRefresh(refresher) {
    this.getTimeEntries().subscribe(() => {
      if(this.timeEntries.length > 0 && this.timeEntries[0].ended) {
          this.timeEntry = {}; 
      }
      refresher.complete()
    });
  }

  ionViewDidLoad() {
    this.getTimeEntries();

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
    let subject = new Subject();
    this.timeEntryService.get().subscribe((timeEntries) => {
      this.timeEntries = timeEntries;

      if(this.timeEntries.length > 0 && !this.timeEntries[0].ended) {
        this.timeEntry = this.timeEntries[0];
        this.timeEntryForm.controls['activity'].setValue(this.timeEntry.activity.id);
        this.timeEntryForm.controls['comment'].setValue(this.timeEntry.comment);
      }

      subject.next();
      subject.complete();
    }, error => {
      subject.next();
      subject.complete();
    });

    return subject.asObservable();
  }

  startTimeEntry() {
    if(!this.timeEntryForm.valid) {
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
    let activity: Activity = this.activities.find((activity: Activity) => {
      return activity.id == activityId;
    });

    this.timeEntry.activity = activity;
    this.timeEntry.started  = moment().tz('GMT').format(this.timestampFormat);
    this.timeEntry.comment  = this.timeEntryForm.controls['comment'].value;

    this.timeEntryService.create(this.timeEntry)
      .subscribe((timeEntry: TimeEntry) => {
          this.timeEntry = timeEntry;
          this.timeEntries.unshift(this.timeEntry);
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

  stopTimeEntry() {
    if(!this.timeEntryForm.valid) {
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
    let activity: Activity = this.activities.find((activity: Activity) => {
      return activity.id == activityId;
    });

    this.timeEntry.ended = moment().tz('GMT').format(this.timestampFormat);
    this.timeEntry.comment = this.timeEntryForm.controls['comment'].value;
    this.timeEntry.activity = activity;

    this.timeEntryService.update(this.timeEntry)
      .subscribe((timeEntry: TimeEntry) => {
          const toast = this.toastController.create({
            //title: 'Error!',
            message: 'Done',
            duration: 3000,
            position: 'bottom'
          });

          toast.present(toast);
          this.timeEntry = {};
        },
        (error) => {
          console.error(error);
          const toast = this.toastController.create({
            //title: 'Error!',
            message: 'Something went wrong to updating time',
            duration: 3000,
            position: 'bottom'
          });

          toast.present(toast);
        });
  }

  timeDiff(started: string, ended: string) {
    if(started && ended) {
      let duration = moment.duration(moment(ended).diff(started));
      var hours = Math.floor(duration.asMinutes()/60);
      var minutes = Math.round(duration.asMinutes()-hours*60);
      return `${hours}h ${minutes}m`
    } else {
      return 'Ongoing'
    }
  }

  goToEditNewTimeEntry(timeEntry: TimeEntry) {
    this.navCtrl.push(NewTimeEntryPage, {
      timeEntry: timeEntry
    })
  }
}
