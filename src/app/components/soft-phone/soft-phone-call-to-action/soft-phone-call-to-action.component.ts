import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';

@Component({
  selector: 'app-soft-phone-call-to-action',
  templateUrl: './soft-phone-call-to-action.component.html',
  styleUrls: ['./soft-phone-call-to-action.component.scss']
})
export class SoftPhoneCallToActionComponent implements OnInit, OnDestroy {
  rtlDirection;
  bottomSheetData: BottomSheetInterface;
  data: any;
  loggedInUser: UserInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private notificationService: NotificationService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;
  }

  call(user: UserInterface) {
    const notification: Notification = new Notification(`${this.loggedInUser.name} ${this.loggedInUser.family}`, {
      body: `${user.name} ${user.family}`,
      icon: 'assets/profileImg/' + user.adminId + '.jpg',
      dir: 'auto',
      data: user
    });

    this.notificationService.changeCurrentNotification(user);
  }

  closeBottomSheet() {
    this.bottomSheetData.bottomSheetRef.close();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
