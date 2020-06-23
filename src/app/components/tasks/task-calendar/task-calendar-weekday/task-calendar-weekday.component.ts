import * as io from 'socket.io-client';
import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../../logic/task-interface';
import {UserInterface} from '../../../users/logic/user-interface';
import {ProjectInterface} from '../../../projects/logic/project-interface';
import {ApiService} from '../../logic/api.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import {MatTabChangeEvent} from "@angular/material/tabs";


@Component({
  selector: 'app-task-calendar-weekday',
  templateUrl: './task-calendar-weekday.component.html',
  styleUrls: ['./task-calendar-weekday.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class TaskCalendarWeekdayComponent implements OnInit, OnDestroy {

  @Input()
  calendarEvents: any;

  calendarPlugins = [dayGridPlugin , timeGridPlugin];
  tasks: TaskInterface[] = [];
  socket = io('http://192.168.110.179:4000');
  monthView = false;
  events = [
    {title: 'event 1', start: '2020-05-10 12:00' , end: '2020-05-10 13:00'},
    {title: 'event 2', start: '2020-05-10 23:00' , end: '2020-05-10 00:00'}
  ];
  options: any;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    //
    // this.options = {
    //   columnHeaderHtml: () => {
    //     return '<b>Friday!</b>';
    //   },
    // };
    //
    // this.getBoards();
    //
    // this.socket.on('update-data', (data: any) => {
    //   this.getBoards();
    // });
  }

  // eventClick(event) {
  //   console.log(event);
  //   event.target.className.includes('fc-dayGridMonthCustom-button') ? this.monthView = true : this.monthView = false;
  // }
  //

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    //console.log(changes.filterBoards , "MamadChange");


    if (changes.calendarEvents && !changes.calendarEvents.firstChange) {
      this.calendarEvents = changes.calendarEvents.currentValue;

    }
  }
}
