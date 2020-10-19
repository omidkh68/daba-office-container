import {Component, Input, OnInit, Renderer2, SimpleChanges} from '@angular/core';
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
  rtlDirection: boolean;

  datetime: DatetimeInterface;

  checkMoreClock: boolean = false;
  checkMoreClockContent: boolean = false;
  cityClocksList: TimezonesInterface[];
  item: number;
  currentTimezone: string;

  myControl = new FormControl();
  options: TimezonesInterface[];
  filteredOptions: Observable<TimezonesInterface[]>;

  private _subscription: Subscription = new Subscription();

  constructor(private render: Renderer2,
              public dateTimeService: DatetimeService,
              private userInfoService: UserInfoService) {
    this.checkMoreClock = false;

    this.options = dateTimeService.timezones;

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

  displayFn(timezone: TimezonesInterface): string {
    return timezone && timezone.city ? timezone.city : '';
  }

  onEnter(evt: any){
    console.log(evt);
    /*if (evt.source.selected) {
      alert("hello ");
    }*/
  }

  setClockCity(option) {
    this.checkMoreClock = false;
    this.checkMoreClockContent = false;
    if (this.cityClocksList.some(item => item.timezone !== option.timezone)) {
      this.cityClocksList.push(option)
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDateTime();
  }

  getDateTime(): void {
    this.datetime = this.dateTimeService.changeDatetimeLabel(this.rtlDirection);
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filter(name) : this.options.slice())
      );
  }

  init() {
    setInterval(() => {
      this.datetime.time = new Date().toLocaleTimeString('en-US', {
        timeZone: this.cityClocksList[0].timezone,
        hour12: false
      });
    }, 1000);
  }

  private filter(name: string): TimezonesInterface[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.city.toLowerCase().indexOf(filterValue) === 0);
  }

}
