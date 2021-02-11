import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {TaskInterface} from '../logic/task-interface';
import {LoginInterface} from '../../login/logic/login.interface';
import {MessageService} from '../../message/service/message.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {TaskReportDescriptionComponent} from '../task-description/task-report-description.component';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {ResultTaskReportInterface, TaskReportDescriptionInterface, TaskReportInterface} from '../logic/board-interface';

export interface TotalWorkingTimeInterface {
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-task-report',
  styleUrls: ['./task-report.component.scss'],
  templateUrl: './task-report.component.html'
})
export class TaskReportComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Input()
  rtlDirection = false;

  @Input()
  loginData: LoginInterface;

  @Input()
  task: TaskInterface;

  @Input()
  usersList: Array<UserInterface> = [];

  taskReports: Array<TaskReportInterface> = [];
  displayedColumns: string[] = [
    'taskDateStart', 'taskDateStop', 'adminIdStartTask', 'adminIdStopTask', 'percentage', 'description'
  ];
  pageLimit: number[] = [10, 25, 50, 100];
  dataSource = new MatTableDataSource<TaskReportInterface>(this.taskReports);
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'project-report-report'};
  dataChange = false;
  total: TotalWorkingTimeInterface = null;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private api: ApiService,
              private translate: TranslateService,
              private messageService: MessageService,
              private matPaginatorIntl: MatPaginatorIntl,
              private refreshLoginService: RefreshLoginService,
              private windowManagerService: WindowManagerService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngOnInit(): void {
    this.getTaskReport();

    this.matPaginatorIntl.itemsPerPageLabel = this.getTranslate('global.pagination.item_per_page');
    this.matPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 ${this.getTranslate('global.pagination.from')} ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return `${startIndex + 1} - ${endIndex} ${this.getTranslate('global.pagination.from')} ${length}`;
    };
  }

  getTaskReport(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project-report'});

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.getTaskReport(this.task.taskId).subscribe((resp: ResultTaskReportInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project-report'});

        if (resp.result === 1) {
          this.taskReports = resp.contents;

          let totalTime = 0;

          this.taskReports.map(item => {
            if (item.taskDateStop !== '0000-00-00 00:00:00') {
              const timeStart = new Date(item.taskDateStart);
              const timeEnd = new Date(item.taskDateStop);
              const diff = Math.abs(timeEnd.getTime() - timeStart.getTime());
              totalTime = totalTime + diff;
            }
          });

          const ms = totalTime % 1000;
          totalTime = (totalTime - ms) / 1000;
          const secs = totalTime % 60;
          totalTime = (totalTime - secs) / 60;
          const mins = totalTime % 60;
          const hrs = (totalTime - mins) / 60;
          const hr = hrs < 10 ? `0${hrs}` : `${hrs}`;
          const min = mins < 10 ? `0${mins}` : `${mins}`;
          const sec = secs < 10 ? `0${secs}` : `${secs}`;

          this.total = {hours: hr, minutes: min, seconds: sec};

          this.taskReports.map(report => {
            if (report.adminIdStartTask) {
              const findUserStarted: UserInterface = this.usersList.filter(user => user.adminId === report.adminIdStartTask).pop();

              if (findUserStarted) {
                report.adminIdStartTask = `${findUserStarted.name} ${findUserStarted.family}`;
              } else {
                report.adminIdStartTask = `-`;
              }
            }

            if (report.adminIdStopTask) {
              const findUserStopped: UserInterface = this.usersList.filter(user => user.adminId === report.adminIdStopTask).pop();

              if (findUserStopped) {
                report.adminIdStopTask = `${findUserStopped.name} ${findUserStopped.family}`;
              } else {
                report.adminIdStopTask = `-`;
              }
            }
          });

          this.dataSource = new MatTableDataSource(this.taskReports);
          this.dataSource.paginator = this.paginator;
        }

        if (resp.message) {
          this.messageService.showMessage(resp.message);
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message);
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project-report'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  descriptionTask(description: string, percentage: number, taskDateStop: string): void {
    const data: TaskReportDescriptionInterface = {
      task: this.task,
      description: description,
      percentage: percentage,
      taskDateStop: taskDateStop
    };

    const dialogRef = this.dialog.open(TaskReportDescriptionComponent, {
      data: data,
      autoFocus: false,
      width: '500px',
      height: '250px'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataChange = true;

          setTimeout(() => {
            this.dataChange = false;
          }, 500);
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
