import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AppConfig} from '../../../environments/environment';
import {ApiService} from '../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../message/service/message.service';
import {LoginDataClass} from '../../services/loginData.class';
import {WindowInterface} from './logic/window.interface';
import {UserInfoService} from '../users/services/user-info.service';
import {ElectronService} from '../../services/electron.service';
import {SoftPhoneService} from '../soft-phone/service/soft-phone.service';
import {ServiceInterface} from '../services/logic/service-interface';
import {TranslateService} from '@ngx-translate/core';
import {CompanyInterface} from '../select-company/logic/company-interface';
import {WindowManagerService} from '../../services/window-manager.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {CompanySelectorService} from '../select-company/services/company-selector.service';
import {WallpaperSelectorService} from '../../services/wallpaper-selector.service';
import {StatusChangeResultInterface} from '../status/logic/result-interface';
import {ApiService as StatusApiService} from '../status/logic/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowManager: Array<WindowInterface>;
  serviceList: ServiceInterface[] = [];
  wallpaper: string;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject('windowObject') public window,
              public dialog: MatDialog,
              private api: ApiService,
              private injector: Injector,
              private messageService: MessageService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private statusApiService: StatusApiService,
              private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
              private wallPaperSelector: WallpaperSelectorService,
              private companySelectorService: CompanySelectorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.wallPaperSelector.currentWallpaper.subscribe(wallpaper => this.wallpaper = wallpaper)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => {
        this.loggedInUser = user;

        this.serviceList = [];

        const windowServices: Array<ServiceInterface> = [];

        this.loggedInUser.services.map((item: ServiceInterface) => {
          if (item.show_in_container) {
            this.serviceList.push(item);
          }

          windowServices.push(item);
        });

        this.windowManagerService.changeServices(windowServices);
      })
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.windowManagerService.windowsList.subscribe(windowList => this.windowManager = windowList)
    );
  }

  ngOnInit(): void {
    this.stopWorkingBeforeCloseApp();
  }

  stopWorkingBeforeCloseApp() {
    // if environment in production mode change status when user want to close app
    if (AppConfig.production) {
      this.window.onbeforeunload = async (event) => {
        event.returnValue = false;

        await this.softPhoneService.sipHangUp();
        await this.softPhoneService.sipUnRegister();

        const resultOfStatus = await this.changeStatus();

        setTimeout(() => {
          this.electronService.remote.app.quit();
          this.electronService.remote.app.exit(0);

          event.returnValue = true;
        }, 200);
      };
    }
  }

  changeStatus() {
    return new Promise((resolve) => {
      const currentCompany: CompanyInterface = this.companySelectorService.currentCompany;

      const stopWorkingStatus = {
        user_id: this.loggedInUser.id,
        status: 2 // this means stop working status will emit.
      };

      if (!this.loginData && !currentCompany) {
        resolve(false);
      }

      this.statusApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.statusApiService.userChangeStatus(stopWorkingStatus).subscribe((resp: StatusChangeResultInterface) => {
          if (resp.success === true) {
            new Notification(`Office Container`, {
              body: this.getTranslate('status.close_app_stop_working'),
              icon: 'assets/profileImg/' + this.loggedInUser.email + '.jpg',
              dir: 'auto',
              requireInteraction: true
            });

            resolve(true);
          } else {
            new Notification(`Office Container`, {
              body: this.getTranslate('status.cant_stop_working'),
              icon: 'assets/profileImg/' + this.loggedInUser.email + '.jpg',
              dir: 'auto',
              requireInteraction: true
            });

            resolve(false);
          }
        }, () => {
          new Notification(`Office Container`, {
            body: this.getTranslate('status.cant_stop_working'),
            icon: 'assets/profileImg/' + this.loggedInUser.email + '.jpg',
            dir: 'auto',
            requireInteraction: true
          });

          this.electronService.remote.app.quit();
          this.electronService.remote.app.exit(0);
        })
      );
    });
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
