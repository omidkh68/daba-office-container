import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {TimezonesInterface} from './timezones.interface';
import {Observable} from 'rxjs/internal/Observable';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {map, startWith} from 'rxjs/operators';
import {DatetimeService} from './service/datetime.service';
import {UserInfoService} from '../../../users/services/user-info.service';
import {DatetimeInterface} from './logic/datetime.interface';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';

@Component({
  selector: 'app-time-area',
  templateUrl: './time-area.component.html',
  styleUrls: ['./time-area.component.scss']
})
export class TimeAreaComponent implements OnInit {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection = false;

  datetime: DatetimeInterface;
  checkMoreClock = false;
  checkMoreClockContent = false;
  cityClocksList: Array<TimezonesInterface>;
  item: number;
  currentTimezone: string;
  myControl = new FormControl();
  options: Array<TimezonesInterface>;
  filteredOptions: Observable<Array<TimezonesInterface>>;

  private _subscription: Subscription = new Subscription();

  constructor(private render: Renderer2,
              private datetimeService: DatetimeService,
              private userInfoService: UserInfoService) {
    this.checkMoreClock = false;

    this.options = datetimeService.timezones;

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => {
        this.loggedInUser = user;

        if (!this.loggedInUser.timezone) {
          this.loggedInUser.timezone = 'Asia/Tehran';
        }

        this.currentTimezone = this.loggedInUser.timezone.split('/')[1].replace('_', ' ');

        this.cityClocksList = [{city: this.loggedInUser.timezone.split('/')[1], timezone: this.loggedInUser.timezone}];

        this.init();
      })
    );
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filter(name) : this.options.slice())
      );
  }

  displayFn(timezone: TimezonesInterface): string {
    return timezone && timezone.city ? timezone.city : '';
  }

  setClockCity(option: TimezonesInterface): void {
    this.checkMoreClock = false;
    this.checkMoreClockContent = false;

    if (this.cityClocksList.some(item => item.timezone !== option.timezone)) {
      this.cityClocksList.push(option);
    }
  }

  ngOnChanges(): void {
    this.getDateTime();
  }

  getDateTime(): void {
    this.datetime = this.datetimeService.changeDatetimeLabel(this.rtlDirection);
  }

  init(): void {
    setInterval(() => {
      this.datetime.time = new Date().toLocaleTimeString('en-US', {
        timeZone: this.cityClocksList[0].timezone,
        hour12: false
      });
    }, 1000);
  }

  private filter(name: string): Array<TimezonesInterface> {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.city.toLowerCase().indexOf(filterValue) === 0);
  }
}
