import {Component, Input} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {CompanyInterface} from '../../../select-company/logic/company-interface';
import {CompanySelectorService} from '../../../select-company/services/company-selector.service';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';

@Component({
  selector: 'app-company-selector',
  templateUrl: './company-selector.component.html',
  styleUrls: ['./company-selector.component.scss']
})
export class CompanySelectorComponent {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection: boolean;

  companyList: Array<CompanyInterface> = null;

  private _subscription: Subscription = new Subscription();

  constructor(private companySelectorService: CompanySelectorService) {
    this._subscription.add(
      this.companySelectorService.currentCompanyList.subscribe(companyList => this.companyList = companyList)
    );
  }

  selectCompany(company: CompanyInterface) {
    console.log(company);
  }
}
