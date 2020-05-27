import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserInterface} from '../../users/logic/user-interface';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

@Component({
  selector: 'app-soft-phone-information',
  templateUrl: './soft-phone-information.component.html',
  styleUrls: ['./soft-phone-information.component.scss']
})
export class SoftPhoneInformationComponent implements OnInit {
  @Output()
  triggerBottomSheet: EventEmitter<BottomSheetInterface> = new EventEmitter<BottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  loggedInUser: UserInterface;

  users: Array<UserInterface> = [
    {
      adminId: 9,
      username: 'seanBassiri',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      name: 'آقای',
      family: 'بصیری',
      email: 'seanbassiri@gmail.com',
      status: '1',
      permission: '111111000000000000001111111111100000000011100000000000000000111111000000000000000',
      darkMode: 0,
      creationDate: '2020-05-26 04:27:13',
      role: {
        roleId: 1,
        roleNameEn: 'Manager',
        roleNameFa: 'مدیر ارشد'
      }
    },
    {
      adminId: 16,
      username: 'mbahadori',
      password: '1403301a5cce4b5c802bd23cda0d09ed',
      name: 'مریم',
      family: 'بهادری',
      email: 'm.bahadori@dabacenter.ir',
      status: '0',
      permission: '111111000000000000001111111111110000000011100000000000000000111111000000000000000',
      darkMode: 0,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 1,
        roleNameEn: 'Manager',
        roleNameFa: 'مدیر ارشد'
      }
    },
    {
      adminId: 4,
      username: 'mmarjani',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      name: 'مهدی',
      family: 'مرجانی',
      email: 'marjani@dabacenter.ir',
      status: '1',
      permission: '100011000000000000001111110101000000000011100000000000000000100001000000000000000',
      darkMode: 1,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 20,
        roleNameEn: 'Responsible Developer',
        roleNameFa: 'مسئول توسعه دهنده ها'
      }
    },
    {
      adminId: 36,
      username: 'm.malekloo',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      name: 'محمود',
      family: 'ملک لو',
      email: 'm.malekloo@dabacenter.ir',
      status: '1',
      permission: '100001000000000000001111111111110000000011100000000000000000100001000000000000000',
      darkMode: 0,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 20,
        roleNameEn: 'Responsible Developer',
        roleNameFa: 'مسئول توسعه دهنده ها'
      }
    },
    {
      adminId: 41,
      username: 'm.radan',
      password: 'd35f65d24bef8031480a1c8f7a70e69c',
      name: 'محمدرضا',
      family: 'رادان',
      email: 'm.radan@dabacenter.ir',
      status: '0',
      permission: '100001000000000000001111111111110000000011100000000000000000100001000000000000000',
      darkMode: 0,
      creationDate: '2020-05-27 16:57:13',
      role: {
        roleId: 1,
        roleNameEn: 'Manager',
        roleNameFa: 'مدیر ارشد'
      }
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  openSheet(user) {
    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      data: user
    });
  }
}
