import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {SoftPhoneService} from '../service/soft-phone.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {HttpErrorResponse} from '@angular/common/http';
import {ResultApiInterface} from '../logic/result-api.interface';
import {NotificationService} from '../../../services/notification.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {SoftPhoneCallPopUpComponent} from '../soft-phone-call-pop-up/soft-phone-call-pop-up.component';
import {SoftPhoneBottomSheetComponent} from '../soft-phone-bottom-sheet/soft-phone-bottom-sheet.component';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {FormControl} from '@angular/forms';

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
  loadingIndicator: LoadingIndicatorInterface = null;
  activeTab = new FormControl(0);
  tabs: Array<TabInterface> = [];
  callPopUpMinimizeStatus: boolean = false;
  softPhoneUsers: Array<SoftphoneUserInterface> = [];

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private injector: Injector,
              private translate: TranslateService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private viewDirection: ViewDirectionService,
              private notificationService: NotificationService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;

        this.changeMainTabLanguage();
      })
    );

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.softPhoneService.currentSoftPhoneUsers.subscribe(users => this.softPhoneUsers = users)
    );

    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );

    this._subscription.add(
      this.softPhoneService.currentActiveTab.subscribe(tab => this.activeTab.setValue(tab))
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
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'pbx'});

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.getExtensionList().subscribe((resp: ResultApiInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        if (resp.success) {
          const extensionList = resp.data.filter(item => item.extension_type === '2' && item.username.length > 10);

          this.softPhoneService.changeSoftPhoneUsers(extensionList);

          this.softPhoneService.changeExtensionList(extensionList).then(() => {
            this.softPhoneUsers = extensionList;

            this.softPhoneService.sipRegister();
          });
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        this.refreshLoginService.openLoginDialog(error);
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

    this.changeMainTabLanguage();
  }

  changeMainTabLanguage() {
    setTimeout(() => {
      this.tabs = [
        {
          name: this.getTranslate('soft_phone.main.status'),
          icon: 'home'
        },
        /*{ // todo : fix this in release
          name: this.getTranslate('soft_phone.main.address_book'),
          icon: 'contacts'
        },*/
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
    this.activeTab.setValue(event.index);
  }

  openButtonSheet(bottomSheetConfig: SoftPhoneBottomSheetInterface) {
    try {
      bottomSheetConfig.bottomSheetRef = this.bottomSheet;

      this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
    } catch (e) {
      console.log(e);
    }
  }

  call(data: any) {
    this.openButtonSheet(data);
  }

  maximizeCallPopUp() {
    this.softPhoneService.changeMinimizeCallPopUp(false);
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this.softPhoneService.sipHangUp();
  }
}
