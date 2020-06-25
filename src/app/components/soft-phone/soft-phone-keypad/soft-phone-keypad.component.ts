import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneCallPopUpComponent} from '../soft-phone-call-pop-up/soft-phone-call-pop-up.component';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneService} from '../service/soft-phone.service';

export interface KeysInterface {
  num: string;
}

@Component({
  selector: 'app-soft-phone-keypad',
  templateUrl: './soft-phone-keypad.component.html',
  styleUrls: ['./soft-phone-keypad.component.scss']
})
export class SoftPhoneKeypadComponent implements OnInit {
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

  numeric: string | any = '';
  oldNumeric: string | any = '';
  disableKeypad: boolean = false;

  keys: Array<KeysInterface> = [
    {num: '1'}, {num: '2'}, {num: '3'},
    {num: '4'}, {num: '5'}, {num: '6'},
    {num: '7'}, {num: '8'}, {num: '9'},
    {num: '*'}, {num: '0'}, {num: '#'}
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private softPhoneService: SoftPhoneService) {
  }

  ngOnInit(): void {

  }

  keyPress(event, key: KeysInterface) {
    this.numeric += key.num;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.numeric.includes(item.extension)).pop();

    this.softPhoneService.sipSendDTMF(key.num);

    if (contact) {
      this.oldNumeric = this.numeric;

      // this.numeric = contact.name + ' ' + contact.family;
      this.numeric = contact.name;
    }
  }

  removeFromNumber() {
    if (this.oldNumeric !== '') {
      this.numeric = this.oldNumeric;

      this.oldNumeric = '';
    } else {
      this.numeric = this.numeric.substring(0, this.numeric.length - 1);
    }
  }

  changeNumber(event) {
    this.numeric = event;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.numeric.includes(item.extension)).pop();

    if (contact) {
      this.oldNumeric = this.numeric;

      // this.numeric = contact.name + ' ' + contact.family;
      this.numeric = contact.name;
    }
  }

  openButtonSheet() {
    if (!this.numeric.length) {
      return;
    }

    let contactInfo: any;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.oldNumeric.includes(item.extension)).pop();

    if (contact) {
      contactInfo = contact;
    } else {
      contactInfo = this.numeric;
    }

    this.triggerBottomSheet.emit({
      component: SoftPhoneCallPopUpComponent,
      height: '100%',
      width: '100%',
      data: contactInfo
    });
  }

  transferCall() {
    this.disableKeypad = true;

    let contactInfo: any;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.oldNumeric.includes(item.extension)).pop();

    if (contact) {
      contactInfo = contact.extension;
    } else {
      contactInfo = this.numeric;
    }

    this.softPhoneService.sipTransfer(contactInfo);

    setTimeout(() => {
      this.triggerCloseBottomSheet.emit();
    }, 1000);
  }

  dismissTransferCall() {
    this.triggerCloseBottomSheet.emit();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
