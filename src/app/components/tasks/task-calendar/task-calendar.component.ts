import * as io from 'socket.io-client';
import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {ApiService} from '../logic/api.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import {MatTabChangeEvent} from "@angular/material/tabs";


@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class TaskCalendarComponent implements OnInit, OnDestroy {
  calendarPlugins = [dayGridPlugin , timeGridPlugin];
  tasks: TaskInterface[] = [];
  usersList: UserInterface[] = [];
  projectsList: ProjectInterface[] = [];
  socket = io('http://192.168.110.179:4000');
  calendarEvents = [];

  monthView = false;
  events = [
    {title: 'event 1', start: '2020-05-10 12:00' , end: '2020-05-10 13:00'},
    {title: 'event 2', start: '2020-05-10 23:00' , end: '2020-05-10 00:00'}
  ];
  options: any;

  tabs = [
    {
      name: 'تقویم کارکرد',
      icon: 'view_week',
      id: 'calendar_task_rate'
    },
    {
      name: 'تقویم تسک ها',
      icon: 'event_available',
      id: 'calendar_task'
    }
  ];

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarApi: any;

  @Input()
  filterBoards: any;
  @Input()
  refreshData: boolean = false;

  activeTab: number = 0;
  viewModeTypes = 'calendar_task';

  changeViewMode(mode) {
    this.viewModeTypes = mode;
  }

  tabChange(event: MatTabChangeEvent) {
    this.activeTab = event.index;
  }

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.options = {
      columnHeaderHtml: () => {
        return '<b>Friday!</b>';
      },
    };

    this.getBoards();

    this.socket.on('update-data', (data: any) => {
      this.getBoards();
    });
  }

  eventClick(event) {
    console.log(event);
    event.target.className.includes('fc-dayGridMonthCustom-button') ? this.monthView = true : this.monthView = false;
  }


  getBoards(resp = null) {

    if(resp){
      //this._subscription.add(
      if (resp.result === 1) {
        this.usersList = resp.content.users.list;
        this.projectsList = resp.content.projects.list;
        this.tasks = resp.content.boards.list;

        const calendarEvent = [];

        console.log(this.tasks , "Husin");

        this.tasks.map(task => {
          const taskEvent = {
            title: task.taskName,
            start: new Date(task.startAt),
            end: new Date(task.stopAt)
          };

          calendarEvent.push(taskEvent);
        });

        this.calendarEvents = calendarEvent;
        setTimeout( () => {
          this.calendarApi.gotoDate(new Date(Date.UTC(2018, 8, 1)))
        },3000)
        //this.calendarEvents = this.events;
      }
      //);
    }else{
      this._subscription.add(
          this.api.boradsCalendar(1).subscribe((resp: any) => {
            if (resp.result === 1) {
              this.usersList = resp.content.users.list;
              this.projectsList = resp.content.projects.list;
              this.tasks = resp.content.boards.list;

              const calendarEvent = [];

              console.log(this.tasks , "Husin");

              this.tasks.map(task => {
                const taskEvent = {
                  title: task.taskName,
                  start: new Date(task.startAt),
                  end: new Date(task.stopAt)
                };

                calendarEvent.push(taskEvent);
              });

              this.calendarEvents = calendarEvent;
              //this.calendarEvents = this.events;
            }
          })
      );
    }

  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshData) {
      this.socket.emit('updatedata');
    }

    console.log(changes.filterBoards , "MamadChange");


    if (changes.filterBoards && !changes.filterBoards.firstChange) {
      this.filterBoards = changes.filterBoards.currentValue;

      this.getBoards(this.filterBoards.resp);
    }
  }
}
