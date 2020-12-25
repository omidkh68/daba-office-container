import {Component, Injector, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppConfig} from '../../../environments/environment';
import {ApiService} from '../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../services/loginData.class';
import {LoginInterface} from '../login/logic/login.interface';
import {UserInfoService} from '../users/services/user-info.service';
import {ElectronService} from '../../core/services';
import {CompanyInterface} from './logic/company-interface';
import {RefreshLoginService} from '../login/services/refresh-login.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ResultCompanyInterface} from './logic/result-company-interface';
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
export class SelectCompanyComponent extends LoginDataClass implements OnInit {
  rtlDirection;
  companies: Array<CompanyInterface> = [];
  showBackLink: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private injector: Injector,
              private apiService: ApiService,
              private userInfoService: UserInfoService,
              private electronService: ElectronService,
              private refreshLoginService: RefreshLoginService,
              private viewDirectionService: ViewDirectionService,
              private companySelectorService: CompanySelectorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirectionService.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.getUserCompanies();
  }

  getUserCompanies() {
    if (this.loginData && this.loginData.token_type) {
      this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
    }

    this._subscription.add(
      this.apiService.getUserCompanies().subscribe((resp: ResultCompanyInterface) => {
        if (resp.success) {
          this.companies = resp.data;

          setTimeout(() => this.showBackLink = true, 500);

          if (this.companies.length === 1) {
            this.changeSelectedCompany(this.companies[0]).then(() => {
              this.router.navigateByUrl(`/`);
            });
          }
        }
      }, () => {
        this.userInfoService.changeLoginData(null);

        this.router.navigateByUrl(`/login`);
      })
    );
  }

  getLoginDataAndWriteCompanyInfo(company: CompanyInterface): Promise<LoginInterface | boolean> {
    return new Promise((resolve, reject) => {
      try {
        let loginData;
        let loginDataPath;

        if (this.electronService.isElectron) {
          const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

          loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

          loginData = this.electronService.fs.readFileSync(loginDataPath, 'utf8');
        } else {
          loginData = localStorage.getItem('loginData');
        }

        if (!loginData) {
          reject(false);
        } else {
          let data = JSON.parse(loginData);

          data = {...data, company: company};

          if (this.electronService.isElectron) {
            this.electronService.fs.writeFileSync(loginDataPath, JSON.stringify(data));
          } else {
            localStorage.setItem('loginData', JSON.stringify(data));
          }

          resolve(true);
        }
      } catch (e) {
        reject(false);
      }
    });
  }

  changeSelectedCompany(company: CompanyInterface) {
    return new Promise((resolve) => {
      this.getLoginDataAndWriteCompanyInfo(company).then(() => {
        this.companySelectorService.changeSelectedCompany(company);

        resolve(true);
      })
    });
  }

  goHome(company: CompanyInterface) {
    this.changeSelectedCompany(company).then(() => {
      this.router.navigateByUrl(`/`);
    });
  }

  goToLogin() {
    this.userInfoService.changeLoginData(null);

    setTimeout(() => this.showBackLink = false, 500);

    this.router.navigateByUrl(`/login`);
  }
}
