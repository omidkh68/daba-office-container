import {Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform} from '@angular/core';
import {UserInterface} from '../../users/logic/user-interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

@Component({
  selector: 'app-soft-phone-information',
  templateUrl: './soft-phone-information.component.html',
  styleUrls: ['./soft-phone-information.component.scss']
})
export class SoftPhoneInformationComponent implements OnInit {
  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  @Input()
  loggedInUser: UserInterface;

  filterArgs = null;

  constructor() {
  }

  ngOnInit(): void {
    this.filterArgs = {adminId: this.loggedInUser.adminId};
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

@Pipe({
  name: 'myFilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter((item: SoftphoneUserInterface) => item.adminId !== filter.adminId);
  }
}
