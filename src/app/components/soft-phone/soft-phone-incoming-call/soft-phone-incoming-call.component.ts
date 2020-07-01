import {Component, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {ElectronService} from '../../../services/electron.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../services/notification.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';

@Component({
  selector: 'app-soft-phone-incoming-call',
  templateUrl: './soft-phone-incoming-call.component.html'
})
export class SoftPhoneIncomingCallComponent implements OnDestroy {
  @Input()
  rtlDirection;

  currentPhoneNumber = '';
  incomingStatus: boolean = false;
  incomingData: any = null;
  softPhoneUsers: SoftphoneUserInterface[] = [];
  onCallUser: SoftphoneUserInterface | null = null;

  private _subscription: Subscription = new Subscription();

  constructor(private softPhoneService: SoftPhoneService,
              private notificationService: NotificationService,
              private translateService: TranslateService,
              private electronService: ElectronService) {
    this._subscription.add(
      this.softPhoneService.currentSoftPhoneUsers.subscribe(softPhoneUsers => this.softPhoneUsers = softPhoneUsers)
    );

    this._subscription.add(
      this.softPhoneService.currentIncomingCallStatus.subscribe(incomingCall => {
        if (incomingCall) {
          this.incomingStatus = incomingCall.status;

          if (incomingCall.data) {
            this.incomingData = incomingCall.data;
            this.currentPhoneNumber = this.incomingData.o_event.o_message.o_hdr_From.s_display_name;
            let callerID = '';
            const translateIncomingCall = this.getTranslate('soft_phone.incoming_call.want_to_call_with_you');

            if (this.softPhoneUsers) {
              const currentUser = this.softPhoneUsers.filter(user => user.extension_no === this.currentPhoneNumber).pop();

              if (currentUser) {
                this.onCallUser = currentUser;
                this.onCallUser.extension_no = this.currentPhoneNumber;

                // callerID = currentUser.name + ' ' + currentUser.family;
                callerID = currentUser.name;
              } else {
                callerID = this.getTranslate('soft_phone.incoming_call.unknown_caller');
              }

              if (!this.electronService.window.isFocused()) {
                const notification: Notification = new Notification(`${callerID} ${translateIncomingCall}`, {
                  body: this.getTranslate('soft_phone.incoming_call.do_you_accept'),
                  icon: 'assets/profileImg/' + currentUser.email + '.jpg',
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
            this.electronService.window.show();
          };

          notification.onclose = () => {
            this.decline_call();
          };
        }
      })
    );
  }

  decline_call() {
    this.softPhoneService.sipHangUp();
    this.softPhoneService.changeIncomingCallStatus({status: false});
  }

  accept_call() {
    this.softPhoneService.sipCall('call-audio');
    this.softPhoneService.changeOnCallUser(this.onCallUser);
    this.softPhoneService.changeIncomingCallStatus({status: false});
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
