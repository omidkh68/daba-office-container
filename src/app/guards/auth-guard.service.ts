import {Injectable, Injector, OnDestroy} from '@angular/core';
import * as Store from 'electron-store';
import {of} from 'rxjs/internal/observable/of';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {ApiService} from '../components/users/logic/api.service';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../services/loginData.class';
import {UserInfoService} from '../components/users/services/user-info.service';
import {ElectronService} from '../services/electron.service';
import {ChangeStatusService} from '../components/status/services/change-status.service';
import {CheckLoginInterface} from '../components/login/logic/check-login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService extends LoginDataClass implements CanActivate, OnDestroy {
  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private injector: Injector,
              private electronService: ElectronService,
              private _router: Router,
              private userInfoService: UserInfoService,
              private changeStatusService: ChangeStatusService) {
    super(injector, userInfoService);
  }

  canActivate(): Observable<boolean> {
    /*const store = new Store();

    if (store.get('userInfo')) {
      this.userInfoService.changeUserInfo(store.get('userInfo'));
    }

    if (store.get('loginData')) {
      this.userInfoService.changeLoginData(store.get('loginData'));
    }*/

    if (this.loginData) {
      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      return this.api.checkLogin().pipe(
        map((resp: CheckLoginInterface) => {
          if (resp.success === true) {
            this.userInfoService.changeUserInfo(resp.data);

            this.changeStatusService.changeUserStatus('');

            return true;
          }
        }),
        catchError(e => {
          console.log(e);

          return of(false);
        })
      );
    } else {
      this._router.navigateByUrl(`/login`);

      return of(false);
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
