import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ProjectInterface} from '../projects/logic/project-interface';
import {UserInterface} from '../users/logic/user-interface';
import {FilterInterface} from './logic/filter-interface';
import {TaskDataInterface} from './logic/task-data-interface';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {FilterTaskInterface} from './logic/filter-task-interface';
import {TaskFilterComponent} from './task-filter/task-filter.component';

export interface TaskEssentialInfo {
  projectsList: ProjectInterface[];
  usersList: UserInterface[];
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements AfterViewInit, OnDestroy {
  taskEssentialInfo: TaskEssentialInfo;
  activeTab: number = 0;
  refreshBoardData: boolean = false;
  filterData: FilterInterface = {
    userId: 0,
    adminID: 0,
    dateStart: '',
    dateStop: '',
    projectID: 0,
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
    /*{
      name: 'یادداشت ها',
      icon: 'description',
      id: 'notes'
    },
    {
      name: 'پیام ها',
      icon: 'textsms',
      id: 'messages'
    },*/
    {
      name: 'تقویم',
      icon: 'event_available',
      id: 'calendar'
    },
    /*{
      name: 'فایل ها',
      icon: 'attach_file',
      id: 'files'
    },*/
  ];

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog) {
  }

  ngAfterViewInit(): void {
    setTimeout(_ => {
      this.showFilter();
    }, 1000);
  }

  addNewTask() {
    let data: TaskDataInterface = {
      action: 'add',
      usersList: this.taskEssentialInfo.usersList,
      projectsList: this.taskEssentialInfo.projectsList
    };

    const dialogRef = this.dialog.open(TaskDetailComponent, {
      data: data,
      autoFocus: false,
      width: '50%',
      height: '520px'
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
          }
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
