import {Component, Injector, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../../services/loginData.class';
import {UserInfoService} from '../../../users/services/user-info.service';
import {WindowManagerService} from '../../../../services/window-manager.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent extends LoginDataClass implements OnDestroy {
  @Input()
  rtlDirection: boolean;

  private _subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private injector: Injector,
              private api: ApiService,
              private userInfoService: UserInfoService,
              private windowManagerService: WindowManagerService) {
    super(injector, userInfoService);
  }

  logout() {
    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.api.logout().subscribe((resp: any) => {
      if (resp.success) {
        this.userInfoService.changeLoginData(null);

        this.windowManagerService.closeAllServices().then(() => {
          setTimeout(() => {
            this.router.navigateByUrl(`/login`);
          }, 500);
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
