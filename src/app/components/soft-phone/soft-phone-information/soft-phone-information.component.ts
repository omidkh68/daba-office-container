import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Pipe,
  PipeTransform
} from '@angular/core';
import {timer} from 'rxjs';
import * as lodash from 'lodash';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ExtensionInterface} from '../logic/extension.interface';
import {ResultApiInterface} from '../logic/result-api.interface';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

export interface LoggedInUserExtensionInterface {
  user: UserContainerInterface,
  extension: SoftphoneUserInterface
}

@Component({
  selector: 'app-soft-phone-information',
  templateUrl: './soft-phone-information.component.html',
  styleUrls: ['./soft-phone-information.component.scss']
})
export class SoftPhoneInformationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface> = [];

  @Input()
  loggedInUser: UserContainerInterface;

  timerDueTime: number = 0;
  timerPeriod: number = 10000;
  globalTimer = null;
  globalTimerSubscription: Subscription;
  loggedInUserExtension: LoggedInUserExtensionInterface = null;
  filterArgs = null;
  callPopUpMinimizeStatus: boolean = false;
  softphoneConnectedStatus: boolean = false;

  private extensionStatusSubscription: Subscription;
  private _subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private messageService: MessageService,
              private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private refreshLoginService: RefreshLoginService) {
    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );
  }

  ngOnInit(): void {
    this.filterArgs = {email: this.loggedInUser.email};
  }

  ngAfterViewInit(): void {
    this.globalTimer = timer(
      this.timerDueTime, this.timerPeriod
    );

    this.globalTimerSubscription = this.globalTimer.subscribe(() => this.getExtensionStatus());
  }

  getExtensionStatus() {
    if (this.extensionStatusSubscription) {
      this.extensionStatusSubscription.unsubscribe();
    }

    this.extensionStatusSubscription = this.apiService.getExtensionStatus().subscribe((resp: ResultApiInterface) => {
      if (resp.success) {
        if (this.softPhoneUsers && this.softPhoneUsers.length) {
          const extensionsList: Array<ExtensionInterface> = lodash.merge(this.softPhoneUsers, resp.data);

          this.softPhoneService.changeSoftPhoneUsers(extensionsList);

          this.softphoneConnectedStatus = this.softPhoneService.getSoftphoneConnectedStatus();

          extensionsList.map(item => {
            if (item.username === this.loggedInUser.email) {
              this.loggedInUserExtension = {
                user: this.loggedInUser,
                extension: item
              }
            }
          });
        }
      }
    }, (error: HttpErrorResponse) => {
      this.refreshLoginService.openLoginDialog(error);
    });
  }

  openSheet(user) {
    if (this.callPopUpMinimizeStatus) {
      this.messageService.showMessage(this.getTranslate('soft_phone.main.you_are_in_call'));

      return;
    }

    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      width: '98%',
      data: user
    });
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  changeSoftphoneStatus(event: MatSlideToggleChange) {
    if (event.checked) {
      this.softPhoneService.sipRegister();
    } else {
      this.softPhoneService.sipUnRegister();
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
      this.globalTimer = null;
    }
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
