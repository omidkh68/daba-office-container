import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';
import {UserInterface} from '../../users/logic/user-interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

@Component({
  selector: 'app-soft-phone-logs',
  templateUrl: './soft-phone-logs.component.html',
  styleUrls: ['./soft-phone-logs.component.scss']
})
export class SoftPhoneLogsComponent {
  @Output()
  triggerBottomSheet: EventEmitter<BottomSheetInterface> = new EventEmitter<BottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  @Input()
  loggedInUser: UserInterface;

  constructor() {
  }

  openSheet(user: SoftphoneUserInterface) {
    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      width: '98%',
      data: user
    });
  }
}
