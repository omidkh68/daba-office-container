import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneService} from '../service/soft-phone.service';
import {timer} from 'rxjs/internal/Observable/timer';

export interface KeysInterface {
  num: string;
}

@Component({
  selector: 'app-soft-phone-call-pop-up',
  templateUrl: './soft-phone-call-pop-up.component.html',
  styleUrls: ['./soft-phone-call-pop-up.component.scss']
})
export class SoftPhoneCallPopUpComponent implements OnInit, OnDestroy {
  rtlDirection;
  bottomSheetData: SoftPhoneBottomSheetInterface;
  data: any;
  loggedInUser: UserInterface;
  callTimer = '00:00';
  counter = timer(0, 1000);
  timeCounter;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;

  keys: Array<KeysInterface> = [
    {num: 'volume_up'}, {num: 'keyboard_voice'}, {num: 'person_add'}
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private notificationService: NotificationService,
              private softPhoneService: SoftPhoneService,
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

    this.softPhoneService.sipCall('call-audio', this.data.extension);

    this.timeCounter = this.counter.subscribe(() => {
      if (this.second < 59) {
        this.second++;
      } else {
        this.second = 0;

        if (this.minute < 59) {
          this.minute++;
        } else {
          this.minute = 0;
          this.hour++;
        }
      }

      this.callTimer = (this.hour < 10 ? '0' + this.hour : this.hour) + ':' + (this.minute < 10 ? '0' + this.minute : this.minute) + ':' + (this.second < 10 ? '0' + this.second : this.second);
    });
  }

  hangUp() {
    // this.bottomSheetData.bottomSheetRef.close('hang up');

    this.softPhoneService.sipHangUp();

    this.timeCounter.unsubscribe();

    this.callTimer = '00:00';
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    if (this.timeCounter) {
      this.timeCounter.unsubscribe();
    }
  }
}
