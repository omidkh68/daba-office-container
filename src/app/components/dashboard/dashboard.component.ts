import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../services/message.service';
import {LoginDataClass} from '../../services/loginData.class';
import {WindowInterface} from './logic/window.interface';
import {UserInfoService} from '../users/services/user-info.service';
import {ElectronService} from '../../services/electron.service';
import {ServiceInterface} from '../services/logic/service-interface';
import {WindowManagerService} from '../../services/window-manager.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ServiceItemsInterface} from './logic/service-items.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends LoginDataClass implements OnInit, OnDestroy {
  rtlDirection: boolean;
  windowManager: Array<WindowInterface>;
  serviceList: ServiceItemsInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(private electronService: ElectronService,
              private injector: Injector,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
              public dialog: MatDialog,
              private messageService: MessageService,
              private userInfoService: UserInfoService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => {
        this.loggedInUser = user;

        this.loggedInUser.services.map((item: ServiceInterface) => {
          let icon: string = '';
          let width = 0;
          let height = 0;
          let serviceTitle = item.name.split(' ').join('_').toLowerCase();

          switch (serviceTitle) {
            case 'project_microservice':
              icon = 'playlist_add_check';
              width = 1200;
              height = 700;

              break;

            case 'pbx_microservice':
              icon = 'perm_phone_msg';
              width = 350;
              height = 500;

              break;

            case 'video_conference':
              icon = 'picture_in_picture';
              width = 1200;
              height = 700;

              break;
          }

          const service: ServiceItemsInterface = {
            ...item,
            serviceTitle: serviceTitle,
            icon: icon,
            width: width,
            height: height
          };

          if (serviceTitle !== 'hr_microservice') {
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
    setTimeout(() => {
      this.messageService.durationInSeconds = 10;
      this.messageService.showMessage(`${this.loggedInUser.name} خوش آمدید `);
    }, 2000);
  }

  changeDarkMode() {
    // this.userInfoService.changeDarkMode(this.loggedInUser);
  }

  changeDirection() {
    const rtlDirection: boolean = !this.rtlDirection;
    this.viewDirection.changeDirection(rtlDirection);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

  }
}
