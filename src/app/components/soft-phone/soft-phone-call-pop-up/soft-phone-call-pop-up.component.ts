import {Component, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {timer} from 'rxjs';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInfoService} from '../../users/services/user-info.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {ExtensionInterface} from '../logic/extension.interface';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneBottomSheetComponent} from '../soft-phone-bottom-sheet/soft-phone-bottom-sheet.component';
import {SoftPhoneTransferCallComponent} from '../soft-phone-transfer-call/soft-phone-transfer-call.component';

export interface KeysInterface {
  type: string;
  num: string;
  changeIcon: string;
}

@Component({
  selector: 'app-soft-phone-call-pop-up',
  templateUrl: './soft-phone-call-pop-up.component.html',
  styleUrls: ['./soft-phone-call-pop-up.component.scss']
})
export class SoftPhoneCallPopUpComponent implements OnInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: SoftPhoneBottomSheetComponent;

  rtlDirection;
  bottomSheetData: SoftPhoneBottomSheetInterface;
  data: any;
  loggedInUser: UserContainerInterface;
  callTimer = '00:00';
  counter = null;
  timeCounter;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  muteStatus: boolean = false;
  connectedStatus: boolean = false;
  extensionList: Array<ExtensionInterface> | null = null;
  keys: Array<KeysInterface> = [];
  activeExtensionList: boolean = false;

  filterArgs = null;

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

    this._subscription.add(
      this.softPhoneService.currentExtensionList.subscribe(extensions => this.extensionList = extensions)
    );
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;

    this.filterArgs = {email: this.loggedInUser.email};

    this.keys = [
      {type: 'mute_unmute', num: 'mic', changeIcon: 'mic_off'},
    ];

    if (this.data.type !== 'conference') {
      this.keys.push(
        {type: 'forward', num: 'phone_forwarded', changeIcon: 'phone_forwarded'}
      );
    }

    if (this.timeCounter) {
      this.timeCounter.unsubscribe();

      this.counter = null;

      this.callTimer = '00:00';
    }

    this._subscription.add(
      this.softPhoneService.currentConnectedCall.subscribe(connectedCall => {
        this.connectedStatus = connectedCall;

        if (this.connectedStatus) {
          this.counter = timer(0, 1000);

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
      })
    );

    this.softPhoneService.sipCall('call-audio', this.data.extension_no);
  }

  callEvent(key: KeysInterface) {
    switch (key.type) {
      case 'mute_unmute': {
        this.muteStatus = this.softPhoneService.sipToggleMute();

        break;
      }
      case 'forward': {
        const bottomSheetConfig: SoftPhoneBottomSheetInterface = {
          component: SoftPhoneTransferCallComponent,
          height: '100%',
          width: '100%',
          data: ''
        };

        /*notification.onclick = () => {
          console.log('in subscribe :D', notification.data);
        };*/

        bottomSheetConfig.bottomSheetRef = this.bottomSheet;

        this.bottomSheet.toggleBottomSheet(bottomSheetConfig);

        break;
      }
    }
  }

  minimizePopUp() {
    this.softPhoneService.changeMinimizeCallPopUp(true);
  }

  showExtensionsInConf() {

  }

  hangUp() {
    this.softPhoneService.sipHangUp();

    if (this.timeCounter) {
      this.timeCounter.unsubscribe();

      this.counter = null;

      this.callTimer = '00:00';
    }
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

@Pipe({
  name: 'myFilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter((item: SoftphoneUserInterface) => item.username !== filter.email);
  }
}
