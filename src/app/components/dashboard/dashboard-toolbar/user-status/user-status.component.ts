import {Component, Input, OnInit} from '@angular/core';
// import {UserInterface} from '../../../users/logic/user-interface';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../../services/message.service';
import {UserStatusInterface} from '../../../users/logic/user-status-interface';
import {ChangeStatusService} from '../../../status/services/change-status.service';
import {ChangeStatusComponent} from '../../../status/change-status/change-status.component';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
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

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private userApiService: UserApiService,
              private changeStatusService: ChangeStatusService,
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
      const statusInfo: ChangeUserStatusInterface = {
        userId: 1,
        assigner: 1,
        statusTime: 'stop'
      };

      this._subscription.add(
        this.userApiService.applyStatusToUser(statusInfo).subscribe((resp: any) => {
          if (resp.result === 1) {
            this.messageService.showMessage(`${resp.message}`);

            this.changeStatusService.changeUserStatus(resp.content.user.userCurrentStatus);
          }
        })
      );
    }
  }
}
