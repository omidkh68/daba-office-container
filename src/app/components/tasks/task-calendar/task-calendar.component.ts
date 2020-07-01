// import * as io from 'socket.io-client';
import {Component, Injector, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarComponent extends LoginDataClass implements OnInit, OnDestroy {
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
  projectsList: ProjectInterface[] = [];
  // socket = io(AppConfig.SOCKET_URL);
  calendarEvents = [];
  events = [
    {title: 'event 1', start: '2020-05-10 12:00', end: '2020-05-10 13:00'},
    {title: 'event 2', start: '2020-05-10 23:00', end: '2020-05-10 00:00'}
  ];
  options: any;
  viewModeTypes = 'calendar_task';

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private injector: Injector,
              private loadingIndicatorService: LoadingIndicatorService,
              private userInfoService: UserInfoService,
              public dialog: MatDialog) {
    super(injector, userInfoService);
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

    /*this.socket.on('update-data', (data: any) => {
      this.getBoards();
    });*/
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
        this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

        this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

        this._subscription.add(
          this.api.boardsCalendar(this.loggedInUser.email).subscribe((resp: any) => {
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

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
          }, error => {
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});
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
