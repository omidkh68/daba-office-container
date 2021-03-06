import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ResultConfApiInterface} from '../logic/result-api.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {SoftphoneConferenceInterface} from '../logic/softphone-conference.interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

@Component({
  selector: 'app-soft-phone-conference',
  templateUrl: './soft-phone-conference.component.html',
  styleUrls: ['./soft-phone-conference.component.scss']
})
export class SoftPhoneConferenceComponent extends LoginDataClass implements OnInit, OnChanges, OnDestroy {
  @Input()
  rtlDirection = false;

  @Input()
  tabId = 3;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface> = [];

  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  conferenceList: Array<SoftphoneConferenceInterface> = [];
  callPopUpMinimizeStatus = false;
  softPhoneConnectedStatus = false;

  private _subscription: Subscription = new Subscription();

  constructor(private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private injector: Injector,
              private apiService: ApiService,
              private refreshLoginService: RefreshLoginService,
              private userInfoService: UserInfoService,
              private loadingIndicatorService: LoadingIndicatorService,
              private messageService: MessageService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
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
    this._subscription.add(
      this.softPhoneService.currentSoftphoneConnected.subscribe((status: boolean) => this.softPhoneConnectedStatus = status)
    );
  }

  getConferenceList(): void {
    this.conferenceList = [];

    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'pbx'});

    this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.apiService.getConferenceList().subscribe((resp: ResultConfApiInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        if (resp.success) {
          resp.data.map(item => {
            const confTransferItem: SoftphoneConferenceInterface = {
              username: '0',
              is_online: 0,
              extension_name: item.conf_name,
              caller_id_number: item.conf_number,
              extension_no: item.conf_number,
              extension_type: '2',
              ...item
            };

            this.conferenceList.push(confTransferItem);
          });
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message, 'error');
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  openSheet(user: SoftphoneConferenceInterface): void {
    if (this.softPhoneConnectedStatus) {
      if (this.callPopUpMinimizeStatus) {
        this.messageService.showMessage(this.getTranslate('soft_phone.main.you_are_in_call'));

        return;
      }

      this.triggerBottomSheet.emit({
        component: SoftPhoneCallToActionComponent,
        height: '200px',
        width: '98%',
        data: {...user, type: 'conference'}
      });
    }
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tabId && changes.tabId.currentValue && changes.tabId.currentValue === 3) {
      this.getConferenceList();
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
