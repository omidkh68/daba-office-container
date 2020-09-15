import {Inject, Injectable, Injector, OnDestroy} from '@angular/core';
import {AppConfig} from '../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {ApiService} from '../components/users/logic/api.service';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../services/loginData.class';
import {MessageService} from '../components/message/service/message.service';
import {UserInfoService} from '../components/users/services/user-info.service';
import {ElectronService} from '../services/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {ChangeStatusService} from '../components/status/services/change-status.service';
import {CheckLoginInterface} from '../components/login/logic/check-login.interface';
import {ViewDirectionService} from '../services/view-direction.service';
import {LoginInterface} from '../components/login/logic/login.interface';
import {UserContainerInterface} from '../components/users/logic/user-container.interface';

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
              private api: ApiService,
              private router: Router,
              private injector: Injector,
              private translate: TranslateService,
              private viewDirection: ViewDirectionService,
              private electronService: ElectronService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private changeStatusService: ChangeStatusService) {
    super(injector, userInfoService);
  }

  canActivate(): Observable<boolean> | Promise<boolean> {
    return new Promise((resolve) => {
      /*this.getUserLoginInfo().then((data: DataInterface) => {
        // this.setUserData(userInfo);

        console.log('data: ', data);
        if (!data.userInfo) {
          this.checkLogin().then(info => {
            const userEssentialData: DataInterface = {
              userInfo: info, loginData: data.loginData
            };

            this.setUserData(userEssentialData);

            resolve(true);
          });
        } else {
          this.setUserData(data);

          resolve(true);
        }

        /!*console.log('after get: ', userInfo);

        this.checkLogin().then(userInfo => {
          this.setUserData(userInfo);

          resolve(true);
        });

        resolve(true);*!/
      }).catch(() => {
        this.router.navigateByUrl(`/login`);

        resolve(false);
      });*/

      this.checkLogin().then(userInfo => {
        this.setUserData(userInfo);

        resolve(true);
      });
    });
  }

  getUserLoginInfo() {
    return new Promise(async (resolve, reject) => {
      this.getLoginDataFile().then(loginData => {
        this.getUserInfoFile().then(userInfo => {
          if (!loginData && !userInfo) {
            reject(false);
          } else {
            resolve({
              loginData: loginData,
              userInfo: userInfo
            });
          }
        }).catch(() => reject(false));
      }).catch(() => reject(false));
    });
  }

  getLoginDataFile() {
    return new Promise((resolve, reject) => {
      try {
        const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

        const loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

        this.electronService.fs.readFile(loginDataPath, 'utf8', (err, data) => {
          if (err) reject(false);

          resolve(data ? JSON.parse(data) : false);
        });
      } catch (e) {
        reject(false);
      }
    });
  }

  getUserInfoFile() {
    return new Promise((resolve, reject) => {
      try {
        const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

        const loggedInUserPath = this.electronService.path.join(homeDirectory, 'loggedInUser.txt');

        this.electronService.fs.readFile(loggedInUserPath, 'utf8', (err, data) => {
          if (err) reject(false);

          resolve(data ? JSON.parse(data) : false);
        });
      } catch (e) {
        reject(false);
      }
    });
  }

  setUserInfoFile(data) {
    const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

    const loggedInUserPath = this.electronService.path.join(homeDirectory, 'loggedInUser.txt');

    this.electronService.fs.writeFileSync(loggedInUserPath, JSON.stringify(data));
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

            this.setUserInfoFile(resp.data);

            resolve(resp.data);
          }
        }, () => {
          reject(false);
        });
      }
    });
  }

  /*setUserData(data: DataInterface) {
    this.userInfoService.changeLoginData(data.loginData);

    this.userInfoService.changeUserInfo(data.userInfo);

    this.viewDirection.changeDirection(data.userInfo.lang === 'fa');

    this.changeStatusService.changeUserStatus(data.userInfo.user_status);
  }*/

  setUserData(data) {
    this.userInfoService.changeUserInfo(data);

    this.viewDirection.changeDirection(data.lang === 'fa');

    this.changeStatusService.changeUserStatus(data.user_status);
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
