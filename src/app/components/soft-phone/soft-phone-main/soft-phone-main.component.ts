import {Component, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {UserInterface} from '../../users/logic/user-interface';
import {UserInfoService} from '../../../services/user-info.service';
import {BottomSheetComponent} from '../../bottom-sheet/bottom-sheet.component';
import {BottomSheetInterface} from '../../bottom-sheet/logic/bottomSheet.interface';

@Component({
  selector: 'app-soft-phone-main',
  templateUrl: './soft-phone-main.component.html',
  styleUrls: ['./soft-phone-main.component.scss']
})
export class SoftPhoneMainComponent implements OnInit, OnDestroy {
  @ViewChild('bottomSheet', {static: true}) bottomSheet: BottomSheetComponent;

  loggedInUser: UserInterface;
  rtlDirection: boolean;
  activeTab: number = 0;
  tabs = [
    {
      nameFa: 'وضعیت',
      nameEn: 'Status',
      icon: 'home'
    },
    {
      nameFa: 'دفتر تلفن',
      nameEn: 'Contacts',
      icon: 'contacts'
    },
    {
      nameFa: 'شماره گیر',
      nameEn: 'Keypad',
      icon: 'dialpad'
    },
    {
      nameFa: 'گزارش تماس',
      nameEn: 'Logs',
      icon: 'settings_phone'
    },
    {
      nameFa: 'تنظیمات',
      nameEn: 'Settings',
      icon: 'settings'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );
  }

  ngOnInit(): void {

  }

  tabChange(event: MatTabChangeEvent) {
    this.activeTab = event.index;
  }

  openButtonSheet(bottomSheetConfig: BottomSheetInterface) {
    this.bottomSheet.toggleBottomSheet(bottomSheetConfig);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
