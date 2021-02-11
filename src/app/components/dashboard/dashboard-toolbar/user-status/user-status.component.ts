import {Subject} from 'rxjs/internal/Subject';
import {interval} from 'rxjs';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../status/logic/api.service';
import {ApiService as TasksApiService} from '../../../tasks/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../../../tasks/logic/task-interface';
import {MessageService} from '../../../message/service/message.service';
import {LoginDataClass} from '../../../../services/loginData.class';
import {UserInfoService} from '../../../users/services/user-info.service';
import {ApproveComponent} from '../../../approve/approve.component';
import {TranslateService} from '@ngx-translate/core';
import {ServiceInterface} from '../../../services/logic/service-interface';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../../login/services/refresh-login.service';
import {ChangeStatusService} from '../../../status/services/change-status.service';
import {UserStatusInterface} from '../../../status/logic/status-interface';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {ChangeStatusComponent} from '../../../status/change-status/change-status.component';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
import {LoadingIndicatorInterface} from '../../../../services/loading-indicator.service';
import {StatusChangeResultInterface} from '../../../status/logic/result-interface';
import {TaskIncompleteTaskComponent} from '../../../tasks/task-incomplete-task/task-incomplete-task.component';
import {ResultIncompleteTaskInterface} from '../../../tasks/logic/board-interface';

export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStatusComponent extends LoginDataClass implements OnInit, OnDestroy {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection = false;

  @Input()
  serviceList: Array<ServiceInterface>;

  userCurrentStatus: UserStatusInterface | null = null;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'userStatusDashboard'};
  currentTimer: TimeSpan = null;

  private destroyed$ = new Subject();
  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private tasksApiService: TasksApiService,
              private userInfoService: UserInfoService,
              private changeDetector: ChangeDetectorRef,
              private translateService: TranslateService,
              private changeStatusService: ChangeStatusService,
              private refreshLoginService: RefreshLoginService,
              private windowManagerService: WindowManagerService) {
    super(injector, userInfoService);
  }

  ngOnInit(): void {
    this.checkToStartWorking();
  }

  checkToStartWorking(): void {
    this._subscription.add(
      this.changeStatusService.currentUserStatus.subscribe(status => this.userCurrentStatus = status)
    );

    if (this.userCurrentStatus === null || (this.userCurrentStatus && this.userCurrentStatus.end_time !== null)) {
      setTimeout(() => {
        const dialogRef = this.dialog.open(ApproveComponent, {
          data: {
            title: this.getTranslate('status.start_working'),
            message: this.getTranslate('status.start_working_time'),
            action: 'success'
          },
          autoFocus: false,
          width: '70vh',
          maxWidth: '350px',
          panelClass: 'approve-detail-dialog',
          height: '160px'
        });

        this._subscription.add(
          dialogRef.afterOpened().subscribe(() => {
            this.windowManagerService.dialogOnTop(dialogRef.id);
          })
        );

        this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

        this._subscription.add(
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this._subscription.add(
                this.apiService.userChangeStatus({
                  user_id: this.loggedInUser.id,
                  status: 1
                }).subscribe((resp: StatusChangeResultInterface) => {
                  if (resp.success) {
                    this.changeStatusService.changeUserStatus(resp.data);

                    this.messageService.showMessage(this.getTranslate('status.status_success'));
                  } else {
                    this.messageService.showMessage(this.getTranslate('status.status_description_error'));
                  }
                })
              );

              setTimeout(() => this.openIncompleteTasks(), 2000);
            }

            this.openSoftPhone();
          })
        );
      });
    } else {
      this.openSoftPhone();
    }

    interval(1000).subscribe(() => {
      if (!this.changeDetector['destroyed']) {
        this.changeDetector.detectChanges();
      }

      const currentTime = this.userCurrentStatus && this.userCurrentStatus.end_time === null ? this.userCurrentStatus.start_time : moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      this.getElapsedTime(currentTime);
    });

    this.changeDetector.detectChanges();
  }

  openIncompleteTasks(): void {
    const service = this.loggedInUser.services.filter(service => service.service_name === 'project').pop();

    if (service) {
      if (this.loginData && this.loginData.token_type) {
        this.tasksApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

        this._subscription.add(
          this.tasksApiService.incompleteTasks(this.loggedInUser.email).subscribe((resp: ResultIncompleteTaskInterface) => {
            if (resp.result === 1 && resp.contents.length !== 0) {
              this.openDialogIncompleteTasks(resp.contents);
            }
          }, (error: HttpErrorResponse) => {
            if (error.message) {
              this.messageService.showMessage(error.message, 'error');
            }

            this.refreshLoginService.openLoginDialog(error);
          })
        );
      }
    }
  }

  changeStatus(): void {
    const dialogRef = this.dialog.open(ChangeStatusComponent, {
      autoFocus: false,
      width: '500px',
      height: '385px',
      panelClass: 'status-dialog'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );
  }

  getElapsedTime(entry: string): void {
    const curDate = new Date(new Date(entry).getTime());

    let totalSeconds = Math.floor((new Date().getTime() - curDate.getTime()) / 1000);

    let hours = 0;
    let minutes = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    this.currentTimer = {
      hours: hours,
      minutes: minutes,
      seconds: totalSeconds
    };
  }

  openSoftPhone(): void {
    setTimeout(() => {
      const service = this.loggedInUser.services.filter(service => service.service_name === 'pbx').pop();

      if (service) {
        this.openService(service);
      }
    }, 2000);
  }

  openDialogIncompleteTasks(taskList: Array<TaskInterface>): void {
    const dialogRef = this.dialog.open(TaskIncompleteTaskComponent, {
      data: taskList,
      autoFocus: false,
      width: '500px',
      height: '300px',
      panelClass: 'status-dialog'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );
  }

  openService(service: ServiceInterface): void {
    this.windowManagerService.openWindowState(service).finally();
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this.destroyed$.next();

    this.destroyed$.complete();
  }
}
