import {Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform, ViewChild} from '@angular/core';
// import {UserInterface} from '../../users/logic/user-interface';
import {SoftPhoneService} from '../service/soft-phone.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
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

  @Output()
  triggerCloseBottomSheet = new EventEmitter();

  @Input()
  rtlDirection: boolean;

  @Input()
  fromPopUp: boolean = false;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  @Input()
  loggedInUser: UserContainerInterface;

  filteredUsers: Array<SoftphoneUserInterface>;
  bottomSheetData: SoftPhoneBottomSheetInterface;
  data: any;
  disableContacts: boolean = false;
  filterArgs = null;

  constructor(private softPhoneService: SoftPhoneService) {
  }

  ngOnInit(): void {
    this.assignCopy();

    this.filterArgs = {email: this.loggedInUser.email};
  }

  filterContacts(value) {
    if (!value) {
      this.assignCopy();
    }

    this.filteredUsers = Object.assign([], this.softPhoneUsers).filter(
      // (item: SoftphoneUserInterface) => (item.name + '' + item.family).toLowerCase().indexOf(value.toLowerCase()) > -1
      (item: SoftphoneUserInterface) => (item.extension_name).toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  assignCopy() {
    this.filteredUsers = Object.assign([], this.softPhoneUsers);
  }

  openSheet(contact: SoftphoneUserInterface) {
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

  transferCall(contact: SoftphoneUserInterface) {
    this.disableContacts = true;

    this.softPhoneService.sipTransfer(contact.extension_no);

    setTimeout(() => {
      this.triggerCloseBottomSheet.emit();
    }, 1000);
  }

  dismissTransferCall() {
    this.triggerCloseBottomSheet.emit();
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
    return items.filter((item: SoftphoneUserInterface) => item.username !== filter.email);
  }
}
