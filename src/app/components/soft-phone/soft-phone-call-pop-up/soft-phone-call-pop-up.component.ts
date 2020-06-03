import {Component, OnInit} from '@angular/core';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';
import {UserInterface} from '../../users/logic/user-interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {NotificationService} from '../../../services/notification.service';
import {UserInfoService} from '../../users/services/user-info.service';

export interface KeysInterface {
  num: string;
}

@Component({
  selector: 'app-soft-phone-call-pop-up',
  templateUrl: './soft-phone-call-pop-up.component.html',
  styleUrls: ['./soft-phone-call-pop-up.component.scss']
})
export class SoftPhoneCallPopUpComponent implements OnInit {
  rtlDirection;
  bottomSheetData: BottomSheetInterface;
  data: any;
  loggedInUser: UserInterface;

  keys: Array<KeysInterface> = [
    {num: 'volume_up'}, {num: 'keyboard_voice'}, {num: 'person_add'}
  ];

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

  hangUp() {
    this.bottomSheetData.bottomSheetRef.close('hang up');
  }
}
