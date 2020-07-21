// import * as io from 'socket.io-client';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskBottomSheetInterface} from "../task-bottom-sheet/logic/TaskBottomSheet.interface";
import {TaskBottomSheetComponent} from "../task-bottom-sheet/task-bottom-sheet.component";

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarComponent extends LoginDataClass implements OnInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: TaskBottomSheetComponent;

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarApi: any;

  @Input()
  calendarParameters: any;

  @Input()
  filterBoards: any;

  @Input()
  refreshData: boolean = false;

  @Input()
  rtlDirection: boolean;

  @Output() onTabLoaded: EventEmitter<any> = new EventEmitter<any>();

  tasks: TaskInterface[] = [];
  usersList: UserInterface[] = [];
  projectsList: ProjectInterface[] = [];
  // socket = io(AppConfig.SOCKET_URL);
  calendarEvents = [];
  events = [
    {title: 'event 1', start: '2020-05-10 12:00', end: '2020-05-10 13:00'},
    {title: 'event 2', start: '2020-05-10 23:00', end: '2020-05-10 00:00'}
  ];
  colorArray = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#ff9800",
    "#607d8b",
    "#444444",
  ];
  options: any;
  viewModeTypes = 'calendar_task';

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private injector: Injector,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService,
              private userInfoService: UserInfoService,
              public dialog: MatDialog) {
    super(injector, userInfoService);
    console.log("HUSIN",this.filterBoards);

  }

  changeViewMode(mode) {
    this.viewModeTypes = mode;
    this.onTabLoaded.emit(this.viewModeTypes);
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

  openButtonSheet(bottomSheetConfig: TaskBottomSheetInterface) {
    bottomSheetConfig.bottomSheetRef = this.bottomSheet;

    this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
  }

  getBoards(resp = null) {
    if (resp) {
      if (resp.result === 1) {
        this.usersList = resp.content.users.list;
        this.projectsList = resp.content.projects.list;
        this.tasks = resp.content.boards.list;

        this.tasks.map((task:any) => {
          task.title = task.taskName;
          task.start = new Date(task.startAt),
              task.end = new Date(task.stopAt),
              task.color = this.colorArray[Math.floor(Math.random()*this.colorArray.length)],
              task.usersList = this.usersList,
              task.projectsList = this.projectsList,
              task.imageurl = 'img/edit.png'
        });
        this.calendarEvents = this.tasks;


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

              this.tasks.map((task:any) => {
                task.title = task.taskName;
                task.start = new Date(task.startAt),
                task.end = new Date(task.stopAt),
                task.color = this.colorArray[Math.floor(Math.random()*this.colorArray.length)],
                task.usersList = this.usersList,
                task.projectsList = this.projectsList,
                task.imageurl = 'assets/profileImg/'+task.assignTo.email+'.jpg'
              });
              this.calendarEvents = this.tasks;
            }
          }, (error: HttpErrorResponse) => {
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

            this.refreshLoginService.openLoginDialog(error);
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
