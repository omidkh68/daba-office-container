import {DatetimeInterface} from '../logic/datetime.interface';
import {Injectable, Pipe} from '@angular/core';
import * as moment from 'jalali-moment';
import {TimezonesInterface} from '../timezones.interface';
import {TimezonesList} from '../logic/timezones';

@Pipe({
  name: 'jalali'
})

@Injectable({
  providedIn: 'root',
})
export class DatetimeService {
  public timezones: TimezonesInterface[] = TimezonesList;

  private weekDaysFa = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  private monthFa = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  private weekDaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private datetime: DatetimeInterface;
  private todayJalali = moment().locale('fa').format('D') + ' ' + this.monthFa[moment().locale('fa').format('M')] + ' ' + moment().locale('fa').format('YYYY');
  private todayGregorian = moment().locale('en').format('D') + ' ' + moment().locale('en').format('MMMM') + ' ' + moment().locale('en').format('YYYY');
  private todayJalaliDayName = this.weekDaysFa[new Date().getDay() + 1];
  private todayGregorianDayName = this.weekDaysEn[new Date().getDay()];

  changeDatetimeLabel(rtlDirection: boolean) {
    if (rtlDirection) {
      this.datetime = {
        time: '',
        date: this.todayJalali,
        weekday: this.todayJalaliDayName
      }
    } else {
      this.datetime = {
        time: '',
        date: this.todayGregorian,
        weekday: this.todayGregorianDayName
      }
    }

    return this.datetime;
  }

  formatTime(date, gmt: boolean = false) {
    let d = new Date(date),
        hour = '' + (gmt ? d.getUTCHours().toString() : d.getHours().toString()),
        min = '' + gmt ? d.getUTCMinutes().toString() : d.getMinutes().toString();

    if (hour.length < 2) hour = '0' + hour;

    if (min.length < 2) min = '0' + min;

    return [hour, min].join(':');
  }

  formatDate(date, gmt: boolean = false) {
    let d = new Date(date),
        month = '' + (gmt ? d.getUTCMonth() + 1 : d.getMonth() + 1),
        day = '' + gmt ? d.getUTCDate().toString() : d.getDate().toString(),
        year = gmt ? d.getUTCFullYear() : d.getFullYear();

    if (month.length < 2) month = '0' + month;

    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  convertToGMT(date: string, time: string) {
    return this.formatDate(new Date(date + ' ' + time), true)
      + ' ' +
      this.formatTime(new Date(date + ' ' + time), true) + ':00';
  }

  getDateByTimezone(date: string, timezone: string) {
    let _date = new Date(date).toLocaleString('en-US', {timeZone: timezone});

    return this.formatDate(_date) + ' ' + this.formatTime(_date);
  }
}
