import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {SoftPhoneService} from '../service/soft-phone.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ResultApiInterface} from '../logic/result-api.interface';
import {NotificationService} from '../../../services/notification.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ExtensionListInterface} from '../logic/extension-list.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneCallPopUpComponent} from '../soft-phone-call-pop-up/soft-phone-call-pop-up.component';
import {SoftPhoneBottomSheetComponent} from '../soft-phone-bottom-sheet/soft-phone-bottom-sheet.component';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';

export interface TabInterface {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-soft-phone-main',
  templateUrl: './soft-phone-main.component.html',
  styleUrls: ['./soft-phone-main.component.scss']
})
export class SoftPhoneMainComponent extends LoginDataClass implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: SoftPhoneBottomSheetComponent;
  @ViewChild('audioRemote', {static: false}) audioRemote: ElementRef;
  @ViewChild('ringtone', {static: false}) ringtone: ElementRef;
  @ViewChild('ringbacktone', {static: false}) ringbacktone: ElementRef;
  @ViewChild('dtmfTone', {static: false}) dtmfTone: ElementRef;

  rtlDirection: boolean;
  activeTab: number = 1;
  tabs: Array<TabInterface> = [];

  softPhoneUsers: Array<SoftphoneUserInterface> = [
    {
      id: 9,
      name: 'آقای بصیری',
      email: 'seanbassiri@gmail.com',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: '',
    },
    {
      id: 46,
      name: 'omid',
      email: 'khosrojerdi@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    },
    {
      id: 16,
      name: 'مریم بهادری',
      email: 'm.bahadori@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    },
    {
      id: 47,
      name: 'مهدی مرجانی',
      email: 'marjani@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    },
    {
      id: 39,
      name: 'جواد موحدی',
      email: 'j.movahedi@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    },
    {
      id: 200,
      name: 'امیر اصغری',
      email: 'a.asghari@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    },
    {
      id: 41,
      name: 'محمدرضا رادان',
      email: 'm.radan@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    },
    {
      id: 36,
      name: 'محمود ملک لو',
      email: 'm.malekloo@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    },
    {
      id: 36,
      name: 'سید  محمد حسین سجادی',
      email: 'h.sajjadi@dabacenter.ir',
      created_at: '2020-06-23T08:53:17.000000Z',
      updated_at: '2020-06-23T08:53:17.000000Z',
      timezone: null,
      extension: ''
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private api: ApiService,
              private injector: Injector,
              private softPhoneService: SoftPhoneService,
              private notificationService: NotificationService,
              private translate: TranslateService,
              private userInfoService: UserInfoService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
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

  ngOnInit(): void {
    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.getExtensionList().subscribe((resp: ResultApiInterface) => {
        if (resp.success.toLowerCase() === 'true') {
          this.softPhoneUsers = this.softPhoneUsers.map(user => {
            const findExtension: ExtensionListInterface = resp.list.filter((item: ExtensionListInterface) => item.username === user.email).pop();

            if (findExtension) {
              user.extension = findExtension.extension_no;
            }

            return user;
          });
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
          name: this.getTranslate('soft_phone.main.status'),
          icon: 'home'
        },
        {
          name: this.getTranslate('soft_phone.main.address_book'),
          icon: 'contacts'
        },
        {
          name: this.getTranslate('soft_phone.main.dial_pad'),
          icon: 'dialpad'
        },
        {
          name: this.getTranslate('soft_phone.main.call_logs'),
          icon: 'settings_phone'
        },/*
        {
          name: this.getTranslate('global.settings'),
          icon: 'settings'
        },*/
        {
          name: this.getTranslate('soft_phone.main.public_room'),
          icon: 'group'
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
