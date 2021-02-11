import {Component, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {ElectronService} from '../../../core/services';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {NotificationService} from '../../../services/notification.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';

@Component({
  selector: 'app-soft-phone-incoming-call',
  templateUrl: './soft-phone-incoming-call.component.html'
})
export class SoftPhoneIncomingCallComponent implements OnDestroy {
  @Input()
  rtlDirection;

  currentPhoneNumber = '';
  incomingStatus = false;
  incomingData: any = null;
  softPhoneUsers: Array<SoftphoneUserInterface> = [];
  onCallUser: SoftphoneUserInterface | null = null;

  private _subscription: Subscription = new Subscription();

  constructor(private electronService: ElectronService,
              private translateService: TranslateService,
              private softPhoneService: SoftPhoneService,
              private notificationService: NotificationService,
              private companySelectorService: CompanySelectorService) {
    this._subscription.add(
      this.softPhoneService.currentSoftPhoneUsers.subscribe(softPhoneUsers => this.softPhoneUsers = softPhoneUsers)
    );

    this._subscription.add(
      this.softPhoneService.currentIncomingCallStatus.subscribe(incomingCall => {
        if (incomingCall) {
          this.incomingStatus = incomingCall.status;

          if (incomingCall.data) {
            this.incomingData = incomingCall.data;

            this.currentPhoneNumber = this.incomingData.o_event.o_session.o_uri_from.s_user_name;

            const defaultCompany: CompanyInterface = this.companySelectorService.currentCompany;

            this.currentPhoneNumber = this.currentPhoneNumber.replace(`-${defaultCompany.subdomain}`, '');

            let callerID = '';

            const translateIncomingCall = this.getTranslate('soft_phone.incoming_call.want_to_call_with_you');

            if (this.softPhoneUsers) {
              const currentUser = this.softPhoneUsers.filter(user => user.extension_no === this.currentPhoneNumber).pop();

              if (currentUser) {
                this.onCallUser = currentUser;
                this.onCallUser.extension_no = this.currentPhoneNumber;

                callerID = currentUser.extension_name;
              } else {
                callerID = this.getTranslate('soft_phone.incoming_call.unknown_caller');
              }

              if (this.electronService.isElectron && !this.electronService.remote.getCurrentWindow().isFocused()) {
                const notification: Notification = new Notification(`${callerID} ${translateIncomingCall}`, {
                  body: this.getTranslate('soft_phone.incoming_call.do_you_accept'),
                  icon: 'assets/profileImg/' + currentUser.username + '.jpg',
                  dir: 'auto',
                  data: currentUser
                });

                this.notificationService.changeCurrentNotification(notification);
              }
            }
          }
        }
      })
    );

    this._subscription.add(
      this.notificationService.currentNotification.subscribe(notification => {
        if (notification) {
          notification.onclick = () => {
            if (this.electronService.isElectron) {
              this.electronService.remote.getCurrentWindow().show();
            }
          };

          notification.onclose = () => {
            this.decline_call();
          };
        }
      })
    );
  }

  decline_call(): void {
    this.softPhoneService.sipHangUp();
    this.softPhoneService.changeIncomingCallStatus({status: false});
  }

  accept_call(): void {
    this.softPhoneService.sipCall('call-audio');
    this.softPhoneService.changeOnCallUser(this.onCallUser);
    this.softPhoneService.changeIncomingCallStatus({status: false});
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
