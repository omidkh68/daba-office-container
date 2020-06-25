import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
// import {UserInterface} from '../../users/logic/user-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {SoftPhoneService} from '../service/soft-phone.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {SoftPhoneCallPopUpComponent} from '../soft-phone-call-pop-up/soft-phone-call-pop-up.component';
import {SoftPhoneBottomSheetComponent} from '../soft-phone-bottom-sheet/soft-phone-bottom-sheet.component';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';

@Component({
  selector: 'app-soft-phone-main',
  templateUrl: './soft-phone-main.component.html',
  styleUrls: ['./soft-phone-main.component.scss']
})
export class SoftPhoneMainComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: SoftPhoneBottomSheetComponent;
  @ViewChild('audioRemote', {static: false}) audioRemote: ElementRef;
  @ViewChild('ringtone', {static: false}) ringtone: ElementRef;
  @ViewChild('ringbacktone', {static: false}) ringbacktone: ElementRef;
  @ViewChild('dtmfTone', {static: false}) dtmfTone: ElementRef;

  loggedInUser: UserContainerInterface;
  rtlDirection: boolean;
  activeTab: number = 1;
  tabs = [];

  softPhoneUsers: Array<SoftphoneUserInterface> = [
    {
      id: 9,
      name: 'آقای بصیری',
      email: 'seanbassiri@gmail.com',
      email_verified_at: '',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6008',
    },
    {
      id: 46,
      name: 'omid',
      email: 'khosrojerdi@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6004'
    },
    {
      id: 16,
      name: 'مریم بهادری',
      email: 'm.bahadori@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6005'
    },
    {
      id: 47,
      name: 'مهدی مرجانی',
      email: 'marjani@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6006'
    },
    {
      id: 39,
      name: 'جواد موحدی',
      email: 'j.movahedi@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6001'
    },
    {
      id: 200,
      name: 'امیر اصغری',
      email: 'a.asghari@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6003'
    },
    {
      id: 41,
      name: 'محمدرضا رادان',
      email: 'm.radan@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6002'
    },
    {
      id: 36,
      name: 'محمود ملک لو',
      email: 'm.malekloo@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6007'
    },
    {
      id: 36,
      name: 'سید  محمد حسین سجادی',
      email: 'h.sajjadi@dabacenter.ir',
      email_verified_at: null,
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      role_id: null,
      timezone: null,
      extension: '6009'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private softPhoneService: SoftPhoneService,
              private notificationService: NotificationService,
              private translate: TranslateService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    /*this._subscription.add(
      this.notificationService.currentNotification.subscribe(notification => {
        if (notification) {
          const bottomSheetConfig: SoftPhoneBottomSheetInterface = {
            component: SoftPhoneCallPopUpComponent,
            height: '100%',
            width: '100%',
            data: notification.data ? notification.data : notification
          };

          /!*notification.onclick = () => {
            console.log('in subscribe :D', notification.data);
          };*!/

          this.openButtonSheet(bottomSheetConfig);
        }
      })
    );*/

    this._subscription.add(
      this.softPhoneService.currentOnCallUser.subscribe(onCallUser => {
        if (onCallUser) {
          const bottomSheetConfig: SoftPhoneBottomSheetInterface = {
            component: SoftPhoneCallPopUpComponent,
            height: '100%',
            width: '100%',
            data: onCallUser
          };

          /*notification.onclick = () => {
            console.log('in subscribe :D', notification.data);
          };*/

          this.openButtonSheet(bottomSheetConfig);
        } else {
          if (this.bottomSheet) {
            this.bottomSheet.close();
          }
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.softPhoneService.changeAudioRemoteTag({
      audioRemote: this.audioRemote,
      ringtone: this.ringtone,
      ringbacktone: this.ringbacktone,
      dtmfTone: this.dtmfTone
    });

    this.softPhoneService.sipRegister();

    this.softPhoneService.changeSoftPhoneUsers(this.softPhoneUsers);

    setTimeout(() => {
      this.tabs = [
        {
          nameFa: this.getTranslate('soft_phone.main.status'),
          nameEn: 'Status',
          icon: 'home'
        },
        {
          nameFa: this.getTranslate('soft_phone.main.address_book'),
          nameEn: 'Contacts',
          icon: 'contacts'
        },
        {
          nameFa: this.getTranslate('soft_phone.main.dial_pad'),
          nameEn: 'Keypad',
          icon: 'dialpad'
        },
        {
          nameFa: this.getTranslate('soft_phone.main.call_logs'),
          nameEn: 'Logs',
          icon: 'settings_phone'
        },
        {
          nameFa: this.getTranslate('global.settings'),
          nameEn: 'Settings',
          icon: 'settings'
        }
      ];
    }, 200);
  }

  tabChange(event: MatTabChangeEvent) {
    this.activeTab = event.index;
  }

  openButtonSheet(bottomSheetConfig: SoftPhoneBottomSheetInterface) {
    bottomSheetConfig.bottomSheetRef = this.bottomSheet;

    this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
  }

  call(data: any) {
    this.openButtonSheet(data);
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
