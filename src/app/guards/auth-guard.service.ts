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
      /*debugger;

      this.getUserLoginInfo().then(userInfo => {
        this.setUserData(userInfo);

        console.log('after get: ', userInfo);

        resolve(true);
      }).catch(() => {
        debugger;

        this.checkLogin().then(userInfo => {
          this.setUserData(userInfo);

          resolve(true);
        });
      });*/

      this.checkLogin().then(userInfo => {
        this.setUserData(userInfo);

        resolve(true);
      });
    });
  }

  getUserLoginInfo() {
    return new Promise(async (resolve, reject) => {
      debugger;

      const loginData = await this.getLoginDataFile();
      const userInfo = await this.getUserInfoFile();

      console.log('login Data: ', loginData, 'user Info: ', userInfo);
    });
  }

  getLoginDataFile() {
    return new Promise((resolve, reject) => {
      debugger;

      try {
        const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

        const loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

        this.electronService.fs.readFile(loginDataPath, 'utf8', (err, data) => {
          if (err) reject(false);

          resolve(data ? JSON.parse(data) : true);
        });
      } catch (e) {
        reject(false);
      }
    });
  }

  getUserInfoFile() {
    return new Promise((resolve, reject) => {
      debugger;

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

    this.electronService.fs.writeFile(loggedInUserPath, JSON.stringify(data), (err) => {
      if (err) throw err;

      console.log('Login Data Path Saved');
    });
  }

  checkLogin() {
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
            this.setUserData(resp.data);

            resolve(resp.data);
          }
        }, () => {
          reject(false);
        });

        /*const userInfo = this.userInfoService.getUserInfo();

        if (userInfo) {
          resolve(true);
        } else {

        }*/
      }
    });
  }

  setUserData(info) {
    debugger;

    this.userInfoService.changeUserInfo(info);

    this.viewDirection.changeDirection(info.lang === 'fa');

    this.changeStatusService.changeUserStatus(info.user_status);
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
