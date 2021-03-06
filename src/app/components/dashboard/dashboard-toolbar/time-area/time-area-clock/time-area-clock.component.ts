import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TimezonesInterface} from '../timezones.interface';

@Component({
  selector: 'app-time-area-clock',
  templateUrl: './time-area-clock.component.html',
  styleUrls: ['./time-area-clock.component.scss']
})
export class TimeAreaClockComponent implements OnInit, AfterViewInit {
  @ViewChild('clock') clock: ElementRef;
  @ViewChild('hours') hours: ElementRef;
  @ViewChild('seconds') seconds: ElementRef;
  @ViewChild('minutes') minutes: ElementRef;

  @Input()
  rtlDirection = false;

  @Input()
  checkMoreClock: boolean;

  @Input()
  cityClocksList: Array<TimezonesInterface>;

  @Input()
  item_index: number;

  @Input()
  item: TimezonesInterface;

  degrees = 360;
  seconds_angle = 0;
  minutes_angle = 0;
  hours_angle = 0;

  ngOnInit(): void {
    this.item.city = this.item.city.replace('_', ' ');
  }

  removeClock = (event: Event): void => {
    event.stopPropagation();

    if (this.item_index != 0) {
      this.cityClocksList.splice(this.item_index, 1);
    }
  };

  init = (): void => {
    this.createIndicators();
    this.setHands();
    setInterval(this.runClock, 1000);
  };

  setHands = (): void => {
    const _date = new Date().toLocaleTimeString('en-US', {timeZone: this.item.timezone, hour12: false});
    const date = _date.split(':');

    const current_hour = parseInt(date[0]) - 12;
    const current_minute = parseInt(date[1]);
    const current_second = parseInt(date[2]);

    this.hours_angle = current_hour * 30 + (current_minute - current_minute % 15) / 15 * 6;
    this.minutes_angle = current_minute * 6;
    this.seconds_angle = current_second * 6;

    this.hours.nativeElement.style.transform = `rotate(${this.hours_angle}deg)`;
    this.minutes.nativeElement.style.transform = `rotate(${this.minutes_angle}deg)`;
    this.seconds.nativeElement.style.transform = `rotate(${this.seconds_angle}deg)`;
  };

  runClock = (): void => {
    this.seconds.nativeElement.style.transform = `rotate(${this.seconds_angle}deg)`;

    if (this.seconds_angle == this.degrees) {
      this.seconds_angle = 0;

      this.seconds.nativeElement.addEventListener('transitionend', this.controlBouncing);

      this.minutes_angle += (this.degrees / 60);

      this.minutes.nativeElement.style.transform = `rotate(${this.minutes_angle}deg)`;

      if (this.minutes_angle % 15 == 0) {
        this.hours_angle += 6;
        this.hours.nativeElement.style.transform = `rotate(${this.hours_angle}deg)`;
      }
    } else {
      this.seconds_angle += (this.degrees / 60);
    }
  };

  controlBouncing = (): void => {
    this.seconds.nativeElement.classList.add('no-transition');
    this.seconds.nativeElement.style.transform = `rotate(${this.seconds_angle}deg)`;

    setTimeout(() => this.seconds.nativeElement.classList.remove('no-transition'), 200);

    this.seconds.nativeElement.removeEventListener('transitionend', this.controlBouncing);
    this.seconds_angle += (this.degrees / 60);
  };

  createIndicators = (): void => {
    for (let i = 0; i < 60; i++) {
      const indicator = document.createElement('div');

      indicator.classList.add('seconds-indicator');

      indicator.style.transform = `rotate(${i * 6}deg)`;

      if (i % 5 == 0) {
        indicator.classList.add('seconds-indicator--fifth');
      }

      this.clock.nativeElement.appendChild(indicator);
    }
  };

  ngAfterViewInit(): void {
    this.init();
  }
}
