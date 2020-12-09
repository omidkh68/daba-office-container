import {Inject, Injectable, Injector, OnDestroy} from '@angular/core';
import {AppConfig} from '../../environments/environment';
import {ApiService} from '../components/users/logic/api.service';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginInterface} from '../components/login/logic/login.interface';
import {LoginDataClass} from '../services/loginData.class';
import {MessageService} from '../components/message/service/message.service';
import {UserInfoService} from '../components/users/services/user-info.service';
import {ElectronService} from '../services/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {ChangeStatusService} from '../components/status/services/change-status.service';
import {CheckLoginInterface} from '../components/login/logic/check-login.interface';
import {ViewDirectionService} from '../services/view-direction.service';
import {UserContainerInterface} from '../components/users/logic/user-container.interface';
import {CompanySelectorService} from '../components/select-company/services/company-selector.service';
import {WallpaperSelectorService} from '../services/wallpaper-selector.service';

export interface DataInterface {
  loginData: LoginInterface,
  userInfo: UserContainerInterface
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService extends LoginDataClass implements CanActivate, OnDestroy {
  private _subscription: Subscription = new Subscription();

  constructor(@Inject('windowObject') private window,
              private router: Router,
              private api: ApiService,
              private injector: Injector,
              private translate: TranslateService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private electronService: ElectronService,
              private viewDirection: ViewDirectionService,
              private changeStatusService: ChangeStatusService,
              private companySelectorService: CompanySelectorService,
              private wallpaperSelectorService: WallpaperSelectorService) {
    super(injector, userInfoService);
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.getUserLoginInfo().then((loginData: LoginInterface) => {

        this.checkLogin().then(userInfo => {
          const userEssentialData: DataInterface = {
            userInfo: userInfo,
            loginData: loginData
          };

          this.setUserData(userEssentialData);

          resolve(true);
        });

      }).catch(() => {
        this.router.navigateByUrl(`/login`);
        resolve(true);
      });
    });
  }

  getUserLoginInfo() {
    return new Promise(async (resolve, reject) => {
      this.getLoginDataFile().then((loginData: LoginInterface) => {
        if (!loginData) {
          reject(false);
        } else {
          this.userInfoService.changeLoginData(loginData);

          if (loginData.company) {
            this.companySelectorService.changeSelectedCompany(loginData.company);
          }

          resolve(loginData);
        }
      }).catch(() => reject(false));
    });
  }

  getLoginDataFile(): Promise<LoginInterface | boolean> {
    return new Promise((resolve, reject) => {
      try {
        const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

        const loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

        const loginData = this.electronService.fs.readFileSync(loginDataPath, 'utf8');

        if (!loginData) {
          reject(false);
        } else {
          resolve(loginData ? JSON.parse(loginData) : false);
        }
      } catch (e) {
        reject(false);
      }
    });
  }

  checkLogin(): Promise<UserContainerInterface> {
    return new Promise((resolve, reject) => {
      if (!this.loginData) {
        this.router.navigateByUrl(`/login`);
      } else {
        this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
        this.api.checkLogin().subscribe((resp: CheckLoginInterface) => {
          if (resp.success === true) {
            const successfulMessage = this.getTranslate('login_info.login_successfully');

            this.messageService.showMessage(successfulMessage, 'success');

            resolve(resp.data);
          }
        }, () => {
          this.router.navigateByUrl(`/login`);

          reject(false);
        });
      }
    });
  }

  setUserData(data: DataInterface) {
    this.userInfoService.changeLoginData(data.loginData);

    this.userInfoService.changeUserInfo(data.userInfo);

    this.viewDirection.changeDirection(data.userInfo.lang === 'fa');

    this.changeStatusService.changeUserStatus(data.userInfo.user_status);

    this.companySelectorService.changeCompanyList(data.userInfo.companies);

    console.log(data.userInfo);

    this.wallpaperSelectorService.changeWallpaper(data.userInfo.background_image ? data.userInfo.background_image : '');
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
