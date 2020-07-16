import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../../services/message.service';
import {RefreshLoginService} from '../../../login/services/refresh-login.service';
import {UserStatusInterface} from '../../../users/logic/user-status-interface';
import {ChangeStatusService} from '../../../status/services/change-status.service';
import {ChangeStatusComponent} from '../../../status/change-status/change-status.component';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../../services/loading-indicator.service';
import {ChangeUserStatusInterface} from '../../../status/logic/change-user-status.interface';
import {ApiService as UserApiService} from '../../../users/logic/api.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss']
})
export class UserStatusComponent implements OnInit {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection: boolean;

  userCurrentStatus: UserStatusInterface | string;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'userStatusDashboard'};

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private userApiService: UserApiService,
              private changeStatusService: ChangeStatusService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService,
              private messageService: MessageService) {
    this._subscription.add(
      this.changeStatusService.currentUserStatus.subscribe(status => this.userCurrentStatus = status)
    );
  }

  ngOnInit(): void {
  }

  changeStatus(startStatus: boolean) {
    if (startStatus) {
      const dialogRef = this.dialog.open(ChangeStatusComponent, {
        autoFocus: false,
        width: '500px',
        height: '355px',
        panelClass: 'status-dialog'
      });

      this._subscription.add(
        dialogRef.afterClosed().subscribe((resp: any) => {
          if (resp) {
            this.messageService.showMessage(`${resp.message}`);
          }
        })
      );
    } else {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'userStatusDashboard'});

      const statusInfo: ChangeUserStatusInterface = {
        userId: 1,
        assigner: 1,
        statusTime: 'stop'
      };

      this._subscription.add(
        this.userApiService.applyStatusToUser(statusInfo).subscribe((resp: any) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'userStatusDashboard'});

          if (resp.result === 1) {
            this.messageService.showMessage(`${resp.message}`);

            // this.changeStatusService.changeUserStatus(resp.content.userCurrentStatus);// todo: related to malekloo
          } else {
            this.messageService.showMessage(`${resp.message}`);
          }
        }, error => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'userStatusDashboard'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }
}
