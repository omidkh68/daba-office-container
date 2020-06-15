import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';

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
  bottomSheetData: SoftPhoneBottomSheetInterface;
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
