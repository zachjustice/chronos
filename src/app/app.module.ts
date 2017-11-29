import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NewTimeEntryPage } from '../pages/new-time-entry/new-time-entry';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TimeEntryService } from '../providers/time-entry.service';
import {HttpClientModule} from '@angular/common/http';
import {ActivityService} from '../providers/activity.service';
import { FormatToLocalPipe } from '../pipes/format-to-local-pipe';
import { DatexPipe } from '../pipes/datex-pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewTimeEntryPage,
    FormatToLocalPipe,
    DatexPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewTimeEntryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TimeEntryService,
    ActivityService
  ]
})
export class AppModule {}
