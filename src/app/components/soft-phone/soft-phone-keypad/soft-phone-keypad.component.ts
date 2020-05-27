import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SoftPhoneContactsComponent} from '../soft-phone-contacts/soft-phone-contacts.component';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';

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

  numeric: string = '';

  keys: Array<KeysInterface> = [
    {num: '1', f1: 697, f2: 1209}, {num: '2', f1: 697, f2: 1336}, {num: '3', f1: 697, f2: 1477},
    {num: '4', f1: 770, f2: 1209}, {num: '5', f1: 770, f2: 1336}, {num: '6', f1: 770, f2: 1477},
    {num: '7', f1: 852, f2: 1209}, {num: '8', f1: 852, f2: 1336}, {num: '9', f1: 852, f2: 1477},
    {num: '*', f1: 941, f2: 1209}, {num: '0', f1: 941, f2: 1336}, {num: '#', f1: 941, f2: 1477}
  ];

  constructor() {
  }

  ngOnInit(): void {

  }

  keyPress(event, key: KeysInterface) {
    this.numeric += key.num;
  }

  removeFromNumber() {
    this.numeric = this.numeric.substring(0, this.numeric.length - 1);

    console.log(this.numeric);
  }

  changeNumber(event) {
    this.numeric = event;
  }

  openButtonSheet() {
    this.triggerBottomSheet.emit({
      component: SoftPhoneContactsComponent,
      height: '90%'
    });
  }
}
