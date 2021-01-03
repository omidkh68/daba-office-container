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
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {TaskBottomSheetComponent} from '../task-bottom-sheet/task-bottom-sheet.component';
import {TaskCalendarService} from './services/task-calendar.service';
import {EventHandlerService} from "../../events/service/event-handler.service";

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCalendarComponent extends LoginDataClass implements OnInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: TaskBottomSheetComponent;

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
  holidays = [];

  viewModeTypes = 'calendar_task';

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private api: ApiService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private refreshLoginService: RefreshLoginService,
              private taskCalendarService: TaskCalendarService,
              private eventHandlerService: EventHandlerService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);
  }

  ngOnInit(): void {
    this.getBoards();
  }

  changeViewMode(mode) {
    this.viewModeTypes = mode;
    this.onTabLoaded.emit(this.viewModeTypes);
  }

  openButtonSheet(bottomSheetConfig: TaskBottomSheetInterface) {
    bottomSheetConfig.bottomSheetRef = this.bottomSheet;

    this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
  }

  getBoards() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});
    if (this.loggedInUser && this.loggedInUser.email) {
      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

      this._subscription.add(
          this.api.boardsCalendar(this.loggedInUser.email).subscribe((resp: any) => {
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

            if (resp.result === 1) {
              this.usersList = resp.content.users.list;
              this.projectsList = resp.content.projects.list;
              this.tasks = resp.content.boards.list;
              this.taskCalendarService.holidays = resp.content.boards.holidays;
              this.calendarEvents = this.taskCalendarService.prepareTaskItems(resp);
              this.eventHandlerService.moveCalendarItem(this.calendarEvents)
            }
          }, (error: HttpErrorResponse) => {
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

            this.refreshLoginService.openLoginDialog(error);
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.viewModeTypes = null;

    this.onTabLoaded.emit(this.viewModeTypes);

    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
