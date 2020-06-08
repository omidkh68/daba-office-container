import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UserInterface} from '../../users/logic/user-interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneBottomSheetComponent} from '../soft-phone-bottom-sheet/soft-phone-bottom-sheet.component';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';
import {SoftPhoneContactDetailComponent} from './soft-phone-contact-detail/soft-phone-contact-detail.component';

@Component({
  selector: 'app-soft-phone-contacts',
  templateUrl: './soft-phone-contacts.component.html',
  styleUrls: ['./soft-phone-contacts.component.scss']
})
export class SoftPhoneContactsComponent implements OnInit {
  @ViewChild('bottomSheet', {static: false}) bottomSheet: SoftPhoneBottomSheetComponent;

  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;
  filteredUsers: Array<SoftphoneUserInterface>;

  @Input()
  loggedInUser: UserInterface;

  constructor() {
  }

  ngOnInit(): void {
    this.assignCopy();
  }

  filterContacts(value) {
    if (!value) {
      this.assignCopy();
    }

    this.filteredUsers = Object.assign([], this.softPhoneUsers).filter(
      (item: SoftphoneUserInterface) => (item.name + '' + item.family).toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  assignCopy() {
    this.filteredUsers = Object.assign([], this.softPhoneUsers);
  }

  openSheet(contact) {
    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      width: '98%',
      data: contact
    });
  }

  addNewContact() {
    this.triggerBottomSheet.emit({
      component: SoftPhoneContactDetailComponent,
      height: '270px',
      width: '98%'
    });
  }

  editContact(contact) {
    this.triggerBottomSheet.emit({
      component: SoftPhoneContactDetailComponent,
      height: '270px',
      width: '98%',
      data: {...contact, action: 'edit'}
    });
  }
}
