import {Component, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginInterface} from '../../../users/logic/login.interface';
import {UserInfoService} from '../../../users/services/user-info.service';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnDestroy {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection: boolean;

  loginData: LoginInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private api: ApiService,
              private userInfoService: UserInfoService,
              private windowManagerService: WindowManagerService) {
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
