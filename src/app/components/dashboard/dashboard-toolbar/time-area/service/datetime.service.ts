import {Injectable, Injector} from '@angular/core';
import * as moment from 'jalali-moment';
import {TimezonesList} from '../logic/timezones';
import {LoginDataClass} from '../../../../../services/loginData.class';
import {UserInfoService} from '../../../../users/services/user-info.service';
import {DatetimeInterface} from '../logic/datetime.interface';
import {TimezonesInterface} from '../timezones.interface';

@Injectable({
  providedIn: 'root',
})
export class DatetimeService extends LoginDataClass {
  public timezones: Array<TimezonesInterface> = TimezonesList;
  private weekDaysFa = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  private monthFa = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  private weekDaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private datetime: DatetimeInterface;
  private todayJalali = `${moment().locale('fa').format('D')} ${this.monthFa[moment().locale('fa').format('M')]} ${moment().locale('fa').format('YYYY')}`;
  private todayGregorian = moment().locale('en').format('D') + ' ' + moment().locale('en').format('MMMM') + ' ' + moment().locale('en').format('YYYY');
  private todayJalaliDayName = this.weekDaysFa[new Date().getDay() + 1];
  private todayGregorianDayName = this.weekDaysEn[new Date().getDay()];

  constructor(private injector: Injector, private userInfoService: UserInfoService) {
    super(injector, userInfoService);
  }

  changeDatetimeLabel(rtlDirection: boolean): DatetimeInterface {
    if (rtlDirection) {
      this.datetime = {
        time: '',
        date: this.todayJalali,
        weekday: this.todayJalaliDayName
      };
    } else {
      this.datetime = {
        time: '',
        date: this.todayGregorian,
        weekday: this.todayGregorianDayName
      };
    }

    return this.datetime;
  }

  formatTime(date: string | Date, gmt = false): string {
    const d = new Date(date);
    let hour = gmt ? d.getUTCHours().toString() : d.getHours().toString();
    let min = gmt ? d.getUTCMinutes().toString() : d.getMinutes().toString();

    if (hour.length < 2) hour = '0' + hour;

    if (min.length < 2) min = '0' + min;

    return [hour, min].join(':');
  }

  formatDate(date: string | Date, gmt = false): string {
    const d = new Date(date);
    const year = gmt ? d.getFullYear() : d.getFullYear();
    const month = (gmt ? d.getMonth() + 1 : d.getMonth() + 1);
    const day = gmt ? d.getDate().toString() : d.getDate();
    const tmpMonth = month < 10 ? `0${month}` : `${month}`;
    const tmpDay = day < 10 ? `0${day}` : `${day}`;

    return [year, tmpMonth, tmpDay].join('-');
  }

  convertToGMT(date: string, time: string): string {
    return this.formatDate(new Date(date + ' ' + time), true)
      + ' ' +
      this.formatTime(new Date(date + ' ' + time), true) + ':00';
  }

  getDateByTimezone(date: string, timezone: string): string {
    const _date = new Date(date).toLocaleString('en-US', {timeZone: timezone});

    return this.formatDate(_date) + ' ' + this.formatTime(_date);
  }

  getDateByTimezoneReturnDate(date: string | Date): Date {
    let _date;
    if (typeof date == 'string') {
      _date = new Date(date).toLocaleString('en-US', {timeZone: this.loggedInUser.timezone});
    } else if (typeof date == 'object') {
      _date = date.toLocaleString('en-US', {timeZone: this.loggedInUser.timezone});
    } else {
      _date = new Date().toLocaleString('en-US', {timeZone: this.loggedInUser.timezone});
    }

    return new Date(_date);
  }
}
