import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserInterface} from '../../users/logic/user-interface';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';

@Component({
  selector: 'app-soft-phone-information',
  templateUrl: './soft-phone-information.component.html',
  styleUrls: ['./soft-phone-information.component.scss']
})
export class SoftPhoneInformationComponent {
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

  openSheet(user) {
    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      width: '98%',
      data: user
    });
  }
}
