import {Component, Input, OnInit, Renderer2, SimpleChanges} from '@angular/core';
// import {UserInterface} from '../../../users/logic/user-interface';
import {DatetimeService} from './service/datetime.service';
import {DatetimeInterface} from './logic/datetime.interface';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

import {map, startWith} from 'rxjs/operators';
import {Timezones} from './timezones.interface';
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
  graduations: Array<number> = new Array(60);

  checkMoreClock: boolean;
  checkMoreClockContent: boolean;
  cityClocksList: Timezones[];
  item: number;

  myControl = new FormControl();
  options: Timezones[];
  filteredOptions: Observable<Timezones[]>;


  displayFn(timezone: Timezones): string {
    return timezone && timezone.city ? timezone.city : '';
  }

  private _filter(name: string): Timezones[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.city.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(private render: Renderer2, private datetimeService: DatetimeService) {
    this.checkMoreClock = false;
    this.options = datetimeService.aryIannaTimeZones;
    this.cityClocksList = [{city: 'Tehran', timezone: 'Asia/Tehran'}]
  }

  addMoreClock(event) {
    event.stopPropagation();
    this.checkMoreClock = this.checkMoreClock ? false : true;
  }

  showMoreClockContent(event) {
    event.stopPropagation();
    this.checkMoreClockContent = true;
  }

  setClockCity(option) {
    this.checkMoreClock = false;
    this.checkMoreClockContent = false;
    this.cityClocksList.push(option)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDateTime();
  }

  getDateTime(): void {
    this.datetime = this.datetimeService.changeDatetimeLabel(this.rtlDirection);
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.init();
  }

  init = () => {
    setInterval(()=>{
      const _time = new Date().toLocaleTimeString("en-US", {timeZone: this.cityClocksList[0].timezone , hour12: false});
      this.datetime.time = _time;
    },1000);
  }

}
