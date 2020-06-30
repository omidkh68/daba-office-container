import * as io from 'socket.io-client';
import {Component, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../../logic/task-interface';

@Component({
  selector: 'app-task-calendar-weekday',
  templateUrl: './task-calendar-weekday.component.html',
  styleUrls: ['./task-calendar-weekday.component.scss'],
  encapsulation: ViewEncapsulation.None
})
  export class TaskCalendarWeekdayComponent implements OnDestroy {
  @Input()
  calendarEvents: any;

  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  tasks: TaskInterface[] = [];
  events = [
    {title: 'event 1', start: '2020-05-10 12:00', end: '2020-05-10 13:00'},
    {title: 'event 2', start: '2020-05-10 23:00', end: '2020-05-10 00:00'}
  ];
  options: any;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog) {
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  eventClick(event){
    console.log(event);
  }
}
