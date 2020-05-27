import {Component, OnInit} from '@angular/core';
import {UserInterface} from '../../users/logic/user-interface';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';

@Component({
  selector: 'app-soft-phone-call-to-action',
  templateUrl: './soft-phone-call-to-action.component.html',
  styleUrls: ['./soft-phone-call-to-action.component.scss']
})
export class SoftPhoneCallToActionComponent implements OnInit {
  bottomSheetData: BottomSheetInterface;
  user: UserInterface;

  constructor() {

  }

  ngOnInit(): void {
    this.user = this.bottomSheetData.data;
  }

  closeBottomSheet() {
    this.bottomSheetData.bottomSheetRef.close();
  }
}
