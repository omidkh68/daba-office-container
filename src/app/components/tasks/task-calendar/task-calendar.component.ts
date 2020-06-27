import * as io from 'socket.io-client';
import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {ApiService} from '../logic/api.service';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {AppConfig} from '../../../../environments/environment';
import {UserInfoService} from '../../users/services/user-info.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarApi: any;

  @Input()
  filterBoards: any;

  @Input()
  refreshData: boolean = false;

  @Input()
  rtlDirection: boolean;

  tasks: TaskInterface[] = [];
  usersList: UserInterface[] = [];
  loggedInUser: UserContainerInterface;
  projectsList: ProjectInterface[] = [];
  socket = io(AppConfig.SOCKET_URL);
  calendarEvents = [];
  events = [
    {title: 'event 1', start: '2020-05-10 12:00', end: '2020-05-10 13:00'},
    {title: 'event 2', start: '2020-05-10 23:00', end: '2020-05-10 00:00'}
  ];
  options: any;
  viewModeTypes = 'calendar_task';

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private userInfoService: UserInfoService,
              public dialog: MatDialog) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );
  }

  changeViewMode(mode) {
    this.viewModeTypes = mode;
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

  getBoards(resp = null) {
    if (resp) {
      if (resp.result === 1) {
        this.usersList = resp.content.users.list;
        this.projectsList = resp.content.projects.list;
        this.tasks = resp.content.boards.list;

        const calendarEvent = [];

        this.tasks.map(task => {
          const taskEvent = {
            title: task.taskName,
            start: new Date(task.startAt),
            end: new Date(task.stopAt)
          };

          calendarEvent.push(taskEvent);
        });

        this.calendarEvents = calendarEvent;
        setTimeout(() => {
          this.calendarApi.gotoDate(new Date(Date.UTC(2018, 8, 1)))
        }, 3000)
      }
    } else {
      if (this.loggedInUser && this.loggedInUser.email) {
        this._subscription.add(
          this.api.boardsCalendar(this.loggedInUser.email).subscribe((resp: any) => {
            if (resp.result === 1) {
              this.usersList = resp.content.users.list;
              this.projectsList = resp.content.projects.list;
              this.tasks = resp.content.boards.list;

              const calendarEvent = [];

              this.tasks.map(task => {
                const taskEvent = {
                  title: task.taskName,
                  start: new Date(task.startAt),
                  end: new Date(task.stopAt)
                };

                calendarEvent.push(taskEvent);
              });

              this.calendarEvents = calendarEvent;
            }
          })
        );
      }
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
