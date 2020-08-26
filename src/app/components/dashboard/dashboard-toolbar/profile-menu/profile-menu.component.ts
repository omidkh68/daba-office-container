import {Component, Injector, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../../services/loginData.class';
import {UserInfoService} from '../../../users/services/user-info.service';
import {SoftPhoneService} from '../../../soft-phone/service/soft-phone.service';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
import {ProfileSettingComponent} from '../../../profile-setting/profile-setting.component';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html'
})
export class ProfileMenuComponent extends LoginDataClass implements OnDestroy {
  @Input()
  rtlDirection: boolean;

  @Input()
  loggedInUser: UserContainerInterface;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private router: Router,
              private api: ApiService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private windowManagerService: WindowManagerService) {
    super(injector, userInfoService);
  }

  logout() {
    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.api.logout().subscribe((resp: any) => {
      if (resp.success) {
        this.userInfoService.changeLoginData(null);

        this.softPhoneService.sipHangUp();

        this.windowManagerService.closeAllServices().then(() => {
          setTimeout(() => {
            this.router.navigateByUrl(`/login`);
          }, 500);
        });
      }
    });
  }

  settingProfile() {
    const dialogRef = this.dialog.open(ProfileSettingComponent, {
      autoFocus: false,
      width: '700px',
      height: '600px',
      panelClass: 'status-dialog'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: any) => {
        if (resp) {
          // this.messageService.showMessage(`${resp.message}`);
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
