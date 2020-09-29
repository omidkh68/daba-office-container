import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInfoService} from '../users/services/user-info.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {CompanySelectorService} from './services/company-selector.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(100, [
            animate('0.2s', style({opacity: 0}))
          ])
        ], {optional: true}),
        query(':enter', [
          style({opacity: 0}),
          stagger(100, [
            animate('0.2s', style({opacity: 1}))
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class SelectCompanyComponent {
  rtlDirection;
  companies = [
    {
      id: 1,
      name: 'Imen Daba Parsian',
      logo: 'daba.png'
    },
    {
      id: 2,
      name: 'Daba Marketing',
      logo: 'daba.png'
    },
    {
      id: 3,
      name: 'Amoozeshgah Rah Amoozan Yekta',
      logo: 'daba.png'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private userInfoService: UserInfoService,
              private viewDirectionService: ViewDirectionService,
              private companySelectorService: CompanySelectorService) {
    this._subscription.add(
      this.viewDirectionService.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  goToHome(companyId: number) {
    // companyId
    this.router.navigateByUrl(`/`);

    this.companySelectorService.changeCompanyList(this.companies);
  }

  goToLogin() {
    this.userInfoService.changeLoginData(null);
    this.router.navigateByUrl(`/login`);
  }
}
