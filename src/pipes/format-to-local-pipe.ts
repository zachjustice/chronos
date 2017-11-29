import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment-timezone';

@Pipe({
  name: 'formatToLocal'
})
export class FormatToLocalPipe implements PipeTransform {
  transform(value, originTimezoneArg, localTimezoneArg) {
    let localTimezone = moment.tz.guess();
    let originTimezone = 'GMT';

    if(originTimezoneArg) {
      originTimezone = originTimezoneArg;
    }

    if(localTimezoneArg) {
      localTimezone = localTimezoneArg;
    }

    if(!value) {
      value = new Date();
    }

    let mDate = moment.tz(value, originTimezone).tz(localTimezone);

    if(!mDate.isValid()){
      console.error("FormatToLocal pipe given invalid date: ", value);
      return value;
    }

    return mDate.format()
  }
}
