import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform} from '@angular/core';
import * as lodash from 'lodash';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../services/message.service';
import {SoftPhoneService} from '../service/soft-phone.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ExtensionInterface} from '../logic/extension.interface';
import {ResultApiInterface} from '../logic/result-api.interface';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
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
export class SoftPhoneInformationComponent implements OnInit, AfterViewInit {
  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface> = [];

  @Input()
  loggedInUser: UserContainerInterface;

  loggedInUserExtension: LoggedInUserExtensionInterface = null;
  filterArgs = null;
  callPopUpMinimizeStatus: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private apiService: ApiService,
              private messageService: MessageService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );
  }

  ngOnInit(): void {
    this.filterArgs = {email: this.loggedInUser.email};
  }

  ngAfterViewInit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'pbx'});

    this._subscription.add(
      this.apiService.getExtensionStatus().subscribe((resp: ResultApiInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        if (resp.success) {
          if (this.softPhoneUsers && this.softPhoneUsers.length) {
            const extensionsList: Array<ExtensionInterface> = lodash.merge(this.softPhoneUsers, resp.data);

            this.softPhoneService.changeSoftPhoneUsers(extensionsList);

            extensionsList.map(item => {
              if (item.username === this.loggedInUser.email) {
                this.loggedInUserExtension = {
                  user: this.loggedInUser,
                  extension: item
                }
              }

              if (item.is_online) {
                console.log(item);
              }
            });
          }
        } else {

        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
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
