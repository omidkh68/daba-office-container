import {Component, Inject, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import * as PackageJson  from '../../../../../../package.json';
import {ApiService} from '../../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../../services/loginData.class';
import {UserInfoService} from '../../../users/services/user-info.service';
import {ElectronService} from '../../../../core/services';
import {SoftPhoneService} from '../../../soft-phone/service/soft-phone.service';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';
import {ProfileSettingComponent} from '../../../profile-setting/profile-setting.component';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html'
})
export class ProfileMenuComponent extends LoginDataClass implements OnInit, OnDestroy {
  @Input()
  rtlDirection: boolean;

  @Input()
  loggedInUser: UserContainerInterface;

  version: string = '';

  private _subscription: Subscription = new Subscription();

  constructor(@Inject('windowObject') private window,
              public dialog: MatDialog,
              private router: Router,
              private api: ApiService,
              private injector: Injector,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private windowManagerService: WindowManagerService) {
    super(injector, userInfoService);
  }

  ngOnInit(): void {
    if (this.electronService.isElectron) {
      this.version = this.electronService.remote.app.getVersion();
    } else {
      this.version = PackageJson.version;
    }
  }

  logout() {
    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.logout().subscribe((resp: any) => {
        if (resp.success) {
          this.clearData();
        }
      }, () => {
        this.clearData();
      })
    );
  }

  clearData() {
    this.userInfoService.changeLoginData(null);

    this.softPhoneService.sipHangUp();
    this.softPhoneService.sipUnRegister();

    this.windowManagerService.closeAllServices().then(() => {
      setTimeout(() => this.router.navigateByUrl(`/login`), 500);
    });
  }

  showProfileSetting() {
    const dialogRef = this.dialog.open(ProfileSettingComponent, {
      autoFocus: false,
      width: '480px',
      height: '565px',
      panelClass: 'status-dialog'
    });

    this.windowManagerService.dialogOnTop(dialogRef.id);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
