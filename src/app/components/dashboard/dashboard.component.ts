import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AppConfig} from '../../../environments/environment';
import {ApiService} from '../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../message/service/message.service';
import {LoginDataClass} from '../../services/loginData.class';
import {WindowInterface} from './logic/window.interface';
import {UserInfoService} from '../users/services/user-info.service';
import {SoftPhoneService} from '../soft-phone/service/soft-phone.service';
import {ServiceInterface} from '../services/logic/service-interface';
import {TranslateService} from '@ngx-translate/core';
import {WindowManagerService} from '../../services/window-manager.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ServiceItemsInterface} from './logic/service-items.interface';
import {WallpaperSelectorService} from '../../services/wallpaper-selector.service';
import {ApiService as StatusApiService} from '../status/logic/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowManager: Array<WindowInterface>;
  serviceList: ServiceItemsInterface[] = [];
  wallpaper: string;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject('windowObject') public window,
              public dialog: MatDialog,
              private api: ApiService,
              private injector: Injector,
              private viewDirection: ViewDirectionService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private statusApiService: StatusApiService,
              private softPhoneService: SoftPhoneService,
              private translateService: TranslateService,
              private wallPaperSelector: WallpaperSelectorService,
              private windowManagerService: WindowManagerService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.wallPaperSelector.currentWallpaper.subscribe(wallpaper => this.wallpaper = wallpaper)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => {
        this.loggedInUser = user;

        this.serviceList = [];

        this.loggedInUser.services.map((item: ServiceInterface) => {
          let serviceTitle = item.name.split(' ').join('_').toLowerCase();

          const service: ServiceItemsInterface = {
            ...item,
            serviceTitle: serviceTitle,
          };

          if (item.show_in_container) {
            this.serviceList.push(service);
          }
        });

        this.windowManagerService.changeServices(this.serviceList);
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
    if (AppConfig.production) { // if environment in production mode change status when user want to close app

      /*this.window.onbeforeunload = (event) => {
        event.preventDefault();

        setTimeout(() => event.returnValue = true, 5000);
        /!*event.returnValue = false;

        event.returnValue = true;
        return true;*!/
      };*/

      /*this.window.onbeforeunload = (event) => {
        event.returnValue = false;

        this.softPhoneService.sipHangUp();

        const stopWorkingStatus = {
          user_id: this.loggedInUser.id,
          status: 2 // this means stop working status will emit
        };

        this.statusApiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

        console.log('process: ', this.electronService.remote.process);

        this._subscription.add(
          this.statusApiService.userChangeStatus(stopWorkingStatus).subscribe((resp: StatusChangeResultInterface) => {
            if (resp.success === true) {
              new Notification(`Office Container`, {
                body: this.getTranslate('status.close_app_stop_working'),
                icon: 'assets/profileImg/' + this.loggedInUser.email + '.jpg',
                dir: 'auto'
              });

              // this.electronService.remote.app.exit();

              event.returnValue = true;

              // setTimeout(() => {
                // if (this.electronService.remote.process.platform !== 'darwin') {
                  /!*this.electronService.remote.app.quit();
                  setTimeout(() => this.electronService.remote.getCurrentWindow().destroy(), 500);
                  setTimeout(() => this.electronService.remote.app.quit(), 800);*!/
                // }
              // }, 500);
            }
          }, () => {
            // if (this.electronService.remote.process.platform !== 'darwin') {
              /!*this.electronService.remote.app.quit();
              setTimeout(() => this.electronService.remote.getCurrentWindow().destroy(), 500);
              setTimeout(() => this.electronService.remote.app.quit(), 800);*!/
            // }
          })
        );
      };*/
    }
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
