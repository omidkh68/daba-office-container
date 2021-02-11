import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
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
  rtlDirection = false;

  @Input()
  fromPopUp = false;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  @Input()
  loggedInUser: UserContainerInterface;

  filteredUsers: Array<SoftphoneUserInterface>;
  bottomSheetData: SoftPhoneBottomSheetInterface;
  data: any;
  disableContacts = false;
  callPopUpMinimizeStatus = false;
  filterArgs = null;

  private _subscription: Subscription = new Subscription();

  constructor(private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private messageService: MessageService) {
    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );
  }

  ngOnInit(): void {
    this.assignCopy();

    this.filterArgs = {email: this.loggedInUser.email};
  }

  filterContacts(value: string): void {
    if (!value) {
      this.assignCopy();
    }

    this.filteredUsers = Object.assign([], this.softPhoneUsers).filter(
      // (item: SoftphoneUserInterface) => (item.name + '' + item.family).toLowerCase().indexOf(value.toLowerCase()) > -1
      (item: SoftphoneUserInterface) => (item.extension_name).toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  assignCopy(): void {
    this.filteredUsers = [...this.softPhoneUsers];
  }

  openSheet(contact: SoftphoneUserInterface): void {
    if (this.callPopUpMinimizeStatus) {
      this.messageService.showMessage(this.getTranslate('soft_phone.main.you_are_in_call'));

      return;
    }

    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      width: '98%',
      data: contact
    });
  }

  addNewContact(): void {
    if (this.callPopUpMinimizeStatus) {
      this.messageService.showMessage(this.getTranslate('soft_phone.main.you_are_in_call'));

      return;
    }

    this.triggerBottomSheet.emit({
      component: SoftPhoneContactDetailComponent,
      height: '270px',
      width: '98%'
    });
  }

  editContact(contact: SoftphoneUserInterface): void {
    if (this.callPopUpMinimizeStatus) {
      this.messageService.showMessage(this.getTranslate('soft_phone.main.you_are_in_call'));

      return;
    }

    this.triggerBottomSheet.emit({
      component: SoftPhoneContactDetailComponent,
      height: '270px',
      width: '98%',
      data: {...contact, action: 'edit'}
    });
  }

  transferCall(contact: SoftphoneUserInterface): void {
    this.disableContacts = true;

    this.softPhoneService.sipTransfer(contact.extension_no);

    setTimeout(() => this.triggerCloseBottomSheet.emit(), 1000);
  }

  dismissTransferCall(): void {
    this.triggerCloseBottomSheet.emit();
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }
}
