import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
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

  loggedInUser: UserInterface;
  rtlDirection: boolean;
  activeTab: number = 1;
  tabs = [];

  softPhoneUsers: Array<SoftphoneUserInterface> = [
    {
      adminId: 1,
      username: 'o.khosrojerdi',
      password: '06df60287a737ebf3a177bd3b2c47e01',
      name: 'امید',
      family: 'خسروجردی',
      email: 'khosrojerdi@dabacenter.ir',
      status: '1',
      permission: '111111000000000000001111111111100000000011100000000000000000111111000000000000000',
      darkMode: 1,
      creationDate: '0000-00-00 00:00:00',
      role: {
        roleId: 9,
        roleNameEn: 'UI Manager',
        roleNameFa: 'مدیر بخش کاربری'
      },
      extension: '200',
      type: 'incoming',
      date: '2020-05-23',
      time: '10:53'
    },
    {
      adminId: 9,
      username: 'seanBassiri',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      name: 'آقای',
      family: 'بصیری',
      email: 'seanbassiri@gmail.com',
      status: '1',
      permission: '111111000000000000001111111111100000000011100000000000000000111111000000000000000',
      darkMode: 0,
      creationDate: '2020-05-26 04:27:13',
      role: {
        roleId: 1,
        roleNameEn: 'Manager',
        roleNameFa: 'مدیر ارشد'
      },
      extension: '6004',
      type: 'incoming',
      date: '2020-05-23',
      time: '10:53'
    },
    {
      adminId: 16,
      username: 'mbahadori',
      password: '1403301a5cce4b5c802bd23cda0d09ed',
      name: 'مریم',
      family: 'بهادری',
      email: 'm.bahadori@dabacenter.ir',
      status: '1',
      permission: '111111000000000000001111111111110000000011100000000000000000111111000000000000000',
      darkMode: 0,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 1,
        roleNameEn: 'Manager',
        roleNameFa: 'مدیر ارشد'
      },
      extension: '6007',
      type: 'outgoing',
      date: '2020-05-20',
      time: '13:21'
    },
    {
      adminId: 4,
      username: 'mmarjani',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      name: 'مهدی',
      family: 'مرجانی',
      email: 'marjani@dabacenter.ir',
      status: '1',
      permission: '100011000000000000001111110101000000000011100000000000000000100001000000000000000',
      darkMode: 1,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 20,
        roleNameEn: 'Responsible Developer',
        roleNameFa: 'مسئول توسعه دهنده ها'
      },
      extension: '231',
      type: 'incoming',
      date: '2020-05-18',
      time: '09:19'
    },
    {
      adminId: 41,
      username: 'm.radan',
      password: 'd35f65d24bef8031480a1c8f7a70e69c',
      name: 'محمدرضا',
      family: 'رادان',
      email: 'm.radan@dabacenter.ir',
      status: '0',
      permission: '100001000000000000001111111111110000000011100000000000000000100001000000000000000',
      darkMode: 0,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 1,
        roleNameEn: 'Manager',
        roleNameFa: 'مدیر ارشد'
      },
      extension: '209',
      type: 'missed',
      date: '2020-05-13',
      time: '14:44'
    },
    {
      adminId: 193,
      username: 'h.sajjadi',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      name: 'سید  محمد حسین',
      family: 'سجادی',
      email: 'h.sajjadi@dabacenter.ir',
      status: '1',
      permission: '00000100000000000000111100010000000000001100000000000000000000000000000000000000100000000000000000000',
      darkMode: 0,
      creationDate: '0000-00-00 00:00:00',
      role: {
        roleId: 11,
        roleNameEn: 'UI Designer',
        roleNameFa: 'طراح بخش کاربری'
      },
      extension: '6009',
      type: 'incoming',
      date: '2020-05-31',
      time: '12:19'
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

    this._subscription.add(
      this.notificationService.currentNotification.subscribe(notification => {
        if (notification) {
          const bottomSheetConfig: SoftPhoneBottomSheetInterface = {
            component: SoftPhoneCallPopUpComponent,
            height: '100%',
            width: '100%',
            data: notification.data ? notification.data : notification
          };

          /*notification.onclick = () => {
            console.log('in subscribe :D', notification.data);
          };*/

          this.openButtonSheet(bottomSheetConfig);
        }
      })
    );

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
