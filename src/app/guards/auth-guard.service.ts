import {Injectable, OnDestroy} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {ApiService} from '../components/users/logic/api.service';
import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserInterface} from '../components/users/logic/user-interface';
import {UserInfoService} from '../components/users/services/user-info.service';
import {ChangeStatusService} from '../components/status/services/change-status.service';

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
  private _subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private _router: Router,
              private userInfoService: UserInfoService,
              private changeStatusService: ChangeStatusService) {
  }

  canActivate(): Observable<boolean> {
    const loginInfo = {
      username: 'admin@admin.com',
      password: '123456789'
    };

    return this.apiService.login(loginInfo).pipe(
      map((resp: Result) => {
        this.userInfoService.changeUserInfo({
          adminId: 1,
          username: 'o.khosrojerdi',
          password: '06df60287a737ebf3a177bd3b2c47e01',
          name: 'امید',
          family: 'خسروجردی',
          email: 'khosrojerdi@dabacenter.ir',
          status: '1',
          permission: '11111100000000000000111111111111000000001110000000000000000011111100000000000000110000000000000000000',
          darkMode: 0,
          creationDate: '2020-06-20 13:48:18',
          role: {
            roleId: 9,
            roleNameEn: 'UIManager',
            roleNameFa: 'مدیر طراحی'
          }
        });
        this.changeStatusService.changeUserStatus('');

        return true;
        /*if (resp.result === 1) {

          return true;
        } else if (resp.result === 1) {
          return true;
        }*/
      }),
      catchError(e => {
        this._router.navigateByUrl(`/login`);

        return of(false);
      })
    );
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
