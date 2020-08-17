import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-time-area-digital-clock',
  templateUrl: './time-area-digital-clock.component.html',
  styleUrls: ['./time-area-digital-clock.component.scss']
})
export class TimeAreaDigitalClockComponent implements OnInit {
  @Input()
  timezone: string;

  time: string;

  constructor() {
  }

  ngOnInit(): void {
    this.time = new Date().toLocaleTimeString('en-US', {
      timeZone: this.timezone.length ? this.timezone : 'UTC',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
