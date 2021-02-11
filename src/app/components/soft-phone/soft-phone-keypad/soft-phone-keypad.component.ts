import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {SoftPhoneCallPopUpComponent} from '../soft-phone-call-pop-up/soft-phone-call-pop-up.component';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';

export interface KeysInterface {
  num: string;
}

@Component({
  selector: 'app-soft-phone-keypad',
  templateUrl: './soft-phone-keypad.component.html',
  styleUrls: ['./soft-phone-keypad.component.scss']
})
export class SoftPhoneKeypadComponent {
  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Output()
  triggerCloseBottomSheet = new EventEmitter();

  @Input()
  rtlDirection = false;

  @Input()
  tabId = 1;

  @Input()
  fromPopUp = false;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  numeric: string | any = '';
  oldNumeric: string | any = '';
  disableKeypad = false;
  callPopUpMinimizeStatus = false;
  findContact: SoftphoneUserInterface = null;

  keys: Array<KeysInterface> = [
    {num: '1'}, {num: '2'}, {num: '3'},
    {num: '4'}, {num: '5'}, {num: '6'},
    {num: '7'}, {num: '8'}, {num: '9'},
    {num: '*'}, {num: '0'}, {num: '#'}
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private messageService: MessageService) {
    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );

    this._subscription.add(
      this.softPhoneService.currentCloseSoftphone.subscribe(status => {
        if (status) {
          this.ngOnDestroy();
        }
      })
    );
  }

  keyPress(key: KeysInterface): void {
    this.numeric += key.num;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.numeric === item.extension_no).pop();

    this.softPhoneService.sipSendDTMF(key.num);

    if (contact) {
      this.findContact = contact;
    } else {
      this.findContact = null;
    }
  }

  removeFromNumber(): void {
    if (this.oldNumeric !== '') {
      this.numeric = this.oldNumeric;

      this.oldNumeric = '';
    } else {
      this.numeric = this.numeric.substring(0, this.numeric.length - 1);

      const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.numeric === item.extension_no).pop();

      if (contact) {
        this.findContact = contact;
      } else {
        this.findContact = null;
      }
    }
  }

  changeNumber(event: number | any): void {
    this.numeric = event;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.numeric === item.extension_no).pop();

    if (contact) {
      this.findContact = contact;
    } else {
      this.findContact = null;
    }
  }

  openButtonSheet(): void {
    if (this.callPopUpMinimizeStatus) {
      this.messageService.showMessage(this.getTranslate('soft_phone.main.you_are_in_call'));

      return;
    }

    if (!this.numeric.length) {
      return;
    }

    let contactInfo: any;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.oldNumeric.includes(item.extension_no)).pop();

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

  transferCall(): void {
    this.disableKeypad = true;

    let contactInfo: any;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.oldNumeric.includes(item.extension_no)).pop();

    if (contact) {
      contactInfo = contact.extension_no;
    } else {
      contactInfo = this.numeric;
    }

    this.softPhoneService.sipTransfer(contactInfo);

    setTimeout(() => this.triggerCloseBottomSheet.emit(), 1000);
  }

  dismissTransferCall(): void {
    this.triggerCloseBottomSheet.emit();
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
