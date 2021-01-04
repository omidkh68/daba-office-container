import {Inject, Injectable, Injector, OnDestroy} from '@angular/core';
import {AppConfig} from '../../environments/environment';
import {ApiService} from '../components/users/logic/api.service';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginInterface} from '../components/login/logic/login.interface';
import {LoginDataClass} from '../services/loginData.class';
import {MessageService} from '../components/message/service/message.service';
import {ElectronService} from '../core/services';
import {UserInfoService} from '../components/users/services/user-info.service';
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
  rtlDirection: boolean;

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

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
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
        let loginData;

        if (this.electronService.isElectron) {
          const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

          const loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

          loginData = this.electronService.fs.readFileSync(loginDataPath, 'utf8');
        } else {
          loginData = localStorage.getItem('loginData');
        }

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
            resolve(resp.data);
          }
        }, () => {
          this.router.navigateByUrl(`/login`);

          reject(false);
        });
      }
    });
  }

  async setUserData(data: DataInterface) {
    await this.userInfoService.changeLoginData(data.loginData);

    await this.userInfoService.changeUserInfo(data.userInfo);

    await this.viewDirection.changeDirection(data.userInfo.lang === 'fa');

    await this.changeStatusService.changeUserStatus(data.userInfo.user_status);

    await this.companySelectorService.changeCompanyList(data.userInfo.companies);

    await this.wallpaperSelectorService.changeWallpaper(data.userInfo.background_image ? data.userInfo.background_image : '');

    setTimeout(() => {
      this.getTranslate(data.userInfo.lang, 'login_info.login_successfully').then((successfulMessage: string) => {
        this.messageService.showMessage(successfulMessage, 'success');
      });
    });
  }

  getTranslate(lang, word) {
    return new Promise((resolve) => {
      const translatedWord = this.translate.instant(word);

      resolve(translatedWord);
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
