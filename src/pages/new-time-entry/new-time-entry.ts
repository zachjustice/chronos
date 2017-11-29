import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {TimeEntry} from "../../models/time-entry";
import {TimeEntryService} from "../../providers/time-entry.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivityService} from "../../providers/activity.service";
import {Activity} from "../../models/activity";

import * as moment from 'moment-timezone';

@Component({
  selector: 'page-new-time-entry',
  templateUrl: 'new-time-entry.html'
})
export class NewTimeEntryPage {
  public timeEntry: TimeEntry = {};
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
