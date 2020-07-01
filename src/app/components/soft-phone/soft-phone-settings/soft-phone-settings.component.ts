import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

@Component({
  selector: 'app-soft-phone-settings',
  templateUrl: './soft-phone-settings.component.html',
  styleUrls: ['./soft-phone-settings.component.scss']
})
export class SoftPhoneSettingsComponent implements OnInit {
  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface> = [];

  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  publicConference: Array<SoftphoneUserInterface> = [];

  constructor() {
  }

  ngOnInit(): void {
    this.publicConference.push({
      id: -1,
      name: 'Daba Employees',
      email: '',
      extension_no: '9999',
    });
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
