import {AfterViewInit, Component, Injector, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {TaskInterface} from '../logic/task-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {FilterInterface} from '../logic/filter-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TranslateService} from '@ngx-translate/core';
import {TaskAddComponent} from '../task-add/task-add.component';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {TaskDataInterface} from '../logic/task-data-interface';
import {CurrentTaskService} from '../services/current-task.service';
import {FilterTaskInterface} from '../logic/filter-task-interface';
import {TaskFilterComponent} from '../task-filter/task-filter.component';
import {EventHandlerService} from '../../events/service/event-handler.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {BottomSheetDataService} from '../services/BottomSheetData.service';
import {TaskBottomSheetComponent} from '../task-bottom-sheet/task-bottom-sheet.component';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {IgnoreAutoRefreshService} from '../services/ignore-auto-refresh.service';
import {TaskCalendarRateInterface} from '../task-calendar/services/task-calendar.service';
import {UsersProjectsListInterface} from '../logic/board-interface';
import {TaskCalendarFilterComponent} from '../task-calendar/task-calendar-filter/task-calendar-filter.component';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

export interface TaskEssentialInfo {
  projectsList: Array<ProjectInterface>;
  usersList: Array<UserInterface>;
}

@Component({
  selector: 'app-task-main',
  templateUrl: './task-main.component.html'
})
export class TaskMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: TaskBottomSheetComponent;

  rtlDirection = false;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'project'};
  taskEssentialInfo: TaskEssentialInfo;
  pushTaskToBoard;
  doResetFilter = false;
  disableButton = false;
  activeTab = 0;
  refreshBoardData = false;
  filterData: FilterInterface = null;
  filteredBoardsData: any = null;
  tabs = [];
  checksTab: string;
  calendarParameters = {};
  currentTasks: Array<TaskInterface> | null = null;
  projectsList: Array<ProjectInterface> = [];
  usersList: Array<UserInterface> = [];

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private translate: TranslateService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private currentTaskService: CurrentTaskService,
              private eventHandlerService: EventHandlerService,
              private windowManagerService: WindowManagerService,
              private bottomSheetDataService: BottomSheetDataService,
              private loadingIndicatorService: LoadingIndicatorService,
              private ignoreAutoRefreshService: IgnoreAutoRefreshService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;

        this.changeMainTabLanguage();
      })
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );
  }

  ngAfterViewInit(): void {
    this.changeMainTabLanguage();

    this.filterData = {
      userId: 0,
      userImg: '0',
      adminId: 0,
      dateStart: '',
      dateStop: '',
      projectId: 0,
      taskName: '',
      type: '',
      email: this.loggedInUser.email,
      status: 0
    };

    this._subscription.add(
      this.bottomSheetDataService.currentButtonSheetData.subscribe((data: TaskBottomSheetInterface) => {
        if (data) {
          data.bottomSheetRef = this.bottomSheet;

          this.bottomSheet.toggleBottomSheet(data);
        }
      })
    );
  }

  changeMainTabLanguage(): void {
    setTimeout(() => {
      this.tabs = [
        {
          name: this.getTranslate('tasks.main.boards'),
          icon: 'view_week',
          id: 'boards'
        },
        {
          name: this.getTranslate('tasks.main.calendar'),
          icon: 'event_available',
          id: 'calendar'
        }
      ];
    }, 200);
  }

  addNewTask(): void {
    this.disableButton = true;

    const data: TaskDataInterface = {
      action: 'add',
      usersList: this.taskEssentialInfo.usersList,
      projectsList: this.taskEssentialInfo.projectsList
    };

    const dialogRef = this.dialog.open(TaskAddComponent, {
      data: data,
      autoFocus: false,
      width: '45%',
      height: '560px'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);

        this.ignoreAutoRefreshService.changeCurrentAutoRefresh(true);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        this.ignoreAutoRefreshService.changeCurrentAutoRefresh(false);

        this.disableButton = false;

        if (result) {
          this.refreshBoardData = true;

          setTimeout(() => this.refreshBoardData = false, 500);
        }
      })
    );
  }

  tabChange(event: MatTabChangeEvent): void {
    this.activeTab = event.index;

    this.doResetFilter = false;
  }

  getTaskEssentialInfo(event: UsersProjectsListInterface): void {
    this.taskEssentialInfo = event;
  }

  showCalendarFilter(): void {
    const data: FilterTaskInterface = {
      filterData: this.filterData,
      usersList: this.taskEssentialInfo.usersList,
      projectsList: this.taskEssentialInfo.projectsList,
      loginData: this.loginData,
      rtlDirection: this.rtlDirection
    };

    const dialogRef = this.dialog.open(TaskCalendarFilterComponent, {
      data: data,
      autoFocus: false,
      width: '500px',
      height: '450px'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: TaskCalendarRateInterface) => {
        this.disableButton = false;

        if (resp) {
          this.eventHandlerService.moveCalendarRate(resp);
        }
      })
    );
  }

  showTaskFilter(): void {
    const data: FilterTaskInterface = {
      filterData: this.filterData,
      usersList: this.taskEssentialInfo.usersList,
      projectsList: this.taskEssentialInfo.projectsList
    };

    const dialogRef = this.dialog.open(TaskFilterComponent, {
      data: data,
      autoFocus: false,
      width: '500px',
      height: '450px'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);

        this.ignoreAutoRefreshService.changeCurrentAutoRefresh(true);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(resp => {
        this.disableButton = false;

        if (resp && resp.result === 1) {
          this.filterData = null;

          this.filterData = {...resp.filterData};

          this.filteredBoardsData = {
            resp: resp
          };
          this.eventHandlerService.moveEventsTask(resp);
          this.doResetFilter = true;
        } else {
          this.ignoreAutoRefreshService.changeCurrentAutoRefresh(false);
        }
      })
    );
  }

  showFilter(): void {
    this.disableButton = true;

    if (this.checksTab === undefined || this.checksTab == 'calendar_task' || !this.activeTab) {
      this.showTaskFilter();
    } else if (this.checksTab == 'calendar_task_rate' && this.activeTab) {
      this.showCalendarFilter();
    } else {
      this.showTaskFilter();
    }
  }

  resetFilter(): void {
    this.refreshBoardData = true;
    this.filterData = null;

    setTimeout(() => {
      this.refreshBoardData = false;
      this.doResetFilter = false;
    }, 200);
  }

  makeFilterReset(event: boolean): void {
    if (event) {
      this.resetFilter();
    }
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  doSomething(data: string): void {
    this.checksTab = data;
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
