import {Component, Input, ViewEncapsulation} from '@angular/core';
import {WindowInterface} from '../logic/window.interface';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {ServiceInterface} from '../../services/logic/service-interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';

@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardToolbarComponent {
  @Input()
  rtlDirection: boolean;

  @Input()
  windowManager: Array<WindowInterface>;

  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  serviceList: Array<ServiceInterface>;

  companies: Array<CompanyInterface> = null;

  constructor(private companySelectorService: CompanySelectorService) {
    this.companies = this.companySelectorService.currentCompanies;
  }
}
