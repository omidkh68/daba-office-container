import {Inject, Injectable, Injector, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {ApiService} from '../components/users/logic/api.service';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../services/loginData.class';
import {UserInfoService} from '../components/users/services/user-info.service';
import {ElectronService} from '../services/electron.service';
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
              private viewDirection: ViewDirectionService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private changeStatusService: ChangeStatusService) {
    super(injector, userInfoService);
  }

  canActivate(): Observable<boolean> | Promise<boolean> {
    return new Promise((resolve) => {
      /*this.getCookie().then(userInfo => {
        this.setUserData(userInfo);

        resolve(true);
      }).catch(() => {
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

  getCookie() {
    return new Promise((resolve, reject) => {
      this.electronService.session.defaultSession.cookies.get({url: this.window.location.href}).then(userInfo => {
        if (!userInfo.length) {
          reject(false);
        } else {
          const cookieValues = userInfo;
          const loginDataCookie = cookieValues.filter(cookie => cookie.name === 'loginData').pop().value;

          if (loginDataCookie) {
            this.userInfoService.changeLoginData(JSON.parse(loginDataCookie));

            reject(false);
          } else {
            this.userInfoService.changeLoginData(JSON.parse(loginDataCookie));

            const userInfoCookie = cookieValues.filter(cookie => cookie.name === 'userInfo').pop().value;
            resolve(JSON.parse(userInfoCookie));
          }
        }
      });
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
    this.userInfoService.changeUserInfo(info);

    this.viewDirection.changeDirection(info.lang === 'fa');

    this.changeStatusService.changeUserStatus(info.user_status);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
