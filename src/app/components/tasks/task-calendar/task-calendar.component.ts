import * as io from 'socket.io-client';
import {Component, OnDestroy, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {ApiService} from '../logic/api.service';
import {AppConfig} from '../../../../environments/environment';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss']
})
export class TaskCalendarComponent implements OnInit, OnDestroy {
  calendarPlugins = [dayGridPlugin];
  tasks: TaskInterface[] = [];
  usersList: UserInterface[] = [];
  projectsList: ProjectInterface[] = [];
  // socket = io(AppConfig.socketUrl);
  calendarEvents = [];
  events = [
    {title: 'event 1', date: '2020-04-01'},
    {title: 'event 2', date: '2020-04-02'}
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getBoards();

    /*this.socket.on('update-data', (data: any) => {
      this.getBoards();
    });*/
  }

  getBoards() {
    this._subscription.add(
      this.api.boards(1).subscribe((resp: any) => {
        if (resp.result === 1) {
          this.usersList = resp.content.users.list;
          this.projectsList = resp.content.projects.list;
          this.tasks = resp.content.boards.list;

          const calendarEvent = [];

          this.tasks.map(task => {
            const taskEvent = {
              title: task.taskName,
              start: task.startAt,
              end: task.stopAt
            };

            calendarEvent.push(taskEvent);
          });

          this.calendarEvents = calendarEvent;
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
