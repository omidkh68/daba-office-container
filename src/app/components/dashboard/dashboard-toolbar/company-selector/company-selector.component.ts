import {Component, Input, OnDestroy} from '@angular/core';
import {ApiService} from '../../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../../message/service/message.service';
import {UserInfoService} from '../../../users/services/user-info.service';
import {CompanyInterface} from '../../../select-company/logic/company-interface';
import {TranslateService} from '@ngx-translate/core';
import {CheckLoginInterface} from '../../../login/logic/check-login.interface';
import {ChangeStatusService} from '../../../status/services/change-status.service';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {ViewDirectionService} from '../../../../services/view-direction.service';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
import {CompanySelectorService} from '../../../select-company/services/company-selector.service';

@Component({
  selector: 'app-company-selector',
  templateUrl: './company-selector.component.html',
  styleUrls: ['./company-selector.component.scss']
})
export class CompanySelectorComponent implements OnDestroy {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection: boolean;

  companyList: Array<CompanyInterface> = null;
  currentCompany: CompanyInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private changeStatusService: ChangeStatusService,
              private windowManagerService: WindowManagerService,
              private companySelectorService: CompanySelectorService) {
    this._subscription.add(
      this.companySelectorService.currentCompanyList.subscribe(companyList => this.companyList = companyList)
    );

    this._subscription.add(
      this.companySelectorService.currentSelectedCompany.subscribe(company => this.currentCompany = company)
    );
  }

  selectCompany(company: CompanyInterface) {
    if (this.currentCompany.id === company.id) {
      return;
    }

    this.companySelectorService.changeSelectedCompany(company);

    setTimeout(() => {
      this._subscription.add(
        this.apiService.checkLogin().subscribe((resp: CheckLoginInterface) => {
          this.windowManagerService.closeAllServices().then(() => {
            this.userInfoService.changeUserInfo(resp.data);

            this.viewDirection.changeDirection(resp.data.lang === 'fa');

            this.changeStatusService.changeUserStatus(resp.data.user_status);

            this.companySelectorService.changeCompanyList(resp.data.companies);

            let translateTitle = 'select_company.your_default_company';

            let titleMessage = this.getTranslate(translateTitle) + ' (' + company.name + ')';

            if (this.rtlDirection) {
              titleMessage += ' ' + this.getTranslate('select_company.is');
            }

            this.messageService.showMessage(titleMessage)
          });
        })
      )
    }, 500);
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
