import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {UserInterface} from '../../users/logic/user-interface';
import {BottomSheetComponent} from '../../bottom-sheet/bottom-sheet.component';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneUsersService} from '../service/soft-phone-users.service';
import {NotificationService} from '../../../services/notification.service';
import {SoftPhoneCallPopUpComponent} from '../soft-phone-keypad/soft-phone-call-pop-up/soft-phone-call-pop-up.component';
import {UserInfoService} from '../../users/services/user-info.service';
import {not} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-soft-phone-main',
  templateUrl: './soft-phone-main.component.html',
  styleUrls: ['./soft-phone-main.component.scss']
})
export class SoftPhoneMainComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: BottomSheetComponent;

  loggedInUser: UserInterface;
  rtlDirection: boolean;
  activeTab: number = 1;
  tabs = [
    {
      nameFa: 'وضعیت',
      nameEn: 'Status',
      icon: 'home'
    },
    {
      nameFa: 'دفتر تلفن',
      nameEn: 'Contacts',
      icon: 'contacts'
    },
    {
      nameFa: 'شماره گیر',
      nameEn: 'Keypad',
      icon: 'dialpad'
    },
    {
      nameFa: 'گزارش تماس',
      nameEn: 'Logs',
      icon: 'settings_phone'
    },
    {
      nameFa: 'تنظیمات',
      nameEn: 'Settings',
      icon: 'settings'
    }
  ];

  softPhoneUsers: Array<SoftphoneUserInterface> = [
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
      extension: '200',
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
      status: '0',
      permission: '111111000000000000001111111111110000000011100000000000000000111111000000000000000',
      darkMode: 0,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 1,
        roleNameEn: 'Manager',
        roleNameFa: 'مدیر ارشد'
      },
      extension: '202',
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
      extension: '09191166401',
      type: 'incoming',
      date: '2020-05-31',
      time: '12:19'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private softPhoneUsersService: SoftPhoneUsersService,
              private notificationService: NotificationService,
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
          const bottomSheetConfig: BottomSheetInterface = {
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
  }

  ngAfterViewInit(): void {
    this.softPhoneUsersService.changeSoftPhoneUsers(this.softPhoneUsers);
  }

  tabChange(event: MatTabChangeEvent) {
    this.activeTab = event.index;
  }

  openButtonSheet(bottomSheetConfig: BottomSheetInterface) {
    bottomSheetConfig.bottomSheetRef = this.bottomSheet;

    this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
  }

  call(data: any) {
    this.openButtonSheet(data);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
