import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
  SimpleChanges
} from '@angular/core';
import {timer} from 'rxjs';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ExtensionInterface, MuteUnMuteInterface} from '../logic/extension.interface';
import {ResultApiInterface, ResultMuteUnMuteApiInterface} from '../logic/result-api.interface';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

export interface LoggedInUserExtensionInterface {
  user: UserContainerInterface,
  extension: SoftphoneUserInterface
}

@Component({
  selector: 'app-soft-phone-information',
  templateUrl: './soft-phone-information.component.html',
  styleUrls: ['./soft-phone-information.component.scss']
})
export class SoftPhoneInformationComponent extends LoginDataClass implements OnInit, OnChanges, OnDestroy {
  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Input()
  rtlDirection = false;

  @Input()
  activePermissionRequest: string;

  @Input()
  tabId = 0;

  softPhoneUsers: Array<SoftphoneUserInterface> = [];

  timerDueTime = 0;
  timerPeriod = 15000;
  globalTimer = null;
  globalTimerSubscription: Subscription;
  loggedInUserExtension: LoggedInUserExtensionInterface = null;
  filterArgs = '';
  callPopUpMinimizeStatus = false;
  softphoneConnectedStatus = false;
  currentIp = '';

  private extensionStatusSubscription: Subscription = new Subscription();
  private softphoneConnectedStatusSubscription: Subscription = new Subscription();
  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private http: HttpClient,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );

    this._subscription.add(
      this.softPhoneService.currentConnectedCall.subscribe(connectedCall => {
        if (connectedCall) {
          this.clearTimer();
        }
      })
    );

    this._subscription.add(
      this.softPhoneService.currentCloseSoftphone.subscribe(status => {
        if (status) {
          this.ngOnDestroy();
        }
      })
    );
  }

  ngOnInit(): void {
    this.filterArgs = this.loggedInUser.email;
  }

  async getEssentialData(): Promise<any> {
    await this.getExtensions();
    await this.setDefaultUnMuteExtension();
    this.startTimer();
  }

  getExtensions(): Promise<boolean> {
    return new Promise((resolve) => {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'pbx'});

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.getExtensionList().subscribe((resp: ResultApiInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

          if (resp.success) {
            const extensionList = resp.data.filter(item => item.extension_type === '2' && item.username.length > 10);

            this.softPhoneService.changeExtensionList(extensionList).then(() => {
              this.softPhoneUsers = extensionList;

              this.softPhoneService.sipRegister();
            });

            resolve(true);
          }
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message, 'error');
          }

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

          this.refreshLoginService.openLoginDialog(error);

          resolve(true);
        })
      );
    });
  }

  getExtensionStatus(): void {
    if (this.extensionStatusSubscription) {
      this.extensionStatusSubscription.unsubscribe();
    }

    this.extensionStatusSubscription = this.apiService.getExtensionStatus().subscribe((resp: ResultApiInterface) => {
      if (resp.success) {
        if (this.currentIp && this.currentIp != resp.meta.ip) {
          this.softPhoneService.sipUnRegister();

          setTimeout(() => {
            this.softPhoneService.sipRegister();
          }, 500);
        }

        this.currentIp = resp.meta.ip;

        if (this.softPhoneUsers && this.softPhoneUsers.length) {
          const extensionList = resp.data.filter(item => item.extension_type === '2' && item.username.length > 10);

          // const extensionsList: Array<ExtensionInterface> = lodash.merge(this.softPhoneUsers, extensionList);
          const extensionsList: Array<ExtensionInterface> = [];

          this.softPhoneUsers.map((softphoneUser: ExtensionInterface) => {
            const findExtStatus = extensionList.filter((ext: ExtensionInterface) => ext.username === softphoneUser.username).pop();

            if (findExtStatus) {
              extensionsList.push(findExtStatus);
            }
          });

          this.softPhoneUsers = extensionsList.sort((first: ExtensionInterface, second: ExtensionInterface) => {
            const a = first.is_online;
            const b = second.is_online;

            let comparison = 0;

            if (a > b) {
              comparison = -1;
            } else if (a < b) {
              comparison = 1;
            }

            return comparison;
          });

          this.softPhoneService.changeSoftPhoneUsers(this.softPhoneUsers);

          if (this.softphoneConnectedStatusSubscription) {
            this.softphoneConnectedStatusSubscription.unsubscribe();
          }

          this.softphoneConnectedStatusSubscription = this.softPhoneService.currentSoftphoneConnected.subscribe(status => {
            if (status) {
              this.softphoneConnectedStatus = this.softPhoneService.getSoftphoneConnectedStatus;

              extensionsList.map(item => {
                if (item.username === this.loggedInUser.email) {
                  this.loggedInUserExtension = {
                    user: this.loggedInUser,
                    extension: item
                  };
                }
              });
            }
          });
        }
      }
    }, (error: HttpErrorResponse) => {
      if (error.message) {
        this.messageService.showMessage(error.message, 'error');
      }
      this.clearTimer();

      this.refreshLoginService.openLoginDialog(error);
    });
  }

  setDefaultUnMuteExtension(): Promise<boolean> {
    return new Promise((resolve) => {
      const muteInfo: MuteUnMuteInterface = {
        extension_no: `${this.loggedInUser.extension_no}`,
        is_mute: 0
      };

      this._subscription.add(
        this.apiService.muteUnMute(muteInfo).subscribe(() => {
          resolve(true);
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message);
          }

          this.refreshLoginService.openLoginDialog(error);

          resolve(true);
        })
      );
    });
  }

  openSheet(user: SoftphoneUserInterface): void {
    if (this.callPopUpMinimizeStatus) {
      this.messageService.showMessage(this.getTranslate('soft_phone.main.you_are_in_call'));

      return;
    }

    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      width: '98%',
      data: user
    });
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  changeSoftphoneStatus(event: MatSlideToggleChange): void {
    if (event.checked) {
      this.softPhoneService.sipRegister();
    } else {
      this.softPhoneService.sipUnRegister();
    }
  }

  startTimer(): void {
    if (this.globalTimer) {
      this.globalTimer = null;
    }

    this.globalTimer = timer(
      this.timerDueTime, this.timerPeriod
    );

    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
    }

    this.globalTimerSubscription = this.globalTimer.subscribe(() => {
      if (this.globalTimer) {
        this.getExtensionStatus();
      }
    });
  }

  clearTimer(): void {
    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
      this.globalTimer = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tabId && changes.tabId.currentValue === 0 && this.activePermissionRequest === 'granted') {
      this.clearTimer();

      setTimeout(() => this.startTimer(), 200);
    } else {
      this.clearTimer();
    }

    if (changes.activePermissionRequest && changes.activePermissionRequest.currentValue === 'granted') {
      this.getEssentialData().finally();
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this.clearTimer();

    if (this.extensionStatusSubscription) {
      this.extensionStatusSubscription.unsubscribe();
    }

    if (this.softphoneConnectedStatusSubscription) {
      this.softphoneConnectedStatusSubscription.unsubscribe();
    }
  }
}

@Pipe({
  name: 'myFilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: Array<SoftphoneUserInterface>, filter: string): Array<SoftphoneUserInterface> {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item: SoftphoneUserInterface) => item.username !== filter);
  }
}
