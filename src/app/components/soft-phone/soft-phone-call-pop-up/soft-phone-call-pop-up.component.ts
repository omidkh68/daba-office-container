import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {timer} from 'rxjs';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInfoService} from '../../users/services/user-info.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneBottomSheetComponent} from '../soft-phone-bottom-sheet/soft-phone-bottom-sheet.component';
import {SoftPhoneTransferCallComponent} from '../soft-phone-transfer-call/soft-phone-transfer-call.component';
import {ConferenceOnlineExtensionInterface, MuteUnMuteInterface} from '../logic/extension.interface';
import {ResultConfOnlineExtensionApiInterface, ResultMuteUnMuteApiInterface} from '../logic/result-api.interface';

export interface KeysInterface {
  type: string;
  num: string;
  changeIcon: string;
}

export interface DialPadKeysInterface {
  num: string;
}

export interface JoinedOrLeftTheConfInterface {
  extension: ConferenceOnlineExtensionInterface;
  status: string;
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
  extensionList: Array<ConferenceOnlineExtensionInterface> = [];
  keys: Array<KeysInterface> = [];
  activeExtensionList: boolean = false;
  activeDialPad: boolean = false;
  timerDueTime: number = 0;
  timerPeriod: number = 5000;
  globalTimer = null;
  globalTimerSubscription: Subscription;
  userJoinOrLeftTheConf: JoinedOrLeftTheConfInterface | null = null;

  dialPadKeys: Array<DialPadKeysInterface> = [
    {num: '1'}, {num: '2'}, {num: '3'},
    {num: '4'}, {num: '5'}, {num: '6'},
    {num: '7'}, {num: '8'}, {num: '9'},
    {num: '*'}, {num: '0'}, {num: '#'}
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private viewDirection: ViewDirectionService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private notificationService: NotificationService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;

    console.log('bottomsheet data: ', this.data);

    this.keys = [
      {type: 'mute_unmute', num: 'mic', changeIcon: 'mic_off'},
    ];

    if (this.data.type !== 'conference') {
      this.keys.push(
        {type: 'forward', num: 'phone_forwarded', changeIcon: 'phone_forwarded'}
      );
    } else if (this.data.type === 'conference' && this.data.password.length) {
      this.keys.push(
        {type: 'key_pad', num: 'dialpad', changeIcon: 'dialpad'}
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

          // get conference online users every 5 secs when conf_id exist in bottomSheet Data
          if (this.data.conf_id) {
            this.globalTimer = timer(
              this.timerDueTime, this.timerPeriod
            );

            this.globalTimerSubscription = this.globalTimer.subscribe(() => this.getConferenceOnlineUser());
          }
        } else {
          if (this.globalTimerSubscription) {
            this.globalTimerSubscription.unsubscribe();
            this.globalTimer = null;
          }
        }
      })
    );

    this.softPhoneService.sipCall('call-audio', this.data.extension_no);
  }

  callEvent(key: KeysInterface) {
    switch (key.type) {
      case 'mute_unmute': {
        const muteInfo: MuteUnMuteInterface = {
          is_mute: this.muteStatus ? 0 : 1,
          extension_no: `${this.loggedInUser.extension_no}`
        };

        this._subscription.add(
          this.apiService.muteUnMute(muteInfo).subscribe((resp: ResultMuteUnMuteApiInterface) => {
            if (resp.success) {
              this.muteStatus = this.softPhoneService.sipToggleMute();
            }
          })
        );

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

      case 'key_pad': {
        this.activeDialPad = true;

        break;
      }
    }
  }

  minimizePopUp() {
    this.softPhoneService.changeMinimizeCallPopUp(true);
  }

  getConferenceOnlineUser() {
    this._subscription.add(
      this.apiService.getConferenceOnlineUser(this.data.extension_no).subscribe((resp: ResultConfOnlineExtensionApiInterface) => {
        if (resp.success) {
          this.joinOrLeftToConf(this.extensionList, resp.data).then(() => {
            this.extensionList = resp.data;
          });
        }
      })
    );
  }

  joinOrLeftToConf(arr1: Array<ConferenceOnlineExtensionInterface>, arr2: Array<ConferenceOnlineExtensionInterface>) {
    return new Promise((resolve) => {
      let diffArr1 = arr1.filter(this.arrayComparer(arr2));
      let diffArr2 = arr2.filter(this.arrayComparer(arr1));

      let getDiff = diffArr1.concat(diffArr2);

      if (getDiff.length && getDiff.length === 1) {
        let status = '';
        // left the conf
        if (diffArr1.length === 1 && diffArr2.length === 0) {
          status = 'left';
        }
        // join the conf
        else if (diffArr1.length === 0 && diffArr2.length === 1) {
          status = 'join';
        }

        const joinedOrLeftExtension: ConferenceOnlineExtensionInterface = getDiff.pop();

        if (joinedOrLeftExtension.username !== this.loggedInUser.email) {
          this.userJoinOrLeftTheConf = {
            extension: joinedOrLeftExtension,
            status: status
          };
        } else {
          this.userJoinOrLeftTheConf = null;
        }

        resolve(true);
      } else {
        this.userJoinOrLeftTheConf = null;

        resolve(true);
      }
    });
  }

  arrayComparer(arrayParam: Array<ConferenceOnlineExtensionInterface>) {
    return (current: ConferenceOnlineExtensionInterface) => {
      return arrayParam.filter((other: ConferenceOnlineExtensionInterface) => {
        return other.extension_no == current.extension_no && other.extension_no == current.extension_no
      }).length == 0;
    }
  }

  hangUp() {
    this.softPhoneService.sipHangUp();

    if (this.timeCounter) {
      this.timeCounter.unsubscribe();

      this.counter = null;

      this.callTimer = '00:00';
    }

    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
      this.globalTimer = null;
    }
  }

  dialKeyPress(event, key: DialPadKeysInterface) {
    this.softPhoneService.sipSendDTMF(key.num);

    if (key.num === '#') {
      setTimeout(() => this.activeDialPad = false, 5000);
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.activeExtensionList = false;
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    if (this.timeCounter) {
      this.timeCounter.unsubscribe();
    }

    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
      this.globalTimer = null;
    }
  }
}
