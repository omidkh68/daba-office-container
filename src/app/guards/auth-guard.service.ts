import {Injectable, Injector, OnDestroy} from '@angular/core';
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
import {ViewDirectionService} from '../services/view-direction.service';
// import * as Datastore from 'nedb';
import {delay} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService extends LoginDataClass implements CanActivate, OnDestroy {
  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private router: Router,
              private injector: Injector,
              private viewDirection: ViewDirectionService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private changeStatusService: ChangeStatusService) {
    super(injector, userInfoService);
  }

  canActivate(): Observable<boolean> {
    /*const userInfoStore: Datastore = this.electronService.remote.getGlobal('collectionsDb');

    let result;
    userInfoStore.findOne({}, (err, docs) => {
      result = docs;
    });

    setTimeout(() => {
      return
    });*/

    if (this.loginData) {
      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      return this.api.checkLogin().pipe(
        map((resp: CheckLoginInterface) => {
          if (resp.success === true) {
            this.userInfoService.changeUserInfo(resp.data);

            this.viewDirection.changeDirection(resp.data.lang === 'fa');

            this.changeStatusService.changeUserStatus(resp.data.user_status);

            /*const userInfo = {
              loginData: this.loginData,
              userInfo: resp.data
            };

            userInfoStore.insert(userInfo, (err, doc) => {
              console.log('Inserted', doc, 'with ID', doc._id);
            });*/

            return true;
          }
        }),
        catchError(e => {
          console.log(e);

          return of(false);
        })
      );
    } else {
      this.router.navigateByUrl(`/login`);

      return of(false);
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
