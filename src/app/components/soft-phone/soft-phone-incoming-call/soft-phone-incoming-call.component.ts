import {Component, Input, OnDestroy} from '@angular/core';
import {SoftPhoneService} from '../service/soft-phone.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {Subscription} from 'rxjs/internal/Subscription';

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

  constructor(private softPhoneService: SoftPhoneService) {
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

            //if (this.softPhoneUsers && this.softPhoneUsers.length) {
              const currentUser = this.softPhoneUsers.filter(user => user.extension === this.currentPhoneNumber).pop();

              if (currentUser) {
                this.onCallUser = currentUser;
                this.onCallUser.extension = this.currentPhoneNumber;
              }
            //}
          }
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

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
