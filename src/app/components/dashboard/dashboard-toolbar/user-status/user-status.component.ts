import {Subject, interval} from 'rxjs';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../status/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../../services/message.service';
import {LoginDataClass} from '../../../../services/loginData.class';
import {UserInfoService} from '../../../users/services/user-info.service';
import {ApproveComponent} from '../../../approve/approve.component';
import {TranslateService} from '@ngx-translate/core';
import {RefreshLoginService} from '../../../login/services/refresh-login.service';
import {ChangeStatusService} from '../../../status/services/change-status.service';
import {UserStatusInterface} from '../../../status/logic/status-interface';
import {ChangeStatusComponent} from '../../../status/change-status/change-status.component';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../../services/loading-indicator.service';
import {StatusChangeResultInterface} from '../../../status/logic/result-interface';

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
  rtlDirection: boolean;

  userCurrentStatus: UserStatusInterface | null = null;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'userStatusDashboard'};
  currentTimer: TimeSpan = null;

  private destroyed$ = new Subject();
  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private apiService: ApiService,
              private userInfoService: UserInfoService,
              private changeStatusService: ChangeStatusService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService,
              private translateService: TranslateService,
              private changeDetector: ChangeDetectorRef,
              private messageService: MessageService) {
    super(injector, userInfoService);
  }

  ngOnInit(): void {
    this._subscription.add(
      this.changeStatusService.currentUserStatus.subscribe(status => this.userCurrentStatus = status)
    );

    if (this.userCurrentStatus) {
      setTimeout(() => {
        if (this.userCurrentStatus.end_time) { // if finished working time
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

          this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

          this._subscription.add(
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this._subscription.add(
                  this.apiService.userChangeStatus({
                    user_id: this.loggedInUser.id,
                    status: 1,
                    description: ''
                  }).subscribe((resp: StatusChangeResultInterface) => {
                    if (resp.success) {
                      this.changeStatusService.changeUserStatus(resp.data);

                      this.messageService.showMessage(this.getTranslate('status.status_success'));
                    } else {
                      this.messageService.showMessage(this.getTranslate('status.status_description_error'));
                    }
                  })
                );
              }
            })
          );
        }
      }, 2000);

      interval(1000).subscribe(() => {
        if (!this.changeDetector['destroyed']) {
          this.changeDetector.detectChanges();
        }

        this.getElapsedTime(this.userCurrentStatus.start_time);
      });

      this.changeDetector.detectChanges();
    }
  }

  changeStatus() {
    const dialogRef = this.dialog.open(ChangeStatusComponent, {
      autoFocus: false,
      width: '500px',
      height: '355px',
      panelClass: 'status-dialog'
    });/*

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: any) => {
        if (resp) {
          console.log(resp);
          this.messageService.showMessage(`${resp.message}`);
        }
      })
    );*/
  }

  getElapsedTime(entry): void {
    const curDate = new Date(new Date(entry).getTime());

    let totalSeconds = Math.floor((new Date().getTime() - curDate.getTime()) / 1000);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    seconds = totalSeconds;

    this.currentTimer = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  getTranslate(word) {
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
