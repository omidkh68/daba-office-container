import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {SoftPhoneCallPopUpComponent} from './soft-phone-call-pop-up/soft-phone-call-pop-up.component';

export interface KeysInterface {
  num: string;
  f1: number;
  f2: number;
}

@Component({
  selector: 'app-soft-phone-keypad',
  templateUrl: './soft-phone-keypad.component.html',
  styleUrls: ['./soft-phone-keypad.component.scss']
})
export class SoftPhoneKeypadComponent implements OnInit {
  @Output()
  triggerBottomSheet: EventEmitter<BottomSheetInterface> = new EventEmitter<BottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  numeric: string | any = '';
  oldNumeric: string | any = '';

  keys: Array<KeysInterface> = [
    {num: '1', f1: 697, f2: 1209}, {num: '2', f1: 697, f2: 1336}, {num: '3', f1: 697, f2: 1477},
    {num: '4', f1: 770, f2: 1209}, {num: '5', f1: 770, f2: 1336}, {num: '6', f1: 770, f2: 1477},
    {num: '7', f1: 852, f2: 1209}, {num: '8', f1: 852, f2: 1336}, {num: '9', f1: 852, f2: 1477},
    {num: '*', f1: 941, f2: 1209}, {num: '0', f1: 941, f2: 1336}, {num: '#', f1: 941, f2: 1477}
  ];

  private _subscription: Subscription = new Subscription();

  constructor() {
  }

  ngOnInit(): void {

  }

  keyPress(event, key: KeysInterface) {
    this.numeric += key.num;

    const contact: SoftphoneUserInterface = this.softPhoneUsers.filter(item => this.numeric.includes(item.extension)).pop();

    if (contact) {
      this.oldNumeric = this.numeric;

      this.numeric = contact;
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

      this.numeric = contact;
    }
  }

  openButtonSheet() {
    if (!this.numeric.length) {
      return;
    }

    this.triggerBottomSheet.emit({
      component: SoftPhoneCallPopUpComponent,
      height: '100%',
      width: '100%',
      data: this.numeric
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
