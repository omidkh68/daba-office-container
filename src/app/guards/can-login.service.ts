import {Injectable, OnDestroy} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {ApiService} from '../components/users/logic/api.service';
import {CanActivate, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
// import {UserInterface} from '../components/users/logic/user-interface';
import {LoginInterface} from '../components/users/logic/login.interface';
import {UserInfoService} from '../components/users/services/user-info.service';
import {UserContainerInterface} from '../components/users/logic/user-container.interface';

@Injectable({
  providedIn: 'root'
})
export class CanShowLogin implements CanActivate, OnDestroy {
  loggedInUser: UserContainerInterface;
  loginData: LoginInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private _router: Router,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentLoginData.subscribe(loginData => this.loginData = loginData)
    );
  }

  canActivate(): Observable<boolean> {
    debugger;

    if (this.loginData) {
      return this.apiService.checkLogin(this.loginData.token_type + ' ' + this.loginData.access_token).pipe(
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
