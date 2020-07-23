import {AfterViewInit, Component, Injector, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {FilterInterface} from '../logic/filter-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TranslateService} from '@ngx-translate/core';
import {TaskAddComponent} from '../task-add/task-add.component';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {TaskDataInterface} from '../logic/task-data-interface';
import {FilterTaskInterface} from '../logic/filter-task-interface';
import {TaskFilterComponent} from '../task-filter/task-filter.component';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskBottomSheetComponent} from '../task-bottom-sheet/task-bottom-sheet.component';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {TaskCalendarFilterComponent} from "../task-calendar/task-calendar-filter/task-calendar-filter.component";
import {LoginDataClass} from "../../../services/loginData.class";
import {UtilsService} from "../../../services/utils.service";

export interface TaskEssentialInfo {
  projectsList: ProjectInterface[];
  usersList: UserInterface[];
}

@Component({
  selector: 'app-task-main',
  templateUrl: './task-main.component.html',
  styleUrls: ['./task-main.component.scss']
})
export class TaskMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: TaskBottomSheetComponent;

  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'project'};
  loggedInUser: UserContainerInterface;
  taskEssentialInfo: TaskEssentialInfo;
  pushTaskToBoard;
  doResetFilter: boolean = false;
  activeTab: number = 0;
  refreshBoardData: boolean = false;
  filterData: FilterInterface = null;
  filteredBoardsData: any;
  tabs = [];
  checksTab: string;
  calendarParameters = {};

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private injector: Injector,
              private loadingIndicatorService: LoadingIndicatorService,
              private translate: TranslateService,
              private userInfoService: UserInfoService,
              private utilService: UtilsService,
              public dialog: MatDialog) {
    super(injector, userInfoService);
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngAfterViewInit(): void {
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
      typeId: 0
    };
  }

  addNewTask() {
    let data: TaskDataInterface = {
      action: 'add',
      usersList: this.taskEssentialInfo.usersList,
      projectsList: this.taskEssentialInfo.projectsList
    };

    const dialogRef = this.dialog.open(TaskAddComponent, {
      data: data,
      autoFocus: false,
      width: '50%',
      height: '560px'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refreshBoardData = true;

          setTimeout(_ => {
            this.refreshBoardData = false;
          }, 500);
        }
      })
    );
  }

  tabChange(event: MatTabChangeEvent) {
    this.activeTab = event.index;
  }

  getTaskEssentialInfo(event) {
    this.taskEssentialInfo = event;
  }

  getTaskToBoardData(event) {
    this.pushTaskToBoard = event;
  }

  showCalendarFilter() {
    const data: FilterTaskInterface = {
      filterData: this.filterData,
      usersList: this.taskEssentialInfo.usersList,
      projectsList: this.taskEssentialInfo.projectsList,
      loginData: this.loginData,
      rtlDirection : this.rtlDirection
    };

    const dialogRef = this.dialog.open(TaskCalendarFilterComponent, {
      data: data,
      autoFocus: false,
      width: '500px',
      height: '250px'
    });

    this._subscription.add(
        dialogRef.afterClosed().subscribe(resp => {
          if (resp) {
            this.calendarParameters = resp;
          }
        })
    );
  }

  showTaskFilter(){
    const data: FilterTaskInterface = {
      filterData: this.filterData,
      usersList: this.taskEssentialInfo.usersList,
      projectsList: this.taskEssentialInfo.projectsList
    };

    const dialogRef = this.dialog.open(TaskFilterComponent, {
      data: data,
      autoFocus: false,
      width: '500px',
      height: '300px'
    });

    this._subscription.add(
        dialogRef.afterClosed().subscribe(resp => {
          if (resp && resp.result === 1) {
            this.filterData = Object.assign({}, resp.filterData);

            this.filteredBoardsData = {
              resp: resp
            };

            this.doResetFilter = true;
          }
        })
    );
  }
  showFilter() {

    if(this.checksTab === undefined || this.checksTab == 'calendar_task' || !this.activeTab){
      this.showTaskFilter();
    }

    else if(this.checksTab == 'calendar_task_rate' && this.activeTab){
      this.showCalendarFilter();
    }
    else{
      this.showTaskFilter();
    }
  }

  resetFilter() {
    this.refreshBoardData = true;

    setTimeout(() => {
      this.refreshBoardData = false;
      this.doResetFilter = false;
    }, 200);
  }

  openButtonSheet(bottomSheetConfig: TaskBottomSheetInterface) {
    bottomSheetConfig.bottomSheetRef = this.bottomSheet;

    this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  doSomething(data: any):void {
    this.checksTab = data;
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
