import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInfoService} from '../../users/services/user-info.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';

@Component({
  selector: 'app-soft-phone-transfer-call',
  templateUrl: './soft-phone-transfer-call.component.html',
  styleUrls: ['./soft-phone-transfer-call.component.scss']
})
export class SoftPhoneTransferCallComponent implements OnInit, OnDestroy {
  rtlDirection = false;
  bottomSheetData: SoftPhoneBottomSheetInterface;
  viewModeTypes = 'contact';
  loggedInUser: UserContainerInterface;
  softPhoneUsers: Array<SoftphoneUserInterface>;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private softPhoneService: SoftPhoneService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.softPhoneService.currentSoftPhoneUsers.subscribe(softPhoneUsers => this.softPhoneUsers = softPhoneUsers)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );
  }

  ngOnInit(): void {
  }

  changeViewMode(mode: string): void {
    this.viewModeTypes = mode;
  }

  closeTransferBottomSheet(): void {
    this.bottomSheetData.bottomSheetRef.close();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
