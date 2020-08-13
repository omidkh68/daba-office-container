import {Injectable, Injector, OnDestroy} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {ApiService} from '../components/users/logic/api.service';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInfoService} from '../components/users/services/user-info.service';
import {LoginDataClass} from '../services/loginData.class';

@Injectable({
  providedIn: 'root'
})
export class CanShowLogin extends LoginDataClass implements CanActivate, OnDestroy {
  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private _router: Router,
              private injector: Injector,
              private userInfoService: UserInfoService) {
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
        map((resp: any) => {
          return !(resp.success === true);
        }),
        catchError(e => {
          console.log(e);

          return of(false);
        })
      );
    } else {
      return of(true);
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
