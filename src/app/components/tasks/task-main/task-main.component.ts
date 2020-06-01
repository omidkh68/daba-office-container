import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {FilterInterface} from '../logic/filter-interface';
import {TaskDataInterface} from '../logic/task-data-interface';
import {TaskAddComponent} from '../task-add/task-add.component';
import {FilterTaskInterface} from '../logic/filter-task-interface';
import {TaskFilterComponent} from '../task-filter/task-filter.component';
import {BottomSheetComponent} from '../../bottom-sheet/bottom-sheet.component';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';
import {SoftPhoneCallToActionComponent} from '../../soft-phone/soft-phone-call-to-action/soft-phone-call-to-action.component';

export interface TaskEssentialInfo {
  projectsList: ProjectInterface[];
  usersList: UserInterface[];
}

@Component({
  selector: 'app-task-main',
  templateUrl: './task-main.component.html',
  styleUrls: ['./task-main.component.scss']
})
export class TaskMainComponent implements OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: BottomSheetComponent;

  taskEssentialInfo: TaskEssentialInfo;
  pushTaskToBoard;
  doResetFilter: boolean = false;
  activeTab: number = 0;
  refreshBoardData: boolean = false;
  filterData: FilterInterface = {
    userId: 0,
    adminId: 0,
    dateStart: '',
    dateStop: '',
    projectId: 0,
    taskName: '',
    type: '',
    typeId: 0
  };
  filteredBoardsData: any;
  tabs = [
    {
      name: 'برد',
      icon: 'view_week',
      id: 'boards'
    },
    {
      name: 'تقویم',
      icon: 'event_available',
      id: 'calendar'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog) {
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

  showFilter() {
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

  resetFilter() {
    this.refreshBoardData = true;

    setTimeout(() => {
      this.refreshBoardData = false;
      this.doResetFilter = false;
    }, 200);
  }

  openButtonSheet(bottomSheetConfig: BottomSheetInterface) {
    this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
