import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {UserInterface} from '../../users/logic/user-interface';

export interface TaskReportInterface {
  taskSheetId: number;
  taskDateStart: string;
  taskDateStop: string;
  percentage: number;
  adminIdStartTask: string | number;
  adminIdStopTask: string | number;
  description: string;
}

@Component({
  selector: 'app-task-report',
  templateUrl: './task-report.component.html'
})
export class TaskReportComponent implements OnInit, OnDestroy {
  @ViewChild
  (MatPaginator, {static: true}) paginator: MatPaginator;

  @Input()
  rtlDirection: boolean;

  @Input()
  taskId: number = 0;

  @Input()
  usersList: Array<UserInterface> = [];

  taskReports: Array<TaskReportInterface> = [];
  displayedColumns: string[] = [
    'taskDateStart', 'taskDateStop', 'adminIdStartTask', 'adminIdStopTask', 'percentage', 'description'
  ];
  pageLimit: number[] = [10, 25, 50, 100];
  dataSource = new MatTableDataSource<TaskReportInterface>(this.taskReports);

  private _subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private matPaginatorIntl: MatPaginatorIntl) {
  }

  ngOnInit(): void {
    this.getTaskReport();

    this.matPaginatorIntl.itemsPerPageLabel = 'تعداد در هر صفحه';
    this.matPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) { return `0 از ${length}`; }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} از ${length}`;
    };
  }

  getTaskReport() {
    this._subscription.add(
      this.apiService.getTaskReport(this.taskId).subscribe((resp: any) => {
        if (resp.result === 1) {
          this.taskReports = resp.contents;

          this.taskReports.map(report => {
            if (report.adminIdStartTask) {
              const findUserStarted: UserInterface = this.usersList.filter(user => user.adminId === report.adminIdStartTask).pop();
              report.adminIdStartTask = `${findUserStarted.name} ${findUserStarted.family}`;
            }

            if (report.adminIdStopTask) {
              const findUserStopped: UserInterface = this.usersList.filter(user => user.adminId === report.adminIdStopTask).pop();
              report.adminIdStopTask = `${findUserStopped.name} ${findUserStopped.family}`;
            }
          });

          this.dataSource = new MatTableDataSource(this.taskReports);
          this.dataSource.paginator = this.paginator;
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
