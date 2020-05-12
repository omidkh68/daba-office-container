import {Injectable, OnDestroy} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {UserInterface} from '../components/users/logic/user-interface';
import {ApiService} from '../components/users/logic/api.service';
import {UserInfoService} from '../services/user-info.service';
import {ChangeStatusService} from '../services/change-status.service';

export interface Result {
  result: number;
  message: string;
  content: {
    user: UserInterface,
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, OnDestroy {
  private _subscription = new Subscription();

  constructor(private apiService: ApiService,
              private userInfoService: UserInfoService,
              private changeStatusService: ChangeStatusService) {
  }

  canActivate(): Observable<boolean> {
    const loginInfo = {
      username: 'o.khosrojerdi',
      password: 'OMid@#8315229950'
    };

    return this.apiService.login(loginInfo).pipe(
      map((resp: Result) => {
        if (resp.result === 1) {
          this.userInfoService.changeUserInfo(resp.content.user);
          this.changeStatusService.changeUserStatus(resp.content.user.userCurrentStatus);
          return true;
        } else if (resp.result === 1) {
          return true;
        }
      }),
      catchError(e => throwError('No Connection Please Try Again!!!'))
    );
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
