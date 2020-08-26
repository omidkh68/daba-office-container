import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../services/message.service';
import {LoginDataClass} from '../../services/loginData.class';
import {WindowInterface} from './logic/window.interface';
import {UserInfoService} from '../users/services/user-info.service';
import {ElectronService} from '../../services/electron.service';
import {SoftPhoneService} from '../soft-phone/service/soft-phone.service';
import {ServiceInterface} from '../services/logic/service-interface';
import {WindowManagerService} from '../../services/window-manager.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ServiceItemsInterface} from './logic/service-items.interface';
import {WallpaperSelectorService} from "../../services/wallpaper-selector.service";

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

  constructor(public dialog: MatDialog,
              private api: ApiService,
              private injector: Injector,
              private messageService: MessageService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
              private wallPaperSelector: WallpaperSelectorService) {
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
    this.electronService.window.on('close', () => {
      this.softPhoneService.sipHangUp();
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
