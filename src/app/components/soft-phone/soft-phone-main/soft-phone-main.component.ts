import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInfoService} from '../../users/services/user-info.service';
import {ElectronService} from '../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {SoftPhoneService} from '../service/soft-phone.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {NotificationService} from '../../../services/notification.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';
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
export class SoftPhoneMainComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: SoftPhoneBottomSheetComponent;
  @ViewChild('audioRemote', {static: false}) audioRemote: ElementRef<HTMLAudioElement>;
  @ViewChild('ringtone', {static: false}) ringtone: ElementRef<HTMLAudioElement>;
  @ViewChild('ringbacktone', {static: false}) ringbacktone: ElementRef<HTMLAudioElement>;
  @ViewChild('dtmfTone', {static: false}) dtmfTone: ElementRef<HTMLAudioElement>;

  rtlDirection = false;
  loadingIndicator: LoadingIndicatorInterface = null;
  activeTab = 0;
  tabs: Array<TabInterface> = [];
  callPopUpMinimizeStatus = false;
  softPhoneUsers: Array<SoftphoneUserInterface> = [];
  activePermissionRequest = 'prompt';

  private _subscription: Subscription = new Subscription();

  constructor(private translate: TranslateService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private viewDirection: ViewDirectionService,
              private notificationService: NotificationService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
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
      // this.softPhoneService.currentActiveTab.subscribe(tab => this.activeTab.setValue(tab))
      this.softPhoneService.currentActiveTab.subscribe(tab => this.activeTab = tab)
    );
  }

  ngOnInit(): void {
    this.microphonePremissionRequest();
  }

  ngAfterViewInit(): void {
    this.softPhoneService.changeAudioRemoteTag({
      audioRemote: this.audioRemote,
      ringtone: this.ringtone,
      ringbacktone: this.ringbacktone,
      dtmfTone: this.dtmfTone
    });

    this.changeMainTabLanguage();

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

  microphonePremissionRequest(): void {
    navigator.permissions.query({name: 'microphone'})
      .then((permission) => {
        this.activePermissionRequest = permission.state;
        if (this.activePermissionRequest != 'granted') {
          this.getPermissionAccess();
        }
      }).catch(() => {
        this.activePermissionRequest = null;
      });
  }

  changeMainTabLanguage(): void {
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
        },
        {
          name: this.getTranslate('soft_phone.main.public_room'),
          icon: 'group'
        },
        {
          name: this.getTranslate('global.settings'),
          icon: 'settings'
        }
      ];
    }, 200);
  }

  tabChange(event: MatTabChangeEvent): void {
    this.activeTab = event.index;
  }

  openButtonSheet(bottomSheetConfig: SoftPhoneBottomSheetInterface): void {
    try {
      bottomSheetConfig.bottomSheetRef = this.bottomSheet;

      this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
    } catch (e) {
      console.log(e);
    }
  }

  maximizeCallPopUp(): void {
    this.softPhoneService.changeMinimizeCallPopUp(false);
  }

  getPermissionAccess(): void {
    navigator.getUserMedia({audio: true}, () => {
      this.activePermissionRequest = 'granted';
    }, (err) => {
      if (err.message == 'Permission dismissed') {
        this.activePermissionRequest = 'prompt';
      } else {
        this.activePermissionRequest = 'denied';
      }
    });
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this.softPhoneService.sipHangUp();

    this.softPhoneService.sipUnRegister();
  }
}
