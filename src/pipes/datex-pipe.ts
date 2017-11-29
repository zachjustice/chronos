import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment-timezone';

@Pipe({
  name: 'datex'
})
export class DatexPipe implements PipeTransform {
  transform(value, formatArg, timezoneArg) {
    let timezone = moment.tz.guess()
    let format = undefined;
    if(formatArg) {
      format = formatArg;
    }

    if(timezoneArg) {
      timezone = timezoneArg;
    }

    if(!value) {
      value = new Date();
    }

    let mDate = moment.tz(value, 'GMT').tz(timezone)

    if(!mDate.isValid()){
      console.error("FormatToLocal pipe given invalid date: ", value);
      return value;
    }

    return mDate.format(format);
  }
}
