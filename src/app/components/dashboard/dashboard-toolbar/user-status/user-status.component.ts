import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../../services/message.service';
import {RefreshLoginService} from '../../../login/services/refresh-login.service';
import {ChangeStatusService} from '../../../status/services/change-status.service';
import {UserStatusInterface} from '../../../status/logic/status-interface';
import {ChangeStatusComponent} from '../../../status/change-status/change-status.component';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../../services/loading-indicator.service';
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

  userCurrentStatus: UserStatusInterface | null = null;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'userStatusDashboard'};

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private userApiService: UserApiService,
              private changeStatusService: ChangeStatusService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this._subscription.add(
      this.changeStatusService.currentUserStatus.subscribe(status => this.userCurrentStatus = status)
    );
  }

  changeStatus() {
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
  }
}
